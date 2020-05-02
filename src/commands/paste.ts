import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Ping {
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
		if (!this.args || this.args.length == 0 || this.args[0] == '')
			return this.msg.channel.send('Please provide text to be uploaded to pastebin.');
		const content: string = this.args.join(' ');
		this.bot.paste
			.createPaste({ text: content })
			.then((res: string) => {
				this.msg.channel.send(`This is your pastebin: ${res}`);
			})
			.catch(this.bot.log.Error);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Ping(msg, cmd, args, bot);
};
