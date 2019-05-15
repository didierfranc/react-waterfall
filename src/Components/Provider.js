// @flow
/* eslint-disable no-undef */

import React from 'react'

import type { CreateProvider, State } from '../types'

type Props = { children: React$Node, initialState: {} }

const EnhancedProvider: CreateProvider = (
  setProvider,
  Provider,
  initialState,
) =>
  class EnhancedProvider extends React.Component<Props, State> {
    constructor(props) {
      super(props)
      this.state = props.initialState || initialState
      setProvider(this)
    }

    render() {
      return <Provider value={this.state}>{this.props.children}</Provider>
    }
  }

export default EnhancedProvider
