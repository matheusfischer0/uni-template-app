import { useClerk } from '@clerk/clerk-expo'
import React from 'react'
import { View, Text, Button } from 'react-native'

export default function SignIn() {
  const { openSignIn } = useClerk()

  function handleSignInClick(): void {
    const signInOptions = {
      // Specify any options for the sign-in dialog here
    }

    openSignIn(signInOptions)
  }

  return (
    <View>
      <Text>Sign In</Text>
      <Button title="Sign In with Clerk" onPress={handleSignInClick} />
    </View>
  )
}
