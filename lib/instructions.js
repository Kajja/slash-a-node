/**
 * Module for a basic set of instructions for the Slash/A
 * programming language.
 */


/**
 * SETI:
 * Stores an integer in the I register.
 *
 * @param integer - the integer to be stored in the I register
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function seti(integer, inStream, outStream, runEnv) {

    runEnv.I = integer;
}

/**
 * The "seti" instruction's id: 0. The "seti" instructions is handled
 * differently than the other instructions. If a bytecode of O is found
 * in a bytecode program, it is interpreted as the integer value to set
 * the I register to, not as the id of the "seti" instruction.
 */
Object.defineProperty(seti, "id", { get: function() { return 0; }});



/**
 * ITOF:
 * Stores the value in the I register in the F register, keeps I
 * as is.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function itof(value, inStream, outStream, runEnv) {

    runEnv.F = runEnv.I;
}

// The "itof" instruction's bytecode id: -1 
Object.defineProperty(itof, "id", { get: function() { return -1; }});



/**
 * FTOI:
 * Stores the value in the F register in the I register i.e. I = round(abs(F)).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function ftoi(value, inStream, outStream, runEnv) {

    runEnv.I = Math.round(Math.abs(runEnv.F));
}

// The "ftoi" instruction's bytecode id: -2
Object.defineProperty(ftoi, "id", { get: function() { return -2; }});



/**
 * INC:
 * Increases the value in the F register with 1.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function inc(value, inStream, outStream, runEnv) {

    runEnv.F++;
}

// The "inc" instruction's bytecode id: -3
Object.defineProperty(inc, "id", { get: function() { return -3; }});



/**
 * DEC:
 * Decreases the value in the F registe with 1.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function dec(value, inStream, outStream, runEnv) {

    runEnv.F--;
}

// The "dec" instruction's bytecode id: -4
Object.defineProperty(dec, "id", { get: function() { return -4; }});



/**
 * LOAD:
 * Loads a value from the D array into the F register, using the integer in the
 * I register as index i.e. F = D[I].
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function load(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var D = runEnv.D;

    if (D[I] !== undefined) runEnv.F = D[I];
}

// The "load" instruction's bytecode id: -5
Object.defineProperty(load, "id", { get: function() { return -5; }});



/**
 * SAVE:
 * Saves the value in the F register in data array D using the integer in the
 * I register as index i.e. D[I] = F.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function save(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var D = runEnv.D;

    if (I != undefined && F != undefined) D[I] = F;
}

// The "save" instruction's bytecode id: -6
Object.defineProperty(save, "id", { get: function() { return -6; }});



/**
 * SWAP:
 * Swap the value in F with the value in the data array D using the
 * integer in the I register as index i.e. F <-> D[I].
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function swap(value, inStream, outStream, runEnv) {
    
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I != undefined && F != undefined && DI !== undefined) {
        runEnv.F = DI;
        runEnv.D[I] = F;
    }
}

// The "swap" instruction's bytecode id: -7
Object.defineProperty(swap, "id", { get: function() { return -7; }});



/**
 * CMP:
 * If F === D[I] then F = 0 else F = -1
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function cmp(value, inStream, outStream, runEnv) {

    runEnv.F = runEnv.F === runEnv.D[runEnv.I] ? 0 : -1;
}

// The "cmp" instruction's bytecode id: -8
Object.defineProperty(cmp, "id", { get: function() { return -8; }});



/**
 * LABEL:
 * Creates a label in a Labels-array, for the current code posistion + 1,
 * using the integer in the I register as index.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function label(value, inStream, outStream, runEnv) {

    if (runEnv.I != undefined) runEnv.labels[runEnv.I] = runEnv.counter;
}

// The "label" instruction's bytecode id: -9
Object.defineProperty(label, "id", { get: function() { return -9; }});



/**
 * GOTOIFP:
 * If F >= 0 then set the counter (i.e. code posistion) to Labels[I].
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function gotoifp(value, inStream, outStream, runEnv) {

    if (runEnv.F >= 0 && runEnv.I != undefined && 
            runEnv.labels[runEnv.I] !== undefined) {

        runEnv.counter = runEnv.labels[runEnv.I];
    }
}

// The "gotoifp" instruction's bytecode id: -10
Object.defineProperty(gotoifp, "id", { get: function() { return -10; }});



/**
 * JUMPIFN:
 * If F < 0 jump to the instruction after the corresponding jumphere
 * instruction. If there is no corresponding jumphere instruction,
 * the instruction is ignored. The first time the function is called,
 * for a certain code, a "jumptable" is constructed that links jumpifn 
 * instructions to jumphere instructions.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function jumpifn(value, inStream, outStream, runEnv) {

    if (runEnv.F < 0) {

        if (!runEnv.jumpTable) createJumpTable(runEnv);

        if (runEnv.jumpTable[runEnv.counter] !== null) {

            // Jump to the corresponding jumphere instruction
            runEnv.counter = runEnv.jumpTable[runEnv.counter];
        }
    }
}

// The "jumpifn" instruction's bytecode id: -11
Object.defineProperty(jumpifn, "id", { get: function() { return -11; }});

/**
 * Creates an array that links jumpifn instruction with corresponding
 * jumphere instructions.
 *
 * @param {Object} runEnv - runtime state object
 */
