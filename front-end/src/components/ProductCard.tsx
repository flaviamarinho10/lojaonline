import { useCart } from '../contexts/CartContext';

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
        <div className="group cursor-pointer bg-[#f5f5f5] rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                />

                {/* Overlay Button (Desktop) */}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                        className="w-full bg-white/90 backdrop-blur text-gray-900 py-2.5 rounded-lg uppercase tracking-widest text-[10px] font-bold hover:bg-rosa-500 hover:text-white transition-colors"
                    >
                        Adicionar à Sacola
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 md:p-4 text-center space-y-1">
                <h3 className="font-medium text-sm text-gray-900 group-hover:text-rosa-500 transition-colors truncate">
                    {product.name}
                </h3>
                <p className="text-rosa-500 font-bold text-base">
                    {formattedPrice}
                </p>

                {/* Mobile Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="md:hidden text-[10px] uppercase tracking-widest border border-gray-300 rounded-lg py-2 px-4 mt-2 text-gray-600 hover:bg-rosa-500 hover:text-white hover:border-rosa-500 transition-all w-full"
                >
                    Adicionar à Sacola
                </button>
            </div>
        </div>
    );
}
