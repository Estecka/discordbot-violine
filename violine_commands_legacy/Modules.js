let Reply = require("../messages.js");
let Violine = require("../violine.js");

var commands = {};

commands["v!help"] = {
	help: ()=>"Provides some mighty useful intel, if I do say so myself.",
	call: function(params, channel) {
		let result = [];
		if (params.length<=0){
			for (var mod in Violine.legacyCommands){
				let block = {embed: {
					color: Violine.config.favColor,
					title: '🔩 '+mod,
					description: ''
				}}

				for (var cmd in Violine.legacyCommands[mod])
					block.embed.description += cmd+'\n';
				result.push(block);
			}
			Violine.Send(result, channel);
			return -1;
		}
		else {
			let cmd = params.shift();
			result = {embed:{
				color: Violine.config.favColor,
				title: '🔩 '+cmd,
				footer: {text:'Module : '}
			}}
			for (var mod in Violine.legacyCommands){
				if (Violine.legacyCommands[mod][cmd]){
					result.embed.description = Violine.legacyCommands[mod][cmd].help ?
						Violine.legacyCommands[mod][cmd].help(params):
						"This command has no documentation"
					result.embed.footer.text += mod;
					return result;
				}
			}
		}
	}
};

commands["v!modules"] = {
	help:()=>"List all known modules' status",
	call: function(){
		let result = {embed: {
			color: Violine.config.favColor,
			title: "⚙️ Modules :",
			footer: {text:''}
		}}

		for (var mod in Violine.config.import_commands_legacy){
			mod = Violine.config.import_commands_legacy[mod];
			result.embed.footer.text += Violine.legacyCommands[mod] ? 
				"\n✔️"+mod+" ("+Object.keys(Violine.legacyCommands[mod]).length+"); " :
				"\n❌"+mod+';';
		}
		return result;
	}
};


module.exports = commands;