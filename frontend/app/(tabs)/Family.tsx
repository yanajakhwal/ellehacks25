import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FamilyTree from "../../components/FamilyTree"; // Adjust path if needed

const FamilyScreen = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <FamilyTree />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE5D4",
  },
});

export default FamilyScreen;