function createJumpTable(runEnv) {

    var code = runEnv.code;
    var jumpStack = [];

    /* Create an array to hold the loop and endloop addresses
     * (i.e. index in the code for the instructions)
     */
    var jumpTable = runEnv.jumpTable = [];

    for (var i = 0 ; i < code.length ; i++) {

        switch (code[i]) {
            case jumpifn.id:
                jumpStack.push(i);
                jumpTable[i] = null;
                break;
            case jumphere.id:
                if (jumpStack.length) {
                    jumpTable[jumpStack.pop()] = i;
                }
                break;
        }
    }
}



/**
 * JUMPHERE:
 * A type of instruction who's single purpose is to mark a point in
 * the code that the interpreter should jump to if there is a
 * corresponding jumpifn instruction.
 */
function jumphere() {}

// The "jumphere" instruction's bytecode id: -12
Object.defineProperty(jumphere, "id", { get: function() { return -12; }});



/**
 * LOOP:
 * Instruction that marks the start of a loop. The code between a loop
 * instruction and a corresponding endloop instruction shall be be iterated
 * i number of times, where i is the value in the I register at the time
 * the loop instruction is processed. If there is no corresponding 
 * endloop instruction, the instruction is ignored. 
 *
 * The first time the function is called, for a certain code, 
 * a "loop table" is constructed that links loop instructions 
 * to endloop instructions.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function loop(value, inStream, outStream, runEnv) {

    // Is there a loop table?
    if (!runEnv.loopTable) {

        // No, create one
        createLoopTable(runEnv);
    }

    // Is this a valid loop i.e. is there a corresponding endloop?
    if (runEnv.loopTable[runEnv.counter] !== null) {

        // I holds the number of times to execute the loop code
        if (runEnv.I === 0) {
            
            // Jump straight to the endloop instruction
            runEnv.counter = runEnv.loopTable[runEnv.counter];

        } else {
            
            // Set the number of times the loop shall be executed
            runEnv.loopCounter[runEnv.counter] = runEnv.I;
        }
    }
}

// The "loop" instruction's bytecode id: -13
Object.defineProperty(loop, "id", { get: function() { return -13; }});

/**
 * Creates an array that links loop instruction with corresponding
 * endloop instructions.
 *
 * @param runEnv - runtime state object
 */
