import { Platform } from 'react-native';

let _crashlytics = null;
if (Platform.OS !== 'web') {
  try {
    _crashlytics = require('@react-native-firebase/crashlytics').default;
  } catch (_) {}
}

export function recordError(error) {
  if (_crashlytics) {
    _crashlytics().recordError(error instanceof Error ? error : new Error(String(error)));
  } else {
    console.error(error);
  }
}

export function log(message) {
  if (_crashlytics) _crashlytics().log(message);
}

export function setUserId(id) {
  if (_crashlytics) _crashlytics().setUserId(String(id));
}
