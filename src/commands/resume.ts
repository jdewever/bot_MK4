import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Resume {
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
		if (!this.bot.voice.dispatcher.paused) return this.msg.channel.send('The bot is not currently paused');

        this.bot.voice.resume();
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Resume(msg, cmd, args, bot);
};
