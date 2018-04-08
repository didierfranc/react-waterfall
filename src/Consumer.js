import React from 'react'

class Prevent extends React.PureComponent<*> {
  render() {
    const { _children, ...rest } = this.props
    return _children()(rest)
  }
}

export default class Consumer extends React.Component<*> {
  // We do this so the sCU of Prevent will ignore the children prop
  _children = () => this.props.children

  prevent = ({ state, actions }) => {
    const { mapStateToProps } = this.props
    return (
      <Prevent {...mapStateToProps(state)} actions={actions} _children={this._children} />
    )
  }

  render() {
    const { context } = this.props
    return (
      <context.Consumer>
        {this.prevent}
      </context.Consumer>
    )
  }
}
