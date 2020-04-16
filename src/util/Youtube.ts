import { Bot } from '../Bot';
import ytdl = require('ytdl-core');
import yts = require('yt-search');
import { Readable } from 'stream';

export class Youtube {
	private bot: Bot;
	private ytOptions: Object;

	constructor(_bot: Bot) {
		this.bot = _bot;
		this.ytOptions = { filter: 'audioonly' };
	}

	getID(args: string[]): Promise<string> {
		return new Promise(async (res, rej) => {
			if (!args || args.length == 0 || (args.length == 1 && args[0] == '')) rej(null);
			if (ytdl.validateID(args[0]) || ytdl.validateURL(args[0])) {
				res(ytdl.getVideoID(args[0]));
			}
			const searchRes = await this.searchVideo(args.join(' '));
			const id = ytdl.getVideoID(searchRes);
			res(id);
		});
	}

	searchVideo(str: string): Promise<string> {
		return new Promise(async (res, rej) => {
			const results = await yts(str);
			res(results.videos[0].url);
		});
	}

	getInfo(id: string): Promise<VideoInfo> {
		return new Promise(async (res, rej) => {
			const info = await ytdl.getInfo(id);
			const obj: VideoInfo = {
				title: info.title,
				url: info.video_url,
				id: info.video_id,
				length: parseInt(info.length_seconds),
				thumbnail: info.thumbnail_url,
			};
			res(obj);
		});
	}

	getStream(url: string): Readable {
		return ytdl(url, this.ytOptions);
	}
}

export interface VideoInfo {
	title: string;
	url: string;
	id: string;
	length: number;
	thumbnail: string;
}
