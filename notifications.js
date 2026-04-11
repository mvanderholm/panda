// Push notification functionality is disabled
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import Constants from 'expo-constants';
// import { Platform } from 'react-native';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export async function registerForPushNotifications() {
//   if (!Device.isDevice) {
//     console.log('Push notifications require a physical device');
//     return null;
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;

//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== 'granted') {
//     console.log('Push notification permission denied');
//     return null;
//   }

//   const projectId = Constants.expoConfig?.extra?.eas?.projectId;
//   const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
//   console.log('Expo Push Token:', token);

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//     });
//   }

//   return token;
// }
