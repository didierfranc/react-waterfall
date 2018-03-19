import React from 'react'
import { Consumer } from '../store'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import TodoList from '../components/TodoList'

const App = () => (
  <Consumer select={['todos', 'visibilityFilter']}>
    {({ state, actions }) => {
      return (
        <div>
          <AddTodo addTodo={actions.addTodo} />
          <TodoList
            todos={state.todos}
            toggleTodo={actions.toggleTodo}
            visibilityFilter={state.visibilityFilter}
          />
          <Footer
            setVisibilityFilter={actions.setVisibilityFilter}
            visibilityFilter={state.visibilityFilter}
          />
        </div>
      )
    }}
  </Consumer>
)

export default App
