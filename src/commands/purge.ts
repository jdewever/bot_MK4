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
		let msgs = await this.msg.channel.messages.fetch({ limit: this.messageLimit });
		let toDelete = msgs.filter((m) => m.author.bot || m.content.startsWith(this.bot.config.prefix));

		this.msg.channel.bulkDelete(toDelete);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Purge(msg, cmd, args, bot);
};
