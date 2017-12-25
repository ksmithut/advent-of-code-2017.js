'use strict'

// Part 1
// ======

const partition = (arr, newPartition) => {
  return arr.reduce((partitions, item, i) => {
    if (newPartition(item, i)) partitions.push([])
    partitions[partitions.length - 1].push(item)
    return partitions
  }, [])
}

const reduceAmount = (amount, reducer, initialValue) => {
  let value = initialValue
  for (let i = 0; i < amount; i++) {
    value = reducer(value, i)
  }
  return value
}

const currentValueEquals = val => {
  return state => {
    return (state.tape[state.slot] || 0) === val
  }
}

const writeValue = val => {
  return state => {
    state.tape[state.slot] = val
    return state
  }
}

const move = (amount, direction) => {
  amount = direction === 'right' ? amount : -amount
  return state => {
    state.slot += amount
    return state
  }
}

const nextState = stateId => {
  return state => {
    state.currentState = stateId
    return state
  }
}

const parseConditions = conditionInstructions => {
  const [, conditionValue] = conditionInstructions
    .shift()
    .match(/If the current value is (\d+):/)
  const condition = currentValueEquals(Number(conditionValue))
  const instructions = conditionInstructions.map(line => {
    if (/Write the value (\d+)./.test(line)) {
      const [, value] = line.match(/Write the value (\d+)./)
      return writeValue(Number(value))
    }
    if (/Move one slot to the (\w+)./.test(line)) {
      const [, amount, direction] = line.match(/Move (\w+) slot to the (\w+)./)
      // TODO ignore amount, amount is in written language, not numeric, and all
      // of them are "one" for the input
      return move(1, direction)
    }
    if (/Continue with state (\w+)./.test(line)) {
      const [, stateId] = line.match(/Continue with state (\w+)./)
      return nextState(stateId)
    }
    throw new Error(`unknown instruction, "${line}"`)
  })
  return { condition, instructions }
}

const parseInput = input => {
  const [initialStateInfo, ...stateInstructions] = input.split('\n\n')
  const [, beginningState] = initialStateInfo.match(/Begin in state (\w+)/)
  const [, steps] = initialStateInfo.match(
    /Perform a diagnostic checksum after (\d+) steps/
  )
  const states = stateInstructions.reduce(
    (instructionsByState, stateInstruction) => {
      const lines = stateInstruction.split('\n')
      const [, state] = lines.shift().match(/In state (\w+):/)
      const instructions = partition(lines, line =>
        /If the current value/.test(line)
      ).map(parseConditions)
      instructionsByState[state] = instructions
      return instructionsByState
    },
    {}
  )
  return {
    beginningState,
    steps: Number(steps),
    states
  }
}

const part1 = input => {
  const { beginningState, steps, states } = parseInput(input)
  const endState = reduceAmount(
    steps,
    state => {
      return states[state.currentState]
        .find(action => action.condition(state))
        .instructions.reduce((state, instruction) => instruction(state), state)
    },
    {
      currentState: beginningState,
      tape: {},
      slot: 0
    }
  )
  return Object.values(endState.tape).filter(Boolean).length
}

// Part 2
// ======

const part2 = input => {
  return 'You did it!'
}

exports.part1 = part1
exports.part2 = part2
