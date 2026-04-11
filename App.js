import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import LoginScreen from './screens/LoginScreen';
import EnrollmentScreen from './screens/EnrollmentScreen';
import HomeScreen from './screens/HomeScreen';
import MerchantsScreen from './screens/MerchantsScreen';
import MerchantDetailScreen from './screens/MerchantDetailScreen';
import MapScreen from './screens/MapScreen';
import RewardsScreen from './screens/RewardsScreen';
import RewardDetailScreen from './screens/RewardDetailScreen';
import RedemptionCodeScreen from './screens/RedemptionCodeScreen';
import ProfileScreen from './screens/ProfileScreen';
import MyCardScreen from './screens/MyCardScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MerchantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MerchantsList" component={MerchantsScreen} options={{ title: 'Merchants' }} />
      <Stack.Screen name="MerchantDetail" component={MerchantDetailScreen} options={{ title: 'Merchant Detail' }} />
      <Stack.Screen name="MerchantMap" component={MapScreen} options={{ title: 'Map' }} />
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
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarStyle: {
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
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Merchants"
        component={MerchantsStack}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="My Card"
        component={MyCardScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="barcode-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="My Rewards"
        component={RewardsStack}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="gift-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Enrollment" component={EnrollmentScreen} options={{ title: 'Create Account' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}