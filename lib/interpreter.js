/**
 * Module that interpret Slash/A bytecode on the format:
 * -> code[i] < 0   => one of the instructions in the instruction set 
 * -> code[i] >= 0  => an integer value that shall be stored in the I register
 */

/**
 * Used modules
 */
var instructions = require('./instructions').instructions;
var idToImpl = require('./instructions').idToImpl;
var Execution = require('./Execution');
var RuntimeEnvironment = require('./RuntimeEnvironment');

/**
 * The interpreter function.
 * Code shall be supplied as an array of integers. Input values are "consumed"
 * by shifting values from the front of the input array. If an execObj 
 * of type Execution is supplied, this object can be used to follow 
 * and control the execution of the code.
 *
 * @param {Array} code - the bytecode to be interpreter
 * @param {Array} input - reference to a an array with input values
 * @param {Object} execObj - object of type Execution (optional)
 * @returns {Array} output - array of output values
 */
function runBytecode(code, input, execObj) {

    validateArguments(code, input, execObj);

    var codeValue;
    var instr;
    var output = [];
    var runEnv = new RuntimeEnvironment({
        code: code,
        input: input,
        output: output,
        execution: execObj
    });

    // After validation, execObj is either undefined or of type Execution

    while (runEnv.counter < runEnv.code.length && (!execObj || !execObj.quit)) {
        
        codeValue = runEnv.code[runEnv.counter];

        /**
         * Check if it is a positive integer, to be placed in register I,
         * or an instruction
         */
        if (codeValue >= 0) {

            // Its a positive integer, store it in register I.
            instructions.seti(codeValue, input, output, runEnv);

        } else {

            /**
             * Its an instruction id, i.e. a negative integer. 
             * The relationship between an instruction's bytecode 
             * id and the index in the array with the functions 
             * implementing the instructions is:
             *
             *      -(instruction-id) = index in array
             *
             * For example, the jumpifn instruction has id -11, and
             * the function that implements the instruction is located 
             * at index 11 in the idToImpl array.
             *
             * If there is no matching instruction to the id, i.e.
             * idToImpl[-id] === undefined, the id is ignored.
             */
            if (instr = idToImpl[-codeValue]) {
                instr(null, input, output, runEnv);
            }
        }

        runEnv.counter++;
        if (execObj) {
            execObj.trigger('tick', runEnv.counter);
        }
    }

    if (execObj) {
        execObj.trigger('finished', output);
    }

    return output;
}

/**
 * Used to validate arguments, to the runBytecode function.
 *
 * @param {Number[]} code - the code to be run
 * @param {Number[]} input - input values
 * @param {Object} execObj - object to follow and control the execution
 */
function validateArguments(code, input, execObj) {

    // Check that the code is valid
    if (!Array.isArray(code) || !code.every(function(value) { return isInt(value); })) {
        throw new Error('Code must be an array made up of integers');
    }

    // Check that the input is valid
    if (!Array.isArray(input) || !input.every(function(value) { return typeof value === 'number'; })) {
        throw new Error('Input must be an array made up of numbers');
    }

    // Check that the execObj is of the right type
    if (execObj !== undefined) {
        if (!(execObj instanceof Execution)) {
            throw new Error('The execution object is not of the right type');
        }
    }
}

/**
 * Function that checks if the value is an integer.
 * From: http://www.2ality.com/2014/05/is-integer.html
 *
 * @param {*} value - value to be checked
 * @returns {boolean} true if value is an integer
 */
function isInt(value) {

    return (typeof value === 'number') && (value % 1 === 0);
}

/**
 * What is exported
 */

module.exports = {
    runBytecode: runBytecode
};