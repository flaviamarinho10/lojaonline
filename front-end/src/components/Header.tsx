import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl?: string;
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
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-rosa-100/50 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 h-16 md:h-[72px] flex items-center justify-between gap-4">

                {/* Left: Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link
                        to="/"
                        className="cursor-pointer group"
                        aria-label="Ir para página inicial"
                    >
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-800 group-hover:text-rosa-400 transition-colors duration-200">
                            Shine <span className="font-light text-rosa-400">Glam</span>
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
                                <div className="p-3 space-y-0.5">
                                    {categories.map((category) => (
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
                        className="text-gray-400 hover:text-rosa-500 p-2.5 rounded-full hover:bg-rosa-50 transition-all"
                        aria-label="Pesquisar"
                    >
                        <Search size={20} strokeWidth={1.5} />
                    </button>

                    {/* Login */}
                    <button className="hidden md:flex items-center gap-2 text-gray-500 hover:text-rosa-500 px-3 py-2 rounded-full hover:bg-rosa-50 transition-all text-sm font-medium">
                        <User size={18} strokeWidth={1.5} />
                        <span>Entrar</span>
                    </button>

                    {/* Cart */}
                    <button
                        className="relative text-gray-400 hover:text-rosa-500 p-2.5 rounded-full hover:bg-rosa-50 transition-all duration-200"
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Carrinho com ${itemCount} itens`}
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rosa-400 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden text-gray-500 hover:text-rosa-500 p-2 rounded-full hover:bg-rosa-50 transition-all"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-rosa-100/50 animate-in slide-in-from-top duration-300">
                    <nav className="container mx-auto px-4 py-4 space-y-1" aria-label="Navegação mobile">
                        {/* Categories as pills */}
                        <div className="pb-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Categorias</p>
                            <div className="flex flex-wrap gap-2 px-1">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        to={`/categoria/${cat.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 bg-rosa-50 hover:bg-rosa-100 hover:text-rosa-600 transition-all border border-rosa-100"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="pt-3 border-t border-rosa-100/50 flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-rosa-50 text-rosa-500 py-3 rounded-2xl text-sm font-medium border border-rosa-100">
                                <User size={16} />
                                Entrar / Cadastrar
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
