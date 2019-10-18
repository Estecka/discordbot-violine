var Reply  = require("./Reply.js");
var Config = require("./config.json");
var Nest   = require("./Nest.js");
var Interpreter = require("./Interpreter.js");
var Postman = require("./Postman.js");

var Violine = {

	/**
	 * @type {Object.<string, Nest>}
	 */
	legacyModules: {},


	/**
	 * Processes a message 
	 * @param {Postman} postman The Postman object that carries the message
	 * @return {object} The answer, or an array of answers.
	 */
	ProcessSentence: function(postman) {
		let words = Interpreter.ShiftSentence(postman.message.content);
		let cmdName = words.current;
		let args = words.remaining;

		let result = this.ProcessCommand(cmdName, args, postman);

		if (result && isNaN(result))
			postman.Complete(result);
		// If no commands are triggered, hum to your name.
		if (!result) {
			words = Interpreter.SplitSentence(postman.message.content);
			if (words.includes(Violine.mentions[0]) || words.includes(Violine.mentions[1]))
				postman.Complete({ message: "♪" });
		}
	},

	/**
	 * Find the corresponding command and executes it.
	 * @param {string} cmdName The name of the command
	 * @param {string} args The unprocessed arguments string
	 * @param {Postman} postman The postman carrying the command
	 * @return {boolean} `true` if a command was found.
	 */
	ProcessCommand: function(cmdName, args, postman) {
		let r = false;
		for (let m in this.legacyModules){
			let nest = this.legacyModules[m];

			try{
				r = nest.Run(cmdName, args, postman);
				if (r)
					return true;
			}
			catch(e){
				console.error(e);
				postman.Complete(Reply.Error(null, "Command failed to execute"));
				return true;
			}
		}
		return false;
	}
};
Violine.config = Config;

// --------------
// Legacy methods
// --------------
Violine.initialize = function(){
	try {
		Violine.mentions = [
			"<@"+Client.id+">",
			"<@!"+Client.id+">"
		];

		Violine.reloadAllLegacy();
		
	}catch(err){
		console.error("Initialization Failed");
		console.error(err);
		return -1;
	}
};

Violine.Send = function(messages, channel){
	if (!Array.isArray(messages))
		messages = [messages];
	let msg = messages.shift();
	if (channel)
		msg.to = channel;

	Client.sendMessage(msg, (error, response)=>{
		if (messages.length>0)
			setTimeout(()=>Violine.Send(messages, channel), 1000);
		if (error){
			console.warn("Message caused an error : ");
			console.warn(msg);
			console.warn(error);
			Client.sendMessage({
				to: msg.to,
				embed: {
					color: 0xff8800,
					description: "⛔ A message was refused by Discord"
				}
			})
		}
	})
};

/**
 * Load/Reload a given module.
 * @param {string} moduleName 
 */
Violine.reloadLegacy = function(moduleName){
	let path = "./violine_commands_legacy/"+moduleName+".js"
	console.log("Loading "+path);
	try {
		delete require.cache[require.resolve(path)];
		Violine.legacyModules[moduleName] = new Nest(require(path));
		return 0;
	} catch(e){
		console.error("Module failed to load: "+moduleName+" ("+path+")");
		console.error(e);

		return -1;
	}
};

/**
 * Load/Reload all modules and config.
 */
Violine.reloadAllLegacy = function(){
	console.log("Reloading...");
	try {
		delete require.cache[require.resolve("./config.json")];
		Violine.config = require("./config.json")
	}
	catch(e){
		console.error(e);
		return Reply.Failure(null, "Error in config file");
	}

	Client.setPresence({
		game:{
			name: Violine.config.game
		}
	});

	for (var name in Violine.legacyModules)
		delete Violine.legacyModules[name];

	let result = [];
	for (var i in Violine.config.import_commands_legacy)
		Violine.reloadLegacy(Violine.config.import_commands_legacy[i]);

	console.log("Done\n");
};

global.Violine = Violine;
module.exports = Violine;