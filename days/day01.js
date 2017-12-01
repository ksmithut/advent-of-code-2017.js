'use strict'

// Part 1
// ======

const sumMatchingPairs = (input, getNextIndex) => {
  return input.split('').reduce((sum, char, i, arr) => {
    const nextIndex = getNextIndex(i, arr)
    return sum + (char === arr[nextIndex] ? +char : 0)
  }, 0)
}

const getNeighborIndex = (i, arr) => (i >= arr.length - 1 ? 0 : i + 1)

const part1 = input => sumMatchingPairs(input, getNeighborIndex)

// Part 2
// ======

const getOppositeIndex = (i, arr) => (i + arr.length / 2) % arr.length

const part2 = input => sumMatchingPairs(input, getOppositeIndex)

module.exports = { part1, part2 }
