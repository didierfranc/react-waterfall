import { initStore } from 'react-waterfall'
let nextTodoId = 2

const store = initStore({
  initialState: {
    todos: [
      {
        id: 1,
        text: 'Buy avocados 🥑',
        completed: false,
      },
    ],
    visibilityFilter: 'SHOW_ALL',
  },
  actions: {
    addTodo: ({ todos }, todo) => ({
      todos: todos.concat([
        {
          id: nextTodoId++,
          text: todo,
          completed: false,
        },
      ]),
    }),
    toggleTodo: ({ todos }, toggledTodo) => ({
      todos: todos.map(
        todo =>
          todo.id === toggledTodo.id
            ? { ...todo, completed: !todo.completed }
            : todo,
      ),
    }),
    setVisibilityFilter: ({ todos }, visibilityFilter) => ({
      visibilityFilter,
    }),
  },
})

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
}

export default store
