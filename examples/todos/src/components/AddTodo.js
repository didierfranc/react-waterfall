import React from 'react'
import { actions } from '../store'

const AddTodo = () => {
  const addTodo = e => {
    e.preventDefault()
    const { input } = e.target
    if (input.value) {
      actions.addTodo(input.value)
      input.value = ''
    }
  }

  return (
    <form onSubmit={addTodo} name="addTodo">
      <input name="input" />
      <button type="submit">+</button>
    </form>
  )
}

export default AddTodo
