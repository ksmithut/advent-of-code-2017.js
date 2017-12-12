'use strict'

// Part 1
// ======

class Graph {
  constructor (input) {
    this.nodes = {}
    input.split('\n').forEach(line => {
      let [, source, connections] = line.match(/(\d+) <-> (.+)/)
      this.addNode(source, connections.split(', '))
    })
  }
  getNode (name) {
    this.nodes[name] = this.nodes[name] || new Node(name)
    return this.nodes[name]
  }
  addNode (name, links) {
    const node = this.getNode(name)
    links.forEach(link => {
      const linkNode = this.getNode(link)
      node.addLink(linkNode)
      linkNode.addLink(node)
    })
    return this
  }
  forEach (fn) {
    Object.entries(this.nodes).forEach(([key, value]) => fn(value, key))
  }
}

class Node {
  constructor (name) {
    this.name = name
    this.links = new Set()
  }
  addLink (link) {
    this.links.add(link)
  }
}

const visitNode = (node, visited = {}) => {
  if (visited[node.name]) return visited
  visited[node.name] = true
  node.links.forEach(link => {
    visited = visitNode(link, visited)
  })
  return visited
}

const part1 = input => {
  const graph = new Graph(input)
  const visited = visitNode(graph.nodes['0'])
  return Object.keys(visited).length
}

// Part 2
// ======

const part2 = input => {
  const rootVisited = {}
  const groups = []
  const graph = new Graph(input)
  graph.forEach((node, name) => {
    if (rootVisited[name]) return
    const visited = visitNode(node)
    groups.push(visited)
    Object.assign(rootVisited, visited)
  })
  return groups.length
}

module.exports = { part1, part2 }
