import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Test {
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
		this.bot.log.Info(`Guild: ${this.bot.currentGuild}`);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Test(msg, cmd, args, bot);
};
