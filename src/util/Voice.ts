import { Bot } from '../Bot';
import { Queue, QueueVideo } from './Queue';
import { StreamDispatcher, VoiceConnection, VoiceChannel, VoiceState } from 'discord.js';
import { Readable } from 'stream';
import { VideoInfo } from './Youtube';

export class Voice {
	private bot: Bot;
	private vol: number; // float
	private playingNow: QueueVideo;

	constructor(bot_: Bot) {
		this.bot = bot_;
		this.vol = this.bot.config.defaultVolume / 100;
		this.playingNow = null;
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
			this.connection.play(stream, { volume: this.volume });
			this.registerDispatchEvents();
		} catch (err) {
			return this.startPlaying();
		}
	}

	get nowPlaying(): QueueVideo {
		return this.playingNow;
	}

	registerDispatchEvents() {
		const dispatch: StreamDispatcher = this.dispatcher;

		dispatch.on('start', () => {
			this.playingNow = this.bot.Queue.shift();
			this.bot.log.Info(`Playing: ${this.playingNow.title}`);
			this.bot.Presence.listening(this.playingNow.title);
		});

		dispatch.on('finish', async (reason) => {
			this.playingNow = null;
			this.bot.Presence.idle();
			this.startPlaying();
		});
	}

	pause() {
		this.dispatcher.pause(true);
	}

	resume() {
		this.dispatcher.resume();
	}
}
