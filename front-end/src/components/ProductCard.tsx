import { useCart } from '../contexts/CartContext';
import { Star } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
    imageUrl: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
        });
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(product.price));

    return (
        <div className="group cursor-pointer">
            {/* Image Container - Aspect 4/5 */}
            <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 mb-4">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                />

                {/* Overlay Button (Desktop) */}
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                        className="w-full bg-white/90 backdrop-blur text-slate-900 py-3 uppercase tracking-widest text-[10px] font-bold hover:bg-slate-900 hover:text-white transition-colors"
                    >
                        ADICIONAR À SACOLA
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="text-center space-y-1">
                {/* Stars (Static 5 star) */}
                <div className="flex justify-center gap-0.5 text-slate-300 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                    ))}
                </div>

                <h3 className="font-sans text-sm font-medium text-slate-900 group-hover:text-pink-500 transition-colors">
                    {product.name}
                </h3>

                <p className="font-serif text-slate-500 italic">
                    {formattedPrice}
                </p>

                {/* Mobile Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="md:hidden text-[10px] uppercase tracking-widest border-b border-slate-300 pb-0.5 mt-2 text-slate-600"
                >
                    ADICIONAR À SACOLA
                </button>
            </div>
        </div>
    );
}
