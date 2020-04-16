import { Message } from 'discord.js';
import { Bot } from '../Bot';
import { VideoInfo } from '../util/Youtube';
import { QueueVideo } from '../util/Queue';

export class Play {
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

		const newQueueObj: QueueVideo = this.bot.Queue.convert(info);
		this.bot.Queue.add(newQueueObj);
		this.msg.channel.send(`\`${newQueueObj.title}\` added to queue!`);
		this.bot.log.Event(`\`${newQueueObj.title}\` added to queue!`);
		this.bot.voice.startPlaying();
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Play(msg, cmd, args, bot);
};
