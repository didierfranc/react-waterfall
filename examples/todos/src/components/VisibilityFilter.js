import React from 'react'
import { connect, actions } from '../store'

const VisibilityFilter = ({ visibilityFilter }) =>
  ['all', 'active', 'completed'].map(filter => (
    <button
      key={filter}
      onClick={() => actions.setVisibilityFilter(filter)}
      style={{ fontWeight: visibilityFilter === filter ? 'bold' : 'normal' }}
    >
      {filter}
    </button>
  ))

export default connect(({ visibilityFilter }) => ({ visibilityFilter }))(VisibilityFilter)
