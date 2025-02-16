import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, 
  Keyboard, TouchableWithoutFeedback 
} from "react-native";

const AuthenticationScreen = () => {
  const [code, setCode] = useState(["", "", "", "", ""]); // ✅ Only 5 digits

  const handleVerify = () => {
    console.log("Verifying code:", code.join(""));
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require("@/assets/images/clara-logo.png")} style={styles.illustration} />

        {/* Title */}
        <Text style={styles.title}>Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>Enter the five-digit code from your authentication app</Text>

        {/* Code Input Fields */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.codeInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleCodeChange(index, value)}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>

        {/* Help Text */}
        <Text style={styles.helpText}>Having trouble getting the code?</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  illustration: { width: 250, height: 180, marginBottom: 20, resizeMode: "contain" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#777", textAlign: "center", marginBottom: 20 },
  codeContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  codeInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
    backgroundColor: "#f9f9f9",
  },
  verifyButton: { width: 300, backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20 },
  verifyButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  helpText: { fontSize: 14, color: "#007bff", marginTop: 10 },
});

export default AuthenticationScreen;