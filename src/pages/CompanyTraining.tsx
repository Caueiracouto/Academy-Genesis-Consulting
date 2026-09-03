import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { COURSES } from '@/data/courses'
import { Building2, Users, ArrowLeft, CheckCircle2, Clock, Calendar, Globe, GraduationCap, Sparkles, ShieldCheck } from 'lucide-react'

export default function CompanyTraining() {
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

  return (
    <div style={{ backgroundColor: '#030903', minHeight: '100vh', color: '#edf3ed' }}>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(3,9,3,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(70,162,57,0.12)', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(`/treinamento/${course.slug}`)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#8f9c8f', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#edf3ed')}
          onMouseLeave={e => (e.currentTarget.style.color = '#8f9c8f')}>
          <ArrowLeft size={16} />
          Voltar ao treinamento
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <img src="/image.png" alt="Genesis Consulting" style={{ width: 128, height: 'auto', display: 'block', backgroundColor: '#ffffff', borderRadius: '4px' }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.22em', color: '#46a239', textTransform: 'uppercase', marginTop: '0.3rem' }}>Academy</span>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '4rem 2rem 3rem', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(70,162,57,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(70,162,57,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 400, height: 400, background: 'radial-gradient(circle at top right, rgba(70,162,57,0.06), transparent 65%)' }} />

        <div style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#5a635a', letterSpacing: '0.08em' }}>Academy</span>
            <span style={{ color: '#3a3f3a', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#5a635a', letterSpacing: '0.08em' }}>{course.category}</span>
            <span style={{ color: '#3a3f3a', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: '#46a239', letterSpacing: '0.08em' }}>In-Company</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem', backgroundColor: 'rgba(70,162,57,0.08)', border: '1px solid rgba(70,162,57,0.25)', borderRadius: '10px', marginBottom: '1.5rem' }}>
            <Building2 size={16} color="#46a239" />
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.12em', color: '#46a239', textTransform: 'uppercase' }}>Treinamento In-Company</span>
          </div>

          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            AI-Empowered {course.title}
          </h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.05rem', color: '#8f9c8f', lineHeight: 1.75, maxWidth: '60ch', marginBottom: '2rem' }}>
            Treinamento exclusivo para equipes corporativas. O mesmo conteúdo oficial do curso <span style={{ color: '#edf3ed', fontWeight: 600 }}>{course.title}</span>, aplicado em formato fechado e dedicado à sua organização — com agenda personalizada e foco nos desafios reais da sua empresa.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            {[
              { icon: <Clock size={16} color="#46a239" />, label: 'Carga horária', value: course.duration },
              { icon: <Calendar size={16} color="#46a239" />, label: 'Formato', value: course.sessions },
              { icon: <Globe size={16} color="#46a239" />, label: 'Modalidade', value: 'Live Virtual' },
              { icon: <GraduationCap size={16} color="#46a239" />, label: 'Idioma', value: 'Português' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {m.icon}
                <div>
                  <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#5a635a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>{m.label}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#edf3ed', fontWeight: 600 }}>{m.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 6rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Minimum notice banner */}
          <div style={{ border: '1px solid rgba(212,168,67,0.3)', backgroundColor: 'rgba(212,168,67,0.06)', borderRadius: '16px', padding: '1.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: '12px', backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} color="#d4a843" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.2rem', fontWeight: 700, color: '#edf3ed', marginBottom: '0.5rem' }}>
                Mínimo de 10 participantes
              </h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.9rem', color: '#c4d0c4', lineHeight: 1.65 }}>
                Para fechar uma turma in-company deste treinamento, é necessário um <span style={{ color: '#d4a843', fontWeight: 600 }}>mínimo de 10 pessoas</span>. A turma é exclusiva para a sua empresa, com agenda e dinâmicas adaptadas à realidade do seu time.
              </p>
            </div>
          </div>

          {/* Ementa */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Ementa do Curso</h2>
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', color: '#5a635a', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              O treinamento in-company segue a mesma ementa oficial do curso {course.title}:
            </p>
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
                  <CheckCircle2 size={14} color="#46a239" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.88rem', color: '#8f9c8f', lineHeight: 1.55 }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vantagens In-Company */}
          <div style={{ border: '1px solid rgba(70,162,57,0.25)', backgroundColor: 'rgba(70,162,57,0.04)', borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, background: 'radial-gradient(circle at top right, rgba(70,162,57,0.08), transparent 65%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', position: 'relative' }}>
              <div style={{ width: 4, height: 24, backgroundColor: '#46a239', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.35rem', fontWeight: 700 }}>Vantagens do formato In-Company</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', position: 'relative' }}>
              {[
                { title: 'Turma exclusiva', desc: 'Treinamento dedicado apenas ao seu time, sem participantes externos.' },
                { title: 'Agenda personalizada', desc: 'Datas e horários ajustados à disponibilidade da sua equipe.' },
                { title: 'Foco no seu contexto', desc: 'Exercícios e estudos de caso adaptados à realidade da sua empresa.' },
                { title: 'Economia por participante', desc: 'Valor por pessoa reduz em comparação com turmas abertas.' },
                { title: 'Materiais oficiais', desc: 'Todo o conteúdo oficial Scaled Agile® incluído, igual à turma aberta.' },
                { title: 'Certificação inclusa', desc: 'Cada participante recebe o exame de certificação SAFe®.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.85rem', backgroundColor: 'rgba(70,162,57,0.05)', border: '1px solid rgba(70,162,57,0.12)', borderRadius: '12px' }}>
                  <Sparkles size={16} color="#46a239" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.82rem', color: '#edf3ed', marginBottom: '0.2rem' }}>{item.title}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f', lineHeight: 1.5 }}>{item.desc}</p>
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
                A Genesis Consulting é uma consultoria <span style={{ color: '#46a239', fontWeight: 600 }}>AI-empowered</span> — integramos inteligência artificial em nossa metodologia de ensino e em projetos reais de transformação. No formato in-company, esse diferencial é ainda mais potente: adaptamos os exercícios de IA para o contexto da sua empresa.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { title: 'IA nos exercícios práticos', desc: 'Simulações e dinâmicas enriquecidas com ferramentas de IA que replicam cenários reais de ARTs e PI Plannings.' },
                  { title: 'IA no dia a dia do SAFe', desc: 'Casos de uso de IA aplicados a backlog refinement, métricas de fluxo e gestão de portfólio lean.' },
                  { title: 'Ferramentas que aceleram', desc: 'Demonstrações ao vivo de como IA generativa apoia a escrita de features, stories e critérios de aceitação.' },
                  { title: 'Competitividade profissional', desc: 'Sua equipe sai sabendo aplicar IA no contexto SAFe — um diferencial que outras escolas não oferecem.' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.85rem', backgroundColor: 'rgba(70,162,57,0.05)', border: '1px solid rgba(70,162,57,0.12)', borderRadius: '12px' }}>
                    <Sparkles size={16} color="#46a239" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
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

        {/* RIGHT — CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '5rem' }}>

          {/* CTA Card */}
          <div style={{ border: '1px solid rgba(70,162,57,0.25)', backgroundColor: '#1a1f1a', borderRadius: '16px', padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#46a239', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Proposta para empresas
              </p>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.25, marginBottom: '1.25rem' }}>
                Solicite uma proposta in-company
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Treinamento</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.78rem', color: '#edf3ed' }}>{course.certCode}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Carga horária</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#edf3ed' }}>{course.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #2a2e2a' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Mínimo de participantes</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#d4a843' }}>10 pessoas</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f' }}>Modalidade</span>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.82rem', color: '#edf3ed' }}>Live Virtual</span>
                </div>
              </div>

              <a href="https://br.genesisconsulting.com/treinamentos/" target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: '#46a239', color: '#030903', padding: '0.9rem', borderRadius: '12px', textDecoration: 'none', marginBottom: '0.75rem', transition: 'background-color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#5ec04f')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#46a239')}>
                Solicitar proposta →
              </a>
              <button onClick={() => navigate(`/treinamento/${course.slug}`)}
                style={{ display: 'block', width: '100%', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', fontWeight: 500, color: '#8f9c8f', padding: '0.65rem', border: '1px solid #3a3f3a', borderRadius: '12px', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = '#46a239')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3f3a')}>
                Ver turma aberta
              </button>
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
                  <CheckCircle2 size={13} color="#46a239" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', color: '#8f9c8f', lineHeight: 1.5 }}>{inc}</span>
                </div>
              ))}
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

          {/* PDUs */}
          <div style={{ border: '1px solid #2a2e2a', backgroundColor: '#242824', borderRadius: '16px', padding: '1.25rem' }}>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.63rem', color: '#8f9c8f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Créditos Profissionais
            </p>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.82rem', color: '#8f9c8f', lineHeight: 1.6 }}>{course.pdus}</p>
          </div>

          {/* Partner badge */}
          <div style={{ padding: '1rem', backgroundColor: 'rgba(70,162,57,0.05)', border: '1px solid rgba(70,162,57,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={20} color="#46a239" />
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.78rem', color: '#8f9c8f', lineHeight: 1.5 }}>
              <span style={{ color: '#46a239', fontWeight: 600 }}>Scaled Agile® Silver Partner.</span> Conteúdo oficial e certificações internacionalmente reconhecidas.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
