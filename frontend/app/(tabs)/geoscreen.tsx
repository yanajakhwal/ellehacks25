import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
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
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
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
      setStatus(isInRange ? "Inside Geofence" : "Outside Geofence");
      setInRange(isInRange);
/*
      axios.post(`${API_URL}/geofence`, {
        inRange: isInRange,
        location: userLocation
      })
      .then(response => {
        console.log('Status sent to backend:', response.data);
      })
      
      .catch(error => {
        console.error('Error sending status to backend:', error);
      });
      */
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
            strokeColor="rgba(142, 172, 205, 0.8)" // 8EACCD with opacity
            fillColor="rgba(142, 172, 205, 0.2)" // 8EACCD with opacity
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
    backgroundColor: "#DEE5D4", // Background color
  },
  header: {
    backgroundColor: "#8EACCD", // Header background color
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#FEF9D9", // Accent color
  },
  headerText: {
    fontSize: 24,
    paddingTop: 22,
    fontWeight: "bold",
    color: "#FFFFFF", // White text
  },
  status: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#FFFFFF", // White text
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  inRange: {
    backgroundColor: "#4CAF50", // Green for in-range status
  },
  outOfRange: {
    backgroundColor: "#F44336", // Red for out-of-range status
  },
  errorText: {
    fontSize: 16,
    color: "#F44336", // Red for errors
    textAlign: "center",
    marginTop: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default GeofenceScreen;