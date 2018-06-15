import React from 'react'
import { actions, connect } from '../store'

const Load = ({ movies: { loading, data } }) =>
  !data &&
  !loading && <button onClick={() => actions.getMovies()}>Load Movies</button>

export default connect(({ movies }) => ({ movies }))(Load)
