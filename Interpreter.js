/**
 * @typedef {Object} ShiftedSentence
 * @property {string} current The value of the current parameter.
 * @property {string} remaining The remaining parameters.
 */

var Interpreter = 
{
	/**
	 * Checks whether a given character is a whitespace
	 * @param {character} char 
	 * @returns {boolean} True if `char` is a whitespace
	 */
	IsWhitespace : function(char) {
		return " \t\n\r\v\f".indexOf(char) >= 0;
	},

	/**
	 * Gets the first word of a sentence, along with and the remaining string.
	 * @param {string} sentence The full sentence.
	 * @returns {ShiftedSentence} Ta mère
	 */
	ShiftSentence: function(sentence){
		let result = {};
		let length = sentence.length;
		let limit = 0;

		for (let i=0; i<length; i++) {
			if (IsWhitespace(sentence[i])) {
				limit = i;
				break;
			}
		}
		result.value = sentence.substring(0, limit);
		limit++;
		for (let i=limit; i<length; i++){
			if (!IsWhitespace(sentence[i])){
				limit = i;
				break;
			}
		}
		if (limit < length)
			result.remaining = sentence.substring(limit);
		else
			result.remaining = "";
		return result;
	},

	/**
	 * Separates a sentence into words at every whitespace.
	 * @param {*} sentence 
	 * @return {string[]} An array of words.
	 */
	SplitSentence: function(sentence){
		return sentence.match(/\S+/g) || [];
	},
};

module.exports = Interpreter;