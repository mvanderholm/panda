import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../AuthContext';
import { navigationRef } from '../App';

// Maps current React Navigation route names to which header nav item should appear active
const UNAUTH_ACTIVE_MAP = {
  Landing:        'home',
  LearnMore:      'learn',
  FindMerchants:  'merchants',
  MerchantDetail: 'merchants',
  Contact:        'contact',
  Login:          'login',
  Enrollment:     'enroll',
  ForgotPassword: 'login',
};

const AUTH_ACTIVE_MAP = {
  Home:           'home',
  Main:           'home',
  Merchants:      'merchants',
  MerchantsList:  'merchants',
  MerchantDetail: 'merchants',
  'My Card':      'card',
  'My Rewards':   'rewards',
  RewardsList:    'rewards',
  RewardDetail:   'rewards',
  RedemptionCode: 'rewards',
  Profile:        'profile',
};

function NavLink({ label, active, onPress }) {
  return (
    <TouchableOpacity style={styles.navLink} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.navLinkText, active && styles.navLinkActive]}>{label}</Text>
      {active && <View style={styles.navLinkUnderline} />}
    </TouchableOpacity>
  );
}

function NavButton({ label, variant = 'outline', onPress }) {
  return (
    <TouchableOpacity
      style={[styles.navBtn, variant === 'fill' ? styles.navBtnFill : styles.navBtnOutline]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.navBtnText, variant === 'fill' ? styles.navBtnTextFill : styles.navBtnTextOutline]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function nav(screen, params) {
  if (navigationRef.isReady()) navigationRef.navigate(screen, params);
}

export default function WebHeader({ currentRoute }) {
  const { user, logout } = useAuth();
  const activeKey = user
    ? (AUTH_ACTIVE_MAP[currentRoute] ?? null)
    : (UNAUTH_ACTIVE_MAP[currentRoute] ?? null);

  return (
    <View style={styles.header}>
      <View style={styles.inner}>

        {/* Logo */}
        <TouchableOpacity onPress={() => nav(user ? 'Home' : 'Landing')} activeOpacity={0.8}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Nav links */}
        <View style={styles.navLinks}>
          {user ? (
            // ── Authenticated nav ──────────────────────────────────────────
            <>
              <NavLink label="Home"       active={activeKey === 'home'}     onPress={() => nav('Home')} />
              <NavLink label="Merchants"  active={activeKey === 'merchants'} onPress={() => nav('Merchants')} />
              <NavLink label="My Card"    active={activeKey === 'card'}     onPress={() => nav('My Card')} />
              <NavLink label="My Rewards" active={activeKey === 'rewards'}  onPress={() => nav('My Rewards')} />
              <NavLink label="Profile"    active={activeKey === 'profile'}  onPress={() => nav('Profile')} />
            </>
          ) : (
            // ── Unauthenticated nav ────────────────────────────────────────
            <>
              <NavLink label="Learn More"     active={activeKey === 'learn'}     onPress={() => nav('LearnMore')} />
              <NavLink label="Find Merchants" active={activeKey === 'merchants'} onPress={() => nav('FindMerchants')} />
              <NavLink label="Contact"        active={activeKey === 'contact'}   onPress={() => nav('Contact')} />
            </>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {user ? (
            <NavButton label="Sign Out" variant="outline" onPress={logout} />
          ) : (
            <>
              <NavButton label="Get a Free Card" variant="fill"    onPress={() => nav('Enrollment')} />
              <NavButton label="Log In"          variant="outline" onPress={() => nav('Login')} />
            </>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 32,
    height: 68,
    gap: 8,
  },

  logo: {
    width: 160,
    height: 44,
    marginRight: 16,
  },

  navLinks: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: 'relative',
    alignItems: 'center',
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  navLinkActive: {
    color: '#1a73e8',
    fontWeight: '700',
  },
  navLinkUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 14,
    right: 14,
    height: 2,
    backgroundColor: '#1a73e8',
    borderRadius: 1,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 16,
  },
  navBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  navBtnOutline: {
    borderColor: '#1a73e8',
    backgroundColor: 'transparent',
  },
  navBtnFill: {
    borderColor: '#1a73e8',
    backgroundColor: '#1a73e8',
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navBtnTextOutline: {
    color: '#1a73e8',
  },
  navBtnTextFill: {
    color: '#ffffff',
  },
});
