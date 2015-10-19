/**
 * Module for a basic set of instructions for the Slash/A programming language
 *
 */

// seti
function seti(integer, input, output, runEnv) {
    runEnv.I = integer;
}

seti.id = 1;

// itof
function itof(value, input, output, runEnv) {
    runEnv.F = runEnv.I;
}

itof.id = 2;

// ftoi
function ftoi(value, input, output, runEnv) {
    runEnv.I = Math.round(Math.abs(runEnv.F));
}

ftoi.id = 3;

// inc
function inc(value, input, output, runEnv) {
    runEnv.F++;
}

inc.id = 4;

// dec
function dec(value, input, output, runEnv) {
    runEnv.F--;
}
dec.id = 5;

// load
function load(value, input, output, runEnv) {

    var I = runEnv.I;
    var D = runEnv.D;

    if (D[I] !== undefined)
        runEnv.F = D[I];
}
load.id = 6;

// save
function save(value, input, output, runEnv) {

    var I = runEnv.I;
    var F = runEnv.F;
    var D = runEnv.D;

    if (I !== undefined && F !== undefined) 
        D[I] = F;
}
save.id = 7;

// swap
function swap(value, input, output, runEnv) {
    
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I !== undefined && F !== undefined && DI !== undefined) {
        runEnv.F = DI;
        runEnv.D[I] = F;
    }
}
swap.id = 8;

// cmp
function cmp(value, input, output, runEnv) {
    runEnv.F === runEnv.D[runEnv.I] ? runEnv.F = 0 : runEnv.F = -1;
}
cmp.id = 9;

// label
function label(value, input, output, runEnv) {
    if (runEnv.I !== undefined)
        runEnv.label[runEnv.I] = runEnv.counter;
}
label.id = 10;

// gotoifp
function gotoifp(value, input, output, runEnv) {
    if (runEnv.F >= 0 && runEnv.I !== undefined && runEnv.label[runEnv.I] !== undefined)
        runEnv.counter = runEnv.label[runEnv.I];
}
gotoifp.id = 11;

// jumpifn
function jumpifn(value, input, output, runEnv) {

    var i, k;
    var code = runEnv.code;
    var unmatchedJumps;

    if (runEnv.F < 0) {
        if (!runEnv.jumpTable) {

            // Create a jump table
            runEnv.jumpTable = [];

            // Fill the jump table
            for (i = 0 ; i < code.length ; i++) {

                if (code[i] === jumpifn.id) {
                    unmatchedJumps++;

                    for (k = i + 1 ; k < code.length && unmatchedJumps ; k++) {
                        
                        switch (code[k]) {
                            case jumpifn.id:
                                unmatchedJumps++;    
                                break;
                            case jumphere.id:
                                unmatchedJumps--;
                                break;
                        }                        
                    }

                    if (unmatchedJumps === 0) {
                        // A match was found
                        runEnv.jumpTable[i] = k;
                    } else {
                        // No matching jumphere
                        runEnv.jumpTable[i] = null;
                    }
                }
            }
        }

        if (runEnv.jumpTable[runEnv.counter] !== null)
            // Jump to the corresponding jumphere instruction
            runEnv.counter = runEnv.jumpTable[runEnv.counter];
    }
}
jumpifn.id = 12;

// jumphere
function jumphere() {}
jumphere.id = 13;

// loop
function loop() {}
loop.id = 14;

// endloop
function endloop() {}
endloop.id = 15; 

// input
function input(value, input, output, runEnv) {

    var value = input.shift();

    if (value !== undefined)
        runEnv.F = value;
}
input.id = 16;

// output
function output(value, input, output, runEnv) {

    var value = runEnv.F;

    if (value !== undefined)
        output.push(value);
}
output.id = 17;

// add
function add(value, input, output, runEnv) {
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I !== undefined && F !== undefined && DI !== undefined)
        runEnv.F += DI;
}
add.id = 18;

// sub
function sub(value, input, output, runEnv) {
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I !== undefined && F !== undefined && DI !== undefined)
        runEnv.F -= DI;
}
sub.id = 19;

// mul
function mul(value, input, output, runEnv) {
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I !== undefined && F !== undefined && DI !== undefined)
        runEnv.F *= DI;
}
mul.id = 20;

// div
function div(value, input, output, runEnv) {
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I !== undefined && F !== undefined && DI !== undefined)
        runEnv.F /= DI;
}
div.id = 21;

// abs
function abs(value, input, output, runEnv) {
    var F = runEnv.F;

    if (F !== undefined)
        runEnv.F = Math.abs(F);
}
abs.id = 22;

// sign
function sign(value, input, output, runEnv) {
    var F = runEnv.F;

    if (F !== undefined)
        runEnv.F = -F;   
}
sign.id = 23;

// exp
function exp(value, input, output, runEnv) {
    var F = runEnv.F;

    if (F !== undefined)
        runEnv.F = Math.exp(F);   
}
exp.id = 24;

// log
function log(value, input, output, runEnv) {
    var F = runEnv.F;

    if (F !== undefined)
        runEnv.F = Math.log(F);   
}
log.id = 25;

// sin
function sin(value, input, output, runEnv) {
    var F = runEnv.F;

    if (F !== undefined)
        runEnv.F = Math.sin(F);   
}
sin.id = 26;

// pow
function pow(value, input, output, runEnv) {
    var I = runEnv.I;
    var F = runEnv.F;
    var DI = runEnv.D[I];

    if (I !== undefined && F !== undefined && DI !== undefined)
        runEnv.F = Math.pow(F, DI);
}
pow.id = 27;

// ran
function ran(value, input, output, runEnv) {
    runEnv.F = Math.random();
}
ran.id = 28;

// nop
function nop() {
}
nop.id = 29;

// What is exported
module.exports = {
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
    sin, sin,
    pow: pow,
    ran: ran,
    nop: nop
};