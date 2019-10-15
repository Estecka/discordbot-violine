let Reply = require("../messages.js");
let commands = {}


commands["v!color"] = {
	_isLegacy: true,
	help: ()=>"Preview a color-code \nE.g: `v!color 0x8844ff`",
	call: function(params){
		code = parseInt(params[0]);
		if (isNaN(code) || code<0)
			return Reply.invalid;
		else if (code>0xffffff)
			return Reply.embed("Too big");
		else
			return Reply.embed(params[0], code);
	}
};



commands["v!drill"] = {
	_isLegacy: true,
	help: ()=> "Simulates a given error message.",
	call: function(params) {
		if (params.length<=0 && Reply[params[0]] == undefined)
			return Reply.invalid;

		else {
			let r = Object.assign({}, Reply[params[0]]);
			r.message = '♫';
			return r;
		}
	}
};

module.exports = commands;