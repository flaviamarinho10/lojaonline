import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import HeroBanner from '../components/HeroBanner';
import TrustBadges from '../components/TrustBadges';
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

interface Appearance {
    topBar: {
        active: boolean;
        message: string;
        bgColor: string;
    };
    hero: {
        desktopImage: string;
        mobileImage: string;
        title: string;
        subtitle: string;
        buttonText: string;
        buttonLink: string;
    };
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [appearance, setAppearance] = useState<Appearance | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);

                const appRes = await api.get('/settings/appearance');
                setAppearance(appRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Header />
            {appearance && <AnnouncementBar settings={appearance.topBar} />}
            <CartSidebar />

            {/* Hero Banner */}
            {appearance && <HeroBanner settings={appearance.hero} />}

            {/* Trust Badges */}
            <TrustBadges />

            {/* Compre por Categoria */}
            <CategoryCarousel />

            {/* Lançamentos */}
            <section className="py-12 md:py-16 bg-[#f9f9f9]">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#333333] text-center mb-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Lançamentos
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden">
                                    <div className="bg-gray-200/60 aspect-square rounded-2xl m-2" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-gray-200/60 w-3/4 rounded" />
                                        <div className="h-4 bg-gray-200/60 w-1/2 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Prev Arrow */}
                            <button
                                onClick={() => {
                                    const el = document.getElementById('products-carousel');
                                    if (el) el.scrollBy({ left: -el.clientWidth * 0.7, behavior: 'smooth' });
                                }}
                                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200 active:scale-90"
                                aria-label="Produtos anteriores"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Products Carousel */}
                            <div
                                id="products-carousel"
                                className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
                            >
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Next Arrow */}
                            <button
                                onClick={() => {
                                    const el = document.getElementById('products-carousel');
                                    if (el) el.scrollBy({ left: el.clientWidth * 0.7, behavior: 'smooth' });
                                }}
                                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all duration-200 active:scale-90"
                                aria-label="Próximos produtos"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}

                    {/* Ver tudo button */}
                    {!loading && products.length > 0 && (
                        <div className="flex justify-center mt-10">
                            <button className="px-8 py-2.5 border-2 border-[#66c2bb] text-[#66c2bb] rounded-lg font-semibold text-sm hover:bg-[#66c2bb] hover:text-white transition-all duration-300 active:scale-95">
                                Ver tudo
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-rosa-50 via-white to-turquesa-50">
                <div className="container mx-auto px-4 text-center max-w-xl space-y-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Entre para a Lista VIP
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Cadastre-se para receber 15% de desconto na primeira compra e acesso exclusivo aos lançamentos.
                    </p>
                    <div className="flex gap-0 bg-white rounded-full border border-gray-200 p-1.5 shadow-sm">
                        <input
                            type="email"
                            placeholder="Seu melhor e-mail"
                            className="flex-1 bg-transparent outline-none placeholder:text-gray-400 text-gray-900 text-sm px-4"
                            aria-label="Endereço de e-mail para newsletter"
                        />
                        <button className="bg-rosa-500 hover:bg-rosa-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 shadow-sm">
                            Inscrever
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                        <div className="md:col-span-1">
                            <h4 className="text-lg font-bold mb-3">
                                Flavia <span className="font-light">Beauty</span>
                            </h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Beleza de luxo ao seu alcance. Produtos premium para realçar o melhor de você.
                            </p>
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Loja</h5>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Todos os Produtos</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Mais Vendidos</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Lançamentos</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Kits</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Suporte</h5>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Central de Ajuda</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Trocas e Devoluções</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Rastrear Pedido</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Fale Conosco</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Sobre</h5>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Quem Somos</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Política de Privacidade</a></li>
                                <li><a href="#" className="hover:text-rosa-400 transition-colors">Termos de Uso</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 text-center">
                        <p className="text-xs text-gray-500">&copy; 2026 Flavia Beauty. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>

            {/* Back to Top */}
            <BackToTop />
        </div>
    );
}
