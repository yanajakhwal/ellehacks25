import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const EmergencyContactsPage = () => {
  const contacts = [
    { name: 'Primary Caregiver', phone: '647-679-6931' },
    { name: 'Jane Smith', phone: '987-654-3210' },
    { name: 'Alice Johnson', phone: '555-0123-4567' },
    { name: 'Bob Wilson', phone: '444-000-3333' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
      </View>
      <ScrollView style={styles.contactsContainer}>
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactItem}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactPhone}>{contact.phone}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  contactsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contactItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 16,
    color: '#333',
  },
});

export default EmergencyContactsPage;