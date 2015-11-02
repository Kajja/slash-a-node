Slash/A for Node
================

This is an implementation of the cool [Slash/A](https://github.com/arturadib/slash-a) language. The language has characteristics that make it suitable for genetic/evolutionary programming. The original interpreter is written in C++.


Install
-------
With Node.js on your machine, you do:
```js
npm install slash-a-node --save
```

Usage
-----
Basic usage:
```js
var interpreter = require('slash-a-node').interpreter;

// Example x^4 code, from slash/A by Artur B Adib
var code = [4, -1, 0, -6, -15, -26, -16];

// x = 2
var input = [2];

var output = interpreter.runBytecode(code, input);

console.log(output); // => [16]
```

Using an Execution object:
```js
var interpreter = require('slash-a-node').interpreter;
var Execution = require('slash-a-node').Execution;

// Create a Execution object and register callbacks for events
var execObj = new Execution();

// Register a callback for "tick" events
execObj.tick(function(counter) {

    console.log('Number of executed instruction: ' + counter);

    if (counter > 3) {

        // Stop the execution
        execObj.stop();
    }
});

// Register a callback for the "finished" event 
execObj.finished(function(output) {

    console.log('The output of the execution: ' + output);
});

// Example x^4 code, from slash/A by Artur B Adib
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
 *      Number of executed instruction: 5
 *      Number of executed instruction: 6
 *      Number of executed instruction: 7
 *      The output of the execution: 16
*/
```
This will output:


You can register many callbacks for every event. They will be called in the
order that they were registered. The "tick" and the "finished" events are
the only supported events.


About the implementation
------------------------
The interpreter is based on Slash/A's default instruction set (DIS) and accompaning memory structure. Although the base is the same, this Node implementation differs from the original C++ implementation in some areas:

1) The bytecode format differs. The bytecode is made up of integers, but this implementation uses the range -n,...-1 for instructions and 0, ...m for data. That is, a bytecode of -3 corresponds to an instruction and the bytecode 5 is the value 5 that should be placed in the I register (see [Slash/A](https://github.com/arturadib/slash-a) for details about the registers used in the language). You don't need to specify a range for data values to be able to run the interpreter.

2) Instructions have fixed ids.

3) There is an Execution class. With an object of this type, you can follow and control the exeuction of the bytecode.

4) There is only a Slash/A bytecode interpreter, not any source code interpreter.

