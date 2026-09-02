import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { COURSES } from '@/data/courses'

const LEVEL_COLOR: Record<string, { text: string; bg: string; border: string }> = {
  Iniciante: { text: '#5ec04f', bg: 'rgba(94,192,79,0.08)', border: 'rgba(94,192,79,0.25)' },
  Intermediário: { text: '#d4a843', bg: 'rgba(212,168,67,0.08)', border: 'rgba(212,168,67,0.25)' },
  Avançado: { text: '#e6c25a', bg: 'rgba(230,194,90,0.08)', border: 'rgba(230,194,90,0.25)' },
}

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const course = COURSES.find(c => c.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!course) {
    return (
      <div style={{ backgroundColor: '#030903', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#edf3ed' }}>Treinamento não encontrado.</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '1.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#46a239', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>← Voltar à Academy</button>
        </div>
      </div>
    )
  }

  const lvl = LEVEL_COLOR[course.level]

  return (
    <div style={{ backgroundColor: '#030903', minHeight: '100vh', color: '#edf3ed' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(3,9,3,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(70,162,57,0.12)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#8f9c8f', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#edf3ed')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8f9c8f')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Voltar à Academy
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#edf3ed' }}>Genesis</span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.22em', color: '#46a239', textTransform: 'uppercase' }}>Academy</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '4rem 2rem 3rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(70,162,57,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(70,162,57,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#5a635a', letterSpacing: '0.08em' }}>Academy</span>
            <span style={{ color: '#3a3f3a', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#5a635a', letterSpacing: '0.08em' }}>{course.category}</span>
            <span style={{ color: '#3a3f3a', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#46a239', letterSpacing: '0.08em' }}>{course.certCode}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.12em', color: '#46a239', padding: '0.3rem 0.7rem', backgroundColor: 'rgba(70,162,57,0.08)', border: '1px solid rgba(70,162,57,0.2)', borderRadius: '8px', textTransform: 'uppercase' }}>
                  SAFe® {course.certCode}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', color: lvl.text, padding: '0.3rem 0.7rem', backgroundColor: lvl.bg, border: `1px solid ${lvl.border}`, borderRadius: '8px' }}>
                  {course.level}
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.08em', color: '#8f9c8f', padding: '0.3rem 0.7rem', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}>
                  {course.category}
                </span>
              </div>

              <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {course.title}
              </h1>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.05rem', color: '#8f9c8f', lineHeight: 1.75, maxWidth: '60ch', marginBottom: '2rem' }}>
                {course.fullDescription}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                {[
                  { icon: '⏱', label: 'Carga horária', value: course.duration },
                  { icon: '📅', label: 'Formato', value: course.sessions },
                  { icon: '🖥', label: 'Modalidade', value: 'Live Virtual' },
                  { icon: '🌐', label: 'Idioma', value: 'Português' },
                ].map(m => (
                  <div key={m.label}>
                    <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#5a635a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{m.label}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#edf3ed', fontWeight: 600 }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ width: 220, height: 160, flexShrink: 0, overflow: 'hidden', borderRadius: '12px', border: '1px solid rgba(70,162,57,0.15)', display: 'none' }} className="hidden lg:block">
              <img src={`https://images.unsplash.com/${course.image}?w=440&h=320&fit=crop&auto=format`} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Ementa */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Ementa do Curso</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {course.syllabus.map((item, idx) => (
                <div key={item} style={{ display: 'flex', gap: '1rem', padding: '0.85rem 0', borderBottom: idx < course.syllabus.length - 1 ? '1px solid #2a2e2a' : 'none' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: '#46a239', flexShrink: 0, marginTop: '0.1rem', minWidth: '1.5rem' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#c4d0c4', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Público-alvo */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Indicado para</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {course.audience.map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#46a239" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '0.2rem' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', color: '#8f9c8f', lineHeight: 1.55 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefícios */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Benefícios</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {course.benefits.map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.85rem', backgroundColor: 'rgba(70,162,57,0.05)', border: '1px solid rgba(70,162,57,0.12)', borderRadius: '12px' }}>
                  <span style={{ color: '#46a239', fontSize: '0.8rem', flexShrink: 0, marginTop: '0.15rem' }}>✦</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.825rem', color: '#8f9c8f', lineHeight: 1.55 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Como é aplicado */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Como o treinamento é aplicado</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '🎥', title: 'Live Virtual', desc: 'Sessões ao vivo com instrutor certificado SAFe®, em português. Totalmente interativas e com dinâmicas de grupo.' },
                { icon: '📚', title: 'Materiais Oficiais', desc: 'Todo o conteúdo segue os padrões oficiais do Scaled Agile®. Materiais digitais disponíveis durante e após o curso.' },
                { icon: '🤝', title: 'Altamente Interativo', desc: 'Exercícios práticos, simulações e estudos de caso reais promovem aprendizado imediato e aplicação no dia a dia.' },
                { icon: '🏅', title: 'Certificação Incluída', desc: 'O exame de certificação oficial SAFe® está incluído. Deve ser realizado em até 30 dias após o curso.' },
                { icon: '💳', title: 'Pagamento Facilitado', desc: 'Aceito via Pix, boleto ou cartão de crédito em até 12x. Nota fiscal eletrônica emitida após a conclusão.' },
                { icon: '🔒', title: 'Aulas Não Gravadas', desc: 'Por respeito à LGPD e à confidencialidade dos participantes, as sessões não são gravadas.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(70,162,57,0.04)', border: '1px solid rgba(70,162,57,0.1)', borderRadius: '12px' }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.875rem', color: '#edf3ed', marginBottom: '0.2rem' }}>{item.title}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.825rem', color: '#8f9c8f', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI-Empowered Differential */}
          <div style={{ border: '1px solid rgba(70,162,57,0.25)', backgroundColor: 'rgba(70,162,57,0.04)', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle at top right, rgba(70,162,57,0.08), transparent 65%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Treinamento AI-Empowered</h2>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#46a239', textTransform: 'uppercase', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(70,162,57,0.1)', border: '1px solid rgba(70,162,57,0.25)', borderRadius: '6px' }}>
                Diferencial Genesis
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.95rem', color: '#c4d0c4', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                A Genesis Consulting é uma consultoria <span style={{ color: '#46a239', fontWeight: 600 }}>AI-empowered</span> — integramos inteligência artificial em nossa metodologia de ensino e em projetos reais de transformação. Enquanto outras escolas e treinadoras utilizam apenas o material oficial do Scaled Agile®, nós enriquecemos cada treinamento com práticas de IA aplicadas ao dia a dia do SAFe.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { title: 'IA nos exercícios práticos', desc: 'Simulações e dinâmicas enriquecidas com ferramentas de IA que replicam cenários reais de ARTs e PI Plannings.' },
                  { title: 'IA no dia a dia do SAFe', desc: 'Casos de uso de IA aplicados a backlog refinement, métricas de fluxo e gestão de portfólio lean.' },
                  { title: 'Ferramentas que aceleram', desc: 'Demonstrações ao vivo de como IA generativa apoia a escrita de features, stories e critérios de aceitação.' },
                  { title: 'Competitividade profissional', desc: 'Você sai sabendo aplicar IA no contexto SAFe — um diferencial que outras escolas não oferecem.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.85rem', backgroundColor: 'rgba(70,162,57,0.05)', border: '1px solid rgba(70,162,57,0.12)', borderRadius: '12px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#46a239" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.15rem' }}>
                      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4z" />
                    </svg>
                    <div>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#edf3ed', marginBottom: '0.2rem' }}>{item.title}</p>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '5rem' }}>

          {/* CTA Card */}
          <div style={{ border: '1px solid rgba(70,162,57,0.25)', backgroundColor: '#1a1f1a', borderRadius: '16px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#46a239', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Inscreva-se agora
              </p>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '1.25rem' }}>
                Garanta sua vaga neste treinamento
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Carga horária</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#edf3ed' }}>{course.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Sessões</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#edf3ed' }}>{course.sessions}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Modalidade</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#edf3ed' }}>Live Virtual</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Idioma</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#edf3ed' }}>Português</span>
                </div>
              </div>
              <a href="https://br.genesisconsulting.com/treinamentos/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903', padding: '0.9rem', borderRadius: '12px', textDecoration: 'none', marginBottom: '0.75rem', transition: 'background-color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#5ec04f')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#46a239')}>
                Inscrever-se →
              </a>
              <button onClick={() => navigate(`/empresa/${course.slug}`)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#46a239', padding: '0.75rem', border: '1px solid rgba(70,162,57,0.3)', borderRadius: '12px', background: 'rgba(70,162,57,0.06)', cursor: 'pointer', transition: 'all 0.2s', marginTop: '0.75rem' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(70,162,57,0.12)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#46a239' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(70,162,57,0.06)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(70,162,57,0.3)' }}>
                <Building2 size={16} />
                Solicitar para Empresa
              </button>
            </div>
          </div>

          {/* Certification Card */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '1.5rem' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#8f9c8f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Certificação
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#46a239', marginBottom: '1rem', lineHeight: 1.4 }}>{course.certification.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Questões', value: String(course.certification.questions) },
                { label: 'Duração', value: course.certification.duration },
                { label: 'Aprovação', value: course.certification.passing },
                { label: 'Formato', value: course.certification.format },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.45rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#5a635a', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: '#8f9c8f', textAlign: 'right' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Includes Card */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '1.5rem' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#8f9c8f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              O que está incluído
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {course.includes.map(inc => (
                <div key={inc} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#46a239" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: '0.15rem' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#8f9c8f', lineHeight: 1.5 }}>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PDUs */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '1.25rem' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#8f9c8f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Créditos Profissionais
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f', lineHeight: 1.6 }}>{course.pdus}</p>
          </div>

          {/* Partner badge */}
          <div style={{ padding: '1rem', backgroundColor: 'rgba(70,162,57,0.05)', border: '1px solid rgba(70,162,57,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#46a239" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f', lineHeight: 1.5 }}>
              <span style={{ color: '#46a239', fontWeight: 600 }}>Scaled Agile® Silver Partner.</span> Conteúdo oficial e certificações internacionalmente reconhecidas.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
