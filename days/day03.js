'use strict'

// Part 1
// ======

const DIRECTIONS = {
  RIGHT: {
    move: ({ x, y }) => ({ x: x + 1, y }),
    next: () => DIRECTIONS.UP
  },
  UP: {
    move: ({ x, y }) => ({ x, y: y + 1 }),
    next: () => DIRECTIONS.LEFT
  },
  LEFT: {
    move: ({ x, y }) => ({ x: x - 1, y }),
    next: () => DIRECTIONS.DOWN
  },
  DOWN: {
    move: ({ x, y }) => ({ x, y: y - 1 }),
    next: () => DIRECTIONS.RIGHT
  }
}

function * spiralGridGenerator (getNextValue) {
  const grid = {}
  let currentDirection = DIRECTIONS.RIGHT
  let prev = { x: null, y: null }
  let head = { x: 0, y: 0 }
  // Kind of a "hash" to make it easy to lookup and set grid points
  const getKey = ({ x, y }) => `${x},${y}`
  // Used to get the value at a point in the grid
  const getNodeValue = point => {
    const node = grid[getKey(point)]
    return node ? node.value : 0
  }
  while (true) {
    // Yield current node
    yield (grid[getKey(head)] = {
      ...head,
      value: getNextValue({ ...head }, { ...prev }, { getNodeValue })
    })
    // Set next direction
    const possibleNextDirection = currentDirection.next()
    const possibleNextKey = getKey(possibleNextDirection.move(head))
    const possibleNextNode = grid[possibleNextKey]
    if (!possibleNextNode) currentDirection = possibleNextDirection
    // Set prev and head values
    prev = { ...head }
    head = currentDirection.move(head)
  }
}

const part1 = input => {
  let currentNode
  const lastValue = parseInt(input, 10)
  const grid = spiralGridGenerator((currNode, prevNode, { getNodeValue }) => {
    return getNodeValue(prevNode) + 1
  })

  do currentNode = grid.next().value
  while (currentNode.value < lastValue)

  return Math.abs(currentNode.x) + Math.abs(currentNode.y)
}

// Part 2
// ======

const getSurroundingPoints = ({ x, y }) => {
  let points = []
  for (let xIndex = x - 1; xIndex <= x + 1; xIndex++) {
    for (let yIndex = y - 1; yIndex <= y + 1; yIndex++) {
      if (xIndex === x && yIndex === y) continue
      points.push({ x: xIndex, y: yIndex })
    }
  }
  return points
}

const part2 = input => {
  let currentNode
  const lastValue = parseInt(input, 10)
  const grid = spiralGridGenerator((currNode, prevNode, { getNodeValue }) => {
    return (
      getSurroundingPoints(currNode)
        .map(getNodeValue)
        .reduce((total, num) => total + num) || 1 // Default to 1 on the first run
    )
  })

  do currentNode = grid.next().value
  while (currentNode.value < lastValue)

  return currentNode.value
}

exports.part1 = part1
exports.part2 = part2
