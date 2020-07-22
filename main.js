// Cause any uncaught error to be displayed on the console window for 5mn.
process.on("uncaughtException", function(err){
    console.log("\n /!\\ FATAL ERROR /!\\ \n Shutting down in 5mn\n");
    console.log(err);
    setTimeout(
        function(){}, 
        300000
    );
});

// Adds the root path to the module listing
module.paths.push("/");

const Discord = require('discord.js');
var auth    = require('./auth.json');

// Initialize Discord Client
var Client =
global.Client = new Discord.Client();

const Reply   = require("./Reply.js");
const Postman = require("./Postman.js");
const Violine = require('./violine.js');

/**
 * Ships messages to the appropriate destination.
 * @param {Reply|Reply[]} message A single or an Array of preformatted message objects
 * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} channel The ID of the destination channel.
 * @param {boolean} silent if true, the message will not be logged.
 */
function StampMessages (message, channel, silent=false){
	let msg;

	if (Array.isArray(message))
		msg = message.shift();
	else {
		msg = message
		message = [];
	}

	if (!silent)
		console.log(msg);

	channel.send(msg)
	.catch((err) =>{
		console.error(err);
		channel.send(Reply.socialError).catch(console.error);
	});

	return;

	Client.sendMessage(msg, function(error, response) {
		if (message.length>0)
			setTimeout(()=>StampMessages(message, channel, silent), 1000);
	});
}


// -- READY --
Client.on('ready', function () {
	console.log("Connected");
	console.log("Logged in as : "  +Client.user.username +" ("+Client.user.id+")");

	Violine.Init();
});


// -- MESSSAGE --
Client.on('message', function (msg) {
	if (msg.author.id == Client.user.id) // Ignore own messages
		return;

	let postman = new Postman(msg);
	postman.onSuccess = (reply) => {
		console.log("> " + msg.content);
		StampMessages(reply, msg.channel);
		console.log('');
	}
	postman.onError = (error) => {
		console.log("> " + msg.content);
		console.error(error);
		StampMessages(Reply.error, msg.channel, true);
		console.log('');
	}

	Violine.ProcessSentence(postman);
});

Client.login(auth.token);