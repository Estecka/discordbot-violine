const Reply  = require("./Reply.js");
const Command = require("./Command.js");
var Config = require("./config.json");
const Gulp = require("./Gulp.js");
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

	SetMaintenance: function(value){
		this.config.maintenance_mode = value;
		this.client.user.setPresence({
			status: value ? "dnd" : "online",
			activity : { 
				name: value ? "In Maintenance" : this.config.status,
				type: "PLAYING",
			},
		});
	},

	/**
	 * Processes a message 
	 * @param {Discord.Message} message The Postman object that carries the message
	 */
	ProcessMessage: function(message) {
		// Ignores everyone when in maintenance mode
		if (this.config.maintenance_mode && !this.config.admins.includes(message.author.id))
			return;

		let postman = new Postman(message);
		postman.onSuccess = (reply) => {
			console.log(
				message.author.username+"#"+message.author.discriminator
				+ "> " + message.content
			);
			ShipReplies(reply, message.channel);
			console.log('');
		}

		let start = 0;
		while(Gulp.IsWhitespace(postman.message.content[start]))
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
		let args = Gulp.ShiftSentence(sentence);
		
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

		this.SetMaintenance(this.config.maintenance_mode);

		for (var name in this.modules)
			delete this.modules[name];

		let result = [];
		for (var i in this.config.import_modules)
			Violine.Reload(this.config.import_modules[i]);

		console.log("Done\n");
	},

	/**
	 * @param {string} moduleName 
	 * @return {boolean} Whether the module was succesfully reloaded.
	 */
	Reload: function(moduleName){
		let path = this.config.mod_dir + moduleName + ".js"
		console.log("Loading "+path);
		try {
			delete require.cache[require.resolve(path)];
			Violine.modules[moduleName] = require(path);
			return true;
		} catch(e){
			console.error("Module failed to load: "+moduleName+" ("+path+")\n");
			console.error(e);
			return false;
		}
	},
};

/**
 * Ships one or several replies to the appropriate destination.
 * @param {Reply|Reply[]|Promise<Reply>|Promise<Reply[]>} replies A single or an Array of preformatted message objects
 * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} channel The ID of the destination channel.
 */
async function ShipReplies (replies, channel){
	if (replies instanceof Promise)
		replies = await replies;
	if (!Array.isArray(replies))
		replies = [replies];

	let promise = null;
	for (let msg of replies)
	{
		console.log(msg);
		if (!promise)
			promise = channel.send(msg);
		else
			promise = promise.then(() => channel.send(msg));
	}

	promise.catch((err) => {
		console.error(err);
		channel.send(Reply.socialError);
	});
}

global.Violine = Violine;
module.exports = Violine;