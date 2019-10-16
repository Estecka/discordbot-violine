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

var Discord = require('discord.io');
var logger  = require('winston');
var auth    = require('./auth.json');
var Reply   = require("./messages.js");
var Postman = require("./Postman.js");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Client
var Client =
global.Client = new Discord.Client({
   token: auth.token,
   autorun: true
});

var Violine = 
global.Violine = require('./violine.js');

/**
 * Ships messages to the appropriate destination.
 * @param {object|object[]} message A single or an Array of preformatted message objects
 * @param {string} channel The ID of the destination channel.
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

	msg.to = channel;
	if (!silent)
		console.log(msg);

	Client.sendMessage(msg, function(error, response) {
		if (message.length>0)
			setTimeout(()=>StampMessages(message, channel, silent), 1000);
		if (error) {
			console.warn(error)
			Client.sendMessage({
				to: channel,
				embed:{
					color: 0xff8800,
					description: "⛔ Social error"
				},
				typing: type
			});
		}
	});
}


// -- READY --
Client.on('ready', function (evt) {
    console.log("Connected");
    console.log("Logged in as : "+Client.username+" ("+Client.id+")");

    Violine.initialize();
});


// -- MESSSAGE --
Client.on('message', function (user, userID, channelID, message, evt) {
    if (userID == Client.id) // Ignore own messages
        return;
	
	let postman = new Postman(message, userID, channelID);
	postman.onSuccess = (reply) => {
		console.log("> " + message);
		StampMessages(reply, channelID);
		console.log('');
	}
	postman.onError = (error) => {
		console.log("> " + message);
		console.error(error);
		StampMessages(Reply.error, channelID, true);
		console.log('');
	}
	
    var result = 0;
	result = Violine.ProcessSentence(userID, message);

    var words = Violine.parse(message);	
    if (result){
		if (isNaN(result))
			postman.Complete(result);
    }
	// If no command are triggered, hums to your name.
    else if(words.includes(Violine.mentions[0]) || words.includes(Violine.mentions[1])) {
        Client.sendMessage({
            to: channelID,
            message: "♪"
        });
    }
});