import { useState } from 'react'
import { X, Mail, Lock, User, Phone, MapPin, CreditCard, Building } from 'lucide-react'
import { useAuth } from '@/lib/auth'

export function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, signIn, signUp } = useAuth()
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

