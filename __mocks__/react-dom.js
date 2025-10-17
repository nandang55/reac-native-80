// Mock react-dom for React Native
// React Query v4 tries to import react-dom, but it's not needed in React Native

export const unstable_batchedUpdates = (callback) => {
  callback();
};

export default {
  unstable_batchedUpdates
};

