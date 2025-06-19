import { Tabs } from 'expo-router';
import { Home, Heart, MapPin, User, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { profile } = useAuth();
  const isFacilitator = profile?.role === 'facilitator';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isFacilitator ? 'Missions' : 'Home',
          tabBarIcon: ({ size, color }) => 
            isFacilitator ? <MapPin size={size} color={color} /> : <Home size={size} color={color} />,
        }}
      />
      {!isFacilitator && (
        <>
          <Tabs.Screen
            name="report"
            options={{
              title: 'Report',
              tabBarIcon: ({ size, color }) => <MapPin size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="donate"
            options={{
              title: 'Donate',
              tabBarIcon: ({ size, color }) => <Heart size={size} color={color} />,
            }}
          />
        </>
      )}
      {isFacilitator && (
        <Tabs.Screen
          name="completed"
          options={{
            title: 'Completed',
            tabBarIcon: ({ size, color }) => <CheckCircle size={size} color={color} />,
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}