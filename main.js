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
    var result = 0;
    var words = Violine.parse(message);
    var cmdName = words[0];
    var params = words.slice(1);

    for (var i in Violine.commands){
        let cmd = Violine.commands[i][cmdName];
        if (cmd){

            if (cmd._admin && !Violine.config.admins.includes(userID))
                result = {embed: {
                    color: 0xff8844,
                    footer: {text: "🚷 403 Forbidden"}
                }};
            else {
                params
                try{
                    result = cmd.call(params, channelID);
                }
                catch(e){
                    result = Reply.Error(null, "Command failed to execute");
                    console.error(e);
                }
            }
            break;
        }
    }

	// This methods needs to be taken out of here.
	/**
	 * Prepares a message content to be sent onto Discord.
	 * @param {*} msg The message object 
	 * @param {*} channel The channel id the message will be sent to.
	 * @param {*} type Should Violine simulate typing.
	 */
    let stampMsg = function(msg, channel, type=false){
        msg.to = channel;
        console.log (msg);

        Client.sendMessage(msg, function(error, response){
            if (error) {
                console.warn(error)
                Client.sendMessage({
                    to: channel,
                    embed:{
                        color: 0xff8800,
                        description: "⛔ A message was denied by Discord"
                    },
                    typing: type
                });
            }
        });
    }

    console.log(result);
    if (result){
        console.log ("I : "+message);
        if (Array.isArray(result)){
            let time = 0;
            for (var i in result){
                stampMsg(result[i], channelID, true);
            }
        }
        else if (isNaN(result))
            Violine.Send(result, channelID);

            //stampMsg(result, channelID);
        console.log('');
    }
	// If no command are triggered, hums to your name.
    else if(words.includes(Violine.mentions[0]) || words.includes(Violine.mentions[1])) {
        Client.sendMessage({
            to: channelID,
            message: "♪"
        });
    }
});