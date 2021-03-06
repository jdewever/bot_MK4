import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Purge {
	private bot: Bot;
	private msg: Message;
	private cmd: string;
	private args: string[];

	private messageLimit: number;

	constructor(msg_: Message, cmd_: string, args_: string[], bot_: Bot) {
		this.bot = bot_;
		this.msg = msg_;
		this.cmd = cmd_;
		this.args = args_;
		this.messageLimit = 50;
	}

	async run() {
		if (this.msg.channel.type == 'dm') return;
		this.bot.ch.purgeChannelMessages(this.msg.channel, this.messageLimit);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Purge(msg, cmd, args, bot);
};
