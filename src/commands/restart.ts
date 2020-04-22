import { Message } from 'discord.js';
import { Bot } from '../Bot';
import { QueueVideo } from '../util/Queue';

export class Restart {
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
		if (!this.bot.voice.playing) return this.msg.channel.send('The bot is not currently playing anything');
		const vid: QueueVideo = this.bot.voice.nowPlaying;
		this.bot.Queue.first(vid);
		this.bot.voice.skip();
		this.msg.channel.send(`Restarted: \`${vid.title}\``);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Restart(msg, cmd, args, bot);
};
