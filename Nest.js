var Command = require("./Command.js");
var Interpreter = require("./Interpreter.js");

class Nest 
{
	_isLegacy = false;
	/**
	 * A dictionnary of {Command} objects :
	 */
	_commands = {};

	/**
	 * Executes a given command
	 * @param {string} name The name of the command to execute
	 * @param {string} args The argument passed to the command.
	 */
	Run (name, args) {
		for (cmd in this.commands)
		if (cmd == name)
		{
			/**
			 * @type {Command}
			 */
			cmd = this.commands[name];
			if (cmd._isLegacy)
				args = Interpreter.SplitSentence(args);
			return cmd.call(args);
		}
		return null;
	};
};

module.exports = Nest;