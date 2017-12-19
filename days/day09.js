'use strict'

// Part 1
// ======

const defaultReducers = {
  onGarbage: acc => acc,
  onGroupStart: acc => acc,
  onGroupEnd: acc => acc
}

const runStream = (
  input,
  {
    onGarbage = defaultReducers.onGarbage,
    onGroupStart = defaultReducers.onGroupStart,
    onGroupEnd = defaultReducers.onGroupEnd
  } = {},
  initialState
) => {
  return input.split('').reduce(
    (state, char) => {
      if (state.ignoreNext) return { ...state, ignoreNext: false }
      if (char === '!') return { ...state, ignoreNext: true }
      if (state.isGarbage) {
        if (char === '>') return { ...state, isGarbage: false }
        return { ...state, innerState: onGarbage(state.innerState, char) }
      }
      if (char === '<') return { ...state, isGarbage: true }
      if (char === '{') {
        return { ...state, innerState: onGroupStart(state.innerState, char) }
      }
      if (char === '}') {
        return { ...state, innerState: onGroupEnd(state.innerState, char) }
      }
      return state
    },
    {
      isGarbage: false,
      ignoreNext: false,
      innerState: initialState
    }
  ).innerState
}

const part1 = input => {
  return runStream(
    input,
    {
      onGroupStart: state => ({
        score: state.score + state.nestedGroups + 1,
        nestedGroups: state.nestedGroups + 1
      }),
      onGroupEnd: state => ({
        score: state.score,
        nestedGroups: state.nestedGroups - 1
      })
    },
    { score: 0, nestedGroups: 0 }
  ).score
}

// Part 2
// ======

const part2 = input => {
  return runStream(input, { onGarbage: garbageCount => garbageCount + 1 }, 0)
}

exports.part1 = part1
exports.part2 = part2
