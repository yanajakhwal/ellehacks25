import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#8EACCD', // Active tab color
        tabBarInactiveTintColor: '#D2E0FB', // Inactive tab color
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: {
          backgroundColor: '#DEE5D4', // Tab bar background color
          borderTopWidth: 0, // Remove the top border
          elevation: 0, // Remove shadow on Android
          ...Platform.select({
            ios: {
              position: 'absolute',
              borderTopLeftRadius: 20, // Rounded corners for iOS
              borderTopRightRadius: 20,
            },
            default: {},
          }),
        },
      }}
    >
      {/* Family Tab */}
      <Tabs.Screen
        name="Family"
        options={{
          title: 'Family',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.3.fill" color={color} /> // Icon for family
          ),
        }}
      />

      {/* Location Tab */}
      <Tabs.Screen
        name="geoscreen"
        options={{
          title: 'Location',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="location.fill" color={color} /> // Icon for location
          ),
        }}
      />

      {/* Clara Tab */}
      <Tabs.Screen
        name="chatbot"
        options={{
          title: 'Clara',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="wand.and.stars" color={color} /> // Icon for Clara
          ),
        }}
      />

      {/* Contacts Tab */}
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.2.fill" color={color} /> // Icon for contacts
          ),
        }}
      />
    </Tabs>
  );
}