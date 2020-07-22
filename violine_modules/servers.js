const Violine = require("../violine.js");
const Reply = require("../Reply.js");
const Interpreter = require("../Interpreter.js");

function list(){
	let guilds = Violine.client.guilds.cache;
	let r = Reply.Title(
		"Servers : ",
		guilds.size + " servers.",
	);

	for (let [id, g] of guilds)
	{
		r.AddField(
			g.name,
			id,
			true,
		);
	}

	return r;
};

async function leave(sentence){
	let args = Interpreter.ShiftSentence(sentence);
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

var commands = {
	server: {
		_isRoot: true,
		main(args){
			let words = Interpreter.ShiftSentence(args);
			switch(words.current){
				default:
					return Reply.invalid;

				case "" :
				case "list" :
					return list();
			
				case "leave":
					return leave(words.remaining);
			}
		},
	},
};

module.exports = commands;