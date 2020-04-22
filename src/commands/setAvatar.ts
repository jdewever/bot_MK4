import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class setAvatar {
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
		if (this.msg.author.id != this.bot.config.ownerID) return this.msg.channel.send("You're not meep");
		const img = this.args[0];
		this.bot.client.user.setAvatar(img);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new setAvatar(msg, cmd, args, bot);
};
