'use strict'

// Part 1
// ======

const sumLinesBy = (input, calc) => {
  return input.split('\n').reduce((total, line) => {
    const lineNums = line
      .split(/\s+/) // Split by whitespace
      .map(num => parseInt(num, 10))
      .sort((a, b) => b - a) // Sort largest to smallest
    return total + calc(lineNums)
  }, 0)
}

const findLargestDifference = arr => {
  return arr[0] - arr[arr.length - 1]
}

const part1 = input => sumLinesBy(input, findLargestDifference)

// Part 2
// ======

const findIntegerQuotient = arr => {
  let quotient = 0
  arr.find((firstNumber, i) => {
    const secondNumber = arr
      .slice(i + 1)
      .find(num => Number.isInteger(firstNumber / num))
    if (secondNumber) return (quotient = firstNumber / secondNumber)
  })
  return quotient
}

const part2 = input => sumLinesBy(input, findIntegerQuotient)

module.exports = { part1, part2 }
