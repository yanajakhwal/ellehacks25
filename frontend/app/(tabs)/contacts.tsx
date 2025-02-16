import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const emergencyContacts = [
  { id: "1", name: "Primary Caregiver", phone: "647-679-6931" },
  { id: "2", name: "Jane Smith", phone: "987-654-3210" },
  { id: "3", name: "Alice Johnson", phone: "555-0123-4567" },
  { id: "4", name: "Bob Wilson", phone: "444-000-3333" },
];

const Contacts = () => {
  const handleCall = (phoneNumber: string) => {
    let phoneUrl = Platform.OS === "ios" ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.error("Error making phone call:", err));
  };

  const renderContact = ({ item }: { item: { id: string; name: string; phone: string } }) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactName}>{item.name}</Text>
      <TouchableOpacity onPress={() => handleCall(item.phone)} style={styles.callButton}>
        <Ionicons name="call" size={24} color="white" />
        <Text style={styles.callButtonText}>Call</Text>
      </TouchableOpacity>
    </View>
  );

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
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  contactName: {
    fontSize: 18,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
  },
  callButtonText: {
    color: "white",
    marginLeft: 5,
  },
});

export default Contacts;