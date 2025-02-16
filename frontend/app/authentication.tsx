import React, { useState, useRef } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, 
  Keyboard, TouchableWithoutFeedback, StatusBar, NativeSyntheticEvent, TextInputKeyPressEventData
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  cream: "#FEF9D9",
  sage: "#DEE5D4",
  lightBlue: "#D2E0FB",
  blueGray: "#8EACCD",
  white: "#FFFFFF",
  darkSage: "#B0BAA5",
  darkBlueGray: "#5D7A99",
};

const AuthenticationScreen = () => {
  const navigation = useNavigation(); // ✅ Moved inside the function
  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>(Array(5).fill(null));

  const handleVerify = (): void => {
    console.log("Verifying code:", code.join(""));
  };

  const handleCodeChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    
    if (value !== "" && index < 4 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    if (event.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.sage} />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={COLORS.blueGray} />
        </TouchableOpacity>

        <Image source={require("@/assets/images/clara-logo.png")} style={styles.illustration} />

        <Text style={styles.title}>Two-Factor Authentication</Text>
        <Text style={styles.subtitle}>Enter the five-digit code from your authentication app</Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : {},
              ]}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleCodeChange(index, value)}
              onKeyPress={(event) => handleBackspace(index, event)}
              selectionColor={COLORS.blueGray}
              placeholderTextColor={COLORS.sage}
              placeholder="•"
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.verifyButton,
            code.join("").length === 5 ? styles.verifyButtonActive : {}
          ]} 
          onPress={handleVerify}
          disabled={code.join("").length !== 5}
        >
          <Text style={[
            styles.verifyButtonText, 
            code.join("").length === 5 ? styles.verifyButtonTextActive : {}
          ]}>
            Verify
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.helpText}>Having trouble getting the code?</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.cream, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingHorizontal: 30,
    position: "relative",
    overflow: "hidden"
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.blueGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  illustration: { 
    width: 220, 
    height: 160, 
    marginBottom: 30, 
    resizeMode: "contain",
    marginTop: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    textAlign: "center", 
    marginBottom: 12,
    color: COLORS.darkBlueGray
  },
  subtitle: { 
    fontSize: 16, 
    color: COLORS.darkSage, 
    textAlign: "center", 
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22
  },
  codeContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginBottom: 45,
    width: "100%",
    paddingHorizontal: 15,
  },
  codeInput: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 58,
    borderWidth: 0,
    borderRadius: 16,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    marginHorizontal: 6,
    backgroundColor: COLORS.white,
    color: COLORS.darkBlueGray,
    shadowColor: COLORS.blueGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  codeInputFilled: {
    backgroundColor: COLORS.lightBlue,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  verifyButton: { 
    width: "100%", 
    backgroundColor: COLORS.sage, 
    padding: 18, 
    borderRadius: 16, 
    alignItems: "center", 
    marginBottom: 20,
    shadowColor: COLORS.blueGray,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonActive: {
    backgroundColor: COLORS.blueGray,
  },
  verifyButtonText: { 
    color: COLORS.darkSage, 
    fontSize: 18, 
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  verifyButtonTextActive: {
    color: COLORS.white,
  },
  helpText: { 
    fontSize: 15, 
    color: COLORS.blueGray, 
    marginTop: 15,
    fontWeight: "500"
  },
});

export default AuthenticationScreen;
