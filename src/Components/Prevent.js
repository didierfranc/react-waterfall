// @flow
/* eslint-disable no-undef */

import { PureComponent } from 'react'

type Props = {
  renderComponent: ({}) => React$Node,
}

export default class Prevent extends PureComponent<Props> {
  render() {
    const { renderComponent, ...rest } = this.props
    return renderComponent(rest)
  }
}
