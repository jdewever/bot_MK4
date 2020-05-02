import { User } from 'discord.js';
import { VideoInfo } from './Youtube';
import * as fs from 'fs';
import { Bot } from '../Bot';

export class Queue {
	private queue_: QueueVideo[];
	private bot: Bot;

	constructor(bot_: Bot) {
		this.queue_ = [];
		this.bot = bot_;
	}

	get queue(): QueueVideo[] {
		return this.queue_;
	}

	add(el: QueueVideo): QueueVideo[] {
		this.queue_.push(el);
		return this.queue_;
	}

	addPL(els: QueueVideo[]): QueueVideo[] {
		const newArr = this.queue_.concat(els);
		this.queue_ = newArr;
		return this.queue_;
	}

	get(pos: number): QueueVideo {
		if (pos == null) return null;
		const el = this.queue_[pos - 1];
		return el ? el : null;
	}

	shift(): QueueVideo {
		return this.queue_.shift();
	}

	first(el: QueueVideo): QueueVideo[] {
		this.queue_.unshift(el);
		return this.queue_;
	}

	isEmpty(): boolean {
		return this.queue_.length === 0;
	}

	get length(): number {
		return this.queue_.length;
	}

	remove(start: number, count: number): QueueVideo[] {
		if (!count) count = 1;
		this.queue_.splice(start, count);
		return this.queue_;
	}

	shuffle(): QueueVideo[] {
		const newQueue = shuffleQueue(this.queue_);
		this.queue_ = newQueue;
		return this.queue_;
	}

	format(): string {
		let out = '';
		this.queue_.map((el, i) => {
			out += `**[${i + 1}]** - \`${el.title}\`\n`;
		});

		if (out == '') return 'Queue is empty!';
		return out;
	}

	move(from: number, to: number) {
		let newQueue = moveInQueue(this.queue_, from, to);
		this.queue_ = newQueue;
	}

	convert(obj: VideoInfo, user: User): QueueVideo {
		let newObj = { ...obj, ...{ queuedBy: user } };
		newObj['queuedBy'] = user;
		return newObj;
	}

	save() {
		const str: string = this.toString();
		if (str == '') return false;

		fs.promises
			.writeFile(this.bot.rootFolder + 'savedQueue.json', str)
			.then(() => {
				this.bot.log.Event('Queue saved to disk.');
			})
			.catch((err) => {
				this.bot.log.Error(err);
			});
    }
    
    load() {
        
    }

	toString(): string {
		if (this.isEmpty) return '';
		return JSON.stringify(this.queue_, null, 4);
	}
}

export interface QueueVideo {
	title: string;
	url: string;
	id: string;
	length: number;
	thumbnail: string;
	queuedBy: User;
	filePath?: string;
}

const shuffleQueue = (original: QueueVideo[]): QueueVideo[] => {
	let arr = original.slice(0);
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
};

const moveInQueue = (original: QueueVideo[], from: number, to: number): QueueVideo[] => {
	let arr = original.slice(0);
	let el = arr.splice(from, 1)[0];
	arr.splice(to, 0, el);

	return arr;
};
