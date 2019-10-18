var Reply = require("./Reply.js");
let Postman = require("./Postman.js");

class Command 
{
	/**
	 * If true the arguments will be passed as an array of words instead of a sentence.
	 */
	_isLegacy = false;

	/**
	 * If true, only admins can execute or require help for the command.
	 */
	_isAdmin = false;
	
	/**
	 * Executes the command.
	 * @param {string} args The sentence passed to the command.
	 * @param {Postman} postman The Postman used for replying.
	 */
	Invoke(args, postman) {
		postman.Complete(Reply.Warning(null, "This command has no implementation"));
	}

	/**
	 * Provides some mighty useful intel if I say so myself.
	 * @return {string} The unformatted help message to display.
	 */
	help() { return "This command has no help"; }

};

module.exports = Command;