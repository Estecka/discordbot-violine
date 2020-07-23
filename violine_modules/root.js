const Violine = require("../violine");
const Reply = require("../Reply");
const Command = require("../Command");
const Gulp = require("../Gulp.js");

/**
 *  @type {Object<string, Command>}
 */
var commands = {
	echo: {
		_isRoot: true,
		main: function(args) {
			return Reply.RawTell(args);
		},
	},

	exit: {
		_isRoot: true,
		main(){
			setTimeout(
				function(){
					Violine.client.destroy();
					process.exit();
				},
				500
			);
			return "♪~";
		},
	},

	maintenance:{
		_isRoot: true,
		main: function(args){
			args = args.trim().toLowerCase();
			switch (args) {
				default:
					return Reply.invalid;

				case "0" :
				case "false" :
				case "off" :
					Violine.SetMaintenance(false);
					return Reply.Say("Maintenance mode disabled.");

				case "1" :
				case "true" :
				case "on" :
					Violine.SetMaintenance(true);
					return Reply.Say("Maintenance mode enabled.")
			}
		},
	},

	drill: {
		_isRoot: true,
		main: function(args) {
			let argsArray = Gulp.SplitSentence(args);
			if (argsArray.length <= 0)
			{
				let r = Reply.invalid;
				r.embed.footer = { text: "This is not a drill." };
				return r;
			}
			
			let result = [];
			for (let arg of argsArray)
			{
				let r;
				if (arg == "--void")
					r = null;
				else if (arg.length <= 0 || Reply[arg] == undefined){
					r = Reply.invalid;
					r.embed.footer = { text: "This is not a drill." };
				}
				else {
					r = Reply[arg];
					r.content = '♫';
					if (!r.embed.footer)
						r.embed.footer = { text: "This is a drill." };
				}
				result.push(r);
			}
			return result;
		}
	},
};

commands.say = commands.echo;
commands.sleep = commands.exit;

module.exports = commands;