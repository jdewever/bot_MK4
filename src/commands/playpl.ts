import { Message } from 'discord.js';
import { Bot } from '../Bot';
import * as ytpl from 'ytpl';
import { VideoInfo, DownloadObject } from '../util/Youtube';
import { QueueVideo } from '../util/Queue';

export class PlayPlaylist {
	private bot: Bot;
	private msg: Message;
	private cmd: string;
	private args: string[];

	constructor(msg_: Message, cmd_: string, args_: string[], bot_: Bot) {
		this.bot = bot_;
		this.msg = msg_;
		this.cmd = cmd_;
		this.args = args_;
	}

	async run() {
		if (!this.args || this.args.length != 1) return this.msg.channel.send('Incorrect argument(s)');
		const id = this.bot.youtube.getPlID(this.args[0]);
		if (!id) return this.msg.channel.send('Error while parsing this playlist...');

		ytpl(id, (err, pl) => {
			try {
				if (err) return this.msg.channel.send('Error while parsing this playlist...');
				const ids = pl.items.map((el) => el.id);
				ids.map(async (id) => {
					const info: VideoInfo = await this.bot.youtube.getInfo(this.args);
					if (!info) throw new Error();

					const newQueueObj: QueueVideo = this.bot.Queue.convert(info, this.msg.author);
					if (this.bot.config.download) {
						const down: DownloadObject = this.bot.youtube.download(newQueueObj);
						down.stream.on('finish', () => {
							newQueueObj.filePath = down.location;
						});
					}
					this.bot.Queue.first(newQueueObj);
					this.msg.channel.send(`\`${newQueueObj.title}\` added to queue at position 1!`);
					this.bot.log.Event(`\`${newQueueObj.title}\` added to queue at position 1!`);
					this.bot.voice.startPlaying();
				});
			} catch (err) {
				this.bot.log.Error('FAULTY_VIDEO_REQUEST @ newPlay.run()');
				return this.msg.channel.send('Faulty video request');
			}
		});
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new PlayPlaylist(msg, cmd, args, bot);
};
