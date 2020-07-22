var Reply = require("../Reply.js");

var injonctions = {};
injonctions["sing"] = function(){
	let song = '';
	for (let i=0; i<10; i++)
		song += (Math.random()>0.5) ? '♫' : '♪';
	return Reply.Say(song);
};

var commands = {};
commands[Violine.mentions[0]] = 
commands[Violine.mentions[1]] = {
	_isLegacy: true,
	_isAdmin: true,
	help: ()=>"Talk to me",
	Invoke: function(params){
		params = params.join(' ').toLowerCase();
		if (injonctions[params])
			return injonctions[params]();
	}
};

module.exports = commands;