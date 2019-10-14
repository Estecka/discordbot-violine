
var Reply = {};
Reply.say = function(message){
	return {
		message: message
	}
}
Reply.embed = function(message, color=undefined, smallText=false){
	if (smallText)
	return {
		embed: {
			color: color===undefined ? Violine.config.favColor : color,
			footer: { text: message }
		}
	};
	else
	return {
		embed: {
			color: color===undefined ? Violine.config.favColor : color,
			description: message
		}
	};
}

Reply.Warning = function(title, message){
	let result = { embed:{ 
		color: 0xFF8844 ,
		title : "⚠️ Warning"
	} };
	if (title)
		result.embed.title = " : "+title
	if (message)
		result.embed.description = message;
	return result;
};
Reply.Error = function(title, message=null, footer=null){
	let result = { embed:{ 
		color: 0xFF2200,
		title: "️️⚠️ Error"
	}};
	if (title)
		result.embed.title += " : "+title;
	if (message)
		result.embed.description = message;
	return result;
};
Reply.Failure = function(title, message=null, footer=null){
	let result = { embed:{ 
		color: 0xFF2200,
		title: "❌ Failure"
	}};
	if (title)
		result.embed.title += " : "+title;
	if (message)
		result.embed.description = message;
	return result;
};

Reply.success = {
	embed: {
		color: 0x00ff00,
		footer: { text: "✔️ Success"}
	}
};
Reply.error = {
	embed: {
		color: 0xFF8822,
		footer: { text: "️⚠️ Unknown error"}
	}
}
Reply.failure = {
	embed: {
		color: 0xFF0000,
		footer: { text: "️❌ Failure"}
	}
}
Reply.invalid = {
	embed: {
		color: 0x2288ff,
		footer: { text: "ℹ Invalid parameters" }
	}
}

Reply.SampleEmbed = {
	embed: {
		author: {
			name: "<-author.icon_url | Author.name",
			url: "author.url",
			icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
		},
		url: "url",

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
			text: "<-footer.icon_url | [footer.url](footer.text) | timestamp->",
			icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
		}
	}
}

module.exports = Reply;