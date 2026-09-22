import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Instagram, Truck, QrCode, CreditCard, MessageCircle } from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import BenefitsTicker from '../components/BenefitsTicker';
import HeroBanner from '../components/HeroBanner';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import SecondaryPinkBar from '../components/SecondaryPinkBar';
import CartSidebar from '../components/CartSidebar';
import AchievementCard from '../components/AchievementCard';

import BackToTop from '../components/BackToTop';
import api from '../lib/axios';
import { useCart } from '../contexts/CartContext';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    colors?: { name: string; hex: string }[];
    categoryId?: string;
}

const benefits = [
    { icon: Truck, title: 'Frete Grátis', text: 'em compras acima de R$ 180' },
    { icon: QrCode, title: 'Pagamentos por PIX', text: 'facilite o pagamento' },
    { icon: CreditCard, title: 'Parcele em até 4x', text: 'sem juros, parcela mínima R$ 50' },
    { icon: MessageCircle, title: 'Suporte Online', text: 'atendimento rápido e personalizado' },
];

function ProductGrid({ products }: { products: Product[] }) {
    return (
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => {
        const cached = localStorage.getItem('shine_featured_products');
        return cached ? JSON.parse(cached) : [];
    });
    const [allProducts, setAllProducts] = useState<Product[]>(() => {
        const cached = localStorage.getItem('shine_all_products');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(() => {
        return !localStorage.getItem('shine_featured_products') || !localStorage.getItem('shine_appearance');
    });
    const [categories, setCategories] = useState<any[]>(() => {
        const cached = localStorage.getItem('shine_categories');
        return cached ? JSON.parse(cached) : [];
    });
    const [appearance, setAppearance] = useState<any>(() => {
        const cached = localStorage.getItem('shine_appearance');
        return cached ? JSON.parse(cached) : null;
    });

    const productsRef = useRef<HTMLDivElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const isProductsPage = location.pathname === '/produtos';
    const querySearch = searchParams.get('search');
    const activeCategory = searchParams.get('category');
    const isDefaultView = !isProductsPage && !activeCategory && !querySearch;

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // If we have cached data, don't show full loading overlay (skeletons will still show if lists are empty)
                // Catalog products (filtered by category, manual sort order)
                let catalogUrl = activeCategory ? `/products?category=${activeCategory}&sort=manual` : '/products?sort=manual';

                if (querySearch) {
                    catalogUrl += `&search=${encodeURIComponent(querySearch)}`;
                }

                const [featuredRes, catalogRes, appRes, catRes] = await Promise.all([
                    api.get('/products?featured=true'),
                    api.get(catalogUrl),
                    api.get('/settings/appearance'),
                    api.get('/categories')
                ]);

                setFeaturedProducts(featuredRes.data);
                setAllProducts(catalogRes.data);
                setAppearance(appRes.data);
                setCategories(catRes.data);

                // Update cache
                localStorage.setItem('shine_featured_products', JSON.stringify(featuredRes.data));
                localStorage.setItem('shine_all_products', JSON.stringify(catalogRes.data));
                localStorage.setItem('shine_appearance', JSON.stringify(appRes.data));
                localStorage.setItem('shine_categories', JSON.stringify(catRes.data));
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, [activeCategory, querySearch]);

    const handleSelectCategory = (categoryId: string | null) => {
        if (categoryId) {
            setSearchParams({ category: categoryId });
        } else {
            setSearchParams({});
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const { items: cartItems, setIsCartOpen } = useCart();
    const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen bg-white selection:bg-rosa-100 selection:text-rosa-600">
            {/* Top Announcement Bar */}
            <AnnouncementBar />

            {/* Header */}
            <Header />

            {/* Cart Sidebar */}
            <CartSidebar />

            {isDefaultView && (
                <>
                    {/* Benefits Ticker (marquee) */}
                    <BenefitsTicker />

                    {/* Hero Banner */}
                    <div className="bg-gradient-to-br from-turquesa-50 via-white to-rosa-50">
                        <HeroBanner settings={appearance} />
                    </div>

                    {/* Static Benefits Row */}
                    <section className="bg-white border-b border-gray-100 py-8 md:py-10">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-rosa-100 to-turquesa-100 flex items-center justify-center flex-shrink-0">
                                        <benefit.icon size={18} className="text-turquesa-600" strokeWidth={2} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[11px] md:text-[13px] font-bold text-gray-800 leading-tight">
                                            {benefit.title}
                                        </p>
                                        <p className="text-[9px] md:text-[11px] text-gray-500 leading-tight truncate">
                                            {benefit.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Compre por Categoria */}
                    <CategoryCarousel onSelectCategory={handleSelectCategory} activeCategory={activeCategory} />

                    {/* Section Divider */}
                    <SecondaryPinkBar />

                    {/* Achievement showcase */}
                    <AchievementCard />
                </>
            )}

            {/* Products */}
            <section ref={productsRef} className="pb-24 pt-8 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {loading ? (
                        <div className="space-y-8 mt-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-6 bg-gray-200 w-1/4 rounded mb-4" />
                                    <div className="flex flex-wrap gap-6">
                                        {[...Array(4)].map((_, j) => (
                                            <div key={j} className="h-64 w-[240px] bg-gray-100 rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isDefaultView ? (
                        <div className="space-y-16">
                            {featuredProducts.length > 0 && (
                                <div className="animate-fade-up">
                                    <div className="flex items-center gap-4 mb-8 px-1">
                                        <h2 className="text-[20px] md:text-[26px] font-extrabold text-gray-900 uppercase tracking-widest">
                                            Lançamentos
                                        </h2>
                                        <div className="h-[2px] flex-1 bg-gradient-to-r from-turquesa-400/60 to-transparent rounded-full" />
                                    </div>
                                    <ProductGrid products={featuredProducts} />
                                </div>
                            )}

                            {categories.map((category, idx) => {
                                const categoryProducts = allProducts.filter(p => p.categoryId === category.id);
                                if (categoryProducts.length === 0) return null;

                                return (
                                    <div key={category.id} id={`category-${category.id}`} className="scroll-mt-24 animate-fade-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                                        <div className="flex items-center gap-4 mb-8 px-1">
                                            <h2 className="text-[20px] md:text-[26px] font-extrabold text-gray-900 uppercase tracking-widest">
                                                {category.name}
                                            </h2>
                                            <div className="h-[2px] flex-1 bg-gradient-to-r from-rosa-400/60 to-transparent rounded-full" />
                                        </div>
                                        <ProductGrid products={categoryProducts} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <>
                            {/* Section Title for search/category results */}
                            <div className="flex flex-col items-center mb-10">
                                <h2 className="text-[20px] md:text-[26px] font-extrabold text-gray-800 mb-3 uppercase tracking-widest text-center">
                                    {querySearch
                                        ? `Resultados para "${querySearch}"`
                                        : activeCategory
                                            ? categories.find(c => c.id === activeCategory)?.name || 'Produtos'
                                            : 'Todos os Produtos'
                                    }
                                </h2>
                                <div className="w-16 h-1.5 bg-gradient-to-r from-rosa-400 to-turquesa-400 rounded-full" />
                            </div>

                            <ProductGrid products={allProducts} />
                            {allProducts.length === 0 && (
                                <div className="text-center text-gray-500 py-16">
                                    Nenhum produto encontrado.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-10 pb-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">

                    {/* Contact & Social */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-rosa-500 transition-colors cursor-pointer">
                            <Phone size={18} className="text-turquesa-500" />
                            <span>84981407003</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-rosa-500 transition-colors cursor-pointer">
                            <Mail size={18} className="text-turquesa-500" />
                            <span>flavinhareginaom@gmail.com</span>
                        </div>
                        <a href="https://instagram.com/shineglaam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 font-medium hover:text-rosa-500 transition-colors" aria-label="Instagram">
                            <Instagram size={18} className="text-turquesa-500" />
                            <span>@shineglaam</span>
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-rosa-200/50 mt-6 pt-6 text-center">
                        <p className="text-[10px] text-gray-400 leading-relaxed max-w-3xl mx-auto">
                            SHINE GLAM COSMÉTICOS — CNPJ: XX.XXX.XXX/0001-XX © Todos os direitos reservados 2026
                        </p>
                        <p className="text-[9px] text-gray-400 mt-3 leading-relaxed max-w-3xl mx-auto">
                            Todos os preços e condições divulgados são válidos apenas para compras no site. Destacamos que os preços previstos no site prevalecem aos
                            demais anunciados em outros meios de comunicação e sites de busca. Imagens meramente ilustrativas.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Floating Cart Button (iFood style) */}
            <div className="fixed bottom-6 right-6 z-40 group">
                {/* Pulse animation ring */}
                {cartItemsCount > 0 && (
                    <div className="absolute inset-0 bg-rosa-400 rounded-full animate-ping opacity-20 pointer-events-none" />
                )}

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex items-center gap-2.5 bg-gradient-to-r from-white to-gray-50 text-rosa-600 border border-rosa-300/50 shadow-[0_8px_20px_rgba(244,114,182,0.25)] px-6 py-3.5 rounded-full font-bold hover:shadow-[0_12px_25px_rgba(244,114,182,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1"></circle>
                        <circle cx="19" cy="21" r="1"></circle>
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                    </svg>
                    <span className="tracking-wide">CARRINHO</span>

                    {cartItemsCount > 0 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-br from-turquesa-500 to-turquesa-600 text-white text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-md border-2 border-white animate-bounce-short">
                            {cartItemsCount}
                        </div>
                    )}
                </button>
            </div>

            {/* Back to Top */}
            <BackToTop />
        </div>
    );
}
