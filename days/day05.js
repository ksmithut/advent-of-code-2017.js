'use strict'

// Part 1
// ======

const followInstructions = (input, increment) => {
  const instructions = input.split('\n').map(n => parseInt(n, 10))
  let index = 0
  let count = 0
  while (instructions[index] != null) {
    const nextIndex = index + instructions[index]
    instructions[index] = increment(instructions[index])
    index = nextIndex
    count++
  }
  return count
}

const part1 = input => {
  return followInstructions(input, offset => offset + 1)
}

// Part 2
// ======

const part2 = input => {
  return followInstructions(input, offset => {
    return offset >= 3 ? offset - 1 : offset + 1
  })
}

exports.part1 = part1
exports.part2 = part2
