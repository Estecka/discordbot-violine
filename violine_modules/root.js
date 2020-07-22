const Reply = require("../Reply");
const Command = require("../Command");
const Interpreter = require("../Interpreter.js");

/**
 *  @type {Object<string, Command>}
 */
var commands = {
	echo: {
		_isRoot: true,
		main: function(args) {
			return Reply.RawTell(args);
		},
	},
	
	drill: {
		_isRoot: true,
		main: function(args) {
			let arg = Interpreter.ShiftSentence(args);
			if (arg.current.length <= 0 || Reply[arg.current] == undefined)
				return Reply.invalid;

			else {
				let r = Reply[arg.current];
				r.content = '♫';
				if (!r.embed.footer)
					r.embed.footer = { text: "This is a drill." };
				return r;
			}
		}
	},
};

commands.say = commands.echo;

module.exports = commands;