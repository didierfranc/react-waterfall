import { v4 as uuid } from 'uuid'

export default {
  addTodo: ({ todos }, _a, todo) => ({
    todos: [
      ...todos,
      {
        id: uuid(),
        text: todo,
        completed: false,
      },
    ],
  }),
  toggle: ({ todos }, _a, selected) => ({
    todos: todos.map(todo =>
      (todo.id === selected ? { ...todo, completed: !todo.completed } : todo)),
  }),
  setVisibilityFilter: (_s, _a, visibilityFilter) => ({
    visibilityFilter,
  }),
}
