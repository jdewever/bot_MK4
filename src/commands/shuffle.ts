import { Message } from 'discord.js';
import { Bot } from '../Bot';
import { runInThisContext } from 'vm';

export class Shuffle {
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
		this.bot.Queue.shuffle();
		this.msg.channel.send('Queue shuffled!');
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Shuffle(msg, cmd, args, bot);
};
