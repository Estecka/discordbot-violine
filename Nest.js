var Interpreter = require("./Interpreter.js");
let Command = require("./Command.js");
let Postman = require("./Postman.js");

class Nest 
{
	_isLegacy = false;
	/**
	 * A dictionnary of {Command} objects :
	 */
	_commands = {};

	/**
	 * 
	 * @param {CallableFunction{}} module 
	 */
	constructor(module){
		this._commands = module;
	}

	/**
	 * Executes a given command
	 * @param {string} name The name of the command to execute
	 * @param {string} args The argument passed to the command.
	 * @param {Postman} postman The Postman used for replying.
	 */
	Run (name, args, postman) {
		for (cmd in this._commands){
			if (cmd == name)
			{
				/**
				 * @type {Command}
				 */
				cmd = this._commands[name];
				if (cmd._isLegacy)
					args = Interpreter.SplitSentence(args);
				return cmd.Invoke(args);
			}
		}
		return null;
	};
};

module.exports = Nest;