import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
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
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
        <header className="sticky top-0 z-[100] w-full glass-light transition-all duration-500">
            <div className="max-w-[1700px] mx-auto px-4 md:px-10 lg:px-16 h-20 md:h-[88px] flex items-center justify-between gap-8">

                {/* Left: Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link
                        to="/"
                        className="cursor-pointer group"
                        aria-label="Ir para página inicial"
                    >
                        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 group-hover:text-rosa-500 transition-all duration-500 flex items-center gap-1">
                            Shine <span className="font-light italic bg-clip-text bg-gradient-to-r from-rosa-400 to-purple-500">Glam</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-rosa-400 ml-1"></div>
                        </h1>
                    </Link>
                </div>

                {/* Center: Todos os Produtos dropdown (Desktop) */}
                <nav className="hidden lg:flex items-center" aria-label="Navegação principal">
                    <div
                        className="relative group"
                        onMouseEnter={() => setDropdownOpen(true)}
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <button
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-rosa-500 transition-colors duration-200 rounded-full hover:bg-rosa-50"
                        >
                            Todos os Produtos
                            <ChevronDown size={14} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-rosa-500' : 'text-gray-400'}`} />
                        </button>

                        {/* Dropdown */}
                        <div
                            className={`absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 transition-all duration-300 origin-top ${dropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                        >
                            <div className="bg-white rounded-2xl shadow-xl border border-rosa-100/60 overflow-hidden">
                                <div className="py-2">
                                    {categories.filter(cat => cat.active !== false).map((category) => (
                                        <Link
                                            key={category.id}
                                            to={`/categoria/${category.id}`}
                                            className="block text-sm text-gray-600 hover:text-rosa-500 hover:bg-rosa-50 px-4 py-2.5 rounded-xl transition-all"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                    {/* Search */}
                    <button
                        className="text-gray-900 hover:text-rosa-500 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-white/40 shadow-sm md:shadow-none"
                        aria-label="Pesquisar"
                    >
                        <Search size={22} strokeWidth={2.5} />
                    </button>

                    {/* Login */}
                    <button className="hidden md:flex items-center gap-3 text-gray-900 hover:text-rosa-500 px-5 py-3 rounded-2xl hover:bg-white/60 transition-all duration-300 text-xs font-black uppercase tracking-widest border border-transparent hover:border-white/40">
                        <User size={18} strokeWidth={2.5} />
                        <span>Minha Conta</span>
                    </button>

                    {/* Cart */}
                    <button
                        className="relative text-gray-900 hover:text-rosa-500 p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-white/40 shadow-sm md:shadow-none"
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Carrinho com ${itemCount} itens`}
                    >
                        <ShoppingBag size={22} strokeWidth={2.5} />
                        {itemCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] font-black text-white shadow-lg ring-2 ring-white">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden text-gray-900 p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-rosa-100/50 animate-in slide-in-from-top duration-300">
                    <nav className="container mx-auto px-4 py-6 space-y-6" aria-label="Navegação mobile">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Categorias</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.filter(cat => cat.active !== false).map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/categoria/${category.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 bg-rosa-50 hover:bg-rosa-100 hover:text-rosa-600 transition-all border border-rosa-100"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-rosa-100/50">
                            <button className="w-full flex items-center justify-center gap-2 bg-rosa-500 text-white py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-rosa-200 transition-transform active:scale-95">
                                <User size={18} />
                                Minha Conta
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
