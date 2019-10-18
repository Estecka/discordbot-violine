let Violine = require("../violine.js");
let Reply = require("../Reply.js");
	
var builtin = {};
builtin["v!reload"] = {
	_isLegacy: true,
	_isAdmin: true,
	help: ()=>"Reload all or given modules",
	Invoke: function(params) {
		let result = [];
		if (params.length<=0)
			result = Reply.invalid;
		else for (var i in params)
			result.push(Violine.reloadLegacy(params[i]));
		return result;
	}
};

builtin["v!reloadall"] = {
	_isLegacy: true,
	_isAdmin: true,
	help: ()=>"Reload all command modules",
	Invoke: function(){
		return Violine.reloadLegacyAllLegacy();
	}
};

module.exports = builtin;