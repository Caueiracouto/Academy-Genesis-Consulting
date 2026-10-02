import { useState } from 'react'
import { X, Mail, Lock, User, Phone, MapPin, CreditCard, Building } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, signIn, signUp, signInWithGoogle, signInWithOutlook } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup'>(authModalMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [cpf, setCpf] = useState('')
  const [address, setAddress] = useState('')
  const [cep, setCep] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)

  if (!authModalOpen) return null

  const currentMode = mode || authModalMode

  const resetForm = () => {
    setEmail(''); setPassword(''); setFullName(''); setPhone(''); setCpf(''); setAddress(''); setCep('')
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    closeAuthModal()
  }

  const switchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (currentMode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error)
        setLoading(false)
      } else {
        handleClose()
      }
    } else {
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        setLoading(false)
        return
      }
      const { error } = await signUp(email, password, fullName, phone, cpf, address, cep)
      if (error) {
        setError(error)
        setLoading(false)
      } else {
        handleClose()
      }
    }
  }

  const handleGoogle = async () => {
    setOauthLoading('google')
    setError(null)
    try {
      await signInWithGoogle()
    } catch {
      setError('Erro ao conectar com Google')
      setOauthLoading(null)
    }
  }

  const handleOutlook = async () => {
    setOauthLoading('outlook')
    setError(null)
    try {
      await signInWithOutlook()
    } catch {
      setError('Erro ao conectar com Outlook')
      setOauthLoading(null)
    }
  }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 301, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        backgroundColor: '#0d130d', border: '1px solid #2a2e2a', borderRadius: '20px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem 2rem', borderBottom: '1px solid #2a2e2a',
        }}>
          <h3 style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '1.15rem', fontWeight: 700, color: '#edf3ed',
          }}>
            {currentMode === 'login' ? 'Entrar na conta' : 'Criar conta'}
          </h3>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8f9c8f' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem 2rem' }}>
          {/* OAuth buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
            <p style={{
              fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
              color: '#46a239', letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '0.25rem',
            }}>
              {currentMode === 'login' ? 'Entrar com' : 'Cadastrar com'}
            </p>

            <button onClick={handleGoogle} disabled={oauthLoading !== null}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                width: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', fontWeight: 600, color: '#edf3ed',
                padding: '0.8rem', borderRadius: '12px',
                border: '1px solid #3a3f3a', backgroundColor: '#1a1f1a',
                cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
                opacity: oauthLoading === 'google' ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (oauthLoading === null) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3f3a' }}>
              <GoogleIcon />
              {oauthLoading === 'google' ? 'Conectando...' : 'Continuar com Google'}
            </button>

            <button onClick={handleOutlook} disabled={oauthLoading !== null}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                width: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', fontWeight: 600, color: '#edf3ed',
                padding: '0.8rem', borderRadius: '12px',
                border: '1px solid #3a3f3a', backgroundColor: '#1a1f1a',
                cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
                opacity: oauthLoading === 'outlook' ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (oauthLoading === null) { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)' } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3f3a' }}>
              <OutlookIcon />
              {oauthLoading === 'outlook' ? 'Conectando...' : 'Continuar com Outlook'}
            </button>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem',
          }}>
            <div style={{ flex: 1, height: 1, backgroundColor: '#2a2e2a' }} />
            <span style={{
              fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
              color: '#5a635a', letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              ou com e-mail
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: '#2a2e2a' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {currentMode === 'signup' && (
              <FormInput icon={<User size={16} />} label="Nome completo *" value={fullName} onChange={setFullName} required />
            )}

            <FormInput icon={<Mail size={16} />} label="E-mail *" type="email" value={email} onChange={setEmail} required />

            <FormInput icon={<Lock size={16} />} label="Senha *" type="password" value={password} onChange={setPassword} required />

            {currentMode === 'signup' && (
              <>
                <FormInput icon={<Phone size={16} />} label="Telefone / WhatsApp" value={phone} onChange={setPhone} />
                <FormInput icon={<CreditCard size={16} />} label="CPF" value={cpf} onChange={setCpf} placeholder="000.000.000-00" />
                <FormInput icon={<MapPin size={16} />} label="CEP" value={cep} onChange={setCep} placeholder="00000-000" />
                <FormInput icon={<Building size={16} />} label="Endereço" value={address} onChange={setAddress} />
              </>
            )}

            {error && (
              <div style={{
                padding: '0.7rem 0.85rem', backgroundColor: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px',
              }}>
                <p style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.78rem', color: '#f87171', lineHeight: 1.4,
                }}>
                  {error}
                </p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', marginTop: '0.5rem',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em',
                textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903',
                padding: '0.9rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                opacity: loading ? 0.6 : 1, transition: 'background-color 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#5ec04f' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#46a239' }}>
              {loading ? 'Aguarde...' : currentMode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          {/* Switch mode */}
          <p style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.82rem', color: '#8f9c8f', textAlign: 'center', marginTop: '1.25rem',
          }}>
            {currentMode === 'login' ? 'Ainda não tem conta? ' : 'Já tem conta? '}
            <button onClick={() => switchMode(currentMode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem',
                fontWeight: 600, color: '#46a239', padding: 0,
              }}>
              {currentMode === 'login' ? 'Criar agora' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

function FormInput({
  icon, label, value, onChange, type = 'text', required = false, placeholder,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.72rem', color: '#8f9c8f', marginBottom: '0.35rem',
      }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        backgroundColor: '#1a1f1a', border: '1px solid #2a2e2a',
        borderRadius: '10px', padding: '0 0.85rem',
        transition: 'border-color 0.2s',
      }}>
        <span style={{ color: '#5a635a', flexShrink: 0 }}>{icon}</span>
        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, backgroundColor: 'transparent', border: 'none', outline: 'none',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem',
            color: '#edf3ed', padding: '0.7rem 0',
          }}
          onFocus={e => (e.currentTarget.parentElement!.style.borderColor = 'rgba(70,162,57,0.4)')}
          onBlur={e => (e.currentTarget.parentElement!.style.borderColor = '#2a2e2a')}
        />
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function OutlookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="13" height="14" rx="1" fill="#0078D4" />
      <rect x="4" y="7" width="9" height="10" fill="#fff" />
      <path d="M15 8.5L22 7v10l-7-1.5v-7z" fill="#0078D4" />
      <text x="8.5" y="14" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0078D4" fontFamily="Arial">O</text>
    </svg>
  )
}
