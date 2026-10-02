import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  cpf: string | null
  address: string | null
  cep: string | null
  avatar_url: string | null
}

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  authModalOpen: boolean
  authModalMode: 'login' | 'signup'
  openAuthModal: (mode?: 'login' | 'signup') => void
  closeAuthModal: () => void
  signUp: (email: string, password: string, fullName: string, phone: string, cpf: string, address: string, cep: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInWithGoogle: () => Promise<void>
  signInWithOutlook: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login')

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle()

    if (data) {
      setProfile(data as Profile)
    } else {
      // Create a minimal profile if it doesn't exist (e.g., OAuth first login)
      const newProfile = {
        id: uid,
        email: user?.email ?? null,
        full_name: user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null,
        avatar_url: user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null,
      }
      const { data: created } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select('*')
        .maybeSingle()
      if (created) setProfile(created as Profile)
    }
  }, [user])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      })()
    })

    return () => { mounted = false }
  }, [fetchProfile])

  const signUp = useCallback(async (
    email: string, password: string,
    fullName: string, phone: string, cpf: string, address: string, cep: string,
  ): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: translateError(error.message) }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName || null,
        phone: phone || null,
        cpf: cpf || null,
        address: address || null,
        cep: cep || null,
      })
      if (profileError) return { error: 'Erro ao salvar perfil: ' + profileError.message }
    }

    return { error: null }
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: translateError(error.message) }
    return { error: null }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }, [])

  const signInWithOutlook = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: { redirectTo: window.location.origin },
    })
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }, [])

  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Não autenticado' }
    const { error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) return { error: error.message }
    setProfile(prev => prev ? { ...prev, ...data } : null)
    return { error: null }
  }, [user])

  const openAuthModal = useCallback((mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), [])

  const value: AuthContextValue = {
    user, profile, loading,
    authModalOpen, authModalMode,
    openAuthModal, closeAuthModal,
    signUp, signIn, signInWithGoogle, signInWithOutlook, signOut, updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'E-mail ou senha incorretos'
  if (msg.includes('User already registered')) return 'Este e-mail já está cadastrado'
  if (msg.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres'
  return msg
}
