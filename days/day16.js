'use strict'

// Part 1
// ======

const getLetters = (length = 26) => {
  return new Array(length)
    .fill(97)
    .map((charCode, i) => String.fromCharCode(charCode + i))
}

const createDance = input => {
  const instructions = input.split(',').reduce((acc, instruction) => {
    let func = arr => arr
    if (instruction.startsWith('s')) {
      let [, val] = instruction.match(/^s(\d+)$/)
      val = parseInt(val, 10)
      func = arr => {
        arr.unshift(...arr.splice(arr.length - parseInt(val, 10)))
        return arr
      }
    } else if (instruction.startsWith('x')) {
      const [, aIndex, bIndex] = instruction.match(/^x(\d+)\/(\d+)$/)
      func = arr => {
        const [aName, bName] = [arr[aIndex], arr[bIndex]]
        arr[bIndex] = aName
        arr[aIndex] = bName
        return arr
      }
    } else if (instruction.startsWith('p')) {
      const [, aName, bName] = instruction.match(/^p(\w+)\/(\w+)$/)
      func = arr => {
        const [aIndex, bIndex] = [arr.indexOf(aName), arr.indexOf(bName)]
        arr[bIndex] = aName
        arr[aIndex] = bName
        return arr
      }
    }
    return acc.concat(func)
  }, [])
  return arr => {
    return instructions.reduce((prevArr, instruction) => {
      return instruction(prevArr.slice())
    }, arr)
  }
}

const danceRepeat = (input, repeat) => {
  const dance = createDance(input)
  const cache = {}
  let programs = getLetters(16)
  for (let i = 0; i < repeat; i++) {
    const from = programs.join(',')
    if (cache[from]) break
    programs = dance(programs)
    cache[from] = programs.slice()
  }
  const cacheLoop = Object.values(cache)
  const index = (repeat - 1) % cacheLoop.length
  return cacheLoop[index].join('')
}

const part1 = input => {
  return danceRepeat(input, 1)
}

// Part 2
// ======

const part2 = input => {
  return danceRepeat(input, 1e9)
}

exports.part1 = part1
exports.part2 = part2
