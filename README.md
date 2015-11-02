Slash/A for Node
================

This is an implementation of the cool [Slash/A](https://github.com/arturadib/slash-a) language. The language has characteristics that make it suitable for genetic/evolutionary programming. The original interpreter is written in C++.


Install
-------


Usage
-----


About the implementation
------------------------
The interpreter is based on Slash/A's default instruction set (DIS) and accompaning memory structure. Although the base is the same, this Node implementation differs from the original C++ implementation in some areas:

1) The bytecode format differs. The bytecode is made up of integers, but this implementation uses the range -n,...-1 for instructions and 0, ...m for data. That is, a bytecode of -3 corresponds to an instruction and the bytecode 5 is the value 5 that should be placed in the I register (see [Slash/A](https://github.com/arturadib/slash-a) for details about the registers used in the language). You don't need to specify a range for data values to be able to run the interpreter.

2) Instructions have fixed ids.

3) There is an Execution class. With an object of this type, you can follow and control the exeuction of the bytecode.

4) There is only a Slash/A bytecode interpreter, not any source code interpreter.

