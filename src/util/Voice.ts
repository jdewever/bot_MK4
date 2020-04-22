import { Bot } from '../Bot';
import { Queue, QueueVideo } from './Queue';
import { StreamDispatcher, VoiceConnection, VoiceChannel, VoiceState } from 'discord.js';
import { Readable } from 'stream';
import { VideoInfo } from './Youtube';

export class Voice {
	private bot: Bot;
	private vol: number; // float
	private playingNow: QueueVideo;
	private previousSpeakingState: boolean;

	constructor(bot_: Bot) {
		this.bot = bot_;
		this.vol = this.bot.config.defaultVolume / 100;
		this.playingNow = null;
		this.previousSpeakingState = false;
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
				const url = this.bot.autoPL.get();
				const info: VideoInfo = await this.bot.youtube.getInfo([url]);

				const queueObj: QueueVideo = this.bot.Queue.convert(info, null);
				this.bot.Queue.add(queueObj);
			}

			const song: QueueVideo = this.bot.Queue.get(1);
			const stream: Readable = this.bot.youtube.getStream(song.url);
			this.registerStreamEvents(stream);
			this.connection.play(stream, { volume: this.volume, highWaterMark: 16 });
			this.registerDispatchEvents(stream);
		} catch (err) {
			return this.startPlaying();
		}
	}

	get nowPlaying(): QueueVideo {
		return this.playingNow;
	}

	registerDispatchEvents(stream: Readable) {
		const dispatch: StreamDispatcher = this.dispatcher;

		dispatch.on('start', () => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher start`);
			this.playingNow = this.bot.Queue.shift();
			this.bot.Presence.listening(this.playingNow.title);
		});

		dispatch.on('finish', async (reason) => {
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Dispatcher finish`);
			stream.destroy();
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
	}

	get timePlayed(): number {
		return this.dispatcher.streamTime / 1000;
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
			this.bot.log.Event(`(${new Date().toLocaleTimeString()}) Stream resume`);
		});
	}

	pause() {
		this.dispatcher.pause(true);
	}

	resume() {
		this.dispatcher.resume();
	}
}
