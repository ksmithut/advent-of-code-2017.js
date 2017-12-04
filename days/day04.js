'use strict'

// Part 1
// ======

const hasNoDuplicates = getWords => {
  return line => {
    const words = getWords(line.split(' '))
    const uniqueWords = words.filter((item, i, arr) => arr.indexOf(item) === i)
    return words.length === uniqueWords.length
  }
}

const part1 = input => {
  const transformWords = val => val
  return input.split('\n').filter(hasNoDuplicates(transformWords)).length
}

// Part 2
// ======

const sortLetters = str => {
  return str
    .split('')
    .sort()
    .join('')
}

const part2 = input => {
  const transformWords = words => words.map(sortLetters)
  return input.split('\n').filter(hasNoDuplicates(transformWords)).length
}

module.exports = { part1, part2 }
