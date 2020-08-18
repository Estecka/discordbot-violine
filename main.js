// Cause any uncaught error to be displayed on the console window for 5mn.
process.on("uncaughtException", function(err){
	console.log("\n/!\\ FATAL ERROR /!\\\n");
	console.log(err);
	setTimeout(()=>{process.exit()}, 300000);
});

// Adds the root path to the module listing
module.paths.push("/");


const http = require('http');
const Discord = require('discord.js');
var auth = require('./auth.json');

// Get token from environnement variables if applicable.
if (process.env.token != undefined)
	auth.token = process.env.token;
// Listen to http port if required.
if (process.env.PORT !== undefined){
	let server = http.createServer((req, res) => {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write("Violine is online.");
		res.end();
	});
	server.listen(process.env.PORT);
}


// Initialize Discord Client
var client = new Discord.Client();

const Violine = require('./violine.js');

// -- READY --
client.on('ready', function () {
	console.log("Connected");
	console.log("Logged in as : "  +client.user.username+"#"+client.user.discriminator +" ("+client.user.id+")");

	Violine.Init(client);
});


// -- MESSSAGE --
client.on('message', function (msg) {
	// Ignore own messages
	if (msg.author.id == client.user.id)
		return;

	Violine.ProcessMessage(msg);
});

client.login(auth.token);