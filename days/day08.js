'use strict'

// Part 1
// ======

const COMPARITORS = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>=': (a, b) => a >= b,
  '==': (a, b) => a === b,
  '!=': (a, b) => a !== b
}
const INSTRUCTIONS = {
  inc: (a, val) => a + val,
  dec: (a, val) => a - val
}

const createInstructions = input => {
  return input.split('\n').map(line => {
    let [
      ,
      setRegister,
      instruction,
      instructionValue,
      conditionRegister,
      comparitor,
      comparitorValue
    ] = line.match(/^(\w+) (inc|dec) (-?\d+) if (\w+) ([><=!]+) (-?\d+)$/)
    instruction = INSTRUCTIONS[instruction]
    instructionValue = parseInt(instructionValue, 10)
    comparitor = COMPARITORS[comparitor]
    comparitorValue = parseInt(comparitorValue, 10)
    return registers => {
      const a = registers[conditionRegister] || 0
      const b = comparitorValue
      if (comparitor(a, b)) {
        registers[setRegister] = instruction(
          registers[setRegister] || 0,
          instructionValue
        )
      }
      return registers
    }
  })
}

const runInstructions = (instructions, each = () => {}) => {
  return instructions.reduce((registers, instruction) => {
    registers = instruction(registers)
    each(registers)
    return registers
  }, {})
}

const max = (a, b) => Math.max(a, b)

const maxValue = registers => Object.values(registers).reduce(max)

const part1 = input => {
  const instructions = createInstructions(input)
  const registers = runInstructions(instructions)
  return maxValue(registers)
}

// Part 2
// ======

const part2 = input => {
  const maxValues = []
  const instructions = createInstructions(input)
  runInstructions(instructions, registers => {
    maxValues.push(maxValue(registers))
  })
  return maxValues.reduce(max)
}

module.exports = { part1, part2 }
