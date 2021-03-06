import { Message } from 'discord.js';
import { Bot } from '../Bot';
import { QueueVideo } from '../util/Queue';

export class NowPlaying {
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
		const np: QueueVideo = this.bot.voice.nowPlaying;
		if (!np) return this.msg.channel.send('Nothing is playing rn');
		const time: Array<number> = [];
		time.push(this.bot.voice.timePlayed);
		time.push(this.bot.voice.playLength);
		this.msg.channel.send(
			`Now playing: \`${np.title}\`\n:stopwatch:\`${this.bot.ch.timeFormat(
				time[0]
			)}\` from \`${this.bot.ch.timeFormat(time[1])}\``
		);
	}
}

export const getClass = (msg: Message, cmd: string, args: string[], bot: Bot) => {
	return new NowPlaying(msg, cmd, args, bot);
};
