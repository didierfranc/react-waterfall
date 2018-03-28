import React from 'react'
import { Consumer } from '../store'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import TodoList from '../components/TodoList'

const App = () => (
  <Consumer mapStateToProps={state => ({ todos: state.todos, visibilityFilter: state.visibilityFilter })}>
    {({ todos, visibilityFilter, actions }) => {
      return (
        <div>
          <AddTodo addTodo={actions.addTodo} />
          <TodoList
            todos={todos}
            toggleTodo={actions.toggleTodo}
            visibilityFilter={state.visibilityFilter}
          />
          <Footer
            setVisibilityFilter={actions.setVisibilityFilter}
            visibilityFilter={visibilityFilter}
          />
        </div>
      )
    }}
  </Consumer>
)

export default App
