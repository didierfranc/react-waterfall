import createStore from 'react-waterfall'
import movies from './movies.json'

const fakeFetch = () =>
  new Promise(resolve => setTimeout(() => resolve(movies), 1000))

const config = {
  initialState: {
    movies: {
      loading: false,
    },
  },
  actionsCreators: {
    getMovies: async (_, actions, trigger) => {
      if (!trigger) await actions.getMovies(true)
      else return { movies: { loading: true } }

      const data = await fakeFetch()
      return { movies: { loading: false, data } }
    },
  },
}

export const { Provider, connect, actions } = createStore(config)
