var Reply = require("./messages.js");
var fs = require("fs");

global.Violine = {};
Violine.config = require("./config.json");
Violine.commands = {};

Violine.initialize = function(){
	try {
		Violine.mentions = [
			"<@"+Client.id+">",
			"<@!"+Client.id+">"
		];

		Violine.reloadAll();
		
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
Violine.reload = function(moduleName){
	let path = "./violine_commands/"+moduleName+".js"
	console.log("Loading "+path);
	try {
		delete require.cache[require.resolve(path)];
		Violine.commands[moduleName] = require(path);
	
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
Violine.reloadAll = function(){
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
	Violine.commands = {};
	for (var i in Violine.config.import_commands)
		result.push(Violine.reload(Violine.config.import_commands[i]));
	
	Violine.commands["built-in"] = require("./built-in.js");

	console.log("Done\n");
	return result;
};

module.exports = Violine;