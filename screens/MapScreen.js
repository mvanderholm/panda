import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ route }) {
  const { name, address, city, state, zip } = route.params;
  const fullAddress = `${address}, ${city}, ${state} ${zip}`.trim();

  const [coords, setCoords] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const query = encodeURIComponent(fullAddress);
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
      headers: { 'User-Agent': 'PinPointApp/1.0' }
    })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setCoords({
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          });
        } else {
          setError('Location not found.');
        }
      })
      .catch(() => setError('Could not load map.'));
  }, []);

  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.error}>{error}</Text>
    </View>
  );

  if (!coords) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#1a73e8" />
      <Text style={styles.loadingText}>Finding location...</Text>
    </View>
  );

  const region = {
    ...coords,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker coordinate={coords} title={name} description={fullAddress} />
      </MapView>
      <View style={styles.addressBar}>
        <Text style={styles.addressName}>{name}</Text>
        <Text style={styles.addressText}>{fullAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#888' },
  error: { fontSize: 14, color: 'red' },
  addressBar: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addressName: { fontSize: 15, fontWeight: '700', color: '#1a2a4a', marginBottom: 2 },
  addressText: { fontSize: 13, color: '#666' },
});
