import React, { Component } from 'react'
import { actions, connect } from './store'

class App extends Component {
  render() {
    return (
      <div>
        <button onClick={actions.increment}>+</button>
        {this.props.state._score}
      </div>
    )
  }
}

export default connect(['_score'])(App)
