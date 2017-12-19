'use strict'

// Part 1
// ======

const DIRECTIONS = {
  UP: {
    next: ({ x, y, ...rest }) => ({ x: x + 0, y: y - 1, ...rest })
  },
  DOWN: {
    next: ({ x, y, ...rest }) => ({ x: x + 0, y: y + 1, ...rest })
  },
  LEFT: {
    next: ({ x, y, ...rest }) => ({ x: x - 1, y: y + 0, ...rest })
  },
  RIGHT: {
    next: ({ x, y, ...rest }) => ({ x: x + 1, y: y + 0, ...rest })
  }
}

const findStart = grid => {
  for (let x = 0; x < grid[0].length; x++) {
    if (grid[0][x] === '|') return { x, y: 0, dir: DIRECTIONS.DOWN }
    if (grid[grid.length - 1][x] === '|') {
      return { x, y: grid.length - 1, dir: DIRECTIONS.UP }
    }
  }
  for (let y = 0; y < grid.length; y++) {
    if (grid[y][0] === '-') return { x: 0, y, dir: DIRECTIONS.RIGHT }
    if (grid[y][grid[0].length - 1] === '-') {
      return { x: grid[0].length - 1, y, dir: DIRECTIONS.LEFT }
    }
  }
  return null
}

const getChar = (grid, marker) => grid[marker.y][marker.x]

const part1 = input => {
  // TODO fix input trimming
  const fs = require('fs')
  input = fs.readFileSync('days/day19input.txt', 'utf8')

  const grid = input.split('\n').map(line => line.split(''))
  const letters = []
  let marker = findStart(grid)
  let found = false
  while (!found) {
    for (
      let char = getChar(grid, marker);
      char !== '+' && char !== ' ';
      marker = marker.dir.next(marker), char = getChar(grid, marker)
    ) {
      if (/\w/.test(char)) letters.push(char)
    }
    if (getChar(grid, marker) === ' ') {
      found = true
      continue
    }
    switch (marker.dir) {
      case DIRECTIONS.UP:
      case DIRECTIONS.DOWN:
        marker.dir =
          getChar(grid, DIRECTIONS.LEFT.next(marker)) === '-'
            ? DIRECTIONS.LEFT
            : DIRECTIONS.RIGHT
        break
      case DIRECTIONS.LEFT:
      case DIRECTIONS.RIGHT:
        marker.dir =
          getChar(grid, DIRECTIONS.UP.next(marker)) === '|'
            ? DIRECTIONS.UP
            : DIRECTIONS.DOWN
        break
    }
    marker = marker.dir.next(marker)
  }
  return letters.join('')
}

// Part 2
// ======

const part2 = input => {
  const grid = input.split('\n').map(line => line.split(''))
  const letters = []
  let marker = findStart(grid)
  let steps = 0
  let found = false
  while (!found) {
    for (
      let char = getChar(grid, marker);
      char !== '+' && char !== ' ';
      steps++, marker = marker.dir.next(marker), char = getChar(grid, marker)
    ) {
      if (/\w/.test(char)) letters.push(char)
    }
    if (getChar(grid, marker) === ' ') {
      found = true
      continue
    }
    switch (marker.dir) {
      case DIRECTIONS.UP:
      case DIRECTIONS.DOWN:
        marker.dir =
          getChar(grid, DIRECTIONS.LEFT.next(marker)) === '-'
            ? DIRECTIONS.LEFT
            : DIRECTIONS.RIGHT
        break
      case DIRECTIONS.LEFT:
      case DIRECTIONS.RIGHT:
        marker.dir =
          getChar(grid, DIRECTIONS.UP.next(marker)) === '|'
            ? DIRECTIONS.UP
            : DIRECTIONS.DOWN
        break
    }
    steps++
    marker = marker.dir.next(marker)
  }
  return steps
}

exports.part1 = part1
exports.part2 = part2
exports.options = {
  noTrim: true
}
