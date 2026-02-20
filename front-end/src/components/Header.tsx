import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Heart, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl?: string;
}

const navLinks = [
    { label: 'Todos os Produtos', href: '#', hasDropdown: true },
    { label: 'Mais Vendidos', href: '#' },
    { label: 'Lançamentos', href: '#' },
    { label: 'Kits', href: '#' },
    { label: 'Quem Somos', href: '#', hasDropdown: false }, // Only 'Todos os Produtos' requested as mega menu for now
];

export default function Header() {
    const { items, setIsCartOpen } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Category Data
    const [categories, setCategories] = useState<Category[]>([]);

    // Dropdown States
    const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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

    const handleMobileExpand = (label: string) => {
        setMobileExpanded(mobileExpanded === label ? null : label);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-all duration-300 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">

                {/* Left: Logo */}
                <div className="flex items-center flex-shrink-0">
                    <Link
                        to="/"
                        className="cursor-pointer group"
                        aria-label="Ir para página inicial"
                    >
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-rosa-500 transition-colors duration-200">
                            Flavia <span className="font-light">Beauty</span>
                        </h1>
                    </Link>
                </div>

                {/* Center: Nav (Desktop) */}
                <nav className="hidden lg:flex items-center gap-6" aria-label="Navegação principal">
                    {navLinks.map((link) => (
                        <div
                            key={link.label}
                            className="relative group" // Wrapper for dropdown positioning
                            onMouseEnter={() => link.hasDropdown && setDesktopDropdownOpen(true)}
                            onMouseLeave={() => link.hasDropdown && setDesktopDropdownOpen(false)}
                        >
                            <a
                                href={link.href}
                                className="relative py-2 text-sm font-medium text-gray-600 hover:text-rosa-500 transition-colors duration-200 flex items-center gap-1"
                            >
                                {link.label}
                                {link.hasDropdown && (
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${desktopDropdownOpen && link.label === 'Todos os Produtos' ? 'rotate-180 text-rosa-500' : 'text-gray-400'}`} />
                                )}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rosa-400 group-hover:w-full transition-all duration-300" />
                            </a>

                            {/* Mega Menu Dropdown */}
                            {link.hasDropdown && link.label === 'Todos os Produtos' && (
                                <div
                                    className={`absolute top-full left-0 w-64 pt-2 transition-all duration-300 origin-top-left ${desktopDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
                                >
                                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                                        <div className={`p-4 ${categories.length > 5 ? 'grid grid-cols-2 gap-x-6 gap-y-2' : 'flex flex-col gap-2'}`}>
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/categoria/${category.id}`}
                                                    className="block text-sm text-gray-600 hover:text-[#66c2bb] hover:bg-gray-50 px-3 py-2 rounded-lg transition-all"
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="bg-gray-50 p-3 border-t border-gray-100">
                                            <Link
                                                to="/produtos"
                                                className="flex items-center justify-between text-sm font-bold text-gray-800 hover:text-rosa-500 transition-colors px-2"
                                            >
                                                Ver todos
                                                <ChevronRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    {/* Search */}
                    <div className="relative hidden md:flex items-center">
                        {searchOpen ? (
                            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 pl-4 pr-2 py-1.5 animate-in fade-in duration-200">
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    autoFocus
                                    className="bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 w-40"
                                    aria-label="Campo de pesquisa"
                                />
                                <button
                                    onClick={() => setSearchOpen(false)}
                                    className="text-gray-400 hover:text-gray-700 p-1 transition-colors"
                                    aria-label="Fechar pesquisa"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-all"
                                aria-label="Abrir pesquisa"
                            >
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                        )}
                    </div>

                    {/* Login button */}
                    <button className="hidden md:flex items-center gap-2 bg-rosa-50 hover:bg-rosa-100 text-rosa-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-rosa-100 hover:border-rosa-200">
                        <User size={16} strokeWidth={1.5} />
                        <span>Entrar</span>
                    </button>

                    {/* Favorites */}
                    <button
                        className="hidden md:flex text-gray-500 hover:text-rosa-500 p-2 rounded-full hover:bg-rosa-50 transition-all duration-200"
                        aria-label="Favoritos"
                    >
                        <Heart size={20} strokeWidth={1.5} />
                    </button>

                    {/* Cart */}
                    <button
                        className="relative text-gray-500 hover:text-rosa-500 p-2 rounded-full hover:bg-rosa-50 transition-all duration-200"
                        onClick={() => setIsCartOpen(true)}
                        aria-label={`Carrinho com ${itemCount} itens`}
                    >
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {itemCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rosa-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-all"
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
                <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300 h-[calc(100vh-64px)] overflow-y-auto">
                    <nav className="container mx-auto px-4 py-4 space-y-1" aria-label="Navegação mobile">
                        {navLinks.map((link) => (
                            <div key={link.label}>
                                <div
                                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-rosa-500 hover:bg-rosa-50 rounded-xl text-sm font-medium transition-all cursor-pointer"
                                    onClick={() => {
                                        if (link.hasDropdown) {
                                            handleMobileExpand(link.label);
                                        } else {
                                            setMobileMenuOpen(false);
                                            // Handle navigation if needed
                                        }
                                    }}
                                >
                                    {link.label}
                                    {link.hasDropdown && (
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform duration-300 ${mobileExpanded === link.label ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </div>

                                {/* Mobile Accordion */}
                                {link.hasDropdown && link.label === 'Todos os Produtos' && (
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${mobileExpanded === link.label ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="bg-gray-50 rounded-lg mx-2 mt-1 p-2 space-y-1">
                                            {categories.map((category) => (
                                                <Link
                                                    key={category.id}
                                                    to={`/categoria/${category.id}`}
                                                    className="block px-4 py-2.5 text-sm text-gray-600 hover:text-rosa-500 rounded-lg"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {category.name}
                                                </Link>
                                            ))}
                                            <div className="border-t border-gray-200 mt-2 pt-2">
                                                <Link
                                                    to="/produtos"
                                                    className="block px-4 py-2.5 text-sm font-bold text-gray-800 hover:text-rosa-500 rounded-lg"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    Ver todos os produtos
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="pt-3 border-t border-gray-100 mt-2 flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-rosa-50 text-rosa-600 py-3 rounded-xl text-sm font-medium border border-rosa-100">
                                <User size={16} />
                                Entrar / Cadastrar
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 p-3 rounded-xl border border-gray-100">
                                <Search size={16} />
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
