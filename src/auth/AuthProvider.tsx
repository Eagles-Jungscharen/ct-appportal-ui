import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthProvider as OidcAuthProvider, useAuth as useOidcAuth } from 'react-oidc-context'
import { oidcConfig } from '../config/oidc'
import { fetchMe } from '../api/me'
import type { MeDto } from '../api/types'

interface AppAuthContextValue {
  isAuthenticated: boolean
  isLoading: boolean
  isAdmin: boolean
  groups: string[]
  displayName: string
  token: string | null
  login: () => void
  logout: () => void
}

const AppAuthContext = createContext<AppAuthContextValue | null>(null)

function InnerAuthProvider({ children }: { children: React.ReactNode }) {
  const oidc = useOidcAuth()
  const [me, setMe] = useState<MeDto | null>(null)
  const [meLoading, setMeLoading] = useState(false)

  const token = oidc.user?.access_token ?? null

  useEffect(() => {
    if (!oidc.isAuthenticated || !token) {
      setMe(null)
      return
    }
    setMeLoading(true)
    fetchMe(token)
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setMeLoading(false))
  }, [oidc.isAuthenticated, token])

  const value: AppAuthContextValue = {
    isAuthenticated: oidc.isAuthenticated,
    isLoading: oidc.isLoading || meLoading,
    isAdmin: me?.isAdmin ?? false,
    groups: me?.groups ?? [],
    displayName: me?.displayName ?? oidc.user?.profile.name ?? '',
    token,
    login: () => oidc.signinRedirect(),
    logout: () => oidc.signoutRedirect(),
  }

  return <AppAuthContext.Provider value={value}>{children}</AppAuthContext.Provider>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <OidcAuthProvider {...oidcConfig}>
      <InnerAuthProvider>{children}</InnerAuthProvider>
    </OidcAuthProvider>
  )
}

export function useAppAuth(): AppAuthContextValue {
  const ctx = useContext(AppAuthContext)
  if (!ctx) throw new Error('useAppAuth must be used within AuthProvider')
  return ctx
}
