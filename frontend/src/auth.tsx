import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { UNAUTHORIZED_EVENT, api, clearToken, getToken, setToken, request } from './api'
import type { Session } from './types'

interface AuthValue {
  session: Session | null
  ready: boolean
  isAdmin: boolean
  isVolunteer: boolean
  adminLogin: (password: string) => Promise<Session>
  volunteerJoin: (accessCode: string, nickname: string) => Promise<Session>
  volunteerLogin: (username: string, password: string, register?: boolean) => Promise<Session>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setSession(null)
      setReady(true)
      return
    }
    try {
      setSession(await api.me())
    } catch {
      clearToken()
      setSession(null)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // A 401 from the backend (expired/cleared token) logs the user out everywhere
  useEffect(() => {
    const handler = () => setSession(null)
    window.addEventListener(UNAUTHORIZED_EVENT, handler)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler)
  }, [])

  const adminLogin = useCallback(async (password: string) => {
    const result = await api.adminLogin(password)
    setToken(result.token)
    setSession(result)
    return result
  }, [])

  const volunteerJoin = useCallback(async (accessCode: string, nickname: string) => {
    const result = await api.volunteerJoin(accessCode, nickname)
    setToken(result.token)
    setSession(result)
    return result
  }, [])

  const volunteerLogin = useCallback(async (username: string, password: string, register = false) => {
    const result = await request<Session>(`/api/auth/volunteer/${register ? 'register' : 'login'}`, {
      method: 'POST', body: JSON.stringify({ username, password }),
    })
    setToken(result.token)
    setSession(result)
    return result
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      /* Local cleanup is enough; a dead server-side session doesn't matter */
    }
    clearToken()
    setSession(null)
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      session,
      ready,
      isAdmin: session?.role === 'admin',
      isVolunteer: session?.role === 'volunteer',
      adminLogin,
      volunteerJoin,
      volunteerLogin,
      logout,
    }),
    [session, ready, adminLogin, volunteerJoin, volunteerLogin, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth 必须在 AuthProvider 内使用')
  return value
}
