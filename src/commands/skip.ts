import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Skip {
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
		if (!this.bot.voice.playing) return this.msg.channel.send('The bot is not playing anything rn');
		this.bot.voice.skip();
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Skip(msg, cmd, args, bot);
};
