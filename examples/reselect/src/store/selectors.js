import { createSelector } from 'reselect'

const goldenNumber = (1 + Math.sqrt(5)) / 2

// score will be calculated every 10 actions.increment calls
export const _score = createSelector(
  [state => Math.round(state.count / 10)],
  count => ({
    _score: Math.round(count * goldenNumber) * 100,
  }),
)
