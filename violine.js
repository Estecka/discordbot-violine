const Reply  = require("./Reply.js");
const Command = require("./Command.js");
var Config = require("./config.json");
const Interpreter = require("./Interpreter.js");
const Postman = require("./Postman.js");
const Discord = require("discord.js");

var Violine = {

	/**
	 * @type {Discord.Client}
	 */
	client: null,

	config: Config,

	/**
	 * @type {Object.<string, Command[]>}
	 */
	modules: {},

	/**
	 * Processes a message 
	 * @param {Postman} postman The Postman object that carries the message
	 */
	ProcessSentence: function(postman) {
		let start = 0;
		while(Interpreter.IsWhitespace(postman.message.content[start]))
			start++;
		
		let prefixesArray = this.config.command_prefixes.concat(this.mentions)
		for(prefix of prefixesArray) {
			if(postman.message.content.startsWith(prefix, start))
			{
				let args = postman.message.content.substr(prefix.length) //Remove the prefix from the command.
				let isCommand = this.RunShell(args, postman);
				if (isCommand)
					return;
			}
		}

		// If not a command, hum to your name.
		if(postman.message.content.includes(this.mentions[0])
		|| postman.message.content.includes(this.mentions[1])) 
			postman.Complete("♪");
	},

	/**
	 * Find the corresponding command and executes it.
	 * @param {string} args The unprocessed arguments string
	 * @param {Postman} postman The postman carrying the command
	 * @return {boolean} `true` if a command was found.
	 */
	RunShell: function(sentence, postman) {
		let args = Interpreter.ShiftSentence(sentence);
		
		for (let mod in this.modules)
		for (let cmd in this.modules[mod])
		if (cmd == args.current)
		{
			let sudo = this.config.admins.includes(postman.message.author.id);
			if (!sudo && this.modules[mod][cmd]._isRoot) {
				postman.Complete(Reply.forbidden);
			}
			else {
				try {
					let r = this.modules[mod][cmd].main(args.remaining, postman);
					if (r){
						postman.Complete(r);
					}
				}
				catch(e){
					console.error(e);
					postman.Complete(Reply.Error(null, "Command failed to execute"));
				}
			}
			return true;
		}
		return false;
	},

	/**
	 * @param {Discord.Client} client 
	 */
	Init: function(client){
		this.client = client;
		try {
			this.mentions = [
				"<@"+client.user.id+">",
				"<@!"+client.user.id+">"
			];
	
			this.ReloadAll();
			
		}catch(err){
			console.error("Initialization Failed");
			console.error(err);
			return -1;
		}
	},

	ReloadAll: function(){
		console.log("Reloading...");
		let prevConf = this.config;
		try {
			delete require.cache[require.resolve("./config.json")];
			this.config = require("./config.json");
		}
		catch(e){
			console.error(e);
			this.config = prevConf;
			return Reply.Failure(null, "Error in config file");
		}
		delete prevConf;

		this.client.user.setPresence({
			activity : { name: this.config.game }
		});

		for (var name in this.modules)
			delete this.modules[name];

		let result = [];
		for (var i in this.config.import_modules)
			Violine.Reload(this.config.import_modules[i]);

		console.log("Done\n");
	},

	Reload: function(moduleName){
		let path = this.config.mod_dir + moduleName + ".js"
		console.log("Loading "+path);
		try {
			delete require.cache[require.resolve(path)];
			Violine.modules[moduleName] = require(path);
			return 0;
		} catch(e){
			console.error("Module failed to load: "+moduleName+" ("+path+")\n");
			console.error(e);
			return -1;
		}
	},
};

// --------------
// Legacy methods
// --------------

Violine.Send = function(messages, channel){
	console.warn("Violine.Send() is deprecated.\n");
	return;
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
	console.warn("Violine.reloadLegacy() is deprecated.\n");
};

/**
 * Load/Reload all modules and config.
 */
Violine.reloadAllLegacy = function(){
	console.warn("Violine.reloadAllLegacy() is deprecated.\n");
};

global.Violine = Violine;
module.exports = Violine;