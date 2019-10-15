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
	 * @returns {string|string[]|object|object[]} The message(s) to be sent. Strings are automatically converted into message object.
	 */
	call(args) { throw "Undefined Command"; }

	/**
	 * Provides some mighty useful intel if I say so myself.
	 * @returns {string} The unformatted help message to display.
	 */
	help() { return "This command has no help"; }

};

module.exports = Command;