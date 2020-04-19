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
		try {
			if (!this.args || this.args.length == 0) return this.msg.channel.send('Wrong parameter(s)');
			const info: VideoInfo = await this.bot.youtube.getInfo(this.args);
			if (!info) throw new Error();

			const newQueueObj: QueueVideo = this.bot.Queue.convert(info, this.msg.author);
			this.bot.Queue.add(newQueueObj);
			this.msg.channel.send(`\`${newQueueObj.title}\` added to queue!`);
			this.bot.log.Event(`\`${newQueueObj.title}\` added to queue!`);
			this.bot.voice.startPlaying();
		} catch (err) {
			this.bot.log.Error('FAULTY_VIDEO_REQUEST @ newPlay.run()');
			return this.msg.channel.send('Faulty video request');
		}
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Play(msg, cmd, args, bot);
};
