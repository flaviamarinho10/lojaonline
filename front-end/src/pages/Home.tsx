import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
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
    const [bannerUrl, setBannerUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Products
                const prodRes = await api.get('/products');
                setProducts(prodRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBanner = async () => {
            try {
                // Fetch Banner
                const bannerRes = await api.get('/settings/banner');
                setBannerUrl(bannerRes.data.url);
            } catch (error) {
                console.error('Error fetching banner:', error);
            } finally {
                setLoadingBanner(false);
            }
        };

        fetchData();
        fetchBanner();
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <Header />
            <CartSidebar />

            {/* Hero Section */}
            <section className="relative w-full h-[500px] bg-rose-50 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 w-full h-full">
                    {loadingBanner ? (
                        <div className="w-full h-full animate-pulse bg-rose-100/50" />
                    ) : (
                        <img
                            src={bannerUrl || "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1974&auto=format&fit=crop"}
                            alt="Banner Principal"
                            className="w-full h-full object-cover object-center"
                        />
                    )}
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-50/90 via-rose-50/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start text-left space-y-6">
                    <span className="inline-block text-xs font-medium tracking-[0.2em] uppercase text-pink-500 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-sm">
                        NOVA COLEÇÃO
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl text-slate-900 leading-tight max-w-2xl">
                        O Brilho <br /> Perfeito
                    </h1>
                    <p className="max-w-md text-slate-700 text-lg font-light leading-relaxed drop-shadow-sm">
                        Descubra o novo padrão de beleza. Fórmulas limpas, aplicação fácil e um acabamento natural que realça a sua pele.
                    </p>
                    <button className="bg-slate-900 text-white px-10 py-4 uppercase tracking-widest text-xs font-medium hover:bg-slate-800 transition-transform active:scale-95 shadow-lg">
                        COMPRAR AGORA
                    </button>
                </div>
            </section>

            {/* Best Sellers */}
            <main className="container mx-auto px-4 py-24">
                <div className="text-center mb-16 space-y-2">
                    <h2 className="font-serif text-3xl md:text-4xl text-slate-900">
                        MAIS VENDIDOS
                    </h2>
                    <div className="w-12 h-0.5 bg-pink-200 mx-auto" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse space-y-4">
                                <div className="bg-slate-100 aspect-[4/5]" />
                                <div className="h-4 bg-slate-100 w-3/4 mx-auto" />
                                <div className="h-3 bg-slate-100 w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            {/* Newsletter */}
            <section className="bg-slate-50 py-24 border-t border-slate-100">
                <div className="container mx-auto px-4 text-center max-w-xl mx-auto space-y-6">
                    <h3 className="font-serif text-2xl text-slate-900">Entre para a lista</h3>
                    <p className="text-slate-500 font-light">Cadastre-se para receber 15% de desconto na primeira compra e acesso exclusivo aos lançamentos.</p>
                    <div className="flex gap-0 border-b border-slate-300 pb-2">
                        <input
                            type="email"
                            placeholder="Seu endereço de e-mail"
                            className="flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-900"
                        />
                        <button className="text-xs uppercase tracking-widest text-slate-900 font-medium">INSCREVER</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 text-center">
                <p className="text-xs text-slate-400 tracking-widest uppercase">&copy; 2026 flavia beauty.</p>
            </footer>
        </div>
    );
}
