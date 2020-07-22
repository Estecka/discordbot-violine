const Reply = require("../Reply");
const Command = require("../Command");

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
};

commands.say = commands.echo;

module.exports = commands;