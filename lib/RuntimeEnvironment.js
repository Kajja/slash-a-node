/**
 * Module for the RuntimeEnvironment constructor.
 */


/**
 * Runtime object constructor function. A RuntimeEnvironment object
 * should hold all the state needed to be able to store and restart 
 * an execution from it.
 *
 * @param {Object} config - configurations
 */
function RuntimeEnvironment(config) {
    'use strict';

    config = config || {}; // FIXME: Not a good solution

    this.I = config.I !== undefined ? config.I : null;
    this.F = config.F !== undefined ? config.F : null;
    this.D = config.D !== undefined ? config.D : [];
    this.code = config.code !== undefined ? config.code : [];
    this.counter = config.counter !== undefined ? config.counter : 0;
    this.labels = config.labels !== undefined ? config.labels : [];
    this.input = config.input !== undefined ? config.input : [];
    this.output = config.output !== undefined ? config.output : [];
    this.execution = config.execution !== undefined ? config.execution : {};
}

module.exports = RuntimeEnvironment;