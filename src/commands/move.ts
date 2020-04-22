import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Move {
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
		if (this.args.length != 2) return this.msg.channel.send('Wrong / missing parameters');
		const from: number = parseInt(this.args[0]);
		const to: number = parseInt(this.args[1]);
		const objToMove = this.bot.Queue.get(from);

		if (!from || !to) return this.msg.channel.send('Wrong / missing parameters');
		if (from < 1 || to < 1 || from > this.bot.Queue.length || to > this.bot.Queue.length)
			return this.msg.channel.send('Wrong / missing parameters');

		this.bot.Queue.move(from - 1, to - 1);
		this.msg.channel.send(`Moved ${objToMove.title} to position ${to}`);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Move(msg, cmd, args, bot);
};
