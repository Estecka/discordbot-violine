let Reply = require("../Reply.js");
let commands = {}


commands["v!color"] = {
	_isLegacy: true,
	help: ()=>"Preview a color-code \nE.g: `v!color 0x8844ff`",
	Invoke: function(params){
		color = parseInt(params[0]);
		if (isNaN(color) || color<0 || color>0xffffff)
			return Reply.invalid;
		else {
			let reply = Reply.Say(params[0]);
			reply.embed.color = color;
			return reply
		}
	}
};

module.exports = commands;