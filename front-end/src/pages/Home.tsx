import { useEffect, useState } from 'react';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import HeroBanner from '../components/HeroBanner';
import TrustBadges from '../components/TrustBadges';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import api from '../lib/axios';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);
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
            <AnnouncementBar />
            <CartSidebar />

            {/* Hero Banner */}
            <HeroBanner />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Section: Compre por Categoria */}
            <section className="py-14 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                        Compre por Categoria
                    </h2>
                    <div className="w-16 h-1 bg-rosa-400 mx-auto rounded-full mb-12" />

                    {/* Category quick-links (decorative) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
                        {[
                            { name: 'Skincare', emoji: '🧴', color: 'bg-turquesa-50 border-turquesa-100 hover:border-turquesa-300' },
                            { name: 'Maquiagem', emoji: '💄', color: 'bg-rosa-50 border-rosa-100 hover:border-rosa-300' },
                            { name: 'Cabelos', emoji: '💇‍♀️', color: 'bg-purple-50 border-purple-100 hover:border-purple-300' },
                            { name: 'Corpo & Banho', emoji: '🛁', color: 'bg-amber-50 border-amber-100 hover:border-amber-300' },
                        ].map((cat) => (
                            <button
                                key={cat.name}
                                className={`${cat.color} border-2 rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
                            >
                                <span className="text-3xl md:text-4xl block mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {cat.emoji}
                                </span>
                                <span className="text-sm md:text-base font-semibold text-gray-800">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mais Vendidos */}
            <section className="bg-gray-50/50 py-14 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 space-y-2">
                        <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
                            Mais Vendidos
                        </h2>
                        <div className="w-16 h-1 bg-rosa-400 mx-auto rounded-full" />
                        <p className="text-gray-500 text-sm mt-3">Os favoritos das nossas clientes</p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="animate-pulse space-y-4">
                                    <div className="bg-gray-200/60 aspect-[4/5] rounded-xl" />
                                    <div className="h-4 bg-gray-200/60 w-3/4 mx-auto rounded" />
                                    <div className="h-3 bg-gray-200/60 w-1/2 mx-auto rounded" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
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
        </div>
    );
}
