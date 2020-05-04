import { Bot } from '../Bot';
import { QueueVideo } from './Queue';
import { StreamDispatcher, VoiceConnection, VoiceChannel, VoiceState } from 'discord.js';
import { Readable } from 'stream';
import { VideoInfo, MP3DownloadObject } from './Youtube';
import * as fs from 'fs';

export class Voice {
	private bot: Bot;
	private vol: number; // float
	private playingNow: QueueVideo;
	private previousSpeakingState: boolean;
	private playopts: playOptions;

	constructor(bot_: Bot) {
		this.bot = bot_;
		this.vol = this.bot.config.defaultVolume / 100;
		this.playingNow = null;
		this.previousSpeakingState = false;
		this.playopts = {
			highWaterMark: null,
		};
	}

	get dispatcher(): StreamDispatcher {
		let conn = this.connection;
		if (conn) {
			let disp = conn.dispatcher;
			if (disp) return disp;
		}
		return null;
	}

	get playing(): boolean {
		return this.dispatcher ? true : false;
	}

	get connection(): VoiceConnection {
		let voice: VoiceState = this.bot.currentGuild.voice;
		if (voice) return voice.connection;
		return null;
	}

	get connected(): boolean {
		return this.connection ? true : false;
	}

	get volume(): number {
		return this.vol;
	}

	set volume(num: number) {
		this.vol = num / 100;
		this.dispatcher.setVolume(this.vol);
	}

	join(vChannel: VoiceChannel) {
		vChannel.join();
	}

	disconnect() {
		this.connection.disconnect();
	}

	skip() {
		this.dispatcher.end();
	}

	async startPlaying() {
		try {
			if (this.playing || !this.connected) return false;

			if (this.bot.Queue.isEmpty()) {
				this.useAutoPlaylist().then((res) => {
					if (res == null) throw new Error();
					else this.playSong(this.bot.Queue.get(1));
				});
			} else this.playSong(this.bot.Queue.get(1));
		} catch (err) {
			this.bot.log.Error('startPlaying()');
			return this.startPlaying();
		}
	}

	async useAutoPlaylist(): Promise<boolean> {
		return new Promise(async (res, rej) => {
			if (!this.bot.config.autoplaylist) res(null);
			const url = this.bot.autoPL.get();
			const info: VideoInfo = await this.bot.youtube.getInfo([url]);

			const queueObj: QueueVideo = this.bot.Queue.convert(info, null);

			if (this.bot.config.download) {
				const down: MP3DownloadObject = this.bot.youtube.downloadMP3(queueObj);
				down.stream.on('end', () => {
					fs.promises
						.rename(down.location + '.tmp', down.location)
						.then(() => {
							this.bot.log.System('Downloaded file');
							queueObj.filePath = down.location;
							this.bot.Queue.add(queueObj);
							res(true);
						})
						.catch((err) => {
							res(false);
						});
				});
			} else {
				this.bot.Queue.add(queueObj);
				res(false);
			}
		});
	}

	async playSong(song: QueueVideo) {
		if (!song.filePath) {
			this.bot.log.Event('Playing from stream');
			const stream: Readable = this.bot.youtube.getStream(song.url);
			this.connection.play(stream, { volume: this.vol });
		} else {
			this.bot.log.Event('Playing from file');
			this.connection.play(song.filePath, { volume: this.vol });
		}
		this.registerDispatchEvents();
	}

	get nowPlaying(): QueueVideo {
		return this.playingNow;
	}

	registerDispatchEvents() {
		const dispatch: StreamDispatcher = this.dispatcher;

		dispatch.on('start', () => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher start`);
			this.playingNow = this.bot.Queue.shift();
			this.bot.Presence.listening(this.playingNow.title);
		});

		dispatch.on('finish', (reason) => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher finish`);
			this.playingNow = null;
			this.bot.Presence.idle();
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher end`);
			this.startPlaying();
		});

		dispatch.on('close', () => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher close`);
		});
		dispatch.on('error', (reason) => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher error: ${reason}`);
		});
		dispatch.on('speaking', (bool) => {
			if (bool != this.previousSpeakingState) {
				this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher speaking: ${bool}`);
				this.previousSpeakingState = bool;
			}
		});

		dispatch.on('debug', (info) => {
			this.bot.log.Info(info);
		});
	}

	get timePlayed(): number {
		return (this.bot.voice.dispatcher.streamTime - this.bot.voice.dispatcher.pausedTime) / 1000;
	}

	get playLength(): number {
		return this.nowPlaying.length;
	}

	registerStreamEvents(stream: Readable) {
		stream.on('error', (err) => {
			this.bot.log.Error(`(${new Date().toLocaleTimeString()}) Stream error: ${err}`);
		});
		stream.on('end', () => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Stream end`);
		});
		stream.on('close', () => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Stream close`);
		});
		stream.on('resume', () => {
			//this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Stream resume`);
		});
	}

	pause() {
		this.dispatcher.pause(true);
	}

	resume() {
		this.dispatcher.resume();
	}
}

interface playOptions {
	highWaterMark: number;
}
