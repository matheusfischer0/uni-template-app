import { StatusBar } from 'expo-status-bar'
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'

import { AppProvider } from '@/contexts/AppProvider'

import { Loading } from '@/components/Loading'
import { Slot } from 'expo-router'

export default function RootLayout() {
  const [isFontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  return (
    <AppProvider>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      {isFontsLoaded ? <Slot /> : <Loading />}
    </AppProvider>
  )
}
