import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard, TouchableWithoutFeedback 
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { useNavigation } from "@react-navigation/native"; // Import navigation

const LoginScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation(); // Get navigation object

  const COLORS = {
    cream: "#FEF9D9",
    sage: "#DEE5D4",
    lightBlue: "#D2E0FB",
    blueGray: "#8EACCD",
    white: "#FFFFFF",
    darkSage: "#B0BAA5",
    darkBlueGray: "#5D7A99",
  };

  useEffect(() => {
    // Hide tab bar when entering the screen
    navigation.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      // Restore tab bar when leaving the screen
      navigation.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  const handleLogin = () => {
    console.log("Logging in with:", email, password);
    // Handle authentication logic here
    // Navigate to the authentication page
    navigation.navigate("authentication"); // Replace "Authentication" with the name of your authentication screen
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Back Arrow */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
  <Ionicons name="chevron-back" size={24} color={COLORS.blueGray} />
</TouchableOpacity>


        {/* Logo */}
        <Image source={require("@/assets/images/clara-logo.png")} style={styles.logo} />

        {/* Login Title */}
        <Text style={styles.title}>Caregiver Login</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#8EACCD" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8EACCD"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#8EACCD" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8EACCD"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE5D4", // Light green background
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    shadowColor: "#8EACCD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  
  logo: {
    width: 250,
    height: 180,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#8EACCD", // Muted blue text to match the theme
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: "#8EACCD", // Light blue border
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FEF9D9", // Light yellow background
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#000", // Black text
  },
  loginButton: {
    width: 300,
    backgroundColor: "#8EACCD", // Light blue button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff", // White text
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default LoginScreen;