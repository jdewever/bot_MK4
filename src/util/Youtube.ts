import { Bot } from '../Bot';
import ytdl = require('ytdl-core');
import * as yts from 'yt-search';
import { Readable } from 'stream';

export class Youtube {
	private bot: Bot;
	private ytOptions: Object;

	constructor(_bot: Bot) {
		this.bot = _bot;
		this.ytOptions = { filter: 'audioonly' };
	}

	getIDOLD(args: string[], auto?: boolean): Promise<string> {
		return new Promise(async (res, rej) => {
			if (!args || args.length == 0 || (args.length == 1 && args[0] == '')) rej(null);
			if (ytdl.validateID(args[0]) || ytdl.validateURL(args[0])) {
				res(ytdl.getVideoID(args[0]));
			} else if (auto) rej(this.bot.log.Error('Autoplaylist entry faulty'));
			else {
				const searchRes = await this.searchVideo(args.join(' '));
				const id = ytdl.getVideoID(searchRes);
				res(id);
			}
		});
	}

	searchVideo(str: string): Promise<string> {
		return new Promise(async (res, rej) => {
			const results: yts.SearchResult = await yts(str);
			if (ytdl.getVideoID(results.videos[0].url)) {
				res(results.videos[0].url);
			} else {
				rej('NO_VALID_SEARCH_RESULT');
			}
		});
	}

	getInfoOLD(id: string, auto?: boolean): Promise<VideoInfo> {
		return new Promise(async (res, rej) => {
			try {
				const info = await ytdl.getInfo(id);
				const obj: VideoInfo = {
					title: info.title,
					url: info.video_url,
					id: info.video_id,
					length: parseInt(info.length_seconds),
					thumbnail: info.thumbnail_url,
				};
				res(obj);
			} catch (err) {
				res(null);
			}
		});
	}

	getStream(url: string): Readable {
		return ytdl(url, this.ytOptions);
	}

	getPlID(url: string): string {
		if (url == null || url == undefined || url.indexOf('?list=') == -1) return null;
		const id: string = url.split('?list=')[1];
		return id;
	}

	getInfo(args: string[], auto?: boolean): Promise<VideoInfo> {
		return new Promise(async (res, rej) => {
			try {
				let id: string = await this.getID(args, auto ? true : false);

				const info = await ytdl.getInfo(id);
				const obj: VideoInfo = {
					title: info.title,
					url: info.video_url,
					id: info.video_id,
					length: parseInt(info.length_seconds),
					thumbnail: info.thumbnail_url,
				};
				res(obj);
			} catch (err) {
				this.bot.log.Error('@ Youtube.newGetInfo()');
				rej(err);
			}
		});
	}

	getID(args: string[], auto: boolean): Promise<string> {
		return new Promise(async (res, rej) => {
			try {
				if (ytdl.validateID(args[0]) || ytdl.validateURL(args[0])) res(ytdl.getVideoID(args[0]));
				else if (!auto) {
					const searchRes = await this.searchVideo(args.join(' '));
					res(ytdl.getVideoID(searchRes));
				} else rej(null);
			} catch (err) {
				this.bot.log.Error(err);
				rej();
			}
		});
	}
}

export interface VideoInfo {
	title: string;
	url: string;
	id: string;
	length: number;
	thumbnail: string;
}
