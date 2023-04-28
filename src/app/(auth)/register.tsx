import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignUpScreen() {
  const router = useRouter()
  const { signIn, setSession, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })

      await setSession(completeSignIn.createdSessionId)
    } catch (err) {
      console.log(err)
    }
  }

  const onSignInPress = () => router.replace('/sign-in')

  return (
    <View className={'flex flex-1 bg-zinc-600'}>
      <View className={''}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          className={''}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View className={''}>
        <TextInput
          value={password}
          className={''}
          placeholder="Password..."
          placeholderTextColor="#000"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity className={''} onPress={onSignUpPress}>
        <Text className={''}>Sign up</Text>
      </TouchableOpacity>

      <View className={''}>
        <Text>Have an account?</Text>

        <TouchableOpacity className={''} onPress={onSignInPress}>
          <Text className={''}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
