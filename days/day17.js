'use strict'

// Part 1
// ======

const iterateSpinLock = (start, end, steps, fn) => {
  let currentPos = 0
  steps = parseInt(steps, 10)
  for (let i = start; i <= end; i++) {
    currentPos = (currentPos + steps) % i + 1
    fn(currentPos, i)
  }
}

const part1 = (input, maxIterations = 2017) => {
  const buffer = [0]
  iterateSpinLock(1, maxIterations, input, (currentPos, i) => {
    buffer.splice(currentPos, 0, i)
  })
  return buffer[buffer.indexOf(maxIterations) + 1]
}

// Part 2
// ======

const part2 = (input, maxIterations = 50e6) => {
  // We don't care about the buffer now, because we just need to track the value
  // after 0, and 0 never moves
  let valAfterZero
  iterateSpinLock(1, maxIterations, input, (currentPos, i) => {
    if (currentPos === 1) valAfterZero = i
  })
  return valAfterZero
}

exports.part1 = part1
exports.part2 = part2
