import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, Instagram } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import BenefitsTicker from '../components/BenefitsTicker';
import HeroBanner from '../components/HeroBanner';
import CategoryCarousel from '../components/CategoryCarousel';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import SecondaryPinkBar from '../components/SecondaryPinkBar';

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
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [appearance, setAppearance] = useState<any>(null);
    const productsRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [dragMoved, setDragMoved] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get('search');
    const activeCategory = searchParams.get('category');

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                // Featured products (all categories, default order)
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
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, [activeCategory, querySearch]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!productsRef.current) return;
        setIsDragging(true);
        setDragMoved(false);
        setStartX(e.pageX - productsRef.current.offsetLeft);
        setScrollLeft(productsRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !productsRef.current) return;
        e.preventDefault();
        const x = e.pageX - productsRef.current.offsetLeft;
        const walk = (x - startX) * 2.5; // Increased sensitivity
        const diff = x - startX;
        if (Math.abs(diff) > 30) {
            setDragMoved(true);
        }
        productsRef.current.scrollLeft = scrollLeft - walk;
    };



    return (
        <div className="min-h-screen bg-white selection:bg-rosa-100 selection:text-rosa-600">
            {/* Top Announcement Bar */}
            <AnnouncementBar />

            {/* Header */}
            <Header />

            {/* Cart Sidebar */}
            <CartSidebar />

            {/* Hero Banner */}
            {!activeCategory && !querySearch && <HeroBanner settings={appearance?.heroBanner} />}

            {/* Benefits Ticker */}
            {!activeCategory && !querySearch && <BenefitsTicker />}

            {/* Category Carousel (Always visible for easy switching) */}
            <CategoryCarousel
                activeCategory={activeCategory}
                onSelectCategory={(categoryId) => {
                    const newParams = new URLSearchParams(searchParams);
                    if (categoryId) {
                        newParams.set('category', categoryId);
                        newParams.delete('search'); // optional: clear search if picking a category
                    } else {
                        newParams.delete('category');
                    }
                    setSearchParams(newParams);
                }}
            />

            {/* Products Section (Featured) */}
            {!activeCategory && !querySearch && (
                <section id="produtos" className="py-6 md:py-8 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Section Title */}
                        <h2 className="text-center text-[15px] md:text-[20px] font-bold text-[#1a1a1a] mb-5 uppercase tracking-widest">
                            Mais Vendidos
                        </h2>


                        {/* Products Carousel */}
                        {loading ? (
                            <div className="flex gap-5 overflow-hidden">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex-shrink-0 w-[180px] md:w-[240px] animate-pulse">
                                        <div className="aspect-square bg-gray-50 rounded-xl mb-3" />
                                        <div className="space-y-2 px-1">
                                            <div className="h-3 bg-gray-100 w-3/4 rounded" />
                                            <div className="h-3 bg-gray-100 w-1/2 rounded" />
                                            <div className="h-5 bg-gray-100 w-2/3 rounded mt-2" />
                                            <div className="h-9 bg-gray-100 w-full rounded-lg mt-3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative">

                                {/* Products */}
                                <div
                                    ref={productsRef}
                                    onMouseDown={handleMouseDown}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseUp={handleMouseUp}
                                    onMouseMove={handleMouseMove}
                                    onClickCapture={(e) => {
                                        if (dragMoved) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }
                                    }}
                                    className={`flex gap-3 px-1 md:gap-5 overflow-x-auto pb-4 no-scrollbar ${isDragging
                                        ? 'cursor-grabbing select-none scroll-auto'
                                        : 'cursor-grab scroll-smooth snap-x snap-mandatory'
                                        }`}
                                >
                                    {featuredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                    {featuredProducts.length === 0 && (
                                        <div className="w-full text-center py-10 text-gray-400 text-sm italic">
                                            Nenhum produto em destaque no momento.
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Secondary Pink Bar */}
            {!activeCategory && !querySearch && <SecondaryPinkBar />}

            {/* All Products Grid Section */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Section Title */}
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-[18px] md:text-[24px] font-bold text-[#1a1a1a] mb-2 uppercase tracking-[0.1em]">
                            {querySearch
                                ? `Resultados para "${querySearch}"`
                                : activeCategory
                                    ? categories.find(c => c.id === activeCategory)?.name || 'Produtos'
                                    : 'Todos os Produtos'
                            }
                        </h2>
                        <div className="w-16 h-1 bg-rosa-400 rounded-full" />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="aspect-square bg-gray-50 rounded-xl mb-3" />
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-100 w-3/4 rounded" />
                                        <div className="h-5 bg-gray-100 w-1/2 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-12 md:gap-x-6">
                            {allProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white pt-14 pb-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">

                        {/* Column 1: Newsletter / Social */}
                        <div className="space-y-5">
                            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900 italic">Redes Sociais</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Acompanhe todas as nossas novidades diárias e lançamentos exclusivos através das nossas redes oficiais.
                            </p>
                            <div className="pt-2">
                                <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-600 mb-3 italic">
                                    Nos siga nas redes sociais
                                </p>
                                <div className="flex gap-3">
                                    <a href="#" className="w-8 h-8 border border-gray-300 text-gray-600 rounded flex items-center justify-center hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all" aria-label="Instagram">
                                        <Instagram size={14} />
                                    </a>
                                    <a href="#" className="w-8 h-8 border border-gray-300 text-gray-600 rounded flex items-center justify-center hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all" aria-label="Facebook">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                    </a>
                                    <a href="#" className="w-8 h-8 border border-gray-300 text-gray-600 rounded flex items-center justify-center hover:bg-rosa-400 hover:border-rosa-400 hover:text-white transition-all" aria-label="TikTok">
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.78 4.78 0 0 1-1-.84z" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Client */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900 italic">Cliente</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Minha Conta</a></li>
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Meus Pedidos</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Institutional */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900 italic">Institucional</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Quem Somos</a></li>
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Seja um Lojista</a></li>
                            </ul>
                        </div>

                        {/* Column 4: Help */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900 italic">Ajuda</h4>
                            <ul className="space-y-2.5">
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Fale Conosco</a></li>
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Política de Privacidade</a></li>
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Trocas e Devoluções</a></li>
                                <li><a href="#" className="text-xs text-gray-500 hover:text-rosa-500 transition-colors">Perguntas Frequentes</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Payment Methods & Security */}
                    <div className="border-t border-rosa-200/50 mt-10 pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Contact */}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-rosa-400" />
                                    <span>84981407003</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={14} className="text-rosa-400" />
                                    <span>flavinhareginaom@gmail.com</span>
                                </div>
                            </div>

                            {/* Payment Icons */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['VISA', 'MC', 'AMEX', 'Elo', 'PIX', 'Boleto'].map((brand, i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded px-3 py-1.5 text-[9px] font-bold text-gray-500 uppercase tracking-wider shadow-sm min-w-[48px] text-center">
                                        {brand}
                                    </div>
                                ))}
                            </div>
                        </div>
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

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {/* WhatsApp */}
                <a
                    href="https://wa.me/5584981407003"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
                    aria-label="WhatsApp"
                >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </a>
            </div>

            {/* Back to Top */}
            <BackToTop />
        </div>
    );
}
