import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import axios from 'axios';
import { API_URL } from '@/config';

const GeofenceScreen = () => {
  const [location, setLocation] = useState<any>(null);
  const [previousLocation, setPreviousLocation] = useState<any>(null);
  const [region, setRegion] = useState({
    latitude: 43.7735,  // York University coordinates
    longitude: -79.5019,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Checking location...");
  const [inRange, setInRange] = useState<boolean | null>(null);

  const geofence = {
    latitude: 43.7735,  // Geofence center (York University)
    longitude: -79.5019,  // Geofence center (York University)
    radius: 500,  // Geofence radius (range) in meters
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 60000, distanceInterval: 100 },
        (locationData) => {
          if (
            previousLocation === null ||
            locationData.coords.latitude !== previousLocation.latitude ||
            locationData.coords.longitude !== previousLocation.longitude
          ) {
            setLocation(locationData.coords);
            setPreviousLocation(locationData.coords);
            setRegion({
              ...region,
              latitude: locationData.coords.latitude,
              longitude: locationData.coords.longitude,
            });
            checkGeofence(locationData.coords);
          }
        }
      );
    })();
  }, [previousLocation]);

  const checkGeofence = (userLocation: any) => {
    if (userLocation) {
      const toRadians = (deg: number) => deg * (Math.PI / 180);

      const lat1 = toRadians(userLocation.latitude);
      const lon1 = toRadians(userLocation.longitude);
      const lat2 = toRadians(geofence.latitude);
      const lon2 = toRadians(geofence.longitude);

      const R = 6371000; // Earth's radius in meters
      const dLat = lat2 - lat1;
      const dLon = lon2 - lon1;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c; // Distance in meters

      const isInRange = distance < geofence.radius;
      updateGeofenceStatus(isInRange, userLocation);
    }
  };

  const updateGeofenceStatus = (isInRange: boolean, location: any) => {
    setStatus(isInRange ? "Inside Geofence" : "Outside Geofence");
    setInRange(isInRange);

    // Only call API when user is NOT in range
    if (!isInRange) {
      axios.post(`${API_URL}/geofence`, {
        inRange: isInRange,
        location: location
      })
      .then(response => {
        console.log('Status sent to backend:', response.data);
      })
      .catch(error => {
        console.error('Error sending status to backend:', error);
      });
    }
  };

  const handleTestToggle = () => {
    const newInRange = !inRange;
    setInRange(newInRange);
    setStatus(newInRange ? "Inside Geofence" : "Outside Geofence");
    
    // Only call API when toggling to NOT in range
    if (!newInRange && location) {
      axios.post(`${API_URL}/geofence`, {
        inRange: newInRange,
        location: location
      })
      .then(response => {
        console.log('Status sent to backend:', response.data);
      })
      .catch(error => {
        console.error('Error sending status to backend:', error);
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Geofence Status</Text>
        <Text style={[styles.status, inRange !== null && (inRange ? styles.inRange : styles.outOfRange)]}>
          {status}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.testButton} 
        onPress={handleTestToggle}
      >
        <Text style={styles.testButtonText}>Toggle Status (Test)</Text>
      </TouchableOpacity>

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          <Circle
            center={geofence}
            radius={geofence.radius}
            strokeWidth={2}
            strokeColor="rgba(142, 172, 205, 0.8)"
            fillColor="rgba(142, 172, 205, 0.2)"
          />
          <Marker coordinate={geofence} title="Geofence Center" pinColor="#8EACCD" />
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              pinColor="#D2E0FB"
            />
          )}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE5D4",
  },
  header: {
    backgroundColor: "#8EACCD",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#FEF9D9",
  },
  headerText: {
    fontSize: 24,
    paddingTop: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  status: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  inRange: {
    backgroundColor: "#4CAF50",
  },
  outOfRange: {
    backgroundColor: "#F44336",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginTop: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  testButton: {
    position: 'absolute',
    right: 16,
    top: 150,
    backgroundColor: '#8EACCD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default GeofenceScreen;