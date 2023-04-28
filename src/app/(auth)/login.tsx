import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignIn } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function SignInScreen() {
  const router = useRouter()
  const { signIn, setSession, isLoaded } = useSignIn()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  const onSignInPress = async () => {
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

  const onSignUpPress = () => router.replace('/sign-up')

  return (
    <View className={'flex-1 items-center justify-center'}>
      <Text className={'text-2xl font-bold mb-4'}>Login</Text>

      <TextInput
        className={'border border-gray-300 rounded-lg py-2 px-4 w-80 mb-4'}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Email..."
        placeholderTextColor="#000"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />

      <TextInput
        value={password}
        className={'border border-gray-300 rounded-lg py-2 px-4 w-80 mb-4'}
        placeholder="Password..."
        placeholderTextColor="#000"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />

      <TouchableOpacity
        className={'bg-blue-500 rounded-lg py-2 px-4 w-80'}
        onPress={onSignInPress}
      >
        <Text className={''}>Sign in</Text>
      </TouchableOpacity>

      <View className={''}>
        <Text>Have an account?</Text>

        <TouchableOpacity className={''} onPress={onSignUpPress}>
          <Text className={''}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
