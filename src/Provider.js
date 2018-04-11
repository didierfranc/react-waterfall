// @flow
import React from 'react'

export default class Provider extends React.Component<*> {
  constructor(props) {
    super(props)
    const { store } = props
    this.state = store.initialState
    this.value = { actions: store.actions, state: this.state }
    store.attach(this)
  }

  render() {
    const { store } = this.props
    if (this.state !== this.value.state) {
      // If state was changed then recreate `this.value` so it will have a different reference
      // Explained here: https://reactjs.org/docs/context.html#caveats
      this.value = { actions: store.actions, state: this.state }
    }

    return (
      <store.context.Provider value={this.value}>
        {React.Children.map(this.props.children, child => React.cloneElement(child, { context: store.context }), {})}
      </store.context.Provider>
    )
  }
}
