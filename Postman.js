
/**
 * @typedef Message
 * @property {string} content The body of the message.
 * @property {string} senderId The ID of the message sender.
 * @property {string} channelId The ID of the channel the message was sent to.
 */

/**
 * A "Promise" object that carries a message, and provides an interface to answer.
 */
class Postman
{
	_completed = false;
	/**
	 * @type {Message} The full input message sent to Violine.
	 */
	message = null;
	/**
	 * Called after the message was sucessfully processed
	 * @type {CallableFunction}
	 * @param {object} reply The reply to the message
	 */
	onSuccess = null;
	/**
	 * Called if an error happenned during processing
	 * @type {CallableFunction}
	 * @param {string} motif The error message.
	 */
	onError = null;
	/**
	 * 
	 * @type {CallableFunction}
	 */
	onComplete = null;

	/**
	 * @param {string} content The body of the message.
	 * @param {string} senderId The ID of the message sender.
	 * @param {string} channelId The ID of the channel the message was sent to.
	 */
	constructor(message, senderId, channelId){
		this.message = {
			content:   message,
			senderId:  senderId,
			channelId: channelId,
		};
	}

	/**
	 * Sends one or several replies to the message. This should only be called once.
	 * @param {object|object[]} reply 
	 */
	Complete (reply) {
		if (this._completed)
			throw "Attempted reusing an expired Postman";
		if (this.onSuccess)
			this.onSuccess.call(reply);
		if (this.onComplete)
			this.onComplete.call();
	}

	/**
	 * Indicates an error while processing the message.
	 * @param {string} motif The error message
	 */
	Fail (motif) {
		if (this._completed)
			throw "Attempted reusing an expired Postman";
		if (this.onError)
			this.onError.call(motif);
		if (this.onComplete)
			this.onComplete.call();
	}
};

module.exports = Postman;