function createLoopTable(runEnv) {

    var loopAdr;
    var code = runEnv.code;
    var loopStack = [];

    /* Create an array to hold the loop and endloop addresses
     * (i.e. index in the code for the instructions)
     */
    var loopTable = runEnv.loopTable = [];

    /* 
     * Create an array to hold the number of times to loop.
     * The index in the array corresponds to the address of
     * the loop instruction (i.e. index in the code for the
     * loop instruction)
     */
    runEnv.loopCounter = [];

    for (var i = 0 ; i < code.length ; i++) {

        switch (code[i]) {
            case loop.id:
                loopStack.push(i);
                loopTable[i] = null;
                break;
            case endloop.id:
                if (loopStack.length) {
                    loopTable[loopAdr = loopStack.pop()] = i;
                    loopTable[i] = loopAdr;
                } else {
                    loopTable[i] = null;
                }
                break;
        }
    }
}



/**
 * ENDLOOP:
 * Instruction that marks the end a loop. If there are iterations
 * left of the loop, it sets the code position to the start of the
 * loop.
 *
 * If there is no corresponding loop instruction or if there are no
 * iterations left, nothing is done. 
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function endloop(value, inStream, outStream, runEnv) {

    var loopStartAdr;

    if (runEnv.loopTable) { // FIXME: Create a loop table?

        // Is there a matching loop start? 
        if (runEnv.loopTable[runEnv.counter] !== null) {

            loopStartAdr = runEnv.loopTable[runEnv.counter];

            // Are there any iterations left?
            if (runEnv.loopCounter[loopStartAdr] > 1) {

                // Go to the loop start
                runEnv.counter = loopStartAdr;

                // Count down the number of iterations left
                runEnv.loopCounter[loopStartAdr]--;
            }
        }
    }
}

// The "endloop" instruction's bytecode id: -14
Object.defineProperty(endloop, "id", { get: function() { return -14; }});



/**
 * INPUT:
 * Shifts the first value from the input array and stores it in the
 * F register.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function input(value, inStream, outStream, runEnv) {

    var inData = inStream.shift();

    if (inData !== undefined) {
        if (typeof inData === 'number') {
            runEnv.F = inData;
        } else {
            throw new Error('Values in the indata array must be numbers');
        }
    }
}

// The "input" instruction's bytecode id: -15
Object.defineProperty(input, "id", { get: function() { return -15; }});



/**
 * OUTPUT:
 * Pushes the value in the F register, if it isn't undefined, onto the
 * outStream array.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function output(value, inStream, outStream, runEnv) {

    if (runEnv.F != undefined) outStream.push(runEnv.F);
}

// The "output" instruction's bytecode id: -16
Object.defineProperty(output, "id", { get: function() { return -16; }});



/**
 * ADD:
 * Adds data from the D array to the value in the F register, using
 * the value in the I register as index (F = F + D[I]).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function add(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I != undefined && F != undefined && DI !== undefined) {
        runEnv.F += DI;
    }
}

// The "add" instruction's bytecode id: -17
Object.defineProperty(add, "id", { get: function() { return -17; }});



/**
 * SUB:
 * Substracts, from F, a value in the data array D, using
 * the value in the I register as index (F = F - D[I]).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function sub(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I != undefined && F != undefined && DI !== undefined) {
        runEnv.F -= DI;
    }
}

// The "sub" instruction's bytecode id: -18
Object.defineProperty(sub, "id", { get: function() { return -18; }});



/**
 * MUL:
 * Multiplies F with a value from the data array D, using
 * the value in the I register as index (F = F * D[I]).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function mul(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I != undefined && F != undefined && DI !== undefined) {
        runEnv.F *= DI;
    }
}

// The "mul" instruction's bytecode id: -19
Object.defineProperty(mul, "id", { get: function() { return -19; }});



/**
 * DIV:
 * Divides F with a value from the data array D, using
 * the value in the I register as index (F = F / D[I]).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function div(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I != undefined && F != undefined && DI !== undefined) {
        runEnv.F /= DI;
    }
}

// The "div" instruction's bytecode id: -20
Object.defineProperty(div, "id", { get: function() { return -20; }});



/**
 * ABS:
 * Calculates the abs value of the value in the F register (F = |F|).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function abs(value, inStream, outStream, runEnv) {

    var F = runEnv.F;

    if (F != undefined) runEnv.F = Math.abs(F);
}

// The "abs" instruction's bytecode id: -21
Object.defineProperty(abs, "id", { get: function() { return -21; }});



/**
 * SIGN:
 * Changes the sign of the value in the F register (F = -F).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function sign(value, inStream, outStream, runEnv) {

    var F = runEnv.F;

    if (F != undefined) runEnv.F = -F;
}

// The "sign" instruction's bytecode id: -22
Object.defineProperty(sign, "id", { get: function() { return -22; }});



/**
 * EXP:
 * Calculates F = e^F.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function exp(value, inStream, outStream, runEnv) {

    var F = runEnv.F;

    if (F != undefined) runEnv.F = Math.exp(F);   
}

// The "exp" instruction's bytecode id: -23
Object.defineProperty(exp, "id", { get: function() { return -23; }});



/**
 * LOG:
 * Calculates F = log(F).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function log(value, inStream, outStream, runEnv) {

    var F = runEnv.F;

    if (F != undefined) runEnv.F = Math.log(F);   
}

// The "log" instruction's bytecode id: -24
Object.defineProperty(log, "id", { get: function() { return -24; }});



/**
 * SIN:
 * Calculates F = sin(F).
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function sin(value, inStream, outStream, runEnv) {

    var F = runEnv.F;

    if (F != undefined) runEnv.F = Math.sin(F);   
}

// The "sin" instruction's bytecode id: -25
Object.defineProperty(sin, "id", { get: function() { return -25; }});



/**
 * POW:
 * Calculates F = F^D[I], where D is the data array and I is the
 * value in the I register.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function pow(value, inStream, outStream, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I != undefined && F != undefined && DI !== undefined) {
        runEnv.F = Math.pow(F, DI);
    }
}

// The "pow" instruction's bytecode id: -26
Object.defineProperty(pow, "id", { get: function() { return -26; }});



/**
 * RAN:
 * Creates a random number between 0 and 1 (exclusive) and stores it
 * the F register.
 *
 * @param value - not used here
 * @param {Array} inStream - array reference where you shift input values from
 * @param {Array} outStream - array reference where output values are pushed
 * @param {Object} runEnv - object reference where runtime state is kept
 */
