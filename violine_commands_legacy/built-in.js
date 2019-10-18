let Violine = require("../violine.js");
let Reply = require("../Reply.js");
	
var builtin = {};
builtin["v!reload"] = {
	_isLegacy: true,
	_isAdmin: true,
	help: ()=>"Reload all or given modules",
	Invoke: function(params) {
		if (params.length<=0)
			return Reply.invalid;

		for (var i in params)
			Violine.reloadLegacy(params[i]);
		return Reply.RawTell("♪!");
	}
};

builtin["v!reloadall"] = {
	_isLegacy: true,
	_isAdmin: true,
	help: ()=>"Reload all command modules",
	Invoke: function(){
		Violine.reloadLegacyAllLegacy();
		return Reply.RawTell("♫!");
	}
};

module.exports = builtin;