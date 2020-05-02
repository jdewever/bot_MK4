import { Client, Guild } from 'discord.js';
import * as debug from 'debug';
import * as path from 'path';
const pb = require('pastebin-ts');
// import {PastebinAPI} from "pastebin-ts"

import { Common } from './util/Common';
import { Config } from './util/Config';
import { Reddit } from './util/Reddit';
import { Queue } from './util/Queue';
import { Voice } from './util/Voice';
import { AutoPlaylist } from './util/AutoPlaylist';
import { Youtube } from './util/Youtube';
import { PresenceHelp } from './util/PresenceHelp';

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
	public Presence: PresenceHelp;
	public paste /*: PastebinAPI*/;

	constructor() {
		this.client = new Client();
		this.ch = new Common(this);

		this.log = {
			System: debug(`system`),
			Event: debug(`event`),
			Error: debug(`error`),
			Warn: debug(`warn`),
			Info: debug(`info`),
			Debug: debug(`debug`),
		};

		this.config = require('./config.json');
		this.rootFolder = path.dirname(require.main.filename);

		this.Presence = new PresenceHelp(this);
		this.reddit = new Reddit(this);
		this.Queue = new Queue(this);
		this.autoPL = new AutoPlaylist(this);
		this.youtube = new Youtube(this);
		this.voice = new Voice(this);
		this.currentGuild = null;
		this.paste = new pb(this.config.pastebin_key);
	}

	public start(): void {
		this.client.on('error', this.log.Error);
		this.client.on('warn', this.log.Warn);

		this.ch.registerEvents();
		this.client.login(this.config.token);
		this.log.Info('rootFolder: ' + this.rootFolder);
		this.client.setTimeout(() => {
			this.Presence.idle();
		}, 5000);
	}
}

export interface Logger {
	System: debug.Debugger;
	Event: debug.Debugger;
	Error: debug.Debugger;
	Warn: debug.Debugger;
	Info: debug.Debugger;
	Debug: debug.Debugger;
}
