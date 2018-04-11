import React, { forwardRef } from 'react'
import Consumer from './Consumer'

const connect: Function = mapStateToProps => WrappedComponent => {
  const ConnectComponent = forwardRef((props, ref) =>
    <Consumer context={props.context} mapStateToProps={mapStateToProps}>
      {injectedProps => <WrappedComponent {...props} {...injectedProps} ref={ref} />}
    </Consumer>,
  )

  ConnectComponent.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name || 'Unknown'})`
  return ConnectComponent
}

export default connect
