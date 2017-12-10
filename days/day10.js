'use strict'

// Part 1
// ======

const generateRange = length => new Array(length).fill().map((_, i) => i)

const runHash = (
  lengths,
  rope,
  { currentPosition = 0, skip = 0, times = 1 } = {}
) => {
  if (times <= 0) return rope
  const newRope = lengths.reduce((accRope, length) => {
    const secondPos = (currentPosition + length) % accRope.length
    const subArray = accRope.slice(currentPosition, currentPosition + length)
    const firstLegLength = subArray.length
    const doesWrap = secondPos <= currentPosition
    if (doesWrap) {
      subArray.push(...accRope.slice(0, secondPos))
    }
    subArray.reverse()
    accRope.splice(
      currentPosition,
      firstLegLength,
      ...subArray.slice(0, firstLegLength)
    )
    if (doesWrap) {
      accRope.splice(0, secondPos, ...subArray.slice(firstLegLength))
    }
    currentPosition = (currentPosition + length + skip) % accRope.length
    skip++
    return accRope
  }, rope)
  return runHash(lengths, newRope, {
    currentPosition,
    skip,
    times: times - 1
  })
}

const part1 = input => {
  const rope = generateRange(256)
  const lengths = input.split(',').map(num => parseInt(num, 10))
  const newRope = runHash(lengths, rope)
  return newRope[0] * newRope[1]
}

// Part 2
// ======

const part2 = input => {
  const rope = generateRange(256)
  const lengths = input
    .split('')
    .map(char => char.charCodeAt(0))
    .concat([17, 31, 73, 47, 23])

  const hash = runHash(lengths, rope, { times: 64 })
    .reduce((groups, elem, i) => {
      if (i % 16 === 0) groups.unshift([])
      groups[0].push(elem)
      return groups
    }, [])
    .reverse()
    .map(segment => segment.reduce((prev, curr) => prev ^ curr))
    .map(charCode => charCode.toString(16).padStart('0', 2))
    .join('')
  return hash
}

module.exports = { part1, part2 }
