var Reply = require("../Reply.js");

var injonctions = {};
injonctions["sing"] = function(){
	let song = '';
	for (let i=0; i<10; i++)
		song += (Math.random()>0.5) ? '♫' : '♪';
	return Reply.Say(song);
};
injonctions["go to sleep"] = function(){
	setTimeout(
		function(){
			Client.disconnect();
			process.exit();
		},
		500
	);
	return Reply.Say("♪~");
};


var commands = {};
commands[Violine.mentions[0]] = 
commands[Violine.mentions[1]] = {
	_isLegacy: true,
	_isAdmin: true,
	help: ()=>"Talk to me",
	call : function(params){
		params = params.join(' ').toLowerCase();
		if (injonctions[params])
			return injonctions[params]();
	}
};

module.exports = commands;