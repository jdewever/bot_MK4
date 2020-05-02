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
		const voiceSpeaking: boolean = this.bot.voice.connection.voice.speaking;

		let txt = '';
		txt += `Playing: \`${isPlaying}\`\n`;
		txt += `Now Playing: \`${nowPlaying}\`\n`;
		txt += `Volume: \`${volume}\`\n`;
		txt += `Voice Speaking: \`${voiceSpeaking}\`\n`;
		txt += `Stream Time: \`${this.bot.ch.timeFormat(this.bot.voice.dispatcher.streamTime / 1000)}\`\n`;
		txt += `Total Stream Time: \`${this.bot.ch.timeFormat(this.bot.voice.dispatcher.totalStreamTime / 1000)}\`\n`;
		txt += `Paused Time: \`${this.bot.ch.timeFormat(this.bot.voice.dispatcher.pausedTime / 1000)}\`\n`;
		txt += `Real Time: \`${this.bot.ch.timeFormat(
			(this.bot.voice.dispatcher.streamTime - this.bot.voice.dispatcher.pausedTime) / 1000
        )}\`\n`;

		this.msg.channel.send(txt);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new Status(msg, cmd, args, bot);
};
