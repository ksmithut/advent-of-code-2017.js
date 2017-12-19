'use strict'

// Part 1
// ======

const knotHash = require('./day10').part2

const generateRows = input => {
  return new Array(128)
    .fill()
    .map((_, i) => `${input}-${i}`)
    .map(str => knotHash(str, 64))
    .map(hash => {
      return hash
        .split('')
        .map(char => {
          return parseInt(char, 16)
            .toString(2)
            .padStart(4, '0')
        })
        .join('')
        .split('')
        .map(Number)
    })
}

const part1 = input => {
  const rows = generateRows(input)
  return rows.reduce((total, row) => {
    return total + row.reduce((a, b) => a + b)
  }, 0)
}

// Part 2
// ======
const getSurrounding = (row, col) => [
  { row: row - 1, col },
  { row: row + 1, col },
  { row, col: col - 1 },
  { row, col: col + 1 }
]

const part2 = input => {
  const rows = generateRows(input)
  const visited = new Set()
  const visit = (row, col) => {
    visited.add(`${row},${col}`)
    getSurrounding(row, col)
      .filter(cell => {
        if (!rows[cell.row]) return false
        if (rows[cell.row][cell.col] !== 1) return false
        if (visited.has(`${cell.row},${cell.col}`)) return false
        return true
      })
      .forEach(({ row, col }) => visit(row, col))
  }

  return rows.reduce((groups, row, x) => {
    return row.reduce((groups, col, y) => {
      if (visited.has(`${x},${y}`)) return groups
      if (col === 0) return groups
      visit(x, y)
      return groups + 1
    }, groups)
  }, 0)
}

exports.part1 = part1
exports.part2 = part2
