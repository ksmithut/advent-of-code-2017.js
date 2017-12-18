'use strict'

// Part 1
// ======

class Channel {
  constructor ({ pop = false } = {}) {
    this.buffer = []
    this.options = { pop }
  }
  put (val = null) {
    this.buffer.push(val)
  }
  take () {
    this.mostRecentTaken = this.options.pop
      ? this.buffer.pop()
      : this.buffer.shift()
    return this.mostRecentTaken
  }
  get length () {
    return this.buffer.length
  }
}

class Program {
  constructor (pid, input, inbox, outbox) {
    this.instructions = input.split('\n').map(line => {
      const [command, x, y] = line.split(' ')
      return () => {
        return this[command](x, y)
      }
    })
    this.registers = { p: pid }
    this.pos = 0
    this.inbox = inbox
    this.outbox = outbox
    this.sent = 0
  }

  run () {
    this.waiting = false
    this.pos += this.instructions[this.pos]()
  }

  get (x) {
    if (/\d+/.test(x)) return parseInt(x, 10)
    return this.registers[x] || 0
  }

  set (x, y) {
    this.registers[x] = this.get(y)
    return 1
  }
  add (x, y) {
    this.registers[x] = this.get(x) + this.get(y)
    return 1
  }
  mul (x, y) {
    this.registers[x] = this.get(x) * this.get(y)
    return 1
  }
  mod (x, y) {
    this.registers[x] = this.get(x) % this.get(y)
    return 1
  }
  jgz (x, y) {
    return this.get(x) > 0 ? this.get(y) : 1
  }
  snd (x) {
    this.outbox.put(this.get(x))
    this.sent++
    return 1
  }
  rcv (x) {
    if (this.inbox.length === 0) {
      this.waiting = true
      return 0
    }
    this.registers[x] = this.inbox.take()
    return 1
  }
}

const part1 = input => {
  const channel = new Channel({ pop: true })
  const program = new Program(0, input, channel, channel)

  do {
    program.run()
  } while (!channel.mostRecentTaken)
  return channel.mostRecentTaken
}

// Part 2
// ======

const part2 = input => {
  const channel0 = new Channel()
  const channel1 = new Channel()
  const program0 = new Program(0, input, channel0, channel1)
  const program1 = new Program(1, input, channel1, channel0)
  do {
    program0.run()
    program1.run()
  } while (!(program0.waiting && program1.waiting))
  return program1.sent
}

module.exports = { part1, part2 }
