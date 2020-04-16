import { Bot, Logger } from '../Bot';
import { Client, Message } from 'discord.js';
import * as path from 'path';

export class Commands {
	private bot: Bot;
	private client: Client;
	private log: Logger;

	constructor(_bot: Bot) {
		this.bot = _bot;
		this.client = this.bot.client;
	}

	async handle(msg: Message, command: string, args: string[]) {
		try {
			const cmdFile: string = `${path.resolve(this.bot.rootFolder, this.bot.config.commandfolder)}/${command}.js`;
			const req = await import(cmdFile);
			await req.getClass(msg, command, args, this.bot).run();
		} catch (err) {
			this.bot.log.Error(err);
		}
	}
}
