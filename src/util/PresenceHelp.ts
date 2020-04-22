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
		return this.current;
	}

	listening(title: string): Presence {
		this.bot.client.user.setPresence({ status: 'online', activity: { name: title, type: 'LISTENING' } });

		return this.current;
	}

	online(): Presence {
		this.bot.client.user.setPresence({ status: 'online' });

		return this.current;
	}
}
