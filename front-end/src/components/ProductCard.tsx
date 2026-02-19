import { useCart } from '../contexts/CartContext';
import { Plus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number; // Handling string/number from API
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
        <div className="group relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-950 relative">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2 min-h-[40px]">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-emerald-400">{formattedPrice}</span>
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={16} />
                        Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}
