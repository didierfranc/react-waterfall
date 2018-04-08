import React from 'react'
import { connect } from 'react-waterfall'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import TodoList from '../components/TodoList'

const App = ({ todos, visibilityFilter, actions }) => (
  <div>
    <AddTodo addTodo={actions.addTodo} />
    <TodoList
      todos={todos}
      toggleTodo={actions.toggleTodo}
      visibilityFilter={visibilityFilter}
    />
    <Footer
      setVisibilityFilter={actions.setVisibilityFilter}
      visibilityFilter={visibilityFilter}
    />
  </div>
)

export default connect(state => ({
  todos: state.todos,
  visibilityFilter: state.visibilityFilter,
}))(App)
