/**
 * @typedef Author
 * @property {string} name
 * @property {string} url
 * @property {string} icon_url
 */

/**
 * @typedef Thumbnail
 * @property {string} url
 */

/**
 * @typedef Field
 * @property {string} name
 * @property {string} value
 * @property {boolean} inline
 */

/**
 * @typedef Footer
 * @property {string} text
 * @property {string} icon_url
 */

/**
 * @typedef Embed
 * @property {Author} author
 * @property {string} url
 * @property {string} title
 * @property {Thumbnail} thumbnail
 * @property {string} description The body of the embed
 * @property {number} color Any value between 0 and 0xffffff
 * @property {Field[]} fields
 * @property {Date} timestamp
 * @property {Footer} footer
 */

/**
 * @returns {Embed}
 */
function DefaultEmbed() {
	return {
		color: 0x8844ff,
	}
}

class Reply 
{
	/**
	 * @type {string} The body of the message;
	 */
	content;

	/**
	 * @type {Embed}
	 */
	embed;

	/**
	 * @param {string} name 
	 * @param {value} value 
	 * @param {boolean} inline 
	 * @return {Field}
	 */
	AddField(name, value, inline=false){
		if (!this.embed)
			this.embed = {};
		if (!this.embed.fields)
			this.embed.fields = [];
		let f = {
			name: name,
			value: value,
			inline: inline,
		};
		this.embed.fields.push(f);
		return f;
	}

	/// -------------------
	/// PRESET CONSTRUCTORS
	/// -------------------
	/**
	 * Tells a message out loud.
	 * @param {strign} message
	 * @return {Reply}
	 */
	static RawTell(message) {
		let reply = new Reply();
		reply.content = message;
		return reply;
	}
	/**
	 * Tells a message in a more robotic fashion.
	 * @param {string} message
	 * @return {Reply}
	 */
	static Say(message){
		let reply = new Reply();
		reply.embed = DefaultEmbed();
		reply.embed.description = message;
		return reply;
	}
	static Title(title, message=null){
		let reply = new Reply();
		reply.embed = DefaultEmbed();
		reply.embed.title = title;
		reply.embed.description = message;
		return reply;
	}
	/**
	 * Tells a message in a less loud robotic fashion.
	 * @param {string} message 
	 * @return {Reply}
	 */
	static Whisper(message){
		console.warn("Whispers are annoying and no longer supported.");
		return Reply.Say(message);
		let reply = new Reply();
		reply.embed = DefaultEmbed();
		reply.embed.footer = {text: message};
		return reply;
	}

	static Error(title, message){
		let reply = Reply.Say(message);
		reply.embed.color = 0xff2200;
		reply.embed.title = "️️⚠️ Error";

		if (message) reply.embed.description = message;
		if (title)   reply.embed.title += " : " + title;
		return reply;
	}
	static Warning(title, message){
		let reply = Reply.Say(message);
		reply.embed.color = 0xff8844;
		reply.embed.title = "️️⚠️ Warning";

		if (message) reply.embed.description = message;
		if (title)   reply.embed.title += " : " + title;
		return reply;
	}
	static Failure(title, message){
		let reply = Reply.Say(message);
		reply.embed.color = 0xff2200;
		reply.embed.title = "️️❌ Failure";

		if (message) reply.embed.description = message;
		if (title)   reply.embed.title += " : " + title;
		return reply;
	}
	static Success(title, message){
		let reply = Reply.Say(message);
		reply.embed.color = 0x00ff00;
		reply.embed.title = "️️✅ Success";

		if (message) reply.embed.description = message;
		if (title)   reply.embed.title += " : " + title;
		return reply;
	}

	
	/// -------
	/// PRESETS
	/// -------
	/**
	 * A generic, ready-to-use success notice
	 * @type {Reply}
	 */
	static get success() {
		return { 
			embed: {
				color: 0x00ff00,
				description: "✅ Success",
			}
		};
	};
	/**
	 * A generic, ready-to-use error notice
	 * @type {Reply}
	 */
	static get error() {
		return {
			embed: {
				color: 0xff8822,
				description: "️⚠️ Error",
			}
		};
	}
	/**
	 * A generic, ready-to-use failure notice
	 * @type {Reply}
	 */
	static get failure() {
		return {
			embed: {
				color: 0xff0000,
				description: "️❌ Failure",
			}
		};
	}
	/**
	 * A ready-to-use notice for invalid parameters.
	 * @type {Reply}
	 */
	static get invalid() {
		return {
			embed: {
				color: 0x2288ff,
				description: "ℹ Invalid parameters",
			}
		};
	}
	/**
	 * A ready-to-use notice for Discord-issued errors
	 * @type {Reply}
	 */
	static get socialError() {
		return {
			embed:{
				color: 0xff8800,
				description: "⛔ Social error"
			},
		}
	}
	/**
	 * A generic, ready-to-use notice for forbidden notices.
	 * @type {Reply}
	 */
	static get forbidden() {
		return {
			embed: {
				color: 0xff8844,
				description: "🚷 Forbidden" ,
			},
		}
	}

	/**
	 * An example reply demonstrating every possible feature.
	 * @type {Reply}
	 */
	static get SampleReply() {
		return {
			content: "Message",
			embed: {
				author: {
					name: "<-author.icon_url | Author.name",
					url: "http://author.url",
					icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
				},
				url: "http://url.url",
		
				color: 0x8844ff,
				title: "Title | thumbnail.url ->",
				thumbnail: {url: "https://cdn.discordapp.com/embed/avatars/1.png"},
				description: "Description",
				fields: [
					{
						name: "field1 name",
						value: "field1 value"
					},
					{
						name: "field2 name",
						value: "field2 value"
					},
					{
						name: "field3.name (inline)",
						value: "field3.value",
						inline: true
					},
					{
						name: "field4.name (inline)",
						value: "inline4.value",
						inline: true
					},
				],
				timestamp: new Date(),
				footer: {
					text: "<-footer.icon_url | footer.text | timestamp->",
					icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
				}
			}
		};
	}

};
module.exports = Reply;