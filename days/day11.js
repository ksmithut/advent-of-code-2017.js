'use strict'

// Part 1
// ======

const MOVEMENTS = {
  n: ({ x, y, z }) => ({ x: x, y: y + 1, z: z - 1 }),
  ne: ({ x, y, z }) => ({ x: x + 1, y: y, z: z - 1 }),
  se: ({ x, y, z }) => ({ x: x + 1, y: y - 1, z: z }),
  s: ({ x, y, z }) => ({ x: x, y: y - 1, z: z + 1 }),
  sw: ({ x, y, z }) => ({ x: x - 1, y: y, z: z + 1 }),
  nw: ({ x, y, z }) => ({ x: x - 1, y: y + 1, z })
}

const cubeDistance = (a, b) => {
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2
}

const part1 = input => {
  const start = { x: 0, y: 0, z: 0 }
  const end = input.split(',').reduce((pos, direction) => {
    return MOVEMENTS[direction](pos)
  }, start)
  return cubeDistance(start, end)
}

// Part 2
// ======

const part2 = input => {
  const start = { x: 0, y: 0, z: 0 }
  let maxDistance = 0
  input.split(',').reduce((pos, direction) => {
    const newPos = MOVEMENTS[direction](pos)
    maxDistance = Math.max(maxDistance, cubeDistance(start, newPos))
    return newPos
  }, start)
  return maxDistance
}

module.exports = { part1, part2 }
