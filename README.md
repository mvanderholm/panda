# Panda Mobile

A mobile loyalty rewards app that helps consumers discover local merchants, earn points through purchases, and manage their rewards.

## Features

- **Home** — Personalized landing screen with quick-access tiles to all main sections
- **Merchants** — Browse participating merchants by category with color-coding and special promotions (e.g., 2X Points)
- **Merchant Details** — View address, contact info, website, and available perks per merchant
- **My Rewards** — Track earned and available rewards grouped by merchant, with expiration countdown timers
- **My Card** — Loyalty card screen with Code128 barcode and QR code toggle for POS scanning
- **Redemption Code** — Barcode and QR code toggle for redeeming rewards at the merchant
- **User Profile** — View member details and manage your account
- **Authentication** — Email/password login and new member enrollment via ColdFusion backend
- **Push Notifications** — Implemented via Expo (currently disabled)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (managed) |
| Navigation | React Navigation (native-stack + bottom-tabs) |
| Icons | @expo/vector-icons (Ionicons) |
| Auth | ColdFusion `UserLogin` CFC method + AsyncStorage session |
| Backend | Custom ColdFusion API (eport9.com) |
| Barcode | @kichiyaki/react-native-barcode-generator |
| QR Code | react-native-qrcode-svg |
| Notifications | Expo Notifications (disabled) |
| Local Storage | AsyncStorage |

## Project Structure

```
panda-mobile/
├── App.js                      # Root component, navigation setup
├── AuthContext.js              # Auth state & customerId context
├── firebase.js                 # Firebase initialization (disabled)
├── api.js                      # Backend API wrapper (ColdFusion CFC)
├── notifications.js            # Push notification setup (disabled)
├── screens/
│   ├── LoginScreen.js
│   ├── EnrollmentScreen.js
│   ├── HomeScreen.js
│   ├── MerchantsScreen.js
│   ├── MerchantDetailScreen.js
│   ├── RewardsScreen.js
│   ├── RewardDetailScreen.js
│   ├── RedemptionCodeScreen.js
│   ├── MyCardScreen.js
│   └── ProfileScreen.js
├── assets/                     # Icons and splash screens
└── app.json                    # Expo configuration
```

## Getting Started

### Prerequisites

- Node.js
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your device, or an Android/iOS simulator

### Install

```bash
npm install
```

### Run

```bash
# Start the Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run in browser
npm run web
```

## Authentication Flow

1. User logs in with email/password via the CFC `UserLogin` method
2. Credentials are Base64-encoded and sent as `authUser` / `authPassword`
3. On success, `customer_id` is returned and persisted in AsyncStorage
4. Session is restored from AsyncStorage on app launch
5. New users enroll via the CFC `MemberEnrollment` method (3-step form)

## Configuration

- **Backend API** — ColdFusion endpoint configured in [api.js](api.js)
- **Firebase** — configured in [firebase.js](firebase.js) but currently disabled in favour of CFC auth
- **Expo** — app name, package ID, icons, and orientation set in [app.json](app.json)
- **Push Notifications** — implemented but disabled; re-enable in [notifications.js](notifications.js) and [AuthContext.js](AuthContext.js)

## Android Package

`com.anonymous.pandamobile`

---

## Deployment

### Prerequisites

- [Expo account](https://expo.dev) (free)
- Apple Developer account ($99/yr) — required for iOS builds and TestFlight
- Google Play Console account ($25 one-time) — required for Android distribution
- EAS CLI installed globally:

```bash
npm install -g eas-cli
```

### Step 1 — Log in and configure EAS

```bash
eas login
eas build:configure
```

This generates an `eas.json` file in your project root.

### Step 2 — Build for both platforms

```bash
# Build for both iOS and Android (internal/preview profile — no store review needed)
eas build --platform all --profile preview
```

Or build separately:

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

> EAS will automatically manage your iOS provisioning profile/certificate and Android keystore.

### Step 3 — Submit to test tracks

**iOS — TestFlight**

```bash
eas submit --platform ios
```

Then in [App Store Connect](https://appstoreconnect.apple.com), go to **TestFlight** and invite testers by email.

**Android — Internal Testing**

```bash
eas submit --platform android
```

Then in Google Play Console, go to **Internal Testing** and add tester email addresses.

### Notes

- Confirm `bundleIdentifier` (iOS) and `package` (Android) are set correctly in `app.json` before building
- Preview builds can be distributed without going through App Store / Play Store review
- Production builds use `--profile production` and go through full store review
