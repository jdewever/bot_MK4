import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Remove {
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
		if (this.args.length != 1) return this.msg.channel.send('Wrong / missing parameters');
		const index = parseInt(this.args[0]);
		if (!index) return this.msg.channel.send('Wrong / missing parameters');

		if (index > this.bot.Queue.length || index < 1) return this.msg.channel.send('Wrong / missing parameters');

		this.bot.Queue.remove(index, 1);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Remove(msg, cmd, args, bot);
};
