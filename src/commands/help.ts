import { Message } from 'discord.js';
import { Bot } from '../Bot';
import path = require('path');
import 'fs';
import { readFile } from 'fs';

export class Help {
	private bot: Bot;
	private msg: Message;
	private cmd: string;
	private args: string[];
	private helpFile: string;

	constructor(msg_: Message, cmd_: string, args_: string[], bot_: Bot) {
		this.bot = bot_;
		this.msg = msg_;
		this.cmd = cmd_;
		this.args = args_;
		this.helpFile = path.resolve(this.bot.rootFolder, 'help.json');
	}

	async run() {
		let output = '';
		readFile(this.helpFile, 'utf8', (err, content) => {
			if (err) return this.msg.channel.send('Error while parsing help-file');
			try {
				const data: Object = JSON.parse(content);
				console.dir(data)
			} catch (err) {
				this.bot.log.Error('Error while parsing help.json');
				return this.msg.channel.send('Error while parsing help-file');
			}
		});
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Help(msg, cmd, args, bot);
};