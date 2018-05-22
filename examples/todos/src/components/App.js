import React from 'react'
import { Provider } from '../store'

import TodoList from './TodoList'
import AddTodo from './AddTodo'
import VisibilityFilter from './VisibilityFilter'

const App = () => (
  <Provider>
    <TodoList />
    <AddTodo />
    <VisibilityFilter />
  </Provider>
)

export default App
