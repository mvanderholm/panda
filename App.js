import { useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View } from 'react-native';
import { AuthProvider, useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBreakpoint } from './hooks/useBreakpoint';

import LoginScreen from './screens/LoginScreen';
import EnrollmentScreen from './screens/EnrollmentScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import HomeScreen from './screens/HomeScreen';
import MerchantsScreen from './screens/MerchantsScreen';
import MerchantDetailScreen from './screens/MerchantDetailScreen';
import RewardsScreen from './screens/RewardsScreen';
import RewardDetailScreen from './screens/RewardDetailScreen';
import RedemptionCodeScreen from './screens/RedemptionCodeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyCardScreen from './screens/MyCardScreen';

import LandingScreen from './screens/LandingScreen';
import LearnMoreScreen from './screens/LearnMoreScreen';
import FAQScreen from './screens/FAQScreen';
import ContactScreen from './screens/ContactScreen';
import WebHeader from './components/WebHeader';

export const navigationRef = createNavigationContainerRef();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MerchantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MerchantsList" component={MerchantsScreen} options={{ title: 'Merchants' }} />
      <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} options={{ title: 'Merchant Detail' }} />
    </Stack.Navigator>
  );
}

function RewardsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="RewardsList" component={RewardsScreen} options={{ title: 'My Rewards' }} />
      <Stack.Screen name="RewardDetail" component={RewardDetailScreen} options={{ title: 'Reward Detail' }} />
      <Stack.Screen name="RedemptionCode" component={RedemptionCodeScreen} options={{ title: 'Redemption Code' }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();
  const { isWide } = useBreakpoint();
  const isWeb = Platform.OS === 'web';

  // On wide web the WebHeader handles top-level nav — hide tab bar entirely.
  // On wide native (tablet) keep the sidebar.
  const hideTabs = isWeb && isWide;
  const showSidebar = !isWeb && isWide;

  return (
    <Tab.Navigator
      tabBarPosition={showSidebar ? 'left' : 'bottom'}
      screenOptions={{
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: hideTabs ? { display: 'none' } : showSidebar ? {
          width: 220,
          paddingTop: 24,
          paddingBottom: 24,
          backgroundColor: '#ffffff',
          borderRightWidth: 1,
          borderRightColor: '#e8e8e8',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        } : {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          height: 58 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: showSidebar ? 14 : 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
        tabBarItemStyle: showSidebar ? {
          justifyContent: 'flex-start',
          paddingLeft: 20,
          paddingVertical: 8,
          height: 52,
        } : {},
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Merchants" component={MerchantsStack}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} /> }} />
      <Tab.Screen name="My Card" component={MyCardScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="barcode-outline" size={size} color={color} /> }} />
      <Tab.Screen name="My Rewards" component={RewardsStack}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} /> }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }} />
    </Tab.Navigator>
  );
}

// All screens rendered inside NavigationContainer
function AuthGatedNavigator() {
  const { user } = useAuth();
  const isWeb = Platform.OS === 'web';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // ── Authenticated ────────────────────────────────────────────────
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen}
            options={{ headerShown: true, title: 'Privacy Policy' }} />
        </>
      ) : isWeb ? (
        // ── Unauthenticated web — landing page first ──────────────────────
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="LearnMore" component={LearnMoreScreen} />
          <Stack.Screen name="FAQ" component={FAQScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
          <Stack.Screen name="FindMerchants" component={MerchantsScreen} />
          <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Enrollment" component={EnrollmentScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen}
            options={{ headerShown: true, title: 'Privacy Policy' }} />
        </>
      ) : (
        // ── Unauthenticated native — login first ─────────────────────────
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Enrollment" component={EnrollmentScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen}
            options={{ headerShown: true, title: 'Privacy Policy' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppInner() {
  const [currentRoute, setCurrentRoute] = useState('Landing');
  const { isWide } = useBreakpoint();
  const isWeb = Platform.OS === 'web';

  const handleStateChange = () => {
    if (navigationRef.isReady()) {
      setCurrentRoute(navigationRef.getCurrentRoute()?.name ?? null);
    }
  };

  const navContainer = (
    <NavigationContainer ref={navigationRef} onStateChange={handleStateChange}>
      <AuthGatedNavigator />
    </NavigationContainer>
  );

  // Wide web: wrap with persistent header above the navigator
  if (isWeb && isWide) {
    return (
      <View style={{ flex: 1 }}>
        <WebHeader currentRoute={currentRoute} />
        <View style={{ flex: 1 }}>{navContainer}</View>
      </View>
    );
  }

  return navContainer;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
