var assert = require('assert');
var instructions = require('../lib/instructions').instructions;
var utils = require('../lib/instructions').utils;
var RuntimeEnvironment = require('../lib/RuntimeEnvironment');

// Input and output buffers
var input = [];
var output = [];


/**
 * Set I: I = number
 */
describe('seti', function(){

    var code = [3];
    var runEnvironment = new RuntimeEnvironment({code: code});

    context('when a positive integer appears in the code', function() {
        
        instructions.seti(code[0], input, output, runEnvironment);

        it('should set I to the value of the number', function() {  
            assert(runEnvironment.I === 3);
        });
    });
});


/**
 * itof: F = I
 */
describe('itof', function() {

    var runEnvironment = new RuntimeEnvironment({I: 10, F:2.5});

    instructions.itof(null, input, output, runEnvironment);

    it('should set F to the value of I', function() {
        assert(runEnvironment.I === runEnvironment.F);
    });
});


/**
 * ftoi: I = round(abs(F))
 */
describe('ftoi', function() {
    context('F is a positive float', function() {

        var runEnvironment = new RuntimeEnvironment({F: 2.5});

        instructions.ftoi(null, input, output, runEnvironment);

        it('should set I to the nearest positive integer', function() {
            assert(runEnvironment.I === 3);
        });
    });

    context('F is a negative float', function() {

        var runEnvironment = new RuntimeEnvironment({F: -2.5});

        instructions.ftoi(null, input, output, runEnvironment);

        it('should set I to the nearest positive integer', function() {
            assert(runEnvironment.I === 3);
        });
    });
});


/**
 * inc: F = F + 1
 */
describe('inc', function(){
    context('F is a positive float', function(){

        var runEnvironment = new RuntimeEnvironment({F: 3.45});

        instructions.inc(null, input, output, runEnvironment);

        it('should increase the value of F by 1', function() {
            assert(runEnvironment.F === 4.45);
        });
    });
});

/**
 * dec: F = F - 1
 */
describe('dec', function() {
    context('F is a positive float', function() {

        var F = 4.23;
        var runEnvironment = new RuntimeEnvironment({F: F});

        instructions.dec(null, input, output, runEnvironment);

        it('should decrease F by 1', function() {
            assert(runEnvironment.F === F - 1);
        });
    });
});

/**
 * load: F = D[I]
 */
describe('load', function() {

    context('D[I] is not undefined', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 3,
            D: [23.4, 10.1, 98, 0.1]
        });

        instructions.load(null, input, output, runEnvironment);

        it('should copy the float value at D[I] to F', function() {
            assert(runEnvironment.F === 0.1);
        });
    });

    context('D[I] is undefined', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 5,
            F: 1.22,
            D: [23.4, 10.1, 98, 0.1]
        });

        it('should leave F as it was', function() {
            assert(runEnvironment.F === 1.22);
        });
    });
});

/**
 * save: D[I] = F
 */
describe('save', function() {

    context('I and F are not undefined', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 3,
            F: 4.5,
            D: []
        });

        instructions.save(null, input, output, runEnvironment);

        it('should save the value of F in D[I]', function() {
            assert(runEnvironment.D[3] === 4.5);
        });
    });

    context('I or F is undefined', function() {

        var runEnvironment = new RuntimeEnvironment({
            F: 4.5,
            D: [2.3, 4.56]
        });
        
        instructions.save(null, input, output, runEnvironment);

        it('should leave D as it was', function() {
            assert.deepEqual(runEnvironment.D, [2.3, 4.56]);
        });
    });
});


/**
 * swap: F <-> D[I], 
 */
describe('swap', function(){

    context('I, F and D[I] are not undefined', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 4.5,
            D: [23.4, 10.1, 98, 0.1]
        });
        var FOld = runEnvironment.F;
        var DIOld = runEnvironment.D[runEnvironment.I];

        instructions.swap(null, input, output, runEnvironment);

        it('should swap the contents of F and D[i] with each other', function() {
            assert(runEnvironment.D[runEnvironment.I] === FOld);
            assert(runEnvironment.F === DIOld);
        });
    });

    context('I, F and/or D[I] are undefined', function() { // TODO: null?

        var runEnvironment = new RuntimeEnvironment({
            F: 4.5,
            D: [23.4, 10.1, 98, 0.1]
        });

        instructions.swap(null, input, output, runEnvironment);

        it('should leave F and D as they were', function() {
            assert(runEnvironment.F === 4.5);
            assert.deepEqual(runEnvironment.D, [23.4, 10.1, 98, 0.1]);
        });
    });
});

/**
 * cmp: If F == D[I] => F = 0 else F = -1
 */
