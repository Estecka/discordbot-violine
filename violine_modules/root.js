var commands = {
	echo: {
		_isRoot: true,
		main: function(args) {
			return args;
		},
	},
};

module.exports = commands;