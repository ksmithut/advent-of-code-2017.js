'use strict'

// Part 1
// ======

const parseInput = input => {
  return input.split('\n').reduce((generators, line) => {
    const [, letter, num] = line.match(/^Generator (\w+) starts with (\d+)$/)
    generators[letter] = parseInt(num, 10)
    return generators
  }, {})
}

const lastBits = (num, bits = 16) => {
  return num
    .toString(2)
    .padStart(bits, '0')
    .substr(-bits)
}

function * generatorGenerator (init, multiplier, shouldEmit = () => true) {
  let num = init
  while (true) {
    num = (num * multiplier) % 2147483647
    if (shouldEmit(num)) yield num
  }
}

const countMatches = (maxComparisons, generatorA, generatorB) => {
  let matches = 0
  for (let i = 0; i < maxComparisons; i++) {
    const [a, b] = [generatorA.next().value, generatorB.next().value]
    if (lastBits(a) === lastBits(b)) matches++
  }
  return matches
}

const part1 = (input, maxComparisons = 40e6) => {
  const { A, B } = parseInput(input)
  const generatorA = generatorGenerator(A, 16807)
  const generatorB = generatorGenerator(B, 48271)
  return countMatches(maxComparisons, generatorA, generatorB)
}

// Part 2
// ======

const part2 = (input, maxComparisons = 5e6) => {
  const { A, B } = parseInput(input)
  const generatorA = generatorGenerator(A, 16807, num => num % 4 === 0)
  const generatorB = generatorGenerator(B, 48271, num => num % 8 === 0)
  return countMatches(maxComparisons, generatorA, generatorB)
}

exports.part1 = part1
exports.part2 = part2
