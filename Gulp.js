/**
 * @typedef {Object} ShiftedWord
 * @property {string} current The word that has been extracted.
 * @property {string} remaining The remaining part of the sentence.
 */

class Gulp {
	/**
	 * Checks whether a given character is a whitespace
	 * @param {character} char 
	 * @returns {boolean} True if `char` is a whitespace
	 */
	static IsWhitespace  (char) {
		return " \t\n\r\v\f".indexOf(char) >= 0;
	}

	/**
	 * Gets the first word of a sentence, along with and the remaining string.
	 * @param {string} sentence The full sentence.
	 * @returns {ShiftedWord} 
	 */
	static ShiftSentence (sentence){
		let result = {};
		let length = sentence.length;
		let start = 0;
		let limit = 0;

		// Remove leading whitespaces
		for (start=0; start<length; start++)
			if (!this.IsWhitespace(sentence[start]))
				break;

		// Browse the first word
		for (limit=start + 1; limit<length; limit++)
			if (this.IsWhitespace(sentence[limit]))
				break;

		result.current = sentence.substring(start, limit);

		// Remove trailing whitespaces
		for (limit=limit+1; limit<length; limit++)
			if (!this.IsWhitespace(sentence[limit]))
				break;

		if (limit < length)
			result.remaining = sentence.substring(limit);
		else
			result.remaining = "";
		return result;
	}

	/**
	 * Separates a sentence into words at every whitespace.
	 * @param {string} sentence 
	 * @return {string[]} An array of words.
	 */
	static SplitSentence (sentence){
		return sentence.match(/\S+/g) || [];
	}
}

module.exports = Gulp;