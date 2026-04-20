import { Platform } from 'react-native';

let _analytics = null;
if (Platform.OS !== 'web') {
  try {
    _analytics = require('@react-native-firebase/analytics').default;
  } catch (_) {}
}

export default {
  track(event, props) {
    if (_analytics) {
      _analytics().logEvent(event, props || {});
    } else {
      console.log('[Analytics]', event, props || {});
    }
  },

  screen(screenName) {
    if (_analytics) {
      _analytics().logScreenView({ screen_name: screenName, screen_class: screenName });
    }
  },

  setUser(userId) {
    if (_analytics) {
      _analytics().setUserId(String(userId));
    }
  },
};