describe('cmp', function() {

    context('F === D[I]', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 3,
            F: 4.5,
            D: [23.4, 10.1, 98, 4.5]
        });        

        instructions.cmp(null, input, output, runEnvironment);

        it('should set F = 0', function() {
            assert(runEnvironment.F === 0);
        });
    });

    context('F !== D[I]', function() { // TODO: undefined, null?

        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 4.5,
            D: [23.4, 10.1, 98, 4.5]
        });        

        instructions.cmp(null, input, output, runEnvironment);

        it('should set F = -1', function() {
            assert(runEnvironment.F === -1);
        });
    });
});

/**
 * label: Label[I] = current code position + 1
 */
describe('label', function() {

    context('I is not undefined', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 4.5,
            D: [23.4, 10.1, 98, 4.5],
            counter: 23
        });

        instructions.label(null, input, output, runEnvironment);

        it('should store a label for the current program position', function() {
            assert(runEnvironment.labels[runEnvironment.I] === 23);
        });
    });
//    context('I is undefined', )
});

/**
 * gotoifp: If F >= 0 => counter = Label[I]
 */
describe('gotoifp', function() {
    context('label exists', function() {

        context('F >= 0', function() {

            var runEnvironment = new RuntimeEnvironment({
                I: 1,
                F: 1.5,
                labels: [34, 23],
                counter: 11
            });

            instructions.gotoifp(null, input, output, runEnvironment);

            it('should set the program counter to the value of label[I]', function() {
                assert(runEnvironment.counter === 23);
            });            
        });

        context('F < 0', function() {

            var runEnvironment = new RuntimeEnvironment({
                I: 1,
                F: -1.5,
                labels: [34, 23],
                counter: 11
            });

            instructions.gotoifp(null, input, output, runEnvironment);

            it('should keep the program counter as is', function() {
                assert(runEnvironment.counter === 11);
            });            
        });
    });

    context('label does not exist', function() {
        var runEnvironment = new RuntimeEnvironment({
            I: 3,
            F: 1.5,
            labels: [34, 23],
            counter: 11
        });

        instructions.gotoifp(null, input, output, runEnvironment);

        it('should keep the program counter as is', function() {
            assert(runEnvironment.counter === 11);
        });        
    });
});

/**
 * jumpifn: If F < 0 => jump to the instruction after the closest 
 * following and corresponding jumphere instruction
 */

describe('jumpifn', function(){

    describe('F < 0', function() {

        var runEnvironment = new RuntimeEnvironment({
            F: -1,
            counter: 2
        });
        runEnvironment.jumpTable = [,,5];

        instructions.jumpifn(null, input, output, runEnvironment);

        it('should jump to the corresponding jumphere instruction', 
            function() {
                assert(runEnvironment.counter === 5);
        });
    });

    describe('F > 0', function() {

        var runEnvironment = new RuntimeEnvironment({
            F: 1,
            counter: 2
        });
        runEnvironment.jumpTable = [,,5];

        instructions.jumpifn(null, input, output, runEnvironment);

        it('should not jump', function() {
            assert(runEnvironment.counter === 2);
        });
    });
});


describe('createJumpTable', function() {

    var runEnvironment = new RuntimeEnvironment({
        code: [
            instructions.nop.id,
            instructions.jumphere.id,
            instructions.nop.id,
            instructions.jumpifn.id,
            instructions.nop.id,
            instructions.jumpifn.id,
            instructions.nop.id,
            instructions.jumphere.id]
    });

    var expectedTable = [];

    expectedTable[3] = null;
    expectedTable[5] = 7;

    utils.createJumpTable(runEnvironment);

    it('should create a jump table', function() {
        assert.deepEqual(runEnvironment.jumpTable, expectedTable);
    });
});

/**
 * jumphere: Instruction indicating a point in the code to jump to
 *
 * (This instruction does not do anything, it is only a code reference point)
 */


 /**
 * loop: Loop the code, between this instruction and the following endloop
 * instruction, I number of times.
 */
