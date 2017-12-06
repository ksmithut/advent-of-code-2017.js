'use strict'

// Part 1
// ======

const findHighest = arr =>
  arr.reduce((highest, val, index) => {
    if (!highest) return { val, index }
    if (val > highest.val) return { val, index }
    return highest
  }, null)

const redistribute = (rawArr, num, fromIndex) => {
  const arr = rawArr.slice()
  arr[fromIndex] = 0
  let index = fromIndex + 1
  for (let i = 0; i < num; i++) {
    if (index >= arr.length) index = 0
    arr[index++]++
  }
  return arr
}

function * redistributeBlocksGenerator (input) {
  let blocks = input
    .replace(/\t/g, ' ')
    .split(' ')
    .map(num => parseInt(num, 10))
  let count = 0
  while (true) {
    yield { count, blocks: blocks.slice() }
    const highest = findHighest(blocks)
    blocks = redistribute(blocks, highest.val, highest.index)
    count++
  }
}

const runUntilDuplicateSet = input => {
  const redistributeBlocks = redistributeBlocksGenerator(input)
  const seen = {}
  let iteration
  do {
    iteration = redistributeBlocks.next().value
    seen[iteration.blocks] = (seen[iteration.blocks] || 0) + 1
  } while (seen[iteration.blocks] < 2)
  return iteration
}

const part1 = input => {
  return runUntilDuplicateSet(input).count
}

// Part 2
// ======

const part2 = input => {
  const output = runUntilDuplicateSet(input).blocks.join('\t')
  return runUntilDuplicateSet(output).count
}

module.exports = { part1, part2 }
