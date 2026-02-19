import { useState } from 'react'
import { CartProvider, useCart } from './contexts/CartContext'
import Store from './pages/Store'
import Admin from './pages/Admin'
import { ShoppingBag, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Navbar = ({ view, setView }: { view: 'store' | 'admin', setView: (v: 'store' | 'admin') => void }) => {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="font-bold text-2xl tracking-tighter cursor-pointer flex items-center gap-2"
          onClick={() => setView('store')}
        >
          <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white">
            <span className="font-serif italic">L</span>
          </div>
          Loja Online
        </div>
        <div className="flex gap-4 items-center">
          <Button
            variant={view === 'store' ? "default" : "ghost"}
            onClick={() => setView('store')}
            className="gap-2"
          >
            <ShoppingBag size={18} />
            Store
            {itemCount > 0 && (
              <span className="ml-1 bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </Button>
          <Button
            variant={view === 'admin' ? "default" : "ghost"}
            onClick={() => setView('admin')}
            size="icon"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const [view, setView] = useState<'store' | 'admin'>('store');

  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-50 font-sans text-foreground">
        <Navbar view={view} setView={setView} />
        <main>
          {view === 'store' ? <Store /> : <Admin />}
        </main>
      </div>
    </CartProvider>
  )
}

export default App
