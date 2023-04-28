import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useOAuth, useAuth, useUser } from '@clerk/clerk-expo'

import { useRouter, useSegments } from 'expo-router'

type User = {
  id: string
  email: string | undefined
  fullName: string | null
  avatar: string
}

type GetSessionInfo = {
  sessionId: string
  token: string
}

export type AuthContextDataProps = {
  user: null | User
  signInOrSignUpWithOAuth: () => Promise<void>
  signOut: () => Promise<void>
  getSessionInfo: () => Promise<GetSessionInfo>
  isLoading: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
)

export function AuthProvider({ children }: AuthContextProviderProps) {
  const router = useRouter()
  const segments = useSegments()

  const [user, setUser] = useState<null | User>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_github' })
  const { signOut: clerkSignOut, getToken, sessionId } = useAuth()
  const { user: clerkUser } = useUser()

  const signInOrSignUpWithOAuth = useCallback(async () => {
    try {
      setIsLoading(true)

      const { createdSessionId, setActive } = await startOAuthFlow()

      if (createdSessionId) {
        setActive({ session: createdSessionId })
      } else {
        throw Error('Clerk session not created.')
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2))
      console.log('error signing in', err)
    } finally {
      setIsLoading(false)
    }
  }, [startOAuthFlow])

  async function signOut() {
    try {
      setIsLoading(true)
      await clerkSignOut()
    } catch (error) {
      throw Error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getSessionInfo() {
    try {
      setIsLoading(true)
      const token = await getToken()

      if (!token || !sessionId) {
        throw Error('Session info not available.')
      }

      return { sessionId, token }
    } catch (error) {
      throw Error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (clerkUser?.id && clerkUser.primaryEmailAddress && clerkUser.fullName) {
      setUser({
        email: clerkUser.primaryEmailAddress.emailAddress,
        id: clerkUser.id,
        avatar: clerkUser.profileImageUrl,
        fullName: clerkUser.fullName,
      })
    } else {
      setUser(null)
    }
  }, [
    clerkUser?.fullName,
    clerkUser?.id,
    clerkUser?.primaryEmailAddress,
    clerkUser?.profileImageUrl,
  ])

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace('/login')
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(drawer)/(tabs)')
    }
  }, [user, segments, router])

  return (
    <AuthContext.Provider
      value={{
        signInOrSignUpWithOAuth,
        signOut,
        user,
        getSessionInfo,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
