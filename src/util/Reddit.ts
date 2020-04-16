import sf = require('snekfetch');
import { Bot } from '../Bot';
import { Message, MessageEmbed } from 'discord.js';

export class Reddit {
	private bot: Bot;

	constructor(bot_: Bot) {
		this.bot = bot_;
	}

	getRandomImage(sub: string, msg: Message): Promise<MessageEmbed> {
		return new Promise(async (res, rej) => {
			try {
				const req = sf.get(`https://www.reddit.com/r/${sub.toLowerCase()}.json?sort=top&t=year`).query({ limit: 800 });
				const tmpList = (await req).body['data'].children;
				const list = tmpList.filter((child) => child.data.url.toLowerCase().startsWith('https://i.redd.it/'));

				if (!list.length) rej('NO_MEMES');

				const rand = Math.floor(Math.random() * list.length);
				const child = list[rand].data;
				const embed = new MessageEmbed()
					.setColor(0x00a2e8)
					.setTitle(child.title)
					.setImage(child.url)
					.setFooter(`Provided by r/${sub}`);

				res(embed);
			} catch (err) {
				rej(err);
			}
		});
	}
}
