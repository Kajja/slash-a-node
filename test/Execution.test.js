var assert = require('assert');
var Execution = require('../lib/Execution');
var interpreter = require('../lib/interpreter');
var instr = require('../lib/instructions').instructions;

describe('trigger', function() {

    var execObj = new Execution();
    var counter = 4;
    var result1 = 0;
    var result2 = 0;

    it('should trigger all callbacks for the event type', function() {

        // Callback 1
        execObj.tick(function(value) {
            result1 = value;
        });

        // Callback 2
        execObj.tick(function(value) {
            result2 = value;
        });

        execObj.trigger('tick', counter);

        assert.equal(result1, counter);
        assert.equal(result2, counter);
    });

    it('should return false if the event type does not exist', function() {

        assert(execObj.trigger('eventThatDoesNotExist', counter) === false);

    });
});

describe('tick', function() {

    var execObj = new Execution;
    var executedInstructions = [];

    // Example x^4 code from https://github.com/arturadib/slash-a, x = input[0]
    var code = [
        4,              // 1: 4 -> I
        instr.itof.id,  // 2: I -> F, i.e. F = 4;
        0,              // 3: 0 -> I
        instr.save.id,  // 4: F -> D[I], i.e. D[0] = 4  
        instr.input.id, // 5: F = input[0]
        instr.pow.id,   // 6: F = F^D[I]
        instr.output.id // 7: F -> output
    ];
    var input = [2];

    it('should be triggered for every executed instruction', function() {

        execObj.tick(function(counter) {
            executedInstructions.push(counter);
        });

        interpreter.runBytecode(code, input, execObj);
        assert.deepEqual(executedInstructions, [1, 2, 3, 4, 5, 6, 7]);
    });

});

describe('finished', function() {

    var execObj = new Execution;
    var result;

    // Example x^4 code from https://github.com/arturadib/slash-a, x = input[0]
    var code = [
        4,              // 1
        instr.itof.id,  // 2
        0,              // 3
        instr.save.id,  // 4
        instr.input.id, // 5
        instr.pow.id,   // 6
        instr.output.id // 7
    ];
    var input = [2];

    it('should be triggered when the code execution is finished', function() {

        execObj.finished(function(output) {
            result = output;
        });

        interpreter.runBytecode(code, input, execObj);

        assert.deepEqual(result[0], 16);
    });
});

describe('stop', function() {

    var execObj = new Execution;
    var executedInstructions = [];
    // Example x^4 code from https://github.com/arturadib/slash-a, x = input[0]
    var code = [
        4,              // 1
        instr.itof.id,  // 2
        0,              // 3
        instr.save.id,  // 4
        instr.input.id, // 5
        instr.pow.id,   // 6
        instr.output.id // 7
    ];
    var input = [2];

    it('should stop the execution of the code', function() {

        execObj.tick(function(counter) {
            if (counter !== 4) {
                executedInstructions.push(counter);
            } else {
                executedInstructions.push(counter);
                execObj.stop();
            }
        });

        interpreter.runBytecode(code, input, execObj);
        assert.deepEqual(executedInstructions, [1, 2, 3, 4]);

    });
});

describe('Asynchronous - stop', function() {

    var execObj = new Execution;
    var executedInstructions = [];
    // Example x^4 code from https://github.com/arturadib/slash-a, x = input[0]
    var code = [
        4,              // 1
        instr.itof.id,  // 2
        0,              // 3
        instr.save.id,  // 4
        instr.input.id, // 5
        instr.pow.id,   // 6
        instr.output.id // 7
    ];
    var input = [2];

    it('should stop the execution of the code', function() {

        execObj.tick(function(counter) {
            if (counter !== 4) {
                executedInstructions.push(counter);
            } else {
                executedInstructions.push(counter);
                execObj.stop();
            }
        });

        setTimeout(function() {
            interpreter.runBytecode(code, input, execObj);
            assert.deepEqual(executedInstructions, [1, 2, 3, 4]);            
        }, 0);

    });
});