import { Bot } from '../Bot';
import { eachLine } from 'line-reader';

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

	inHistory(url: string): boolean {
		if (this.history.indexOf(url) == -1) return false;
		return true;
	}

	randomUrl(): string {
		const index = Math.floor(Math.random() * this.list.length);
		const url = this.list[index];
		if (url == '' || url.indexOf('watch') == -1) return this.randomUrl();
		if (!this.inHistory(url)) {
			this.history.push(url);
			if (this.history.length >= this.list.length) {
				this.history = [];
			}
			return url;
		} else return this.randomUrl();
	}

	get(): string {
		if (this.list.length == 0) return null;
		const url = this.randomUrl();
		return url;
	}
}
