import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Summon {
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
		if (!this.msg.member.voice.channel) return this.msg.channel.send('You must be in a voice channel to to that.');
		this.bot.voice.join(this.msg.member.voice.channel);
		this.bot.log.Event(`Connected to voice in ${this.msg.member.voice.channel.name}`);
		this.bot.voice.startPlaying();
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Summon(msg, cmd, args, bot);
};
