import { View, ScrollView, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

export default function MerchantFilterChips({ merchants, selected, onChange }) {
  if (!merchants || merchants.length < 2) return null;
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <TouchableOpacity
          style={[styles.chip, !selected && styles.chipActive]}
          onPress={() => onChange(null)}
          activeOpacity={0.7}
        >
          <Text style={[styles.chipText, !selected && styles.chipTextActive]}>All</Text>
        </TouchableOpacity>

        {merchants.map(m => (
          <TouchableOpacity
            key={m.id}
            style={[styles.chip, selected === m.id && styles.chipActive]}
            onPress={() => onChange(selected === m.id ? null : m.id)}
            activeOpacity={0.7}
          >
            {m.id && (
              <Image
                source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${m.id}_7.gif` }}
                style={styles.chipLogo}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.chipText, selected === m.id && styles.chipTextActive]} numberOfLines={1}>
              {m.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  chipActive: {
    backgroundColor: '#1a2a4a',
  },
  chipLogo: {
    width: 16,
    height: 16,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  chipTextActive: {
    color: '#ffffff',
  },
});
