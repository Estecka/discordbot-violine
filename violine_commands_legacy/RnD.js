var Violine = require("../violine.js");
var Reply = require("../messages.js");

RnD = {};

RnD["v!config"] = {
	_admin: true,
	call: function(p){
		let cmd = p.shift().toLowerCase();
		
		if (cmd == "get" && p.length>0){
			let r = Reply.embed("");
			r.embed.title = "📋 Config"
			for (let i in p){
				if (Violine.config.hasOwnProperty(p[i]))
					r.embed.description += "**"+p[i]+"**: "+Violine.config[p[i]]+"\n"
			}
			return r;
		}
		else if (cmd == "set" && p.length == 2){
			let key = p.shift();
			if (!Violine.config.hasOwnProperty(key))
				return Reply.Warning(key, "The key doesn't exist in the config file");

			let value = parseInt(p[0]);			
			if (isNaN(value)) switch(p[0]) {
				case "undefined": value = undefined; break;
				case "NaN": value = NaN; break;
				case "true": value = true; break;
				case "false": value = false; break;
				default: return Reply.Warning(null, "String values are not supported yet.");				
			}
			Violine.config[key] = value;
			let r = Reply.embed("");
			r.embed.description = key +" was set to "+typeof(value)+" "+value;
			r.embed.footer = { text: "Changes made at runtime are temporary."}
			return r;
		}
		else
			return Reply.invalid;
	}
};

module.exports = RnD;