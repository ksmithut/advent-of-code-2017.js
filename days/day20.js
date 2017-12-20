'use strict'

// Part 1
// ======

const parseParticle = line => {
  return line.split(', ').reduce((particle, property) => {
    const [key, rawValue] = property.split('=')
    const [x, y, z] = rawValue
      .replace(/^<(.*)>$/, '$1')
      .split(',')
      .map(Number)
    particle[key] = { x, y, z }
    return particle
  }, {})
}

const distance = ({ x, y, z }) => {
  return [x, y, z].map(Math.abs).reduce((a, b) => a + b)
}

const part1 = input => {
  const particles = input
    .split('\n')
    .map((line, index) => ({
      particle: parseParticle(line),
      index
    }))
    .sort((a, b) => {
      return (
        distance(a.particle.a) - distance(b.particle.a) ||
        distance(a.particle.v) - distance(b.particle.v) ||
        distance(a.particle.p) - distance(b.particle.p)
      )
    })
  return particles[0].index
}

// Part 2
// ======

const nextPosition = particle => {
  const a = { ...particle.a }
  const v = {
    x: particle.v.x + particle.a.x,
    y: particle.v.y + particle.a.y,
    z: particle.v.z + particle.a.z
  }
  const p = {
    x: particle.p.x + v.x,
    y: particle.p.y + v.y,
    z: particle.p.z + v.z
  }
  return { a, v, p }
}

const part2 = input => {
  const particles = input.split('\n').map(parseParticle)
  let particleTracers = particles.map((particle, index) => ({
    index,
    particle,
    get key () {
      const { x, y, z } = this.particle.p
      return `${x}:${y}:${z}`
    }
  }))
  for (let i = 0; i < 100; i++) {
    particleTracers.forEach(
      tracer => (tracer.particle = nextPosition(tracer.particle))
    )
    let toRemove = {}
    particleTracers = particleTracers.filter((tracer, i) => {
      if (toRemove[tracer.key]) return false
      const collision = particleTracers.find((checkTracer, subI) => {
        if (i === subI) return false
        return tracer.key === checkTracer.key
      })
      if (collision) {
        toRemove[tracer.key] = true
        return false
      }
      return true
    })
  }
  return particleTracers.length
}

exports.part1 = part1
exports.part2 = part2
