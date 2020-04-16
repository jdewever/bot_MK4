import { Message } from 'discord.js';
import { Bot } from '../Bot';
import { VideoInfo } from '../util/Youtube';
import { QueueVideo } from '../util/Queue';

export class PlayNext {
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
		if (this.args.length == 0) {
			return this.msg.channel.send('Not enough parameters');
		}
		const id = this.bot.youtube.getID(this.args);
		const info: VideoInfo = await this.bot.youtube.getInfo(await id);

		const newQueueObj: QueueVideo = {
			title: info.title,
			url: info.url,
			id: info.url,
			length: info.length,
			thumbnail: info.thumbnail,
			queuedBy: this.msg.author,
		};

		this.bot.Queue.first(newQueueObj);
		this.msg.channel.send(`\`${newQueueObj.title}\` added to queue at position 1!`);
		this.bot.log.Event(`\`${newQueueObj.title}\` added to queue at position 1!`);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new PlayNext(msg, cmd, args, bot);
};
