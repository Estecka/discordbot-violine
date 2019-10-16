var Reply  = require("./messages.js");
var Config = require("./config.json");
var Nest   = require("./Nest.js");
var Interpreter = require("./Interpreter.js");
var Postman = require("./Postman.js");

var Violine = {
	/**
	 * Processes a message 
	 * @param {Postman} postman The Postman object that carries the message
	 * @return {object} The answer, or an array of answers.
	 */
	ProcessSentence: function(postman) {
		let words = Interpreter.ShiftSentence(postman.message.content);
		let cmdName = words.current;
		let args = words.remaining;

		let result = this.ProcessCommand(cmdName, args, postman.message.senderId);

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
	 * @param {string} senderId The Discord ID of the sender.
	 * @returns {object} The anwser to the command, or Null if no matching command was found.
	 */
	ProcessCommand: function(cmdName, args, senderId) {
		for (let i in this.legacyCommands){
			let cmd = this.legacyCommands[i][cmdName];
			if (cmd){
				// Admin handling should be moved into the command Nests
				if (cmd._isAdmin && !Violine.config.admins.includes(senderId))
					result = {embed: {
						color: 0xff8844,
						footer: {text: "🚷 Forbidden"}
					}};
				else {
					if (cmd._isLegacy)
						args = Interpreter.SplitSentence(args);
					try{
						result = cmd.call(args);
					}
					catch(e){
						result = Reply.Error(null, "Command failed to execute");
						console.error(e);
					}
				}

				// Here, convert string results to message objects

				return result;
			}
		}
		return false;
	}
};
Violine.config = Config;
Violine.legacyCommands = {};

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
 * @param {*} moduleName 
 */
Violine.reloadLegacy = function(moduleName){
	let path = "./violine_commands_legacy/"+moduleName+".js"
	console.log("Loading "+path);
	try {
		delete require.cache[require.resolve(path)];
		Violine.legacyCommands[moduleName] = require(path);
	
		return Reply.embed("✔️ Success: "+moduleName, 0x22ff44, true);
	} catch(e){
		console.error("Module failed to load: "+moduleName+" ("+path+")");
		console.error(e);
		return Reply.embed("❌ Failure: "+moduleName, 0xFF4422, true);
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

	let result = [];
	Violine.legacyCommands = {};
	for (var i in Violine.config.import_commands_legacy)
		result.push(Violine.reloadLegacy(Violine.config.import_commands_legacy[i]));
	
	//Violine.legacyCommands["built-in"] = require("./built-in.js");

	console.log("Done\n");
	return result;
};

global.Violine = Violine;
module.exports = Violine;