const Reply = require("../Reply.js");
const Gulp = require("../Gulp.js");
const Postman = require("../Postman.js");

var commands = {
	roll: {
		/**
		 * 
		 * @param {String} argument 
		 * @param {Postman} postman 
		 */
		main:function(argument, postman){
			let args = new Gulp(argument);

			let count = args.NextInt();
			if (count <= 0)
				return Reply.invalid;
			if (isNaN(count))
				count = 1;
			if (args.remaining[0] == 'd' || args.remaining[0] == 'D')
				args.remaining = args.remaining.substr(1);
			let size = args.NextInt();
			if (size <= 0 || isNaN(size) || args.remaining)
				return Reply.invalid;

			let reply = Reply.Title("🎲 " + argument, "")
			reply.embed.author = {
				icon_url: postman.message.author.avatarURL(),
				name: postman.message.author.username + "#"
					+ postman.message.author.discriminator,
			};

			let total = 0;
			for (let i=0; i<count; i++){
				if (i)
					reply.embed.description += " + ";
				let roll = Math.ceil(Math.random() * size);
				reply.embed.description += roll.toString();
				total += roll;
			}

			if (count > 1)
				reply.embed.description += " = " + total;

			return reply;
		}
	},
};

module.exports = commands;