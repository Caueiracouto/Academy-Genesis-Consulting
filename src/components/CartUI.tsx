import { useState, useEffect } from 'react'
import { X, ShoppingCart, Trash2, ArrowRight, CheckCircle2, User, Mail, Phone, Building2, LogOut, Lock } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useAuth } from '@/lib/auth'
import { saveAbandonedCart } from '@/lib/tracking'

function formatBRL(value: number | undefined | null): string {
  if (value == null || isNaN(value)) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, openCheckout } = useCart()
  const { user, profile, openAuthModal } = useAuth()
  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0)

  const handleCheckout = () => {
    if (!user) {
      openAuthModal('signup')
      return
    }
    openCheckout()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420,
        zIndex: 101, backgroundColor: '#0d130d', borderLeft: '1px solid #2a2e2a',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid #2a2e2a',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingCart size={20} color="#46a239" />
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '1rem', fontWeight: 700, color: '#edf3ed',
            }}>
              Meu Carrinho
            </span>
            {items.length > 0 && (
              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '0.65rem',
                color: '#46a239', backgroundColor: 'rgba(70,162,57,0.12)',
                padding: '0.15rem 0.5rem', borderRadius: '6px',
                border: '1px solid rgba(70,162,57,0.2)',
              }}>
                {items.length}
              </span>
            )}
          </div>
          <button onClick={closeCart} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8f9c8f' }}>
            <X size={20} />
          </button>
        </div>

        {/* Logged-in badge */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.5rem', borderBottom: '1px solid #2a2e2a',
            backgroundColor: 'rgba(70,162,57,0.04)',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(70,162,57,0.15)', border: '1px solid rgba(70,162,57,0.25)',
            }}>
              <User size={14} color="#46a239" />
            </div>
            <span style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.78rem', color: '#c4d0c4',
            }}>
              {profile?.full_name || user.email}
            </span>
          </div>
        )}

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '3rem' }}>
              <ShoppingCart size={40} color="#2a2e2a" style={{ margin: '0 auto 1rem' }} />
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.9rem', color: '#5a635a', lineHeight: 1.6,
              }}>
                Seu carrinho está vazio.<br />Adicione um treinamento para começar.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map(item => (
                <div key={item.slug} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '1rem', backgroundColor: '#1a1f1a',
                  border: '1px solid #2a2e2a', borderRadius: '12px',
                }}>
                  <div style={{
                    width: 36, height: 36, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(70,162,57,0.08)',
                    border: '1px solid rgba(70,162,57,0.2)', borderRadius: '8px',
                  }}>
                    <span style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.65rem', fontWeight: 700, color: '#46a239',
                    }}>
                      {item.certCode}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.85rem', fontWeight: 600, color: '#edf3ed',
                      lineHeight: 1.3, marginBottom: '0.25rem',
                    }}>
                      {item.title}
                    </p>
                    <p style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.6rem', color: '#5a635a', letterSpacing: '0.06em',
                      marginBottom: '0.35rem',
                    }}>
                      {item.duration} · {item.sessions}
                    </p>
                    <span style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontSize: '0.85rem', fontWeight: 700, color: '#46a239',
                    }}>
                      {formatBRL(item.price)}
                    </span>
                  </div>
                  <button onClick={() => removeFromCart(item.slug)} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#5a635a', flexShrink: 0, marginTop: '0.2rem',
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #2a2e2a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#8f9c8f' }}>Total</span>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.3rem', fontWeight: 700, color: '#46a239' }}>
                {formatBRL(total)}
              </span>
            </div>
            {!user && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                marginBottom: '0.65rem', padding: '0.55rem 0.75rem',
                backgroundColor: 'rgba(70,162,57,0.06)', border: '1px solid rgba(70,162,57,0.15)',
                borderRadius: '8px',
              }}>
                <Lock size={13} color="#46a239" />
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.7rem', color: '#8f9c8f', lineHeight: 1.4,
                }}>
                  Faça login ou cadastre-se para finalizar
                </span>
              </div>
            )}
            <button onClick={handleCheckout} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              width: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em',
              textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903',
              padding: '0.9rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5ec04f')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#46a239')}>
              {user ? 'Finalizar Inscrição' : 'Entrar / Cadastrar'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export function CheckoutModal() {
  const { items, checkoutOpen, closeCheckout, clearCart } = useCart()
  const { user, profile, signOut } = useAuth()
  const [company, setCompany] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0)

  const contactInfo = {
    name: profile?.full_name || user?.email || '',
    email: user?.email || '',
    phone: profile?.phone || '',
  }

  // Save abandoned cart whenever the checkout is open and has items
  useEffect(() => {
    if (checkoutOpen && items.length > 0 && !submitted) {
      saveAbandonedCart({
        ...contactInfo,
        cartItems: items.map(i => ({ slug: i.slug, title: i.title, price: i.price })),
        cartTotal: total,
      })
    }
  }, [checkoutOpen, items, submitted, total, contactInfo.name, contactInfo.email, contactInfo.phone])

  // Save on page unload if checkout was open but not submitted
  useEffect(() => {
    if (!checkoutOpen || submitted) return
    const handler = () => {
      if (items.length > 0) {
        saveAbandonedCart({
          ...contactInfo,
          cartItems: items.map(i => ({ slug: i.slug, title: i.title, price: i.price })),
          cartTotal: total,
        })
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [checkoutOpen, submitted, items, total, contactInfo.name, contactInfo.email, contactInfo.phone])

  if (!checkoutOpen || !user) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await saveAbandonedCart({
      ...contactInfo,
      cartItems: items.map(i => ({ slug: i.slug, title: i.title, price: i.price })),
      cartTotal: total,
    })

    setLoading(false)
    setSubmitted(true)
    clearCart()
  }

  const handleClose = () => {
    if (!submitted && items.length > 0) {
      saveAbandonedCart({
        ...contactInfo,
        cartItems: items.map(i => ({ slug: i.slug, title: i.title, price: i.price })),
        cartTotal: total,
      })
    }
    setSubmitted(false)
    setCompany('')
    closeCheckout()
  }

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        }}
      />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 201, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto',
        backgroundColor: '#0d130d', border: '1px solid #2a2e2a', borderRadius: '20px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        {submitted ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, margin: '0 auto 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(70,162,57,0.1)', borderRadius: '50%',
              border: '2px solid rgba(70,162,57,0.3)',
            }}>
              <CheckCircle2 size={32} color="#46a239" />
            </div>
            <h3 style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '1.4rem', fontWeight: 700, color: '#edf3ed', marginBottom: '0.75rem',
            }}>
              Inscrição Recebida!
            </h3>
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.9rem', color: '#8f9c8f', lineHeight: 1.7, marginBottom: '2rem',
            }}>
              Recebemos seu interesse nos treinamentos selecionados. Nossa equipe entrará em contato em até 1 dia útil com as próximas etapas e detalhes de pagamento.
            </p>
            <button onClick={handleClose} style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em',
              textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903',
              padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
            }}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1.5rem 2rem', borderBottom: '1px solid #2a2e2a',
            }}>
              <h3 style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '1.15rem', fontWeight: 700, color: '#edf3ed',
              }}>
                Finalizar Inscrição
              </h3>
              <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8f9c8f' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '1.5rem 2rem' }}>
              {/* Logged-in user info */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1rem', marginBottom: '1.25rem',
                backgroundColor: 'rgba(70,162,57,0.06)', border: '1px solid rgba(70,162,57,0.15)',
                borderRadius: '12px',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'rgba(70,162,57,0.15)', border: '1px solid rgba(70,162,57,0.25)',
                }}>
                  <User size={16} color="#46a239" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.82rem', fontWeight: 600, color: '#edf3ed',
                    lineHeight: 1.3,
                  }}>
                    {profile?.full_name || 'Conta'}
                  </p>
                  <p style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.65rem', color: '#8f9c8f',
                  }}>
                    {user.email}
                  </p>
                </div>
                <button type="button" onClick={signOut} title="Sair"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#5a635a', flexShrink: 0,
                  }}>
                  <LogOut size={16} />
                </button>
              </div>

              {/* Cart summary */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                  color: '#46a239', letterSpacing: '0.12em', textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  Treinamentos Selecionados ({items.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {items.map(item => (
                    <div key={item.slug} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.65rem 0.85rem', backgroundColor: '#1a1f1a',
                      border: '1px solid #2a2e2a', borderRadius: '10px',
                    }}>
                      <span style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.58rem', fontWeight: 700, color: '#46a239',
                        padding: '0.15rem 0.4rem', backgroundColor: 'rgba(70,162,57,0.08)',
                        border: '1px solid rgba(70,162,57,0.2)', borderRadius: '5px',
                      }}>
                        {item.certCode}
                      </span>
                      <span style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.8rem', color: '#c4d0c4', flex: 1,
                      }}>
                        {item.title}
                      </span>
                      <span style={{
                        fontFamily: 'Plus Jakarta Sans, sans-serif',
                        fontSize: '0.82rem', fontWeight: 700, color: '#46a239',
                      }}>
                        {formatBRL(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#8f9c8f' }}>Total</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#46a239' }}>{formatBRL(total)}</span>
                </div>
              </div>

              {/* Profile data summary */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{
                  fontFamily: 'Space Mono, monospace', fontSize: '0.6rem',
                  color: '#46a239', letterSpacing: '0.12em', textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}>
                  Seus Dados
                </p>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '0.4rem',
                  padding: '1rem', backgroundColor: '#1a1f1a',
                  border: '1px solid #2a2e2a', borderRadius: '12px',
                }}>
                  <InfoRow icon={<User size={13} />} label="Nome" value={profile?.full_name} />
                  <InfoRow icon={<Mail size={13} />} label="E-mail" value={user.email} />
                  <InfoRow icon={<Phone size={13} />} label="Telefone" value={profile?.phone} />
                  <InfoRow icon={<CreditCardRow />} label="CPF" value={profile?.cpf} />
                  <InfoRow icon={<MapPinRow />} label="CEP" value={profile?.cep} />
                  <InfoRow icon={<BuildingRow />} label="Endereço" value={profile?.address} />
                </div>
              </div>

              {/* Company field (optional, not in profile) */}
              <div>
                <label style={{
                  display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '0.72rem', color: '#8f9c8f', marginBottom: '0.35rem',
                }}>
                  Empresa (opcional)
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  backgroundColor: '#1a1f1a', border: '1px solid #2a2e2a',
                  borderRadius: '10px', padding: '0 0.85rem',
                  transition: 'border-color 0.2s',
                }}>
                  <span style={{ color: '#5a635a', flexShrink: 0 }}><Building2 size={16} /></span>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
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

              <button type="submit" disabled={loading} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                width: '100%', marginTop: '1.5rem',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em',
                textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903',
                padding: '0.9rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                opacity: loading ? 0.6 : 1, transition: 'background-color 0.2s, opacity 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#5ec04f' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = '#46a239' }}>
                {loading ? 'Enviando...' : 'Confirmar Inscrição'}
                {!loading && <ArrowRight size={16} />}
              </button>

              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '0.72rem', color: '#5a635a', lineHeight: 1.5,
                textAlign: 'center', marginTop: '1rem',
              }}>
                Nossa equipe entrará em contato com as próximas etapas e detalhes de pagamento (Pix, boleto ou cartão em até 12x).
              </p>
            </form>
          </>
        )}
      </div>
    </>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ color: '#5a635a', flexShrink: 0, display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.72rem', color: '#5a635a', flexShrink: 0, width: '4.5rem',
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.78rem', color: value ? '#c4d0c4' : '#5a635a',
        fontStyle: value ? 'normal' : 'italic',
      }}>
        {value || 'não informado'}
      </span>
    </div>
  )
}

function CreditCardRow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}

function MapPinRow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BuildingRow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
    </svg>
  )
}