describe('loop', function() {

    describe('I is > 0', function() {
        var runEnvironment = new RuntimeEnvironment({
            I: 5,
            code: [
                instructions.nop.id,
                instructions.endloop.id,
                instructions.nop.id,
                instructions.loop.id,
                instructions.nop.id,
                instructions.loop.id,
                instructions.nop.id,
                instructions.endloop.id],
            counter: 5
        });
        var keys;

        instructions.loop(null, input, output, runEnvironment);

        it('should execute the loop code if a matching endloop', function() {

            keys = Object.keys(runEnvironment);

            assert(keys.indexOf('loopTable') > -1);
            assert(keys.indexOf('loopCounter') > -1);
            assert(runEnvironment.counter === 5);
            assert(runEnvironment.loopCounter[5] === 5);
        });
    });

    describe('I is 0', function() {
        var runEnvironment = new RuntimeEnvironment({
            I: 0,
            code: [
                instructions.nop.id,
                instructions.endloop.id,
                instructions.nop.id,
                instructions.loop.id,
                instructions.nop.id,
                instructions.loop.id,
                instructions.nop.id,
                instructions.endloop.id],
            counter: 5
        });
        var keys;

        instructions.loop(null, input, output, runEnvironment);

        it('should jump to the endloop position if a matching endloop', function() {

            keys = Object.keys(runEnvironment);

            assert(keys.indexOf('loopTable') > -1);
            assert(keys.indexOf('loopCounter') > -1);
            assert(runEnvironment.counter === 7);
        });
    });
});


describe('createLoopTable', function() {

    var runEnvironment = new RuntimeEnvironment({
        code: [
            instructions.nop.id,
            instructions.endloop.id,
            instructions.nop.id,
            instructions.loop.id,
            instructions.nop.id,
            instructions.loop.id,
            instructions.nop.id,
            instructions.endloop.id]
    });

    var expectedTable = [];

    expectedTable[1] = null;
    expectedTable[3] = null;
    expectedTable[5] = 7;
    expectedTable[7] = 5;

    utils.createLoopTable(runEnvironment);

    it('should create a loop table', function() {
        assert.deepEqual(runEnvironment.loopTable, expectedTable);
    });
});


/**
 * endloop: Marks the end of a loop
 */
describe('endloop', function() {

    describe('matching loop instruction', function(){

        describe('loops left', function() {

            var runEnvironment = new RuntimeEnvironment({
                counter: 4
            });
            runEnvironment.loopTable = [,,,,2];
            runEnvironment.loopCounter = [,,3];

            it('should jump to the loop start', function() {

                instructions.endloop(null, input, output, runEnvironment);

                assert(runEnvironment.counter === 2);
                assert(runEnvironment.loopCounter[2] === 2);
            });
        });

        describe('no loops left', function() {

            var runEnvironment = new RuntimeEnvironment({
                counter: 4
            });

            runEnvironment.loopTable = [,,,,2];
            runEnvironment.loopCounter = [,,1];

            it('should continue, i.e. not jump to the loop start', function() {

                instructions.endloop(null, input, output, runEnvironment);

                assert(runEnvironment.counter === 4);
                assert(runEnvironment.loopCounter[2] === 1);
            });
        });
    });

    describe('no matching loop instruction', function(){
        var runEnvironment = new RuntimeEnvironment({
            counter: 4
        });
        runEnvironment.loopTable = [,,,,,];
        runEnvironment.loopCounter = [];

        instructions.endloop(null, input, output, runEnvironment);

        it('should just continue', function() {
            assert(runEnvironment.counter === 4);
        });
    });
});

/**
 * input: F = the next value (always a float value?) in the input buffer
 */
describe('input', function() {

    context('input.next is not undefined and a number', function() {

        input = [5.87, 45];
        var runEnvironment = new RuntimeEnvironment();

        instructions.input(null, input, output, runEnvironment);

        it('should get the next value from the input buffer and store in F', function() {
            assert(runEnvironment.F === 5.87);
        });
    });

    context('input.next is undefined', function() {

        input = [];
        var runEnvironment = new RuntimeEnvironment({F: 2.4});

        instructions.input(null, input, output, runEnvironment);

        it('should leave F as is', function() {
            assert(runEnvironment.F === 2.4);
        });
    });

    context('input.next is not a number', function() {

        input = ['test', 12];
        var runEnvironment = new RuntimeEnvironment();

        it('should throw an error', function() {
            assert.throws(function() { instructions.input(null, input, output, runEnvironment);} );
        });
    })
});

/**
 * output: Writes F to the output buffer
 */
describe('output', function() {

    context('F is not undefined', function() {

        var runEnvironment = new RuntimeEnvironment({F: 34.56});
        var output = [];

        instructions.output(null, input, output, runEnvironment);

        it('should write F to output', function() {
            assert(output[output.length - 1] === 34.56);
        });
    });

    context('F is undefined', function() {

        var runEnvironment = new RuntimeEnvironment();
        var output = [12, 4.5];

        instructions.output(null, input, output, runEnvironment);

        it('should not write to output', function() {
            assert.deepEqual(output, [12, 4.5]);
        });
    });
});

 /**
 * add: F = F + D[I]
 */
