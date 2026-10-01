import { supabase } from '@/lib/supabase'

const SESSION_KEY = 'genesis_session_id'

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export async function trackPageVisit(pagePath: string, courseSlug?: string) {
  try {
    const sessionId = getSessionId()
    const referrer = document.referrer || null

    await supabase.from('page_visits').insert({
      session_id: sessionId,
      page_path: pagePath,
      course_slug: courseSlug || null,
      referrer,
    })
  } catch {
    // Silently fail — tracking should never break the page
  }
}

export interface AbandonedCartLead {
  name?: string
  email?: string
  phone?: string
  company?: string
  cartItems: { slug: string; title: string; price?: number }[]
  cartTotal?: number
}

export async function saveAbandonedCart(lead: AbandonedCartLead) {
  try {
    const sessionId = getSessionId()

    // Check if there's an existing abandoned cart for this session
    const { data: existing } = await supabase
      .from('abandoned_carts')
      .select('id')
      .eq('session_id', sessionId)
      .eq('status', 'abandoned')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const payload = {
      session_id: sessionId,
      name: lead.name || null,
      email: lead.email || null,
      phone: lead.phone || null,
      company: lead.company || null,
      cart_items: lead.cartItems,
      cart_total: lead.cartTotal ?? null,
      status: 'abandoned',
      updated_at: new Date().toISOString(),
    }

    if (existing) {
      await supabase
        .from('abandoned_carts')
        .update(payload)
        .eq('id', existing.id)
    } else {
      await supabase.from('abandoned_carts').insert(payload)
    }
  } catch {
    // Silently fail
  }
}
