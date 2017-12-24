'use strict'

// Part 1
// ======

const createParts = input => {
  return input.split('\n').map(line => ({
    sides: line.split('/'),
    strength: line
      .split('/')
      .map(Number)
      .reduce((a, b) => a + b)
  }))
}

function * permutationGenerator (parts, start = '0', prefix = []) {
  const starters = parts.filter(part => part.sides.includes(start))
  for (let startPart of starters) {
    const subPrefix = prefix.concat(startPart)
    const subParts = parts.filter(part => part !== startPart)
    const end =
      startPart.sides.find(side => side !== start) || startPart.sides[0]
    yield subPrefix
    for (let subPermutation of permutationGenerator(subParts, end, subPrefix)) {
      yield subPermutation
    }
  }
}

const permutationStrength = permutation => {
  return permutation.reduce((total, part) => {
    return total + part.strength
  }, 0)
}

const reduceGenerator = (generator, reducer, initialValue) => {
  let value = initialValue
  for (let iteration of generator) {
    value = reducer(value, iteration)
  }
  return value
}

const part1 = input => {
  const parts = createParts(input)
  return reduceGenerator(
    permutationGenerator(parts),
    (maxStrength, permutation) => {
      return Math.max(maxStrength, permutationStrength(permutation))
    },
    0
  )
}

// Part 2
// ======

const part2 = input => {
  const parts = createParts(input)
  return reduceGenerator(
    permutationGenerator(parts),
    ({ maxStrength, maxLength }, permutation) => {
      if (permutation.length > maxLength) {
        maxLength = permutation.length
        maxStrength = permutationStrength(permutation)
      } else if (permutation.length === maxLength) {
        maxStrength = Math.max(maxStrength, permutationStrength(permutation))
      }
      return { maxLength, maxStrength }
    },
    { maxStrength: 0, maxLength: 0 }
  ).maxStrength
}

exports.part1 = part1
exports.part2 = part2
