/**
 * Module for an object that lets you follow and control the
 * execution of the code by the interpreter.
 *
 * Exports a constructor function used to create Execution objects
 * that are used as argument to the interpreter.
 */

/**
 * Constructor function
 */
function Execution() {
    'use strict';

    // Object holding event handlers
    this.handlers = {};

    // Controls the execution of the code
    this.quit = false;
}


/**
 * Method that triggers an event.
 *
 * @param {string} eventType - type of event that is to be triggered
 * @param {*} data - data that is relevant for the event type
 */
Execution.prototype.trigger = function(eventType, data) {

    var i;
    var callBacks = this.handlers[eventType];

    if(callBacks) {
        callBacks.forEach(function(cb) { cb(data); });
    } else {
        return false;
    }
};


/**
 * Method to register callbacks for the "tick" event. A "tick" event
 * is triggered after an instruction in the code has been executed.
 *
 * When triggering the "tick" event, the number of instructions that
 * have been executed shall be supplied as data to the callback function.
 *
 * Every call to the method registers a new "tick" event handler.
 *
 * @param {Function} cb - callback function
 */
Execution.prototype.tick = function(cb) {

    this.registerEventCallback('tick', cb);
};


/**
 * Method to register callbacks for the "finished" event. The "finished" event
 * is triggered when the interpreter has stopped executing the code, either
 * because it has reached the end of the code or if the execution has been
 * stopped.
 *
 * When triggering the "finished" event, the output from the interpretation
 * of the code shall be supplied as data to the callback function.
 *
 * Every call to the method registers a new "finished" event handler.
 *
 * @param {Function} cb - callback function
 */
Execution.prototype.finished = function(cb) {

    this.registerEventCallback('finished', cb);
};


/**
 * A genereic method that can be used to register callbacks for all
 * event types.
 *
 * @param {string} eventType - the event type associated with the callback
 * @param {Function} cb - callback function
 */
Execution.prototype.registerEventCallback = function(eventType, cb) {

    /**
     * If this is the first callback for this event type, create an
     * event type property.
     */ 
    if (!this.handlers[eventType]) {
        this.handlers[eventType] = [];
    }

    this.handlers[eventType].push(cb);
};


/**
 * Method that sets the quit property to true, which
 * should stop the interpretation of the code.
 */
Execution.prototype.stop = function() {
    
    this.quit = true;
};

// Export the constructor function
module.exports = Execution;