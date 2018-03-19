import React from 'react'
import Link from '../components/Link'
import { VisibilityFilters } from '../store'

const Footer = ({ setVisibilityFilter, visibilityFilter }) => (
  <div>
    <span>Show: </span>
    <Link
      onClick={() => setVisibilityFilter(VisibilityFilters.SHOW_ALL)}
      active={visibilityFilter === VisibilityFilters.SHOW_ALL}
    >
      All
    </Link>
    <Link
      onClick={() => setVisibilityFilter(VisibilityFilters.SHOW_ACTIVE)}
      active={visibilityFilter === VisibilityFilters.SHOW_ACTIVE}
    >
      Active
    </Link>
    <Link
      onClick={() => setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED)}
      active={visibilityFilter === VisibilityFilters.SHOW_COMPLETED}
    >
      Completed
    </Link>
  </div>
)

export default Footer
