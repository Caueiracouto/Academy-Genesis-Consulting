import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, Clock, Users, User, ArrowRight, ChevronLeft, MapPin, Plus, Pencil, Trash2, X, Save, Settings, CheckSquare, Square, Copy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCart, type CartItem } from '@/lib/cart'
import { useAuth } from '@/lib/auth'
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react'
import { COURSES } from '@/data/courses'

interface CourseSession {
  id: string
  course_slug: string
  course_title: string
  cert_code: string
  instructor: string | null
  start_date: string
  end_date: string
  start_time: string | null
  end_time: string | null
  sessions: string | null
  format: string | null
  seats_total: number
  seats_filled: number
  status: string
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  const sDay = s.getDate()
  const eDay = e.getDate()
  const sMonth = MONTHS[s.getMonth()]
  if (s.getMonth() === e.getMonth()) {
    if (sDay === eDay) return `${sDay} ${sMonth}`
    return `${sDay}–${eDay} ${sMonth}`
  }
  return `${sDay} ${MONTHS[s.getMonth()]} – ${eDay} ${MONTHS[e.getMonth()]}`
}

function getSeatsLeft(session: CourseSession): number {
  return Math.max(0, session.seats_total - session.seats_filled)
}

export default function CalendarPage() {
  const navigate = useNavigate()
  const { items, openCart, addToCart } = useCart()
  const { user, profile, openAuthModal, signOut, isAdmin } = useAuth()
  const [sessions, setSessions] = useState<CourseSession[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [adminOpen, setAdminOpen] = useState(false)

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from('course_sessions')
      .select('*')
      .order('start_date', { ascending: true })
    if (!error && data) {
      setSessions(data as CourseSession[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleEnroll = (session: CourseSession) => {
    const course = COURSES.find(c => c.slug === session.course_slug)
    if (!course) return
    const cartItem: CartItem = {
      slug: course.slug,
      title: course.title,
      certCode: course.certCode,
      duration: course.duration,
      sessions: course.sessions,
      price: course.price,
    }
    if (!items.some(item => item.slug === course.slug)) {
      addToCart(cartItem)
    }
    navigate(`/treinamento/${course.slug}`)
  }

  // Build calendar grid
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startWeekday; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)

  const sessionsForDay = (day: number | null): CourseSession[] => {
    if (!day) return []
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return sessions.filter(s => {
      const start = s.start_date
      const end = s.end_date
      return dateStr >= start && dateStr <= end
    })
  }

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))
  const goToday = () => setCurrentMonth(new Date())

  const upcomingSessions = sessions
    .filter(s => new Date(s.start_date + 'T00:00:00') >= new Date(new Date().toDateString()))
    .slice(0, 12)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#030903', color: '#edf3ed' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ backgroundColor: 'rgba(3,9,3,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(70,162,57,0.12)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em', color: '#edf3ed' }}>
              Genesis Consulting
            </span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.22em', color: '#46a239', textTransform: 'uppercase' }}>
              Academy
            </span>
          </button>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate('/')} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', fontWeight: 500, color: '#8f9c8f', background: 'none', border: 'none', cursor: 'pointer' }}
            className="hover:text-white transition-colors">Início</button>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#46a239' }}>Calendário</span>
        </div>
        <div className="flex items-center gap-3">
          {items.length > 0 && (
            <button onClick={openCart}
              style={{ position: 'relative', background: 'none', border: '1px solid #3a3f3a', borderRadius: '8px', padding: '0.5rem 0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              className="hover:border-white/40 transition-colors">
              <ShoppingCart size={16} color="#46a239" />
              <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', backgroundColor: '#46a239', color: '#030903', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {items.length}
              </span>
            </button>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', border: '1px solid #3a3f3a', borderRadius: '8px' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(70,162,57,0.15)', border: '1px solid rgba(70,162,57,0.25)' }}>
                  <UserIcon size={12} color="#46a239" />
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#c4d0c4', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
                <button onClick={signOut} title="Sair" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a635a', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => openAuthModal('login')}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#edf3ed', padding: '0.5rem 1rem', border: '1px solid #3a3f3a', borderRadius: '8px', backgroundColor: 'transparent', cursor: 'pointer' }}
              className="hover:border-white/40 transition-colors">
              Entrar
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse at center, rgba(70,162,57,0.06) 0%, transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5"
            style={{ border: '1px solid rgba(70,162,57,0.25)', backgroundColor: 'rgba(70,162,57,0.05)', borderRadius: '12px' }}>
            <CalendarIcon size={14} color="#46a239" />
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.14em', color: '#46a239', textTransform: 'uppercase' }}>
              Agenda de Turmas
            </span>
          </div>

          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: '22ch', marginBottom: '1rem' }}>
            Calendário de <span style={{ color: '#46a239' }}>treinamentos</span>
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: '#8f9c8f', maxWidth: '52ch' }}>
            Confira as datas das próximas turmas dos nossos treinamentos oficiais SAFe. Inscreva-se diretamente e garanta sua vaga.
          </p>
        </div>
      </section>

      {/* Calendar + Upcoming */}
      <section className="px-8 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Calendar grid */}
          <div className="lg:col-span-3" style={{ border: '1px solid #2a2e2a', borderRadius: '16px', backgroundColor: '#0d130d', overflow: 'hidden' }}>
            {/* Month navigation */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #2a2e2a' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #3a3f3a', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#8f9c8f' }}
                className="hover:border-white/40 hover:text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <div className="flex flex-col items-center">
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#edf3ed' }}>
                  {MONTHS[month]} {year}
                </span>
                <button onClick={goToday} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#46a239', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem' }}
                  className="hover:text-green-400 transition-colors">
                  Ir para hoje
                </button>
              </div>
              <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #3a3f3a', borderRadius: '8px', padding: '0.4rem 0.6rem', cursor: 'pointer', color: '#8f9c8f' }}
                className="hover:border-white/40 hover:text-white transition-colors">
                <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7" style={{ borderBottom: '1px solid #2a2e2a' }}>
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center py-3">
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#5a635a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const daySessions = sessionsForDay(day)
                const today = new Date()
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const isPast = day !== null && new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

                return (
                  <div
                    key={idx}
                    className="min-h-[80px] p-1.5"
                    onClick={() => daySessions[0] && handleEnroll(daySessions[0])}
                    title={daySessions[0] ? `Ver ${daySessions[0].course_title}` : undefined}
                    style={{ borderBottom: '1px solid #1a1f1a', borderRight: idx % 7 !== 6 ? '1px solid #1a1f1a' : 'none', cursor: daySessions.length > 0 ? 'pointer' : 'default' }}
                  >
                    {day !== null && (
                      <>
                        <span style={{
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '0.72rem',
                          fontWeight: isToday ? 700 : 400,
                          color: isToday ? '#46a239' : isPast ? '#3a3f3a' : '#8f9c8f',
                        }}>
                          {day}
                        </span>
                        <div className="flex flex-col gap-1 mt-1">
                          {daySessions.slice(0, 2).map(s => (
                            <button
                              key={s.id}
                              onClick={event => { event.stopPropagation(); handleEnroll(s) }}
                              title={`${s.course_title} — abrir treinamento`}
                              style={{
                                fontFamily: 'Space Mono, monospace',
                                fontSize: '0.55rem',
                                fontWeight: 600,
                                color: '#46a239',
                                backgroundColor: 'rgba(70,162,57,0.1)',
                                border: '1px solid rgba(70,162,57,0.2)',
                                borderRadius: '4px',
                                padding: '0.15rem 0.3rem',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(70,162,57,0.2)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(70,162,57,0.4)' }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(70,162,57,0.1)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(70,162,57,0.2)' }}
                            >
                              {s.cert_code}
                            </button>
                          ))}
                          {daySessions.length > 2 && (
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.5rem', color: '#5a635a', padding: '0 0.3rem' }}>
                              +{daySessions.length - 2}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div style={{ border: '1px solid #2a2e2a', borderRadius: '16px', backgroundColor: '#0d130d', padding: '1.25rem' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#46a239', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                Como usar o calendário
              </p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', fontWeight: 600, color: '#46a239', backgroundColor: 'rgba(70,162,57,0.1)', border: '1px solid rgba(70,162,57,0.2)', borderRadius: '4px', padding: '0.15rem 0.3rem' }}>
                    SA
                  </span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f' }}>
                    Clique no código da turma para ver o curso e se inscrever
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#46a239', display: 'inline-block' }} />
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f' }}>
                    Destaque verde indica o dia atual
                  </span>
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid rgba(70,162,57,0.15)', borderRadius: '16px', backgroundColor: 'rgba(70,162,57,0.04)', padding: '1.25rem' }}>
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#46a239" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#46a239' }}>
                  Treinamentos oficiais
                </span>
              </div>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f', lineHeight: 1.6 }}>
                Todas as turmas são ministradas em Live Virtual, em português, por instrutores certificados SAFe Practice Consultants (SPCs).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADMIN PANEL */}
      {isAdmin && user && (
        <AdminPanel sessions={sessions} loading={loading} onRefresh={fetchSessions} adminOpen={adminOpen} setAdminOpen={setAdminOpen} />
      )}

      {/* Upcoming sessions list */}
      <section className="px-8 pb-24" style={{ borderTop: '1px solid #2a2e2a' }}>
        <div className="max-w-6xl mx-auto pt-16">
          <div className="mb-12">
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.18em', color: '#46a239', textTransform: 'uppercase', display: 'block', marginBottom: '0.75rem' }}>
              Próximas turmas
            </span>
            <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Inscrições abertas
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <div style={{ width: 32, height: 32, border: '2px solid #2a2e2a', borderTopColor: '#46a239', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#5a635a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Carregando turmas...
              </span>
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="text-center py-16">
              <CalendarIcon size={40} color="#2a2e2a" style={{ margin: '0 auto 1rem' }} />
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#5a635a', lineHeight: 1.6 }}>
                Nenhuma turma programada no momento.{isAdmin ? <><br />Use o painel de administração para adicionar turmas.</> : <><br />Entre em contato para agendar um treinamento.</>}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingSessions.map(session => {
                const seatsLeft = getSeatsLeft(session)
                const isFull = seatsLeft === 0
                const seatsPct = Math.round((session.seats_filled / session.seats_total) * 100)

                return (
                  <div key={session.id}
                    className="flex flex-col"
                    style={{
                      border: '1px solid #2a2e2a',
                      backgroundColor: '#0d130d',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(70,162,57,0.25)'; (e.currentTarget as HTMLDivElement).style.backgroundColor = '#131a13' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2e2a'; (e.currentTarget as HTMLDivElement).style.backgroundColor = '#0d130d' }}>

                    {/* Date badge */}
                    <div className="flex items-center gap-3 px-5 pt-5">
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        backgroundColor: 'rgba(70,162,57,0.08)',
                        border: '1px solid rgba(70,162,57,0.2)',
                        borderRadius: '10px',
                        padding: '0.5rem 0.75rem',
                        minWidth: 56,
                      }}>
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: '#46a239', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {MONTHS[new Date(session.start_date + 'T00:00:00').getMonth()].slice(0, 3)}
                        </span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#edf3ed', lineHeight: 1.1 }}>
                          {new Date(session.start_date + 'T00:00:00').getDate()}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#46a239', letterSpacing: '0.04em', padding: '0.15rem 0.5rem', backgroundColor: 'rgba(70,162,57,0.08)', border: '1px solid rgba(70,162,57,0.2)', borderRadius: '6px', display: 'inline-block', width: 'fit-content' }}>
                          {session.cert_code}
                        </span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#edf3ed', lineHeight: 1.3 }}>
                          {session.course_title}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-2.5 px-5 pt-4 pb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={13} color="#5a635a" />
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#8f9c8f' }}>
                          {formatDateRange(session.start_date, session.end_date)}
                        </span>
                      </div>
                      {session.start_time && (
                        <div className="flex items-center gap-2">
                          <Clock size={13} color="#5a635a" />
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#8f9c8f' }}>
                            {session.start_time}{session.end_time ? `–${session.end_time}` : ''}
                          </span>
                        </div>
                      )}
                      {session.instructor && (
                        <div className="flex items-center gap-2">
                          <User size={13} color="#5a635a" />
                          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', color: '#8f9c8f' }}>
                            {session.instructor}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin size={13} color="#5a635a" />
                        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#8f9c8f' }}>
                          {session.format || 'Live Virtual'}
                        </span>
                      </div>

                      {/* Seats bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Users size={12} color={isFull ? '#5a635a' : '#46a239'} />
                            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: isFull ? '#5a635a' : '#46a239' }}>
                              {isFull ? 'Turma lotada' : `${seatsLeft} vagas restantes`}
                            </span>
                          </div>
                          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#5a635a' }}>
                            {session.seats_filled}/{session.seats_total}
                          </span>
                        </div>
                        <div style={{ height: 4, backgroundColor: '#1a1f1a', borderRadius: '2px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${seatsPct}%`,
                            backgroundColor: isFull ? '#5a635a' : seatsPct > 75 ? '#c0a239' : '#46a239',
                            borderRadius: '2px',
                            transition: 'width 0.3s',
                          }} />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="px-5 pb-5">
                      <button
                        onClick={() => handleEnroll(session)}
                        disabled={isFull}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          width: '100%',
                          fontFamily: 'Plus Jakarta Sans, sans-serif',
                          fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          backgroundColor: isFull ? 'transparent' : '#46a239',
                          color: isFull ? '#5a635a' : '#030903',
                          padding: '0.7rem', borderRadius: '10px',
                          border: isFull ? '1px solid #2a2e2a' : 'none',
                          cursor: isFull ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (!isFull) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#5ec04f' }}
                        onMouseLeave={e => { if (!isFull) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#46a239' }}>
                        {isFull ? 'Lotado' : 'Inscrever-se'}
                        {!isFull && <ArrowRight size={14} />}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

/* ===== ADMIN PANEL ===== */

interface AdminPanelProps {
  sessions: CourseSession[]
  loading: boolean
  onRefresh: () => Promise<void>
  adminOpen: boolean
  setAdminOpen: (v: boolean) => void
}

const emptyForm = {
  id: null as string | null,
  course_slug: '',
  course_title: '',
  cert_code: '',
  instructor: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  sessions: '',
  format: 'Live Virtual',
  seats_total: 30,
  seats_filled: 0,
  status: 'open',
}

function AdminPanel({ sessions, loading, onRefresh, adminOpen, setAdminOpen }: AdminPanelProps) {
  const [form, setForm] = useState({ ...emptyForm })
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === sessions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(sessions.map(s => s.id)))
    }
  }

  const handleBulkDelete = async () => {
    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    const res = await supabase.from('course_sessions').delete().in('id', ids)
    setBulkDeleting(false)
    if (res.error) {
      setError('Não foi possível excluir as turmas selecionadas.')
      return
    }
    setSelectedIds(new Set())
    setConfirmBulkDelete(false)
    await onRefresh()
  }

  const startEdit = (s: CourseSession) => {
    setEditing(true)
    setForm({
      id: s.id,
      course_slug: s.course_slug,
      course_title: s.course_title,
      cert_code: s.cert_code,
      instructor: s.instructor || '',
      start_date: s.start_date,
      end_date: s.end_date,
      start_time: s.start_time || '',
      end_time: s.end_time || '',
      sessions: s.sessions || '',
      format: s.format || 'Live Virtual',
      seats_total: s.seats_total,
      seats_filled: s.seats_filled,
      status: s.status,
    })
    setAdminOpen(true)
    setError('')
  }

  const startNew = () => {
    setEditing(false)
    setForm({ ...emptyForm })
    setAdminOpen(true)
    setError('')
  }

  const startDuplicate = (s: CourseSession) => {
    setEditing(false)
    setForm({
      id: null,
      course_slug: s.course_slug,
      course_title: s.course_title,
      cert_code: s.cert_code,
      instructor: s.instructor || '',
      start_date: '',
      end_date: '',
      start_time: s.start_time || '',
      end_time: s.end_time || '',
      sessions: s.sessions || '',
      format: s.format || 'Live Virtual',
      seats_total: s.seats_total,
      seats_filled: 0,
      status: 'open',
    })
    setAdminOpen(true)
    setError('')
  }

  const onCourseSelect = (slug: string) => {
    const course = COURSES.find(c => c.slug === slug)
    if (course) {
      setForm(f => ({ ...f, course_slug: slug, course_title: course.title, cert_code: course.certCode }))
    } else {
      setForm(f => ({ ...f, course_slug: slug }))
    }
  }

  const handleSave = async () => {
    setError('')
    if (!form.course_slug || !form.start_date || !form.end_date) {
      setError('Curso, data de início e data de fim são obrigatórios.')
      return
    }
    if (form.end_date < form.start_date) {
      setError('A data final não pode ser anterior à data inicial.')
      return
    }
    setSaving(true)
    const payload = {
      course_slug: form.course_slug,
      course_title: form.course_title,
      cert_code: form.cert_code,
      instructor: form.instructor || null,
      start_date: form.start_date,
      end_date: form.end_date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      sessions: form.sessions || null,
      format: form.format || 'Live Virtual',
      seats_total: form.seats_total,
      seats_filled: form.seats_filled,
      status: form.status,
      updated_at: new Date().toISOString(),
    }
    let res
    if (editing && form.id) {
      res = await supabase.from('course_sessions').update(payload).eq('id', form.id)
    } else {
      res = await supabase.from('course_sessions').insert(payload)
    }
    setSaving(false)
    if (res.error) {
      setError('Não foi possível salvar. Verifique as permissões e tente novamente.')
      return
    }
    await onRefresh()
    setAdminOpen(false)
    setEditing(false)
    setForm({ ...emptyForm })
  }

  const handleDelete = async (id: string) => {
    const res = await supabase.from('course_sessions').delete().eq('id', id)
    if (res.error) {
      setError('Não foi possível excluir esta turma.')
      return
    }
    setConfirmDelete(null)
    await onRefresh()
  }

  const fieldStyle: React.CSSProperties = {
    backgroundColor: '#1a1f1a', border: '1px solid #2a2e2a', borderRadius: '10px',
    padding: '0.6rem 0.8rem', fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.82rem', color: '#edf3ed', outline: 'none', width: '100%',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontSize: '0.7rem', color: '#8f9c8f', marginBottom: '0.3rem',
  }

  return (
    <section className="px-8 py-12" style={{ borderTop: '1px solid #2a2e2a', backgroundColor: '#080d08' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div style={{
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'rgba(70,162,57,0.1)', border: '1px solid rgba(70,162,57,0.25)', borderRadius: '10px',
            }}>
              <Settings size={20} color="#46a239" />
            </div>
            <div>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.16em', color: '#46a239', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                Modo administrador
              </span>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1.15 }}>
                Gerenciar calendário
              </h2>
            </div>
          </div>
          <button onClick={startNew}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903', padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }}
            className="hover:bg-green-500 transition-colors">
            <Plus size={16} />
            Nova turma
          </button>
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', backgroundColor: 'rgba(200,60,60,0.08)', border: '1px solid rgba(200,60,60,0.25)', borderRadius: '10px' }}>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#e08080' }}>{error}</p>
          </div>
        )}

        {/* Sessions list */}
        {loading ? (
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5a635a' }}>Carregando...</p>
        ) : sessions.length === 0 ? (
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5a635a' }}>Nenhuma turma cadastrada. Clique em "Nova turma" para adicionar.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Bulk actions bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-1"
              style={{ padding: '0.6rem 1rem', backgroundColor: 'rgba(70,162,57,0.04)', border: '1px solid rgba(70,162,57,0.12)', borderRadius: '12px' }}>
              <button onClick={toggleSelectAll}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: selectedIds.size === sessions.length && sessions.length > 0 ? '#46a239' : '#8f9c8f', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', fontWeight: 600 }}>
                {selectedIds.size === sessions.length && sessions.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                {selectedIds.size === sessions.length && sessions.length > 0 ? 'Desmarcar tudo' : 'Selecionar tudo'}
              </button>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-3">
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#46a239' }}>
                    {selectedIds.size} selecionada{selectedIds.size > 1 ? 's' : ''}
                  </span>
                  <button onClick={() => setConfirmBulkDelete(true)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: 'rgba(200,60,60,0.12)', color: '#e08080', padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(200,60,60,0.25)', cursor: 'pointer' }}
                    className="hover:bg-red-600/20 hover:border-red-400/50 transition-all">
                    <Trash2 size={14} />
                    Excluir selecionadas
                  </button>
                </div>
              )}
            </div>

            {sessions.map(s => {
              const isSelected = selectedIds.has(s.id)
              return (
              <div key={s.id} className="flex items-center gap-3 flex-wrap"
                style={{ padding: '0.7rem 1rem', backgroundColor: isSelected ? 'rgba(200,60,60,0.04)' : '#0d130d', border: `1px solid ${isSelected ? 'rgba(200,60,60,0.25)' : '#2a2e2a'}`, borderRadius: '12px', transition: 'all 0.15s' }}>
                <button onClick={() => toggleSelect(s.id)} title={isSelected ? 'Desmarcar' : 'Selecionar'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSelected ? '#e08080' : '#5a635a', display: 'flex', alignItems: 'center', padding: 0, flexShrink: 0 }}
                  className="hover:text-red-400 transition-colors">
                  {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', fontWeight: 700, color: '#46a239', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(70,162,57,0.08)', border: '1px solid rgba(70,162,57,0.2)', borderRadius: '6px', flexShrink: 0 }}>
                  {s.cert_code}
                </span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#edf3ed', flex: 1, minWidth: 120 }}>
                  {s.course_title}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#8f9c8f' }}>
                  {formatDateRange(s.start_date, s.end_date)}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: s.status === 'open' ? '#46a239' : '#8f9c8f', padding: '0.15rem 0.45rem', border: `1px solid ${s.status === 'open' ? 'rgba(70,162,57,0.2)' : '#2a2e2a'}`, borderRadius: '6px' }}>
                  {s.status === 'open' ? 'Aberta' : s.status === 'full' ? 'Lotada' : 'Fechada'}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(s)} title="Editar"
                    style={{ background: 'none', border: '1px solid #2a2e2a', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#8f9c8f', display: 'flex', alignItems: 'center' }}
                    className="hover:border-white/40 hover:text-white transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => startDuplicate(s)} title="Duplicar turma"
                    style={{ background: 'none', border: '1px solid #2a2e2a', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#8f9c8f', display: 'flex', alignItems: 'center' }}
                    className="hover:border-white/40 hover:text-white transition-all">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => setConfirmDelete(s.id)} title="Excluir"
                    style={{ background: 'none', border: '1px solid rgba(200,60,60,0.25)', borderRadius: '8px', padding: '0.35rem', cursor: 'pointer', color: '#a06060', display: 'flex', alignItems: 'center' }}
                    className="hover:border-red-400/60 hover:text-red-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              )
            })}
          </div>
        )}

        {/* Confirm bulk delete dialog */}
        {confirmBulkDelete && (
          <>
            <div onClick={() => setConfirmBulkDelete(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.6)' }} />
            <div style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 201,
              backgroundColor: '#0d130d', border: '1px solid #2a2e2a', borderRadius: '16px',
              padding: '2rem', width: '100%', maxWidth: 380, boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#edf3ed', marginBottom: '0.75rem' }}>
                Excluir {selectedIds.size} turma{selectedIds.size > 1 ? 's' : ''}?
              </h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Esta ação não pode ser desfeita. Todas as {selectedIds.size} turma{selectedIds.size > 1 ? 's selecionadas' : ' selecionada'} serão removidas do calendário permanentemente.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmBulkDelete(false)}
                  style={{ flex: 1, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#8f9c8f', padding: '0.6rem', borderRadius: '10px', border: '1px solid #2a2e2a', backgroundColor: 'transparent', cursor: 'pointer' }}
                  className="hover:border-white/40 transition-all">Cancelar</button>
                <button onClick={handleBulkDelete} disabled={bulkDeleting}
                  style={{ flex: 1, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#fff', padding: '0.6rem', borderRadius: '10px', border: 'none', backgroundColor: '#c04040', cursor: 'pointer', opacity: bulkDeleting ? 0.6 : 1 }}
                  className="hover:bg-red-600 transition-colors">
                  {bulkDeleting ? 'Excluindo...' : `Excluir ${selectedIds.size}`}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Confirm delete dialog */}
        {confirmDelete && (
          <>
            <div onClick={() => setConfirmDelete(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.6)' }} />
            <div style={{
              position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 201,
              backgroundColor: '#0d130d', border: '1px solid #2a2e2a', borderRadius: '16px',
              padding: '2rem', width: '100%', maxWidth: 380, boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
            }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#edf3ed', marginBottom: '0.75rem' }}>
                Excluir turma?
              </h3>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Esta ação não pode ser desfeita. A turma será removida do calendário permanentemente.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDelete(null)}
                  style={{ flex: 1, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#8f9c8f', padding: '0.6rem', borderRadius: '10px', border: '1px solid #2a2e2a', backgroundColor: 'transparent', cursor: 'pointer' }}
                  className="hover:border-white/40 transition-all">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)}
                  style={{ flex: 1, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#fff', padding: '0.6rem', borderRadius: '10px', border: 'none', backgroundColor: '#c04040', cursor: 'pointer' }}
                  className="hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit/Create modal */}
      {adminOpen && (
        <>
          <div onClick={() => setAdminOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 201,
            backgroundColor: '#0d130d', border: '1px solid #2a2e2a', borderRadius: '20px',
            width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}>
            <div className="flex items-center justify-between" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #2a2e2a' }}>
              <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#edf3ed' }}>
                {editing ? 'Editar turma' : form.course_slug && !form.start_date ? 'Duplicar turma' : 'Nova turma'}
              </h3>
              <button onClick={() => setAdminOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8f9c8f' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Course select */}
              <div>
                <label style={labelStyle}>Curso *</label>
                <select value={form.course_slug} onChange={e => onCourseSelect(e.target.value)} style={fieldStyle}>
                  <option value="">Selecione um curso...</option>
                  {COURSES.map(c => (
                    <option key={c.slug} value={c.slug}>{c.title} ({c.certCode})</option>
                  ))}
                </select>
              </div>

              {/* Title + cert code (auto-filled, editable) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Título do curso</label>
                  <input value={form.course_title} onChange={e => setForm(f => ({ ...f, course_title: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Código da certificação</label>
                  <input value={form.cert_code} onChange={e => setForm(f => ({ ...f, cert_code: e.target.value }))} style={fieldStyle} />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Data de início *</label>
                  <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Data de fim *</label>
                  <input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} style={fieldStyle} />
                </div>
              </div>

              {/* Times */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Horário de início</label>
                  <input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Horário de fim</label>
                  <input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} style={fieldStyle} />
                </div>
              </div>

              {/* Instructor + sessions description */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Instrutor</label>
                  <input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="Nome do instrutor" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Sessões (descrição)</label>
                  <input value={form.sessions} onChange={e => setForm(f => ({ ...f, sessions: e.target.value }))} placeholder="Ex: 4 sessões de 4h" style={fieldStyle} />
                </div>
              </div>

              {/* Format + status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Formato</label>
                  <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} style={fieldStyle}>
                    <option value="Live Virtual">Live Virtual</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={fieldStyle}>
                    <option value="open">Aberta</option>
                    <option value="full">Lotada</option>
                    <option value="closed">Fechada</option>
                  </select>
                </div>
              </div>

              {/* Seats */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Vagas totais</label>
                  <input type="number" min={0} value={form.seats_total} onChange={e => setForm(f => ({ ...f, seats_total: parseInt(e.target.value) || 0 }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Vagas preenchidas</label>
                  <input type="number" min={0} value={form.seats_filled} onChange={e => setForm(f => ({ ...f, seats_filled: parseInt(e.target.value) || 0 }))} style={fieldStyle} />
                </div>
              </div>

              {/* Save */}
              <button onClick={handleSave} disabled={saving}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', marginTop: '0.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903', padding: '0.85rem', borderRadius: '12px', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
                className="hover:bg-green-500 transition-colors">
                {saving ? 'Salvando...' : <><Save size={16} /> {editing ? 'Salvar alterações' : 'Criar turma'}</>}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
