import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabsLayout() {
  const insets = useSafeAreaInsets()
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7A9B76',
        tabBarInactiveTintColor: '#8C8475',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          height: 36 + insets.bottom,
          bottom: insets.bottom,
          paddingBottom: insets.bottom,
          paddingHorizontal: 8,
          paddingTop: 8,
          position: 'absolute',
          marginHorizontal: 16,
          borderRadius: 20,
        }
      }}
    >
      <Tabs.Screen name='index' options={{
        tabBarIcon: ({ color, focused}) => <Ionicons 
          name={ focused ? 'home' : 'home-outline' }
          size={26}
          color={color}
        />
      }}/>
      <Tabs.Screen name='chat' options={{
        tabBarIcon: ({ color, focused}) => <Ionicons 
          name={ focused ? 'chatbox' : 'chatbox-outline' }
          size={26}
          color={color}
        />
      }}/>
      <Tabs.Screen name='herbs' options={{
        tabBarIcon: ({ color, focused}) => <Ionicons 
          name={ focused ? 'leaf-sharp' : 'leaf-outline' }
          size={26}
          color={color}
        />
      }}/>
      <Tabs.Screen name='yoga' options={{
        tabBarIcon: ({ color, focused}) => <FontAwesome5 
          name={ 'spa' }
          size={26}
          color={color}
        />
      }}/>
      <Tabs.Screen name='profile' options={{
        tabBarIcon: ({ color, focused}) => <Ionicons 
          name={ focused ? 'person' : 'person-outline' }
          size={26}
          color={color}
        />
      }}/>
    </Tabs>
  )
}