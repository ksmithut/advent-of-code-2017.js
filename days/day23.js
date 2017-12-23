'use strict'

const { EventEmitter } = require('events')

// Part 1
// ======

class Program extends EventEmitter {
  constructor (input, start = {}) {
    super()
    this.instructions = input.split('\n').map(line => {
      const [command, x, y] = line.split(' ')
      return () => {
        const offset = this[command](x, y)
        this.emit(command, x, y)
        return offset
      }
    })
    this.registers = { ...start }
    this.pos = 0
  }
  runAll () {
    const generator = this.generator()
    while (!generator.next().done) {}
  }
  generator () {
    function * runnerGenerator () {
      while (this.instructions[this.pos]) {
        yield
        this.pos += this.instructions[this.pos]()
      }
      return this
    }
    return runnerGenerator.call(this)
  }
  get (x) {
    if (/\d+/.test(x)) return parseInt(x, 10)
    return this.registers[x] || 0
  }
  setRegister (register, val) {
    this.registers[register] = val
    this.emit('change', register, val)
  }

  set (x, y) {
    this.setRegister(x, this.get(y))
    return 1
  }
  sub (x, y) {
    this.setRegister(x, this.get(x) - this.get(y))
    return 1
  }
  mul (x, y) {
    this.setRegister(x, this.get(x) * this.get(y))
    return 1
  }
  jnz (x, y) {
    return this.get(x) !== 0 ? this.get(y) : 1
  }
}

const part1 = input => {
  const processor = new Program(input)
  let mulCount = 0
  processor.on('mul', () => mulCount++)
  processor.runAll()
  return mulCount
}

// Part 2
// ======

const part2 = input => {
  const processor = new Program(input, { a: 1 })
  const iterator = processor.generator()
  // This was hard to document in code, and the method to come up with this was
  // most definitely not automated. It was basically turning each of the
  // commands into imperitive JavaScript and refactoring jumps to do/while loops
  // then those into for loops, then trying to distil what it was actually
  // trying to do. With a set to 1, the program covers the first little part
  // which sets b and c to some initial "range", then we increment through that
  // range by 17 (or at least in my input... for me it was the `sub b -17` that
  // gave me that number). Anyway, there's probably a way to clean up the
  // assembly to be faster so that this code would be specific for this input.
  // For now, I'm okay with that because I have now idea how to program in
  // assembly, let alone optimize it. So the first part of this, gets the b and
  // c values out of that initial part (signified by getting the initial f
  // value), then just running the imperitive code that came out of hand
  // optimizing my input.
  while (processor.get('f') === 0) iterator.next()
  let h = 0
  for (let b = processor.get('b'), c = processor.get('c'); b <= c; b += 17) {
    for (let d = 2; d < b; d++) {
      if (b % d === 0) {
        h++
        break
      }
    }
  }
  return h
}

exports.part1 = part1
exports.part2 = part2
