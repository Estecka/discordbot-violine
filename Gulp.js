/**
 * @typedef {Object} ShiftedWord
 * @property {string} current The word that has been extracted.
 * @property {string} remaining The remaining part of the sentence.
 */

class Gulp {

	/**
	 * 
	 * @param {string} sentence 
	 */
	constructor(sentence){
		this.current = null;
		this.remaining = sentence;
	}

	/**
	 * Extract the next argument (delimited by whitespaces).
	 * @return {string?} The argument, trimmed of whitespaces. Null if there is no argument.
	 */
	ShiftArg(){
		let args = Gulp.ShiftSentence(this.remaining);
		this.current = args.current ? args.current : null;
		this.remaining = args.remaining ? args.current : null;
		return this.current;
	}

	/**
	 * Extracts the next positive decimal integer.
	 * @return {number} The int value, or NaN if no int was found.
	 */
	ShiftInt(){
		if (!IsDigit(this.remaining[0]))
			return Number.NaN;
		
		this.current = 0;
		let i = 0;
		while (i < this.remaining.length && Gulp.IsDigit(this.remaining[i]))
			this.current = (10 * value) + (this.remaining[i] - '0');

		this.remaining = this.remaining.substr(i);

		return this.current;
	}

	/**
	 * Checks whether a given character is a whitespace
	 * @param {character} char 
	 * @returns {boolean} true if `char` is a whitespace
	 */
	static IsWhitespace  (char) {
		return " \t\n\r\v\f".indexOf(char) >= 0;
	}

	/**
	 * Checks whether a given character is a decimal character.
	 * @param {character} char 
	 * @return {boolean} true if `char` is a digit
	 */
	static IsDigit(char) {
		return "0123456789".indexOf(char) >= 0;
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