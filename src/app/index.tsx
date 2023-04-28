import { View } from 'react-native'
import { Stack } from 'expo-router'

export default function Home() {
  return (
    <View className="flex flex-1 justify-center items-center">
      {/* Use the `Screen` component to configure the layout. */}
      <Stack />
    </View>
  )
}
