let id = 0

export default ({ initialState }, self) => {
  const reduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__

  const instanceID = id
  id += 1

  const name = `react-waterfall - ${instanceID}`
  const features = {
    jump: true,
  }

  const devTools = reduxDevTools.connect({ name, features })

  devTools.subscribe(data => {
    switch (data.type) {
      case 'START':
        devTools.init(initialState)
        break
      case 'RESET':
        self.setState(initialState)
        break
      case 'DISPATCH':
        switch (data.payload.type) {
          case 'JUMP_TO_STATE':
          case 'JUMP_TO_ACTION': {
            self.setState(JSON.parse(data.state))
            break
          }
          default:
            break
        }
        break
      default:
        break
    }
  })

  return (action, ...arg) => {
    devTools.send({ type: action, ...arg }, self.state, {}, instanceID)
  }
}
