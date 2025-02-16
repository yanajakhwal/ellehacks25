import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView } from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";

const FamilyTree = () => {
  const [familyMembers, setFamilyMembers] = useState<{ name: string; parents: string[] }[]>([
    { name: "Mom", parents: ["Me"] },
    { name: "Dad", parents: ["Me"] },
    { name: "Spouse", parents: [] },
    { name: "Child", parents: ["Me", "Spouse"] },
  ]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [relationshipModalVisible, setRelationshipModalVisible] = useState<boolean>(false);
  const [newMemberName, setNewMemberName] = useState<string>("");
  const [pendingMember, setPendingMember] = useState<string>("");
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);

  const existingMembers = ["Me", ...familyMembers.map((m) => m.name)];

  const openAddModal = () => {
    setNewMemberName("");
    setModalVisible(true);
  };

  const addNewPerson = () => {
    if (newMemberName.trim() === "") return;
    setPendingMember(newMemberName);
    setNewMemberName("");
    setModalVisible(false);
    setRelationshipModalVisible(true);
  };

  const toggleConnectionSelection = (member: string) => {
    setSelectedConnections((prev) =>
      prev.includes(member) ? prev.filter((m) => m !== member) : [...prev, member]
    );
  };

  const confirmRelationship = () => {
    setFamilyMembers([...familyMembers, { name: pendingMember, parents: ["Child"] }]);
    setPendingMember("");
    setSelectedConnections([]);
    setRelationshipModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Family Tree</Text>
      <Svg height="400" width="100%">
        {/* Mom and Dad */}
        <SvgText x="40%" y="30" fontSize="16" textAnchor="middle">Mom</SvgText>
        <SvgText x="60%" y="30" fontSize="16" textAnchor="middle">Dad</SvgText>
        <Line x1="45%" y1="40" x2="55%" y2="40" stroke="black" strokeWidth="2" />
        <Line x1="50%" y1="40" x2="50%" y2="80" stroke="black" strokeWidth="2" />

        {/* Me */}
        <SvgText x="50%" y="100" fontSize="18" textAnchor="middle" fill="white">Me</SvgText>
        <Rect x="45%" y="90" width="40" height="20" fill="black" rx="5" />

        {/* Spouse */}
        <SvgText x="70%" y="100" fontSize="16" textAnchor="middle">Spouse</SvgText>
        <Line x1="55%" y1="100" x2="65%" y2="100" stroke="black" strokeWidth="2" />

        {/* Child */}
        <Line x1="50%" y1="110" x2="50%" y2="150" stroke="black" strokeWidth="2" />
        <SvgText x="50%" y="170" fontSize="16" textAnchor="middle">Child</SvgText>

        {/* Grandchildren */}
        {familyMembers.map((member, index) =>
          member.parents.includes("Child") ? (
            <React.Fragment key={index}>
              <SvgText x={`${45 + index * 10}%`} y="220" fontSize="14" textAnchor="middle">
                {member.name}
              </SvgText>
              <Line x1="50%" y1="180" x2={`${45 + index * 10}%`} y2="210" stroke="black" strokeWidth="2" />
            </React.Fragment>
          ) : null
        )}
      </Svg>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ Add Person</Text>
      </TouchableOpacity>

      {/* Modal for Adding Member */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={addNewPerson}>
              <Text style={styles.modalButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Selecting Relationship */}
      <Modal visible={relationshipModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Who is {pendingMember} connected to?</Text>
            {existingMembers.map((member, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.parentOption, selectedConnections.includes(member) && styles.selectedParent]}
                onPress={() => toggleConnectionSelection(member)}
              >
                <Text>{member}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalButton} onPress={confirmRelationship}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#dde6f2", padding: 20 },
    title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    addButton: { backgroundColor: "#4CAF50", padding: 12, margin: 20, borderRadius: 10 },
    addButtonText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "bold" },
    parentOption: { padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 8, borderColor: "gray", width: "100%", alignItems: "center", backgroundColor: "#f9f9f9" },
    selectedParent: { backgroundColor: "#c3e6cb" },
    modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "white", padding: 20, borderRadius: 12, width: "80%", alignItems: "center" },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    modalButton: { backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, width: "100%", alignItems: "center" },
    modalButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
    input: { width: "100%", borderWidth: 1, borderColor: "gray", padding: 10, borderRadius: 5, marginBottom: 10 }
  });

export default FamilyTree;
