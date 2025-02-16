// filepath: /c:/Users/sarah/ELLE_PROJECT/ellehacks25/frontend/app/(tabs)/geoscreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import * as Location from "expo-location";
import axios from 'axios';

const GeofenceScreen = () => {
  const [location, setLocation] = useState<any>(null);
  const [previousLocation, setPreviousLocation] = useState<any>(null);  // Store previous location
  const [region, setRegion] = useState({
    latitude: 43.7735,  // York University coordinates
    longitude: -79.5019,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Checking location...");
  const [inRange, setInRange] = useState<boolean | null>(null); // New state variable

  // Define the geofence center and radius (range in meters)
  const geofence = {
    latitude: 43.7735,  // Geofence center (York University)
    longitude: -79.5019,  // Geofence center (York University)
    radius: 500,  // Geofence radius (range) in meters
  };

  // Request location permissions and get current position
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Watch for location updates continuously
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (locationData) => {
          // Compare new location with previous location
          if (
            previousLocation === null ||
            locationData.coords.latitude !== previousLocation.latitude ||
            locationData.coords.longitude !== previousLocation.longitude
          ) {
            // Only update if location has changed
            setLocation(locationData.coords);
            setPreviousLocation(locationData.coords);  // Save the new location as the previous location
            setRegion({
              ...region,
              latitude: locationData.coords.latitude,
              longitude: locationData.coords.longitude,
            });
            checkGeofence(locationData.coords);  // Check geofence whenever location updates
          }
        }
      );
    })();
  }, [previousLocation]);  // Dependency on previousLocation to compare

  // Haversine formula to calculate distance between two points
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

      // Update live status based on whether the user is inside or outside the geofence
      const isInRange = distance < geofence.radius;
      setStatus(isInRange ? "Inside Geofence" : "Outside Geofence");
      setInRange(isInRange);

      // Send the status to the backend
      axios.post('http://localhost:8000/api/geofence', {
        inRange: isInRange,
        location: userLocation
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
      <Text style={styles.status}>{status}</Text>  {/* Live status on the top bar */}

      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <MapView
          style={styles.map}
          region={region}  // Set region to the current location
          onRegionChangeComplete={setRegion}
        >
          {/* Geofence Circle */}
          <Circle
            center={geofence}
            radius={geofence.radius}
            strokeWidth={2}
            strokeColor="rgba(255,0,0,0.5)"
            fillColor="rgba(255,0,0,0.2)"
          />

          {/* Geofence Center Marker */}
          <Marker coordinate={geofence} title="Geofence Center" pinColor="red" />

          {/* User's Current Location Marker */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              pinColor="blue"
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
    justifyContent: "flex-start",  // Ensure the status is at the top
    alignItems: "center",
    position: "relative",
  },
  status: {
    position: "absolute",
    top: 60,  // Adjust this value to move the status down a bit
    fontSize: 18,
    fontWeight: "bold",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Background to make text readable
    padding: 10,
    width: "100%",  // Ensures the status spans across the entire screen
    textAlign: "center",  // Center the status text
  },
  map: {
    width: "100%",
    height: "100%",  // Ensure the map takes the full remaining height below the status
    marginTop: 70,  // Added top margin to move map display down
  },
});

export default GeofenceScreen;