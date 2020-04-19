import { Client, Guild } from 'discord.js';
import * as debug from 'debug';
import * as path from 'path';

import { Common } from './util/Common';
import { Config } from './util/Config';
import { Reddit } from './util/Reddit';
import { Queue } from './util/Queue';
import { Voice } from './util/Voice';
import { AutoPlaylist } from './util/AutoPlaylist';
import { Youtube } from './util/Youtube';

// BOT CLASS
export class Bot {
	public client: Client;
	public ch: Common;
	public log: Logger;
	public config: Config;
	public rootFolder: string;
	public reddit: Reddit;
	public Queue: Queue;
	public voice: Voice;
	public currentGuild: Guild;
	public autoPL: AutoPlaylist;
	public youtube: Youtube;

	constructor() {
		this.client = new Client();
		this.ch = new Common(this);

		this.log = {
			System: debug('bot:system'),
			Event: debug('bot:event'),
			Error: debug('bot:error'),
			Warn: debug('bot:warn'),
			Info: debug('bot:info'),
		};
		this.config = require('./config.json');
		this.rootFolder = path.dirname(require.main.filename);

		this.reddit = new Reddit(this);
		this.Queue = new Queue();
		this.autoPL = new AutoPlaylist(this);
		this.youtube = new Youtube(this);
		this.voice = new Voice(this);
		this.currentGuild = null;
	}

	public start(): void {
		this.client.on('error', this.log.Error);
		this.client.on('warn', this.log.Warn);

		this.ch.registerEvents();
		this.log.Info('rootFolder: ' + this.rootFolder);
		this.client.login(this.config.token);
	}
}

export interface Logger {
	System: debug.Debugger;
	Event: debug.Debugger;
	Error: debug.Debugger;
	Warn: debug.Debugger;
	Info: debug.Debugger;
}