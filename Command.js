const Reply = require("./Reply.js");
const Postman = require("./Postman.js");

class Command 
{
	/**
	 * If true, only admins can execute the command.
	 */
	_isRoot = false;
	
	/**
	 * Executes the command.
	 * @param {string} args The sentence passed to the command.
	 * @param {Postman} postman The Postman used for replying.
	 * @return {Reply|Reply[]}
	 */
	main(args, postman) {
		return Reply.Warning("Not implemented", "This command does nothing yet.");
	}
};

module.exports = Command;