import React from 'react'
import { connect } from '../store'

const Movies = ({ movies }) =>
  (movies.data
    ? movies.data.map(movie => <img src={movie.poster} alt={movie.name} />)
    : movies.loading
      ? '...'
      : null)

export default connect(({ movies }) => ({ movies }))(Movies)
