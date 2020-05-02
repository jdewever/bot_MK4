import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Save {
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
		if (!this.bot.Queue.isEmpty) {
			this.bot.Queue.save();
			return this.msg.channel.send('Queue saved');
		} else return this.msg.channel.send('Nothing to save...');
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Save(msg, cmd, args, bot);
};
