import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export interface CartItem {
  slug: string
  title: string
  certCode: string
  duration: string
  sessions: string
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  checkoutOpen: boolean
  addToCart: (item: CartItem) => void
  removeFromCart: (slug: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  openCheckout: () => void
  closeCheckout: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_KEY = 'genesis_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = useCallback((item: CartItem) => {
    setItems(prev => {
      if (prev.some(i => i.slug === item.slug)) return prev
      return [...prev, item]
    })
    setIsOpen(true)
  }, [])

  const removeFromCart = useCallback((slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value: CartContextValue = {
    items,
    isOpen,
    checkoutOpen,
    addToCart,
    removeFromCart,
    clearCart,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    openCheckout: () => { setIsOpen(false); setCheckoutOpen(true) },
    closeCheckout: () => setCheckoutOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
