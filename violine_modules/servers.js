const Violine = require("../violine.js");
const Reply = require("../Reply.js");

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

var commands = {
	server: {
		_isRoot: true,
		main(args){
			return list();
		},
	},
};

module.exports = commands;