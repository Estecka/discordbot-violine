let Violine = require("../violine.js");
let Reply = require("../messages.js");
	
var builtin = {};
builtin["v!reload"] = {
	_admin: true,
	help: ()=>"Reload all or given modules",
	call: function(params) {
		let result = [];
		if (params.length<=0)
			result = Reply.invalid;
		else for (var i in params)
			result.push(Violine.reloadLegacy(params[i]));
		return result;
	}
};

builtin["v!reloadall"] = {
	_admin: true,
	help: ()=>"Reload all command modules",
	call: function(){
		return Violine.reloadLegacyAllLegacy();
	}
};

module.exports = builtin;