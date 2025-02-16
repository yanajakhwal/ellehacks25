import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import FamilyTree from "../../components/FamilyTree"; // Adjust path if needed

const FamilyScreen = () => {
  const navigation = useNavigation(); // Get navigation object

  useEffect(() => {
    // Hide tab bar when entering the screen
    navigation.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      // Restore tab bar when leaving the screen
      navigation.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FamilyTree />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8", padding: 20 },
});

export default FamilyScreen;