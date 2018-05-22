import { v4 as uuid } from 'uuid'

export default {
  addTodo: ({ todos }, todo) => ({
    todos: [
      ...todos,
      {
        id: uuid(),
        text: todo,
        completed: false,
      },
    ],
  }),
  toggle: ({ todos }, selected) => ({
    todos: todos.map(todo =>
      (todo.id === selected ? { ...todo, completed: !todo.completed } : todo)),
  }),
  setVisibilityFilter: (_, visibilityFilter) => ({
    visibilityFilter,
  }),
}