function ran(value, inStream, outStream, runEnv) {

    runEnv.F = Math.random();
}

// The "ran" instruction's bytecode id: -27
Object.defineProperty(ran, "id", { get: function() { return -27; }});



/**
 * NOP:
 * Does nothing?!
 */
function nop() {
}

// The "nop" instruction's bytecode id: -28
Object.defineProperty(nop, "id", { get: function() { return -28; }});



/**
 * What this module exports
 */

/**
 * An object where the implementing functions can be accessed by
 * the instructions' names.
 */
var instructions = {
    seti: seti,
    itof: itof,
    ftoi: ftoi,
    inc: inc,
    dec: dec,
    load: load,
    save: save,
    swap: swap,
    cmp: cmp,
    label: label,
    gotoifp: gotoifp,
    jumpifn: jumpifn,
    jumphere: jumphere,
    loop: loop,
    endloop: endloop,
    input: input,
    output: output,
    add: add,
    sub: sub,
    mul: mul,
    div: div,
    abs: abs,
    sign: sign,
    exp: exp,
    log: log,
    sin: sin,
    pow: pow,
    ran: ran,
    nop: nop
};

exports.instructions = instructions;

/**
 * Creates an array where you can access the implementing functions using
 * the instructions' bytecode ids.
 *
 * @param {Object} instructions - implementing functions as an object/associative array
 * @returns {Array} array where indexes maps to instructions' bytecode ids as: i = -id
 */

function createInstrArray(instructions) {

    var instrArray = [];
    var func;

    for (var instr in instructions) {

        if (instructions.hasOwnProperty(instr)) {
            func = instructions[instr];
            instrArray[-func.id] = func;
        }
    }
    
    return instrArray;
}

exports.idToImpl = createInstrArray(instructions);


// Utils, to be able to test them
exports.utils = {
    createJumpTable: createJumpTable,
    createLoopTable: createLoopTable
};