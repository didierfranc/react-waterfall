import React from 'react'
import PropTypes from 'prop-types'
import Todo from './Todo'

const TodoList = ({ todos, toggleTodo, visibilityFilter }) => (
  <ul>
    {todos
      .filter(todo => {
        switch (visibilityFilter) {
          case 'SHOW_ALL':
            return true
          case 'SHOW_COMPLETED':
            return todo.completed
          case 'SHOW_ACTIVE':
            return !todo.completed
          default:
            throw new Error('Unknown filter: ' + visibilityFilter)
        }
      })
      .map(todo => (
        <Todo key={todo.id} {...todo} onClick={() => toggleTodo(todo)} />
      ))}
  </ul>
)

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      completed: PropTypes.bool.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  toggleTodo: PropTypes.func.isRequired,
}

export default TodoList
