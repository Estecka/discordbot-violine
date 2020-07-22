const Reply = require("../Reply.js");

var commands = {
	sing: {
		main:function(){
			let song = '';
			for (let i=0; i<10; i++)
				song += (Math.random()>0.5) ? '♫' : '♪';
			return song;	
		}
	},

	color: {
		main: function(args){
			let color = parseInt(args);
			if (isNaN(color) || color<0 || color>0xffffff)
				return Reply.invalid;
			else {
				let r = Reply.Say("#" + color.toString(16).toUpperCase().padStart(6, "0"));
				r.embed.color = color;
				return r
			}
		}
	},
};

module.exports = commands;