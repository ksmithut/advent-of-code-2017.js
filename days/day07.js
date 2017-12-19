'use strict'

// Part 1
// ======

const createTree = input => {
  const parentLookup = {}
  const nodes = input.split('\n').reduce((nodes, line) => {
    const [, name, value, , children = ''] = line.match(
      /^(\w+) \((\d+)\)( -> (.*))?$/
    )
    const childrenNames = children.split(', ').filter(Boolean)
    const node = {
      name,
      value: parseInt(value, 10),
      get combinedValue () {
        return node.children.reduce((total, child) => {
          return total + child.combinedValue
        }, node.value)
      },
      get siblings () {
        if (!node.parent) return []
        return node.parent.children.filter(child => child !== node)
      },
      get children () {
        return childrenNames.map(child => nodes[child])
      },
      get parent () {
        return parentLookup[name] || null
      }
    }
    childrenNames.forEach(childName => {
      parentLookup[childName] = node
    })
    nodes[name] = node
    return nodes
  }, {})
  return Object.values(nodes).find(node => !node.parent)
}

const part1 = input => createTree(input).name

// Part 2
// ======

const printTree = (node, depth = 0) => {
  const prefix = ' '.repeat(depth * 2)
  console.log(`${prefix}(${node.combinedValue}) - ${node.name}`)
  node.children.forEach(child => printTree(child, depth + 1))
}

const findUnbalancedNode = node => {
  const childrenByValue = node.children.reduce((byValue, child) => {
    const value = child.combinedValue
    byValue[value] = (byValue[value] || []).concat(child)
    return byValue
  }, {})
  switch (node.children.length) {
    case 0:
      return null
    case 1:
      return findUnbalancedNode(node.children[0])
    case 2:
      return node.children.children.map(findUnbalancedNode).find(node => node)
    default:
      const values = Object.values(childrenByValue)
      if (values.length === 1) return node
      const differentNode = values.find(nodes => nodes.length === 1)
      return findUnbalancedNode(differentNode[0])
  }
}

const part2 = input => {
  const root = createTree(input)
  const unbalancedNode = findUnbalancedNode(root)

  return (
    unbalancedNode.value -
    (unbalancedNode.combinedValue - unbalancedNode.siblings[0].combinedValue)
  )
}

exports.part1 = part1
exports.part2 = part2
