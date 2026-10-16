import { FormEvent, useEffect, useRef, useState } from 'react'
import { LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const initialMessage: Message = {
  role: 'assistant',
  content: 'Olá. Sou o assistente da Genesis Academy, conectado ao Nemotron da NVIDIA. Posso ajudar você a encontrar treinamentos, certificações e trilhas para sua carreira.',
}

export function NemotronChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = input.trim()
    if (!content || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content }]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)

    const { data, error: functionError } = await supabase.functions.invoke('nemotron-chat', {
      body: {
        messages: [
          {
            role: 'system',
            content: 'Você é o assistente da Genesis Academy. Responda em português do Brasil, seja claro, objetivo e recomende os treinamentos da plataforma quando fizer sentido. Não invente preços, datas ou disponibilidade; oriente o usuário a falar com a equipe quando não souber.',
          },
          ...nextMessages,
        ],
      },
    })

    if (functionError || typeof data?.message !== 'string') {
      setError(functionError?.message || 'O assistente não conseguiu responder agora.')
    } else {
      setMessages(current => [...current, { role: 'assistant', content: data.message }])
    }

    setLoading(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {open && (
        <section className="flex h-[min(650px,calc(100vh-120px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-[24px] border border-[#3a4638] bg-[#111711] shadow-[0_24px_80px_rgba(0,0,0,0.5)] animate-fade-up" aria-label="Assistente Nemotron">
          <header className="flex items-center justify-between border-b border-[#2b382b] bg-[#182018] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#46a239]/15 text-[#75d968]">
                <Sparkles size={19} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#edf3ed]">Assistente Nemotron</p>
                <p className="mt-0.5 text-[11px] text-[#8f9c8f]">IA da NVIDIA para sua jornada</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#8f9c8f] transition hover:bg-[#263126] hover:text-[#edf3ed]" aria-label="Fechar assistente">
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-[#46a239] text-white' : 'rounded-bl-md border border-[#2f3b2e] bg-[#1c251c] text-[#dbe5da]'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#2f3b2e] bg-[#1c251c] px-4 py-3 text-sm text-[#8f9c8f]">
                  <LoaderCircle size={15} className="animate-spin text-[#75d968]" /> Pensando...
                </div>
              </div>
            )}
            {error && <p className="rounded-xl border border-[#6b3e32] bg-[#351f1a] px-3 py-2 text-xs leading-5 text-[#f1b3a3]">{error}</p>}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-[#2b382b] bg-[#151d15] p-3">
            <div className="flex items-end gap-2 rounded-xl border border-[#354335] bg-[#0d120d] p-2 focus-within:border-[#46a239]">
              <textarea value={input} onChange={event => setInput(event.target.value)} placeholder="Pergunte sobre os treinamentos..." rows={1} maxLength={4000} className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-5 text-[#edf3ed] outline-none placeholder:text-[#687568]" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit() } }} />
              <button type="submit" disabled={!input.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#46a239] text-white transition hover:bg-[#5ec04f] disabled:cursor-not-allowed disabled:opacity-40" aria-label="Enviar mensagem">
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#687568]">Respostas geradas pela NVIDIA Nemotron</p>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setOpen(current => !current)} className="group flex items-center gap-3 rounded-full border border-[#5ec04f]/40 bg-[#46a239] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(44,120,35,0.35)] transition hover:-translate-y-0.5 hover:bg-[#5ec04f]" aria-expanded={open}>
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        <span className="hidden sm:inline">Fale com a Nemotron</span>
      </button>
    </div>
  )
}
