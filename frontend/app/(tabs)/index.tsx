import { Image, StyleSheet, Platform } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '@/config';

console.log("API URL:", API_URL);

export default function HomeScreen() {
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/`)
      .then(response => setApiMessage(response.data.message))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <ThemedView style={styles.welcome}>
      <ThemedText style={styles.title}>{apiMessage}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  welcome: {
    flex: 1, // Take full screen height
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    color: "black",
  },
});
