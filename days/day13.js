'use strict'

// Part 1
// ======

const createFirewall = input => {
  return input.split('\n').reduce((layers, line) => {
    const [depth, range] = line.split(':').map(Number)
    layers[depth] = range
    return layers
  }, [])
}

const didCollide = (depth, range, delay = 0) => {
  return (depth + delay) % ((range - 1) * 2) === 0
}

const part1 = input => {
  return createFirewall(input).reduce((severity, range, depth) => {
    if (didCollide(depth, range)) severity += range * depth
    return severity
  }, 0)
}

// Part 2
// ======

const part2 = input => {
  const firewall = createFirewall(input)
  let delay = 0
  let searching = true
  while (searching) {
    searching = firewall.some((range, depth) => {
      if (didCollide(depth, range, delay)) {
        delay++
        return true
      }
    })
  }
  return delay
}

exports.part1 = part1
exports.part2 = part2
