'use strict'

// Part 1
// ======

const DIRECTIONS = {
  UP: ({ x, y, ...rest }) => ({ x, y: y - 1, ...rest }),
  DOWN: ({ x, y, ...rest }) => ({ x, y: y + 1, ...rest }),
  LEFT: ({ x, y, ...rest }) => ({ x: x - 1, y, ...rest }),
  RIGHT: ({ x, y, ...rest }) => ({ x: x + 1, y, ...rest })
}

const findStart = grid => {
  const lastY = grid.length - 1
  const lastX = grid[0].length - 1
  for (let x = 0; x <= lastX; x++) {
    if (grid[0][x] === '|') return { x, y: 0, dir: DIRECTIONS.DOWN }
    if (grid[lastY][x] === '|') return { x, y: lastY, dir: DIRECTIONS.UP }
  }
  for (let y = 0; y <= lastY; y++) {
    if (grid[y][0] === '-') return { x: 0, y, dir: DIRECTIONS.RIGHT }
    if (grid[y][lastX] === '-') return { x: lastX, y, dir: DIRECTIONS.LEFT }
  }
  return null
}

const getChar = (grid, marker) => grid[marker.y][marker.x]

const reduceGridPath = (input, fn, initialValue) => {
  const grid = input.split('\n').map(line => line.split(''))
  let value = initialValue
  let marker = findStart(grid)
  // Note that we break out later
  while (true) {
    // Follow the line until the end
    for (let char = getChar(grid, marker); char !== '+' && char !== ' ';) {
      // Note that these could also be in the iteraction portion of the loop
      // definition, but I found it more readable here
      marker = marker.dir(marker)
      char = getChar(grid, marker)
      value = fn(value, char, marker)
    }
    // If it's a ' ', then we've reached the end
    if (getChar(grid, marker) === ' ') break
    // If it's a '+', then we need to check if we go left or right (relative to
    // the direction we're actually going)
    switch (marker.dir) {
      case DIRECTIONS.UP:
      case DIRECTIONS.DOWN:
        marker.dir =
          getChar(grid, DIRECTIONS.LEFT(marker)) === '-'
            ? DIRECTIONS.LEFT
            : DIRECTIONS.RIGHT
        break
      case DIRECTIONS.LEFT:
      case DIRECTIONS.RIGHT:
        marker.dir =
          getChar(grid, DIRECTIONS.UP(marker)) === '|'
            ? DIRECTIONS.UP
            : DIRECTIONS.DOWN
        break
    }
    // Move one step in that direction
    marker = marker.dir(marker)
    value = fn(value, getChar(grid, marker), marker)
  }
  return value
}

const part1 = input => {
  return reduceGridPath(
    input,
    (letters, char) => {
      if (/\w/.test(char)) return letters + char
      return letters
    },
    ''
  )
}

// Part 2
// ======

const part2 = input => {
  return reduceGridPath(input, steps => steps + 1, 0)
}

exports.part1 = part1
exports.part2 = part2
exports.options = {
  noTrim: true
}
