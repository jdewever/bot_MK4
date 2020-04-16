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
		this.bot.voice.skip();
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Skip(msg, cmd, args, bot);
};
