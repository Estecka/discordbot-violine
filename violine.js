var Reply = require("./messages.js");
var Config = require("./config.json");
var fs = require("fs");

/**
 * @typedef {object} ShiftedParams
 * @property {string} current The value of the current parameter.
 * @property {string} remaining The remaining parameters.
 */

/**
  * Checks whether a given character is a whitespace
  * @param {character} char 
  * @returns {boolean} True if `char` is a whitespace
  */
function IsWhitespace(char) {
	return " \t\n\r\v\f".indexOf(char) > 0;
}

var Violine = {
	/**
	 * Processes a message 
	 * @param {string} sender The ID of the sender
	 * @param {string} message The body of the message
	 * @return {object} The answer, or a series of answer.
	 */
	ProcessMessage: function(sender, message) {},

	/**
	 * Gets the next parameter from the given string.
	 * @param {string} message The full input command.
	 * @returns {ShiftedParams}
	 */
	ShiftParams: function(message){
		let result = {};
		let length = message.length;
		let limit = 0;

		for (let i=0; i<length; i++) {
			if (IsWhitespace(message[i])) {
				limit = i;
				break;
			}
		}
		result.value = message.substring(0, limit);
		limit++;
		for (let i=limit; i<length; i++){
			if (!IsWhitespace(message[i])){
				limit = i;
				break;
			}
		}
		if (limit < length)
			result.remaining = message.substring(limit);
		else
			result.remaining = "";
		return result;
	},

	/**
	 * Separates a string into parameters at every whitespace.
	 * @param {*} parameter 
	 * @return {string[]} An array of words.
	 */
	SplitsParameters: function(parameter){
		return parameter.match(/\S+/g) || [];
	},
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


/**
 * Splits a string into words.
 * @param {*} message 
 */
Violine.parse = function(message){
	message = message.split(' ');
	for (var i=0; i<message.length; i++){
		if (!message[i]){
			message.splice(i,1);
			i--;
		}
	}
	return message;
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