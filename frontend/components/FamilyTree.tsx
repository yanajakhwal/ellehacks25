import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView, SafeAreaView } from "react-native";
import Svg, { Line, Rect, Circle, Text as SvgText, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo-vector-icons

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
    setFamilyMembers([...familyMembers, { name: pendingMember, parents: selectedConnections }]);
    setPendingMember("");
    setSelectedConnections([]);
    setRelationshipModalVisible(false);
  };

  const renderFamilyNode = (name: string, x: string, y: number, isMe: boolean = false) => (
    <G key={name}>
      {isMe ? (
        <>
          <Rect
            x={`${parseFloat(x) - 50}`}
            y={y - 15}
            width="100"
            height="30"
            fill="#8EACCD"
            rx="15"
          />
          <SvgText x={x} y={y + 5} fontSize="16" fontWeight="bold" textAnchor="middle" fill="white">
            {name}
          </SvgText>
        </>
      ) : (
        <>
          <Circle cx={x} cy={y} r="40" fill="#FEF9D9" stroke="#D2E0FB" strokeWidth="2" />
          <SvgText x={x} y={y + 5} fontSize="14" textAnchor="middle" fill="black">
            {name}
          </SvgText>
        </>
      )}
    </G>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Family Tree</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Svg height="500" width="1000">
          {/* Parents */}
          {renderFamilyNode("Mom", "250", 80)}
          {renderFamilyNode("Dad", "450", 80)}
          <Line x1="250" y1="120" x2="450" y2="120" stroke="#8EACCD" strokeWidth="2" />
          <Line x1="350" y1="120" x2="350" y2="180" stroke="#8EACCD" strokeWidth="2" />

          {/* Me */}
          {renderFamilyNode("Me", "350", 230, true)}

          {/* Spouse */}
          {renderFamilyNode("Spouse", "550", 230)}
          <Line x1="400" y1="230" x2="510" y2="230" stroke="#8EACCD" strokeWidth="2" />

          {/* Child */}
          <Line x1="350" y1="245" x2="350" y2="290" stroke="#8EACCD" strokeWidth="2" />
          {renderFamilyNode("Child", "350", 340)}

          {/* Grandchildren */}
          {familyMembers
            .filter(member => member.parents.includes("Child"))
            .map((member, index, array) => {
              const baseX = 350 - (array.length - 1) * 50;
              const x = baseX + index * 100;
              return (
                <React.Fragment key={index}>
                  {renderFamilyNode(member.name, x.toString(), 450)}
                  <Line
                    x1="350"
                    y1="380"
                    x2={x}
                    y2="410"
                    stroke="#8EACCD"
                    strokeWidth="2"
                  />
                </React.Fragment>
              );
            })}
        </Svg>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Ionicons name="add-circle" size={20} color="white" />
        <Text style={styles.addButtonText}>Add Family Member</Text>
      </TouchableOpacity>

      {/* Modal for Adding Member */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Family Member</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter name"
              value={newMemberName}
              onChangeText={setNewMemberName}
              placeholderTextColor="#8EACCD"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={addNewPerson}>
                <Text style={styles.confirmButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Selecting Relationship */}
      <Modal visible={relationshipModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.relationshipModalContent}>
            <Text style={styles.modalTitle}>Who is {pendingMember} connected to?</Text>
            <Text style={styles.modalSubtitle}>Select all that apply</Text>
            <ScrollView style={styles.relationshipScrollView}>
              {existingMembers.map((member, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.parentOption,
                    selectedConnections.includes(member) && styles.selectedParent
                  ]}
                  onPress={() => toggleConnectionSelection(member)}
                >
                  <Text style={selectedConnections.includes(member) ? styles.selectedParentText : styles.parentText}>
                    {member}
                  </Text>
                  {selectedConnections.includes(member) && (
                    <Ionicons name="checkmark-circle" size={24} color="#8EACCD" style={styles.checkIcon} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setRelationshipModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.confirmButton,
                  selectedConnections.length === 0 && styles.disabledButton
                ]} 
                onPress={confirmRelationship}
                disabled={selectedConnections.length === 0}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE5D4",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#8EACCD",
  },
  addButton: {
    backgroundColor: "#8EACCD",
    padding: 16,
    margin: 20,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  parentOption: {
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "#D2E0FB",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  selectedParent: {
    backgroundColor: "#D2E0FB",
    borderColor: "#8EACCD",
  },
  parentText: {
    fontSize: 16,
    color: "#333",
  },
  selectedParentText: {
    fontSize: 16,
    color: "#8EACCD",
    fontWeight: "bold",
  },
  checkIcon: {
    marginLeft: "auto",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  relationshipModalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  relationshipScrollView: {
    width: "100%",
    maxHeight: 300,
    marginVertical: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#8EACCD",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#8EACCD",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FEF9D9",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D2E0FB",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#8EACCD",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D2E0FB",
    backgroundColor: "#FEF9D9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default FamilyTree;