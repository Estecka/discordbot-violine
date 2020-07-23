var Gulp = require("./Gulp.js");
var Reply = require("./Reply.js");
let Command = require("./Command.js");
let Postman = require("./Postman.js");

class Nest 
{
	/**
	 * If set to true, `Run()` will the legacy prototype.
	 * @type {boolean}
	 */
	_isLegacy = false;
	/**
	 * A dictionnary of {Command} objects :
	 * @type {Object.<string, Command>}
	 */
	_commands = {};

	/**
	 * @param {Object.<string, CallableFunction>} module 
	 */
	constructor(module){
		this._commands = module;
	}

	/**
	 * Executes a given command
	 * @param {string} name The name of the command to execute
	 * @param {string} args The argument passed to the command.
	 * @param {Postman} postman The Postman used for replying.
	 * @return {boolean} `true` if a fitting command was found.
	 */
	Run (name, args, postman) {
		for (let cmdName in this._commands){
			if (cmdName == name)
			{
				/**
				 * @type {Command}
				 */
				let cmd = this._commands[name];
				if (cmd._isLegacy){
					args = Gulp.SplitSentence(args);
					let reply = cmd.Invoke(args);
					if (reply && isNaN(reply))
						postman.Complete(reply);
					else
						postman.Complete(Reply.RawTell("♪♫"));
				}
				else {
					cmd.Invoke(args, postman);
				}
				return true;
			}
		}
		return false;
	};
};

module.exports = Nest;