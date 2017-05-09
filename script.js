'use strict';

const Script = require('smooch-bot').Script;
const chatscript = require('./chatscript');

module.exports = new Script({
	start: {
		receive: (bot, message) => {
			var csbot;
			if (process.env.CS_BOT!=null) {
				csbot = process.env.CS_BOT;
			} else {
				csbot = "";
			}

			var oob = {};
			oob.surname = message.appUser["surname"];
			oob.givenName = message.appUser["givenName"];

			console.log("oob: " + JSON.stringify(oob));

			var finalMsg = message.text;
			if (message.payload) {
				finalMsg = message.payload;
			}

			return chatscript.callCs(process.env.CS_HOST, process.env.CS_PORT, bot.userId, csbot, JSON.stringify(oob), finalMsg)
				.catch(function(e) {
					console.log(e);
					bot.say("Sorry, can you repeat?");
				})
				.then( (resp) => {
					var msgs = resp.split("NEXTMSG");
					for (var i = 0; i < msgs.length; i++) {
						console.log("msg: " + msgs[i]);
						bot.say(msgs[i]);
					}
				})
				.then( () => 'start')
			;
		}
	}
});
