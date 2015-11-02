
var assert = require('assert');
var interpreter = require('../lib/interpreter');
var instr = require('../lib/instructions').instructions;

describe('2^4', function(argument) {

    // Example x^4 code from https://github.com/arturadib/slash-a, x = input[0]
    var code = [
        4, 
        instr.itof.id,
        0,
        instr.save.id,
        instr.input.id,
        instr.pow.id,
        instr.output.id
    ];
    var input = [2];
    var output;
    var expected = [16];

    output = interpreter.runBytecode(code, input);

    it('should output 16', function() {
        assert.deepEqual(output, expected);
    });
});

describe('Equality testing', function() {

    // Example equality testing code from https://github.com/arturadib/slash-a
    var code = [
        instr.input.id,     // 0
        0,                  // 1
        instr.save.id,      // 2
        instr.input.id,     // 3
        0,                  // 4
        instr.sub.id,       // 5
        instr.abs.id,       // 6
        instr.sign.id,      // 7
        instr.save.id,      // 8
        0,                  // 9
        instr.itof.id,      // 10
        1,                  // 11
        instr.save.id,      // 12
        0,                  // 13
        instr.load.id,      // 14
        instr.jumpifn.id,   // 15
        1,                  // 16
        instr.itof.id,      // 17
        1,                  // 18
        instr.save.id,      // 19
        instr.jumphere.id,  // 20
        1,                  // 21
        instr.load.id,      // 22
        instr.output.id     // 23
    ];
    var input;
    var output;
    var expected;

    it('should output 1, when the two inputs are equal', function() {
        input = [2, 2];
        //output = [];
        expected = [1];
        output = interpreter.runBytecode(code, input);
        assert.deepEqual(output, expected);
    });

    it('should output 0, when the two inputs are not equal', function() {
        input = [2, 1];
        //output = [];
        expected = [0];
        output = interpreter.runBytecode(code, input);
        assert.deepEqual(output, expected);
    });

});


describe('Loop in code', function() {

    var code = [
        2,                  // 2 -> I
        instr.itof.id,      // I -> F, i.e. 2 -> F
        4,                  // 4 -> I
        instr.loop.id,      // loop start, loop I times i.e. 4 times
        instr.inc.id,       // F = F + 1
        instr.endloop.id,   // loop end
        instr.output.id     // F -> output
    ];
    var input = [];
    var output;
    var expected = [6];

    it('should output 2 + 1 + 1 + 1 + 1 = 6', function() {

        output = interpreter.runBytecode(code, input);
        assert.deepEqual(output, expected);
    });

});

describe('Invalid code', function() {

    context('not an array', function() {

        var code = 'test';      // <= Not an array
        var input = [];

        it('should throw an error', function() {
            assert.throws(function() { interpreter.runBytecode(code, input);});
        });
    });

    context('a float instruction', function() {

        var code = [
            instr.itof.id,
            4.3,                // <= Not an integer
            instr.loop.id  
        ];
        var input = [];

        it('should throw an error', function() {
            assert.throws(function() { interpreter.runBytecode(code, input);});
        });
    });

    context('a string instruction', function() {

        var code = [
            instr.itof.id,      
            'hi',               // <= Not an integer
            instr.loop.id     
        ];
        var input = [];

        it('should throw an error', function() {
            assert.throws(function() { interpreter.runBytecode(code, input);});
        });
    });

    context('a non matching instruction id', function() {

        var code = [
            2,                  // 2 -> I
            instr.itof.id,      // I -> F, i.e. 2 -> F
            4,                  // 4 -> I
            instr.loop.id,      // loop start, loop I times i.e. 4 times
            -1000,              // <= Invalid instruction id
            instr.inc.id,       // F = F + 1
            instr.endloop.id,   // loop end
            -10340,             // <= Invalid instruction id
            instr.output.id     // F -> output
        ];
        var input = [];
        var output;
        var expected = [6];

        it('should ignore invalid instruction ids', function() {
            output = interpreter.runBytecode(code, input);
            assert.deepEqual(output, expected);
        });
    });
});

describe('Invalid input', function() {

    context('not an array', function() {

        var code = [
            instr.itof.id,
            instr.loop.id     
        ];
        var input = 'test';     // <= Not an array

        it('should throw an error', function() {
            assert.throws(function() { interpreter.runBytecode(code, input);});
        });
    });

    context('an array but not with only numbers', function() {

        var code = [
            instr.itof.id,
            instr.loop.id     
        ];
        var input = [2, 4.5, 'test', 5]; // <= All values are not numbers

        it('should throw an error', function() {
            assert.throws(function() { interpreter.runBytecode(code, input);});
        });
    });

});
