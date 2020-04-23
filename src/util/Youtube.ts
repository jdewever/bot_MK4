import { Bot } from '../Bot';
import ytdl = require('ytdl-core');
import * as yts from 'yt-search';
import { Readable } from 'stream';
import { QueueVideo } from './Queue';
import * as fs from 'fs';
import * as path from 'path';

export class Youtube {
	private bot: Bot;
	private ytOptions: Object;
	private folder: string;

	constructor(_bot: Bot) {
		this.bot = _bot;
		this.ytOptions = { filter: 'audioonly' };

		fs.promises
			.mkdir(path.resolve(this.bot.rootFolder, this.bot.config.tempFolder), { recursive: true })
			.then(() => {
				this.folder = path.resolve(this.bot.rootFolder, this.bot.config.tempFolder);
				this.bot.log.Info(`Temporary folder exists or created at: ${this.folder}`);
			})
			.catch((err) => {
				this.bot.log.Error("Can't create temp Folder" + err);
			});
	}

	/*
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
    */

	searchVideo(str: string): Promise<string> {
		return new Promise(async (res, rej) => {
			try {
				if (!str) throw new Error('NO_SEARCH_GIVEN');
				const results: yts.SearchResult = await yts(str);
				if (ytdl.validateURL(results.videos[0].url)) {
					res(results.videos[0].url);
				} else {
					throw new Error('NO_VALID_SEARCH_RESULT');
				}
			} catch (err) {
				rej(err);
			}
		});
	}

	/*
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
    */

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
				this.bot.log.Error('@ Youtube.getInfo()');
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
				} else throw new Error('Youtube.getID()');
			} catch (err) {
				this.bot.log.Error(err);
				rej();
			}
		});
	}

	download(obj: QueueVideo): DownloadObject {
		if (!obj || !this.folder) return null;

		const downStream: Readable = ytdl(obj.url, this.ytOptions);
		const downPath: string = path.resolve(this.folder, `${obj.id}.mp3`);
		const writeStream: fs.WriteStream = downStream.pipe(fs.createWriteStream(downPath));
		return { stream: writeStream, location: downPath };
	}
}

export interface VideoInfo {
	title: string;
	url: string;
	id: string;
	length: number;
	thumbnail: string;
}

export interface DownloadObject {
	stream: fs.WriteStream;
	location: string;
}
