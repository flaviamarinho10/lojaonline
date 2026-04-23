import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl?: string;
    active?: boolean;
}

export default function Header() {
    const { items, setIsCartOpen } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/`);
        }
    };

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (error) {
                console.error('Error fetching categories for header:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <header className="w-full bg-[#fce4ec] relative z-[100]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5 pb-3 md:pt-4 md:pb-2">
                <div className="flex items-center md:items-start justify-between gap-4 md:gap-8">
                    
                    {/* Left: Logo */}
                    <Link
                        to="/"
                        className="flex-shrink-0 flex flex-col justify-center mt-1"
                        aria-label="Ir para página inicial"
                    >
                        <h1 className="text-[42px] md:text-5xl font-black tracking-tighter text-[#4a4a4a] leading-none mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            shine.
                        </h1>
                        <span className="text-xs md:text-xs text-[#4a4a4a] uppercase tracking-widest pl-1 font-medium">
                            glam
                        </span>
                    </Link>

                    {/* Center: Search Bar & Nav */}
                    <div className="hidden md:flex flex-1 flex-col mx-4 md:mx-8 max-w-3xl mt-2">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="w-full flex items-center bg-white rounded-full shadow-sm overflow-hidden mb-4">
                            <input
                                type="text"
                                placeholder="BUSCAR"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-xs text-gray-600 placeholder:text-gray-400 px-6 py-2.5 font-medium"
                            />
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-2.5 rounded-full mr-0.5 hover:bg-gray-800 transition-colors"
                                aria-label="Buscar"
                            >
                                <Search size={16} strokeWidth={2.5} />
                            </button>
                        </form>

                        {/* Navigation Menu */}
                        <nav aria-label="Navegação principal">
                            <ul className="flex items-center justify-center gap-6">
                                {categories.filter(cat => cat.active !== false).slice(0, 7).map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            to={`/?category=${category.id}`}
                                            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4a4a4a] hover:text-rosa-500 transition-colors whitespace-nowrap"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4 sm:gap-4 flex-shrink-0 md:mt-3">
                        {/* Search (Mobile) */}
                        <button className="md:hidden text-[#4a4a4a] p-1" aria-label="Pesquisar">
                            <Search size={24} strokeWidth={1.5} />
                        </button>


                        {/* Cart */}
                        <button
                            id="cart-icon-target"
                            className="relative text-[#4a4a4a] hover:text-rosa-500 p-1 transition-colors flex items-center gap-1"
                            onClick={() => setIsCartOpen(true)}
                            aria-label={`Carrinho com ${itemCount} itens`}
                        >
                            <ShoppingBag size={24} className="md:w-[22px] md:h-[22px]" strokeWidth={1.5} />
                            <span className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] md:h-4 md:w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                                {itemCount}
                            </span>
                        </button>

                        {/* Mobile menu toggle */}
                        <button
                            className="md:hidden text-[#4a4a4a] p-1"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        >
                            {mobileMenuOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 top-full shadow-lg">
                    <nav className="px-4 py-4 space-y-4">
                        <div className="flex flex-col gap-3">
                            {categories.filter(cat => cat.active !== false).map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/?category=${category.id}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="py-2 text-sm font-semibold text-gray-700 uppercase tracking-widest border-b border-gray-50"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
