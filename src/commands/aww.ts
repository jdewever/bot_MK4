import { Message, MessageEmbed } from 'discord.js';
import { Bot } from '../Bot';

export class Aww {
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
		const embed: MessageEmbed = await this.bot.reddit.getRandomImage('aww', this.msg);
		this.msg.channel.send(embed);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Aww(msg, cmd, args, bot);
};
