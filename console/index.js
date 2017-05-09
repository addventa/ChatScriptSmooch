'use strict';

const smoochBot = require('smooch-bot');
const MemoryStore = smoochBot.MemoryStore;
const MemoryLock = smoochBot.MemoryLock;
const Bot = smoochBot.Bot;
const Script = smoochBot.Script;
const StateMachine = smoochBot.StateMachine;


class ConsoleBot extends Bot {
	constructor(options) {
		super(options);
	}

	say(text) {
		return new Promise((resolve) => {
			console.log("Promise:"+text);
			resolve();
		});
	}
}

const chatscript = require('../chatscript');

const script = new Script({
	start: {
		receive: (bot, message) => {
			return chatscript.callCs(process.env.CS_HOST, process.env.CS_PORT, "testuser", "", message.text)
				.then( (resp) => bot.say(resp) )
				.then( () => 'start')
			;
		}
	}
});

const userId = 'testUserId';
const store = new MemoryStore();
const lock = new MemoryLock();
const bot = new ConsoleBot({
	store,
	lock,
	userId
});

const stateMachine = new StateMachine({
	script,
	bot,
	userId
});

process.stdin.on('data', function(data) {
	stateMachine.receiveMessage({
		text: data.toString().trim()
	})
		.catch((err) => {
			console.error(err);
			console.error(err.stack);
		});
});
