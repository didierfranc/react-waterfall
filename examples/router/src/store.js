import { initStore } from 'react-waterfall';

const store = {
  initialState: {
    greeting: 'Hi ',
  },
  actions: {
    changeGreeting: (_, greeting) => ({
      greeting,
    }),
  },
};

export default initStore(store);
