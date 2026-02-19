import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import CartSidebar from '../components/CartSidebar';
import api from '../lib/axios';
import { Loader2 } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    active: boolean;
}

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
            <Header />
            <CartSidebar />

            {/* Hero Section */}
            <section className="relative h-[500px] w-full bg-zinc-900 overflow-hidden flex items-center justify-center pt-16">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-50" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />

                <div className="container relative z-10 px-4 text-center space-y-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-bold tracking-wider uppercase border border-emerald-500/20">
                        Nova Coleção 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                        Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Máxima</span>
                    </h1>
                    <p className="max-w-xl mx-auto text-lg text-zinc-400">
                        Suplementos de alta qualidade para levar seu treino ao próximo nível. Tecnologia e sabor, juntos.
                    </p>
                    <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
                        Explorar Produtos
                    </button>
                </div>
            </section>

            {/* Products Grid */}
            <main className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-10 border-l-4 border-emerald-500 pl-4">
                    Destaques
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-zinc-950 border-t border-zinc-900 py-12 text-center text-zinc-600">
                <p>&copy; 2026 SupleStore. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
