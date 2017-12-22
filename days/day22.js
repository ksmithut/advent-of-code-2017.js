'use strict'

// Part 1
// ======

const toGrid = str => {
  return str
    .trim()
    .split('\n')
    .reduce((grid, row, y) => {
      return row.split('').reduce((innerGrid, cell, x) => {
        innerGrid[`${x}:${y}`] = cell
        return innerGrid
      }, grid)
    }, {})
}

const getMiddle = input => {
  const grid = input.split('\n').map(row => row.split(''))
  const middleY = Math.floor(grid.length / 2)
  const middleX = Math.floor(grid[middleY].length / 2)
  return {
    x: middleX,
    y: middleY
  }
}

const INFECTED = '#'
const CLEAN = '.'
const WEAKENED = 'W'
const FLAGGED = 'F'
const getNode = (grid, { x, y }) => grid[`${x}:${y}`] || CLEAN
const setNode = (grid, { x, y }, val) => (grid[`${x}:${y}`] = val)

const DIRECTIONS = {
  UP: {
    move: ({ x, y, ...rest }) => ({ x, y: y - 1, ...rest }),
    left: () => DIRECTIONS.LEFT,
    right: () => DIRECTIONS.RIGHT,
    reverse: () => DIRECTIONS.DOWN
  },
  DOWN: {
    move: ({ x, y, ...rest }) => ({ x, y: y + 1, ...rest }),
    left: () => DIRECTIONS.RIGHT,
    right: () => DIRECTIONS.LEFT,
    reverse: () => DIRECTIONS.UP
  },
  LEFT: {
    move: ({ x, y, ...rest }) => ({ x: x - 1, y, ...rest }),
    left: () => DIRECTIONS.DOWN,
    right: () => DIRECTIONS.UP,
    reverse: () => DIRECTIONS.RIGHT
  },
  RIGHT: {
    move: ({ x, y, ...rest }) => ({ x: x + 1, y, ...rest }),
    left: () => DIRECTIONS.UP,
    right: () => DIRECTIONS.DOWN,
    reverse: () => DIRECTIONS.LEFT
  }
}

const iterateGrid = (input, steps, stateMachine) => {
  const grid = toGrid(input)
  const start = {
    ...getMiddle(input),
    direction: DIRECTIONS.UP
  }
  let pos = { ...start }
  for (let i = 0; i < steps; i++) {
    const currentNode = stateMachine[getNode(grid, pos)]
    pos.direction = currentNode.direction(pos.direction)
    setNode(grid, pos, currentNode.state())
    pos = pos.direction.move(pos)
  }
}

const part1 = (input, { bursts = 10000 } = {}) => {
  let infectionBursts = 0
  iterateGrid(input, bursts, {
    [INFECTED]: {
      direction: direction => direction.right(),
      state: () => CLEAN
    },
    [CLEAN]: {
      direction: direction => direction.left(),
      state: () => {
        infectionBursts++
        return INFECTED
      }
    }
  })
  return infectionBursts
}

// Part 2
// ======

const part2 = (input, { bursts = 10000000 } = {}) => {
  let infectionBursts = 0
  iterateGrid(input, bursts, {
    [CLEAN]: {
      direction: direction => direction.left(),
      state: () => WEAKENED
    },
    [WEAKENED]: {
      direction: direction => direction,
      state: () => {
        infectionBursts++
        return INFECTED
      }
    },
    [INFECTED]: {
      direction: direction => direction.right(),
      state: () => FLAGGED
    },
    [FLAGGED]: {
      direction: direction => direction.reverse(),
      state: () => CLEAN
    }
  })
  return infectionBursts
}

exports.part1 = part1
exports.part2 = part2
