import React from 'react'
import { connect, actions } from '../store'

const Todo = ({ completed, id, text }) => (
  <li
    style={{
      textDecoration: completed ? 'line-through' : 'none',
    }}
    onClick={() => actions.toggle(id)}
  >
    {text}
  </li>
)

const TodoList = ({ todos, visibilityFilter }) => (
  <ul>
    {todos
      .filter(todo =>
          (visibilityFilter === 'all'
            ? true
            : visibilityFilter === 'completed'
              ? todo.completed
              : !todo.completed))
      .map(props => <Todo {...props} key={props.id} />)}
  </ul>
)

export default connect(state => state)(TodoList)
