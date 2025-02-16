import { Image, StyleSheet, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import { useNavigation } from 'expo-router';
import { useRouter } from 'expo-router'; // ✅ Import useRouter

export default function HomeScreen() {
  const [apiMessage, setApiMessage] = useState('');
  const navigation = useNavigation(); // ✅ Call the hook correctly
  const router = useRouter(); // ✅ Initialize the router

  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: "none" },
      headerShown: false, // ✅ Correct usage of setOptions
    });
  }, [navigation]); // ✅ Dependency is navigation, not useNavigation

  useEffect(() => {
    axios
      .get(`${API_URL}/`)
      .then((response) => setApiMessage(response.data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <ThemedView style={styles.welcome}>
      {/* Voice Button */}
      <TouchableOpacity style={styles.voiceButton}>
        <MaterialIcons name="volume-up" style={styles.voiceIcon} />
      </TouchableOpacity>

      {/* Centered Title */}
      <ThemedText style={styles.title}>Hello Patient</ThemedText>

      {/* Centered Logo */}
      <Image source={require('@/assets/images/clara-logo.png')} style={styles.logo} />

      {/* Centered Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/clara')} // ✅ Navigate to Clara.tsx
      >
        <Text style={styles.buttonText}>Get Started With Clara</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

// ✅ Calculate dimensions outside StyleSheet.create()
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height, // Ensure full height
    overflow: 'hidden',
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: width * 0.1, // 10% of screen width
    fontWeight: '700',
    color: '#8EACCD',
    textAlign: 'center',
    paddingTop: 40,
  },
  logo: {
    width: width * 0.6, // 60% of screen width
    height: width * 0.6, // Maintain aspect ratio
    resizeMode: 'contain',
  },
  button: {
    width: 'auto', // Allows button to size based on content
    minWidth: width * 0.5, // Ensures a minimum size
    height: height * 0.07, // 7% of screen height
    backgroundColor: '#8EACCD',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20, // ✅ Adds space on left & right of text
    paddingVertical: 12, // ✅ Adds space on top & bottom
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    shadowOffset: { width: 0, height: 2 },
  },
  voiceButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.05 : height * 0.04, // Adjust based on platform
    right: width * 0.05, // 5% from the right
    width: width * 0.13, // 13% of screen width
    height: width * 0.13, // Keep it circular
    backgroundColor: '#8EACCD',
    borderRadius: width * 0.065, // Half of width to keep it circular
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  voiceIcon: {
    fontSize: width * 0.08, // Scale icon size dynamically
    color: '#FFFFFF',
  },
});
