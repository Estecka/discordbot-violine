const Violine = require("../violine.js");
const Reply = require("../Reply.js");
const Gulp = require("../Gulp.js");
const Discord = require("discord.js");

function listGuilds(){
	let guilds = Violine.client.guilds.cache;
	let r = Reply.Title(
		"Servers : ",
		guilds.size + " servers.",
	);

	for (let [id, g] of guilds) {
		r.AddField(
			g.name,
			id,
			true,
		);
	}

	return r;
};

function listChannels(serverId){
	let guild = Violine.client.guilds.resolve(serverId);
	if (!guild)
		return Reply.Error(serverId, "Unknown server.")

	let r = Reply.Title(
		"🖧 Server : " + guild.name, 
		guild.channels.cache.size + " channels."
	);
	for (let [id, chan] of guild.channels.cache)	{
		r.AddField(
			"#" + chan.name,
			id,
			true
		);
	}
	return r;
};

async function leave(sentence){
	let args = Gulp.ShiftSentence(sentence);
	if (args.remaining)
		return Reply.invalid;
	
	let guild = Violine.client.guilds.resolve(args.current);
	if (!guild)
		return Reply.Failure(args.current, "Guild not found");
	if (!guild.available)
		return Reply.Failure(args.current, "Guild not available");

	let r;
	await guild.leave()
		.then(
			() => {r = Reply.Success(null, "Left " + guild.name)},
			() => {r = Reply.Failure(args.current, "Social Error")}
		)
		.catch(console.error);
	return r;
};

async function send(channelId, message){
	let channel = Violine.client.channels.resolve(channelId);
	if (!channel)
		return Reply.Error(channelId, "Unknown channel.");
	if (!(channel instanceof Discord.TextChannel))
		return Reply.Failure(channelId, "Not a text channel.")
	
	/**
	 * @var {Discord.TextChannel} channel
	 */
	let reply;
	await channel.send(message)
	.then(
		() => {reply = Reply.success},
		() => {reply = Reply.failure},
	);
	return reply;
};

var commands = {
	server: {
		_isRoot: true,
		main(args){
			let words = Gulp.ShiftSentence(args);
			switch(words.current){
				default:
					return Reply.invalid;

				case "" :
				case "list" :
					return listGuilds();
			
				case "leave":
					return leave(words.remaining);
				
				case "chan":
				case "channels":
					return listChannels(words.remaining);
				
				case "send":
				case "post":
					words = Gulp.ShiftSentence(words.remaining);
					return send(words.current, words.remaining);
			}
		},
	},
};

module.exports = commands;