describe('add', function() {

    context('I, F and D[I] is not undefined', function() {
        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 12.5,
            D: [9, 2.3, 5]
        });

        instructions.add(null, input, output, runEnvironment);

        it('should add D[I] to F', function(){
            assert(runEnvironment.F === 14.8);
        });
    });
});


/**
 * sub: F = F - D[I]
 */
describe('sub', function() {

    context('I, F and D[I] is not undefined', function() {
        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 12.5,
            D: [9, 2.3, 5]
        });

        instructions.sub(null, input, output, runEnvironment);

        it('should substract D[I] to F', function(){
            assert(runEnvironment.F === 10.2);
        });
    });
});

/**
 * mul: F = F * D[I] 
 */
describe('mul', function() {

    context('I, F and D[I] is not undefined', function() {
        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 12.5,
            D: [9, 2.3, 5]
        });

        var FOld = runEnvironment.F;

        instructions.mul(null, input, output, runEnvironment);

        it('should multiply D[I] with F', function(){
            assert(runEnvironment.F === FOld * runEnvironment.D[runEnvironment.I]);
        });
    });
});


/**
 * div: F = F / D[I]
 */
 describe('div', function() {
    context('I, F, D[I] is not undefined and D[I] is not zero', function() {

        var runEnvironment = new RuntimeEnvironment({
            I: 1,
            F: 10.5,
            D: [9, 2, 21]
        });

        instructions.div(null, input, output, runEnvironment);

        it('should divide F with D[I] and assign to F', function() {
            assert(runEnvironment.F === 5.25);
        });
    });
 });

/**
 * abs: F = |F|
 */
describe('abs', function(){

    var runEnvironment = new RuntimeEnvironment({F: -12});

    instructions.abs(null, input, output, runEnvironment);

    it('should set F to abs(F)', function() {
        assert(runEnvironment.F === 12);
    });
});


/**
 * sign: F = -F
 */
describe('sign', function() {
    context('F is positive', function() {
        var runEnvironment = new RuntimeEnvironment({F: 2});

        instructions.sign(null, input, output, runEnvironment);

        it('should change sign of F', function() {
            assert(runEnvironment.F === -2);
        });
    });

    context('F is negative', function() {
        var runEnvironment = new RuntimeEnvironment({F: -2});

        instructions.sign(null, input, output, runEnvironment);

        it('should change sign of F', function() {
            assert(runEnvironment.F === 2);
        });
    });
});

/**
 * exp: F = e^F 
 */
describe('exp', function() {

    var runEnvironment = new RuntimeEnvironment({F: 2});

    instructions.exp(null, input, output, runEnvironment);

    it('should calculate e^F and store in F', function() {
        assert(runEnvironment.F === Math.exp(2));
    });
});

/**
 * log: F = log(F)
 */
describe('log', function() {
    var runEnvironment = new RuntimeEnvironment({F: 2});

    instructions.log(null, input, output, runEnvironment);

    it('should calculate log(F) and store in F', function() {
        assert(runEnvironment.F === Math.log(2));
    });
});

/**
 * sin: F = sin(F)
 */
describe('sin', function() {
    var runEnvironment = new RuntimeEnvironment({F: 2});

    instructions.sin(null, input, output, runEnvironment);

    it('should calculate sin(F) and store in F', function() {
        assert(runEnvironment.F === Math.sin(2));
    });
});

/**
 * pow: F = F^D[I]
 */
describe('pow', function() {
    var runEnvironment = new RuntimeEnvironment({
        I: 1, 
        F: 2,
        D: [1, 3, 4]
    });

    instructions.pow(null, input, output, runEnvironment);

    it('should calculate F^D[I] and store in F', function() {
        assert(runEnvironment.F === 8);
    });
});

/**
 * ran: F = ranodm number between 0 and 1
 */
describe('ran', function() {
    var runEnvironment = new RuntimeEnvironment({F: 2});

    instructions.ran(null, input, output, runEnvironment);

    it('should calculate a random number between 0 and 1 and store in F', function() {
        assert(runEnvironment.F >= 0 && runEnvironment.F < 1);
    });
});


/**
 * nop: no operation
 */
describe('nop', function() {
    var runEnvironment = new RuntimeEnvironment({
            I: 3,
            F: 1.5,
            D: [4, 6.4],
            labels: [34, 23],
            counter: 11,
            code: [-1, 4, 5]
        });

    var old = new RuntimeEnvironment({
            I: 3,
            F: 1.5,
            D: [4, 6.4],
            labels: [34, 23],
            counter: 11,
            code: [-1, 4, 5]
        });

    instructions.nop(null, input, output, runEnvironment);

    it('should not alter state', function() {
        assert.deepEqual(runEnvironment, old);
    });
});
 