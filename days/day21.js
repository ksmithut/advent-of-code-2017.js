'use strict'

// Part 1
// ======

const gridSlice = (grid, { x, y }, { width, height }) => {
  return grid.slice(y, y + height).map(row => row.slice(x, x + width))
}

const divideGrid = grid => {
  const divisor = grid.length % 2 === 0 ? 2 : 3
  let dividedGrid = []
  const length = grid.length / divisor
  const height = length
  for (let y = 0; y < height; y++) {
    dividedGrid[y] = []
    for (let x = 0; x < length; x++) {
      dividedGrid[y][x] = gridSlice(
        grid,
        { x: x * divisor, y: y * divisor },
        { width: divisor, height: divisor }
      )
    }
  }
  return dividedGrid
}

const combineGrid = dividedGrid => {
  let grid = []
  for (let y = 0; y < dividedGrid.length; y++) {
    for (let x = 0; x < dividedGrid[y].length; x++) {
      const subGrid = dividedGrid[y][x]
      for (let subY = 0; subY < subGrid.length; subY++) {
        for (let subX = 0; subX < subGrid[subY].length; subX++) {
          let realY = subY + y * subGrid.length
          let realX = subX + x * subGrid[subY].length
          grid[realY] = grid[realY] || []
          grid[realY][realX] = subGrid[subY][subX]
        }
      }
    }
  }
  return grid
}

const flipVertical = grid => grid.slice().reverse()
const flipHorizontal = grid => grid.map(row => row.slice().reverse())
const rotateClockwise = grid => {
  const newGrid = []
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      newGrid[y] = newGrid[y] || []
      newGrid[y][x] = grid[grid.length - x - 1][y]
    }
  }
  return newGrid
}

const hashGrid = grid => grid.map(row => row.join('')).join('/')
const toGrid = str => {
  return str
    .trim()
    .split('/')
    .map(row => row.split(''))
}

const parseInstructions = input => {
  return input.split('\n').reduce((instructions, line) => {
    const [inGrid, outGrid] = line.split(' => ')
    instructions[inGrid] = () => toGrid(outGrid)
    return instructions
  }, {})
}

const enhanceImage = (image, instructions) => {
  const dividedImage = divideGrid(image).map(row => {
    return row.map(subGrid => {
      const possibilities = [
        () => subGrid,
        () => flipHorizontal(subGrid),
        () => flipVertical(subGrid),
        () => rotateClockwise(subGrid),
        () => rotateClockwise(rotateClockwise(subGrid)),
        () => rotateClockwise(rotateClockwise(rotateClockwise(subGrid))),
        () => rotateClockwise(flipHorizontal(subGrid)),
        () =>
          rotateClockwise(
            rotateClockwise(rotateClockwise(flipHorizontal(subGrid)))
          )
      ]
      for (let possibility of possibilities) {
        let hash = hashGrid(possibility())
        if (instructions[hash]) return instructions[hash]()
      }
      throw new Error('Instruction not found')
    })
  })
  return combineGrid(dividedImage)
}

const repeatReduce = (amount, fn, initialValue) => {
  let value = initialValue
  for (let i = 0; i < amount; i++) value = fn(value)
  return value
}

const flatten = arr => {
  if (!Array.isArray(arr)) return arr
  return arr.reduce((result, value) => result.concat(flatten(value)), [])
}

const count = (arr, fn) => flatten(arr).filter(fn).length

const part1 = (input, { startGrid = '.#./..#/###', iterations = 5 } = {}) => {
  const instructions = parseInstructions(input)
  const image = repeatReduce(
    iterations,
    prevImage => enhanceImage(prevImage, instructions),
    toGrid(startGrid)
  )
  return count(image, cell => cell === '#')
}

// Part 2
// ======

const part2 = (input, { startGrid = '.#./..#/###', iterations = 18 } = {}) => {
  const instructions = parseInstructions(input)
  const image = repeatReduce(
    iterations,
    prevImage => enhanceImage(prevImage, instructions),
    toGrid(startGrid)
  )
  return count(image, cell => cell === '#')
}

exports.part1 = part1
exports.part2 = part2
