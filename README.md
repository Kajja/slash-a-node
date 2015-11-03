Slash/A for Node
================

This is an implementation of the cool [Slash/A](https://github.com/arturadib/slash-a) language. The language has characteristics that make it suitable for genetic programming / evolutionary programming. The original interpreter is written in C++.


Install
-------
With Node.js on your machine, do:
```js
npm install slash-a-node --save
```

Usage
-----
### Basic usage
```js
var interpreter = require('slash-a-node').interpreter;

// x^4 code, based on an example from slash/A by Artur B Adib
var code = [4, -1, 0, -6, -15, -26, -16];

// x = 2
var input = [2];

var output = interpreter.runBytecode(code, input);
console.log(output); // => [16]
```
*Of course, in a real situation, the code is expected to be generated by some sort of evolutionary system.*


### Using an Execution object
```js
var interpreter = require('slash-a-node').interpreter;
var Execution = require('slash-a-node').Execution;

// Create an Execution object and register callbacks for events
var execObj = new Execution();

// Register a callback for "tick" events
execObj.tick(function(counter) {
    console.log('Number of executed instruction: ' + counter);
    if (counter > 3) {

        // Stop the execution after 4 instructions
        execObj.stop();
    }
});

// Register a callback for the "finished" event 
execObj.finished(function(output) {
    console.log('The output of the execution: ' + output);
});

// x^4 code, based on an example from slash/A by Artur B Adib
var code = [4, -1, 0, -6, -15, -26, -16];

// x = 2
var input = [2];

interpreter.runBytecode(code, input, execObj);

/**
 * This will output:
 *      Number of executed instruction: 1
 *      Number of executed instruction: 2
 *      Number of executed instruction: 3
 *      Number of executed instruction: 4
 *      The output of the execution: 
*/
```
The primary motivation for the Execution class, was to make it possible to stop an execution based on the number of instructions executed. You could then stop executions that has ended up in an endless loop. You could also, possibly, promote effective code if individuals of the population have a resource that is consumed when instructions in an individual's code is executed. If an individual's resource is used up, the execution can be stopped and the individual expire.

If `runBytecode()` is called asynchronously, an Execution object will let you follow and control the execution and receive the output.

You can register many callbacks for every event. They will be called in the order that they were registered. The "tick" and the "finished" events are the only supported events.

### Creating test programs
If you would like to create a test programs, it can be easier to use this method, instead of writing the instruction ids directly as in the examples above:
```js
var interpreter = require('slash-a-node').interpreter;

// Get an object with the functions that implements the Slash/A instructions
var instrs = require('slash-a-node').instructions;

// x^4 code, based on an example from slash/A by Artur B Adib
var code = [
    4,
    instrs.itof.id,
    0,
    instrs.save.id,
    instrs.input.id,
    instrs.pow.id,
    instrs.output.id
];

// x = 2
var input = [2];

var output = interpreter.runBytecode(code, input);
console.log(output); // => [16]
```


About the implementation
------------------------
The interpreter is based on Slash/A's default instruction set (DIS) and accompanying memory structure. Although the base is the same, this Node implementation differs from the original C++ implementation in some areas:

1) The bytecode format differs. The bytecode is made up of integers, but this implementation uses the range -n,...-1 for instructions and 0, ...m for data. That is, a bytecode of -3 corresponds to an instruction and the bytecode 5 is the value 5 that should be placed in the I register (see [Slash/A](https://github.com/arturadib/slash-a) for details about the registers used in the language). You don't need to specify a range for data values to be able to run the interpreter.

2) Instructions have fixed ids. The interval of ids is [-28, 0], so valid values in a bytecode to be sent to the runBytecode function, are values in the interval [-28, largest JS 32-bit integer]. Actually, a negative integer not matching any instruction id will be ignored, so bytecodes including integers < -28 will not break the execution.

3) There is an Execution class. With an object of this type, you can follow and control the execution of the bytecode.

4) There is only a Slash/A bytecode interpreter, not any source code interpreter.