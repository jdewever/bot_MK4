import { Bot } from '../Bot';
import { Queue, QueueVideo } from './Queue';
import { StreamDispatcher, VoiceConnection, VoiceChannel } from 'discord.js';
import { Readable } from 'stream';

export class Voice {
	private bot: Bot;
	private queue: Queue;
	private vol: number; // float
	private playingNow: QueueVideo;

	constructor(bot_: Bot) {
		this.bot = bot_;
		this.queue = this.bot.Queue;
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
		let voice = this.bot.currentGuild.voice;
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

	startPlaying(): boolean {
		if (this.playing || !this.connected || this.bot.Queue.isEmpty()) return false;

		const song: QueueVideo = this.bot.Queue.get(1);
		const stream: Readable = this.bot.youtube.getStream(song.url);
		this.connection.play(stream, { volume: this.volume });
		this.registerDispatchEvents();
	}

	get nowPlaying(): QueueVideo {
		return this.playingNow;
	}

	registerDispatchEvents() {
		const dispatch: StreamDispatcher = this.dispatcher;

		dispatch.on('start', () => {
			this.playingNow = this.bot.Queue.shift();
			this.bot.log.Info(`Playing: ${this.playingNow.title}`);
		});

		dispatch.on('finish', async (reason) => {
			this.playingNow = null;
			if (this.bot.Queue.isEmpty()) {
				const newSong = await this.bot.autoPL.get();
				if (newSong) this.bot.Queue.add(newSong);
			}
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
