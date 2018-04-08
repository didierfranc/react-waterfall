import React, { Component } from 'react'
import { connect } from 'react-waterfall'

class App extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.actions.increment}>+</button>
        {this.props.score}
      </div>
    )
  }
}

export default connect(state => ({ score: state._score }))(App)
