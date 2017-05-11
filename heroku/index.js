'use strict';

const smoochBot = require('smooch-bot');
const MemoryLock = smoochBot.MemoryLock;
const SmoochApiStore = smoochBot.SmoochApiStore;
const SmoochApiBot = smoochBot.SmoochApiBot;
const StateMachine = smoochBot.StateMachine;
const app = require('../main');
const script = require('../script');
const SmoochCore = require('smooch-core');
const jwt = require('../jwt');

const avatarUrl = "";

const store = new SmoochApiStore({ jwt });
const lock = new MemoryLock();
const webhookTriggers = ['message:appUser', 'postback'];

function createWebhook(smoochCore, target) {
	return smoochCore.webhooks.create({
		target,
		triggers: webhookTriggers
	})
		.then((res) => {
			console.log('Smooch webhook created with target', res.webhook.target);
		})
		.catch((err) => {
			console.error('Error creating Smooch webhook:', err);
			console.error(err.stack);
		});
}

function updateWebhook(smoochCore, existingWebhook) {
	return smoochCore.webhooks.update(existingWebhook._id, {
		triggers: webhookTriggers
	})
		.then((res) => {
			console.log('Smooch webhook updated with missing triggers', res.webhook.target);
		})
		.catch((err) => {
			console.error('Error updating Smooch webhook:', err);
			console.error(err.stack);
		})
	;
}

// Create a webhook if one doesn't already exist
if (process.env.SERVICE_URL) {
	const target = process.env.SERVICE_URL.replace(/\/$/, '') + '/webhook';
	const smoochCore = new SmoochCore({
		jwt
	});
	smoochCore.webhooks.list()
		.then((res) => {
			const existingWebhook = res.webhooks.find((w) => w.target === target);
			if (!existingWebhook) {
				return createWebhook(smoochCore, target);
			}

			const hasAllTriggers = webhookTriggers.every((t) => {
				return existingWebhook.triggers.indexOf(t) !== -1;
			});
			if (!hasAllTriggers) {
				updateWebhook(smoochCore, existingWebhook);
			}
		})
	;
}

function createBot(appUser) {

	var userId = appUser.userId || appUser._id;
	console.log("user id is: " + userId);
	var botprompt;

	if (process.env.BOT_PROMPT != null) {
		botprompt = process.env.BOT_PROMPT;
	} else {
		botprompt = "";
	}
	
	return new SmoochApiBot({
		botprompt,
		avatarUrl,
		lock,
		store,
		userId
	});
}

function handleMessages(req, res) {
	console.log("in handleMessages");

	const messages = req.body.messages.reduce((prev, current) => {
		if (current.role === 'appUser') {
			prev.push(current);
		}
		return prev;
	}, []);

	if (messages.length === 0) {
		return res.end();
	}

	const stateMachine = new StateMachine({
		script,
		bot: createBot(req.body.appUser)
	});

	messages[0].appUser = req.body.appUser;
	if (req.body && req.body.postbacks && req.body.postbacks[0] && req.body.postbacks[0].action && req.body.postbacks[0].action.payload) {
	  messages[0].payload = req.body.postbacks[0].action.payload;
	  console.log("payload:" + messages[0].payload);
	}
	console.log('LOGS : messages =', messages[0])
	stateMachine.receiveMessage(messages[0])
		.then(() => res.end())
		.catch((err) => {
			console.error('SmoochBot error:', err);
			console.error(err.stack);
			res.end();
		});
}

function handlePostback(req, res) {
	console.log("in handlePostback");
	const postback = req.body.postbacks[0];
	if (!postback || !postback.action) {
		res.end();
	}

	const stateMachine = new StateMachine({
		script,
		bot: createBot(req.body.appUser)
	});

	// don't send postback.action.text because message.text is performed later...

	stateMachine.receiveMessage(postback.action)
		.then(() => res.end())
		.catch((err) => {
			console.error('SmoochBot error:', err);
			console.error(err.stack);
			res.end();
		});
}

app.post('/webhook', function(req, res, next) {
	const trigger = req.body.trigger;

	switch (trigger) {
		case 'message:appUser':
			handleMessages(req, res);
			break;

		case 'postback':
			handlePostback(req, res);
			break;

		default:
			console.log('Ignoring unknown webhook trigger:', trigger);
	}
});

var server = app.listen(process.env.PORT || 8000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Smooch Bot listening at http://%s:%s', host, port);
});
