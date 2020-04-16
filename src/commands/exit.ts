import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Exit {
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
		this.msg.channel.send('Buh bye :wave:').then(() => {
			this.bot.client.destroy();
			setTimeout(() => process.exit(0), 3000);
		});
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Exit(msg, cmd, args, bot);
};
