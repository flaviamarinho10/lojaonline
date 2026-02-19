import { useCart } from '../contexts/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { items, setIsCartOpen } = useCart();
    const navigate = useNavigate();
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="h-8 w-8 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xl group-hover:bg-emerald-400 transition-colors">
                        S
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tighter">
                        Suple<span className="text-emerald-500">Store</span>
                    </span>
                </div>

                {/* Cart Trigger */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                >
                    <ShoppingBag size={24} />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white animate-in zoom-in">
                            {itemCount}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
}
