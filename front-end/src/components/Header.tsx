import { ShoppingBag, Search, User, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { items, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full bg-[#F9F6F0] border-b border-stone-200/50 transition-all duration-300">
            <div className="container mx-auto px-6 h-24 flex items-center justify-between">

                {/* Left: Search */}
                <div className="flex items-center w-1/3">
                    <button className="text-stone-500 hover:text-stone-800 transition-colors p-2 rounded-full hover:bg-stone-100/50">
                        <Search size={22} strokeWidth={1} />
                    </button>
                    <span className="hidden md:inline-block ml-3 text-xs uppercase tracking-[0.2em] text-stone-400">Buscar</span>
                </div>

                {/* Center: Logo */}
                <div className="w-1/3 flex justify-center">
                    <div
                        className="cursor-pointer text-center group"
                        onClick={() => navigate('/')}
                    >
                        <h1 className="font-serif text-4xl font-normal tracking-tight text-stone-900 group-hover:text-rose-900/80 transition-colors">
                            flavia beauty
                        </h1>
                    </div>
                </div>

                {/* Right: Icons */}
                <div className="w-1/3 flex items-center justify-end gap-6 text-stone-800">
                    <div className="hidden md:flex items-center gap-4">
                        <button className="hover:text-rose-800 transition-colors p-2">
                            <User size={22} strokeWidth={1} />
                        </button>
                        <button className="hover:text-rose-800 transition-colors p-2">
                            <Heart size={22} strokeWidth={1} />
                        </button>
                    </div>

                    <button
                        className="relative group hover:text-rose-800 transition-colors p-2"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag size={22} strokeWidth={1} />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-rose-900 text-[9px] font-medium text-white shadow-sm">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
