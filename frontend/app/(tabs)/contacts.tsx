import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Platform, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const emergencyContacts = [
  { id: "1", name: "Primary Caregiver", phone: "647-679-6931" },
  { id: "2", name: "Jane Smith", phone: "987-654-3210" },
  { id: "3", name: "Alice Johnson", phone: "555-0123-4567" },
  { id: "4", name: "Bob Wilson", phone: "444-000-3333" },
];

const Contacts = () => {
  const handleCall = (phoneNumber: any) => {
    let phoneUrl = Platform.OS === "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.error("Error making phone call:", err));
  };

  const renderContact = ({ item }: { item: { id: string; name: string; phone: string } }) => {
    return (
      <Animated.View style={styles.contactItem}>
        <Text style={styles.contactName}>{item.name}</Text>
        <TouchableOpacity onPress={() => handleCall(item.phone)} style={styles.callButton}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Contacts</Text>
      <FlatList
        data={emergencyContacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#DEE5D4",
  },
  title: {
    marginTop: 35,
    fontSize: 28,
    fontWeight: "bold",
    color: "#8EACCD",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#D2E0FB",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8EACCD",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  callButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Contacts;