import { v4 as uuid } from 'uuid'

export default {
  todos: [
    {
      id: uuid(),
      text: 'Write some Jest tests 😅',
      completed: false,
    },
    {
      id: uuid(),
      text: 'Fix eslint error 🚨',
      completed: true,
    },
  ],
  visibilityFilter: 'all',
}
