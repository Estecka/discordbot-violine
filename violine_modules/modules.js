const Violine = require("../violine.js");
const Interpreter = require("../Interpreter.js");
const Reply = require("../Reply.js");

var commands = {
	reload: {
		_isRoot: true,
		main: function(args){
			let modules = Interpreter.SplitSentence(args);
			modules.tri
			if (modules.length <= 0)
				return Reply.invalid;

			let r = Reply.Title("Reloading modules :");
			for (var m of modules) {
				if (Violine.Reload(m))
					r.AddField(m, "✅ Success", true);
				else
					r.AddField(m, "❌ Failure", true);
			}
			return r;
		},
	},
};

module.exports = commands;