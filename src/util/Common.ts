import { Client, Message } from 'discord.js';
import { Bot, Logger } from '../Bot';
import { Commands } from './Commands';

export class Common {
	private bot: Bot;
	private client: Client;
	private log: Logger;
	private cmd: Commands;

	constructor(_bot: Bot) {
		this.bot = _bot;
		this.client = this.bot.client;
		this.log = this.bot.log;
		this.cmd = new Commands(this.bot);
	}

	registerEvents() {
		this.bot.client.on('ready', () => readyEvent(this.bot));
		this.bot.client.on('message', (msg) => messageEvent(this.bot, msg, this.cmd));
	}
}

const readyEvent = (bot: Bot) => {
	bot.log.Event(`Logged in as ${bot.client.user.tag}`);
};

const messageEvent = (bot: Bot, msg: Message, cmd: Commands) => {
	if (!bot.currentGuild && msg.guild) {
		bot.currentGuild = msg.guild;
		bot.log.Event(`Found guild: ${bot.currentGuild}`);
	}

	if (msg.author.bot || !msg.guild || !msg.content.startsWith(bot.config.prefix)) return false;

	const args = msg.content.slice(bot.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	cmd.handle(msg, command, args);
};
