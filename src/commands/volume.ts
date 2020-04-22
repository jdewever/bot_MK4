import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Volume {
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
		if (this.args.length == 0) return this.msg.channel.send(`Current volume: \`${this.bot.voice.volume * 100}\`%`);
		if (this.args.length > 1) return this.msg.channel.send('Wrong parameter(s)');
		const num: number = parseInt(this.args[0]);
		if (!num || num < 1 || num > 100) return this.msg.channel.send('Wrong parameter(s)');

		this.bot.voice.volume = num;
		this.msg.channel.send(`Changed volume to: ${num}%`);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Volume(msg, cmd, args, bot);
};
