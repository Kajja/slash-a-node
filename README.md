Slash/A for Node
================

This is an implementation of the very cool [Slash/A](https://github.com/arturadib/slash-a) language. The language has characteristics that make it suitable for genetic/evolutionary programming. The original interpreter is written in C++.

There are a few differences between this Node implementation and the original C++ implementation. One of the biggest is that the format of the bytecode differs from the bytecode that the original implementation uses.

In the original implementation, the bytecode consists of an array of unsigned integers. A value between 0,... k can be either an instruction or a value. This implementation instead uses the range -1,...-n for instructions and 0, ...m for data. That is, a bytecode of -1 corresponds to an instruction and the bytecode 5 is the value 5 that should be placed in the I register (see [Slash/A](https://github.com/arturadib/slash-a) for details about the registers used in the language).

The original interpreter requires that the data range be specified from the start, i.e. *m* above. That is not needed with this implementation. The interpreter can run all bytecode if supplied with the instruction set that where used when generating it, regardless of the data range used.

Manipulating bytecode
---------------------

When modifying this type of bytecode, in an evolutionary step, I believe it is probably necessary to include these steps:
1. Choose a value from the range of valid instructions.
2. If the instruction was a "set the I register to value"-instruction, choose a value in the data range.

This is probably what I will do, so that I can specify the probability distribution of the instruction range and the data range independently.

Install
-------


Usage
-----