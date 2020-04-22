import { Message } from 'discord.js';
import { Bot } from '../Bot';

export class Status {
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
		const isPlaying: string = this.bot.voice.playing ? 'True' : 'False';
		const nowPlaying: string = this.bot.voice.nowPlaying.title;
		const volume: string = this.bot.voice.volume.toString();
		const speaking: string = this.bot.voice.connection.speaking ? 'True' : 'False';
		const voiceSpeaking: string = this.bot.voice.connection.voice.speaking ? 'True' : 'False';

		let txt = '';
		txt += `Playing: \`${isPlaying}\`\n`;
		txt += `Now Playing: \`${nowPlaying}\`\n`;
		txt += `Volume: \`${volume}\`\n`;
		txt += `Speaking: \`${speaking}\`\n`;
		txt += `Voice Speaking: \`${voiceSpeaking}\`\n`;
        
		this.msg.channel.send(txt);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Status(msg, cmd, args, bot);
};
