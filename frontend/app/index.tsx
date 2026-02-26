import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { user } = useAuthStore();
  
  return (
    <SafeAreaView>
      <View>
        <Text>Hello, {user?.name}</Text>
      </View>
    </SafeAreaView>
  )
}