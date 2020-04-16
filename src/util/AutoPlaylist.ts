import { Bot } from '../Bot';
import { eachLine } from 'line-reader';
import { QueueVideo } from './Queue';
import { VideoInfo } from './Youtube';

export class AutoPlaylist {
	private bot: Bot;
	private file: string;
	private list: string[];

	constructor(bot_: Bot) {
		this.bot = bot_;
		this.file = `${this.bot.rootFolder}/autoplaylist.txt`;
		this.load();
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
			const id = this.bot.youtube.getID([this.randomUrl()]);
			const info: VideoInfo = await this.bot.youtube.getInfo(await id);
			res(this.bot.Queue.convert(info));
		});
	}

	randomUrl(): string {
		return this.list[Math.floor(Math.random() * this.list.length)];
	}
}
