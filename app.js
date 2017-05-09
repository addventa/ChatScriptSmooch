'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function(req, res) {
	var csbot;
	if (process.env.CS_BOT!=null) {
		csbot = process.env.CS_BOT;
	} else {
		csbot = "";
	}
	console.log("bot name = " + csbot);

	res.render('index', {
		appToken: process.env.SMOOCH_APP_TOKEN
	});
});

module.exports = app;
