/* Copyright (c) 2017 Addventa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

'use strict';

const csNull="\x00";

module.exports = {
	callCs: function (host, port, username, bot, oob, msg) {
		return new Promise(function(resolve, reject) {

			console.log("user: " + username + " said: " + msg);

			if (host==null) {
				console.log("chatscript: host cannot be null!");
			}
			if (port==null) {
				port=1024;
			}
			if (bot==null) {
				bot="";
			}
			if (username==null) {
				username="";
			}
			var oobmsg = "";
			if (oob) {
				oobmsg = "[ " + oob + " ]";
			}

			var finalmsg = oobmsg + " " + msg;
			console.log("final msg sent to CS: " + finalmsg);

			var net = require('net');
			var socket = new net.Socket();

			socket.connect(port, host, () => {
				socket.write( username + csNull + bot + csNull + finalmsg + csNull );
			});

			socket.on('data', (data) => {
				socket.destroy();
				var res = String(data);
				console.log('bot says: ' + res);
				var oob_start = res.indexOf("[");
				if(oob_start != -1) {
					var oob_end = res.indexOf("]");
					var result = JSON.parse(res.substring(oob_start + 1, oob_end));
					res = res.substring(oob_end + 1);
				}
				resolve(res);
			});
		});
	}
};
