import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, Star, Phone, Mail, Instagram, Lock, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import BackToTop from '../components/BackToTop';
import api from '../lib/axios';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    colors?: { name: string; hex: string }[];
}


export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const productsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = activeCategory ? `/products?category=${activeCategory}` : '/products';
                const prodRes = await api.get(url);
                setProducts(prodRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeCategory]);

    const scrollProducts = (direction: 'left' | 'right') => {
        if (!productsRef.current) return;
        const scrollAmount = productsRef.current.clientWidth * 0.7;
        productsRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-[#fefcfb] text-gray-900">
            <Header />
            <CartSidebar />

            {/* Search Bar */}
            <div className="bg-gradient-to-b from-rosa-50/60 to-transparent py-4 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center bg-white rounded-2xl border border-rosa-100 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                        <Search size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Buscar produtos ou categorias..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 ml-3"
                            aria-label="Campo de pesquisa"
                        />
                    </div>
                </div>
            </div>

            {/* Compre por Categoria */}
            <CategoryCarousel 
                activeCategory={activeCategory} 
                onSelectCategory={setActiveCategory} 
            />

            {/* Destaques Section */}
            <section className="py-10 md:py-14">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <Star size={20} className="text-rosa-400" fill="currentColor" />
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Destaques
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden border border-gray-100">
                                    <div className="bg-rosa-50/40 aspect-square rounded-2xl m-2" />
                                    <div className="p-3.5 space-y-2">
                                        <div className="h-4 bg-gray-100 w-3/4 rounded-full" />
                                        <div className="h-3 bg-gray-100 w-1/2 rounded-full" />
                                        <div className="h-8 bg-gray-100 w-full rounded-full mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Prev Arrow */}
                            <button
                                onClick={() => scrollProducts('left')}
                                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-500 hover:text-rosa-500 hover:shadow-xl transition-all duration-200 active:scale-90 border border-rosa-100/50"
                                aria-label="Produtos anteriores"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Products Grid/Carousel */}
                            <div
                                ref={productsRef}
                                className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Next Arrow */}
                            <button
                                onClick={() => scrollProducts('right')}
                                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-500 hover:text-rosa-500 hover:shadow-xl transition-all duration-200 active:scale-90 border border-rosa-100/50"
                                aria-label="Próximos produtos"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Ver tudo */}
                    {!loading && products.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button className="px-8 py-2.5 border-2 border-rosa-300 text-rosa-500 rounded-full font-semibold text-sm hover:bg-rosa-400 hover:text-white hover:border-rosa-400 transition-all duration-300 active:scale-95">
                                Ver tudo
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-14 md:py-20 bg-gradient-to-br from-rosa-50 via-white to-rosa-50/30">
                <div className="container mx-auto px-4 text-center max-w-xl space-y-5">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Entre para a Lista VIP ✨
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Cadastre-se para receber 15% de desconto na primeira compra e acesso exclusivo aos lançamentos.
                    </p>
                    <div className="flex gap-0 bg-white rounded-full border border-rosa-200 p-1.5 shadow-sm">
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-gray-800 text-sm px-4"
                            aria-label="Endereço de e-mail para newsletter"
                        />
                        <button className="bg-rosa-400 hover:bg-rosa-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm">
                            Inscrever
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-rosa-50 pt-16 pb-8 border-t border-rosa-100 mt-auto">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-24">
                        
                        {/* Coluna 1: Logo e Contato */}
                        <div className="flex flex-col gap-6">
                            {/* Logo */}
                            <div className="w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm overflow-hidden flex-shrink-0">
                                <span className="font-serif">S<span className="text-rosa-300 font-light">G</span></span>
                            </div>

                            <div className="space-y-4 text-gray-700">
                                <h4 className="font-bold text-gray-900 text-lg">Central de atendimento</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 font-medium">
                                        <Phone size={18} className="text-rosa-500" />
                                        <span>84981407003</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-medium">
                                        {/* Usando ícone Phone para representar o WhatsApp também, já que a lucide não possui logo oficial */}
                                        <div className="relative flex items-center justify-center w-[18px] h-[18px] rounded-full border-[1.5px] border-rosa-500 text-rosa-500">
                                            <Phone size={10} className="fill-current" />
                                        </div>
                                        <span>84981407003</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-medium text-sm sm:text-base break-all">
                                        <Mail size={18} className="text-rosa-500 flex-shrink-0" />
                                        <span>flavinhareginaom@gmail.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna 2: Pagamentos e Segurança */}
                        <div className="flex flex-col gap-8">
                            {/* Pagamento */}
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-4">Pagamento</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['VISA', 'M', 'AMEX', 'elo', 'D', 'BOLETO', 'PIX'].map((brand, i) => (
                                        <div key={i} className="bg-white border-2 border-gray-200 rounded text-[10px] font-bold text-gray-600 px-2.5 py-1.5 flex items-center justify-center min-w-[45px] shadow-sm">
                                            {brand === 'M' ? (
                                                <div className="flex">
                                                    <div className="w-3 h-3 rounded-full bg-red-500/80 -mr-1.5"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                                                </div>
                                            ) : brand === 'D' ? (
                                                <div className="flex">
                                                    <div className="w-3 h-3 rounded-full border-2 border-blue-500 -mr-1.5 opacity-80"></div>
                                                    <div className="w-3 h-3 rounded-full border-2 border-orange-500 opacity-80"></div>
                                                </div>
                                            ) : brand}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Segurança */}
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg mb-4">Segurança</h4>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                                        <Lock size={16} className="text-gray-700" />
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[9px] text-gray-500 font-bold uppercase">Site Seguro</span>
                                            <span className="text-xs font-black text-gray-800">SSL <span className="font-medium text-[9px]">256 BITS</span></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <ShieldCheck size={26} className="text-gray-700" />
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[10px] text-gray-500 font-medium">Safe Browsing</span>
                                            <span className="text-sm font-bold tracking-tight">Google</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Coluna 3: Redes Sociais */}
                        <div className="flex md:justify-end">
                            <a href="#" className="w-10 h-10 border-2 border-gray-900 text-gray-900 rounded-lg flex items-center justify-center hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all shadow-sm">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-rosa-200 mt-12 pt-6 text-center">
                        <p className="text-xs font-medium text-gray-500">&copy; 2026 Shine Glam Makeup. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>

            {/* Back to Top */}
            <BackToTop />
        </div>
    );
}
