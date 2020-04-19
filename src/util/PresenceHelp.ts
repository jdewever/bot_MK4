import { Bot } from '../Bot';
import { Presence } from 'discord.js';

export class PresenceHelp {
	private bot: Bot;

	constructor(bot_: Bot) {
		this.bot = bot_;
	}

	get current(): Presence {
		return this.bot.client.user.presence;
	}

	idle(): Presence {
		this.bot.client.user.setPresence({ status: 'idle', afk: true });
		this.bot.log.Info('Presence: `IDLE`');
		return this.current;
	}

	listening(title: string): Presence {
		this.bot.client.user.setPresence({ status: 'online', activity: { name: title, type: 'LISTENING' } });
		this.bot.log.Info('Presence: `LISTENING`');

		return this.current;
	}

	online(): Presence {
		this.bot.client.user.setPresence({ status: 'online' });
		this.bot.log.Info('Presence: `ONLINE`');

		return this.current;
	}
}
