import { Bot } from '../Bot';
import { eachLine } from 'line-reader';
import { QueueVideo } from './Queue';
import { VideoInfo } from './Youtube';
import * as fs from 'fs';

export class AutoPlaylist {
	private bot: Bot;
	private file: string;
	private list: string[];
	private history: string[];

	constructor(bot_: Bot) {
		this.bot = bot_;
		this.file = `${this.bot.rootFolder}/autoplaylist.txt`;
		this.load();
		this.history = [];
	}

	load(): string[] {
		let arr = [];
		eachLine(this.file, (line) => {
			arr.push(line);
		});
		this.list = arr;
		return this.list;
	}

	get(): Promise<QueueVideo> {
		return new Promise(async (res, rej) => {
			if (this.list.length == 0) rej('AUTOPLAYLIST_EMPTY');
			const url = this.randomUrl();
			try {
				const info: VideoInfo = await this.bot.youtube.getInfo([url]);
				const newQueueObj: QueueVideo = this.bot.Queue.convert(info, null);
				res(newQueueObj);
			} catch (err) {
				this.bot.log.Error('FAULTY_VIDEO_REQUEST @ AutoPlaylist.get()');
				//this.removeFaulty(url);
			}
		});
	}

	randomUrl(): string {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}

	removeFaulty(url: string) {
		const index = this.list.indexOf(url);
		let arr = this.list.splice(index);
		fs.writeFile(this.file, arr.join('\n'), (err) => {
			if (err) return this.bot.log.Error('Faulty autoplaylist entry could not be deleted');
			this.bot.log.Event('Faulty autoplaylist entry deleted');
		});
	}

	inHistory(url: string): boolean {
		if (this.history.indexOf(url) != -1) return true;
		return false;
	}
}
