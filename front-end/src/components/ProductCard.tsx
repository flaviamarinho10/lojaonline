import { useCart } from '../contexts/CartContext';

interface ProductColor {
    name: string;
    hex: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
    imageUrl: string;
    colors?: ProductColor[];
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
        <div className="group cursor-pointer bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex-shrink-0 w-[200px] md:w-[250px]">
            {/* Image Container */}
            <div className="relative bg-[#f3f4f6] rounded-xl m-2 overflow-hidden">
                <div className="aspect-[4/5] flex items-center justify-center p-4">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                </div>

                {/* Hover Add-to-Cart */}
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                        className="w-full bg-white/90 backdrop-blur-sm text-gray-900 py-2.5 rounded-lg uppercase tracking-widest text-[10px] font-bold hover:bg-[#66c2bb] hover:text-white transition-colors shadow-sm"
                    >
                        Adicionar à Sacola
                    </button>
                </div>
            </div>

            {/* Text Content */}
            <div className="px-4 pb-4 pt-3 space-y-1.5">
                <h3 className="font-medium text-sm text-gray-800 leading-snug line-clamp-2 group-hover:text-[#66c2bb] transition-colors">
                    {product.name}
                </h3>
                <p className="text-gray-900 font-bold text-base">
                    {formattedPrice}
                </p>

                {/* Dynamic Color Swatches */}
                {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (() => {
                    const MAX_VISIBLE = 3;
                    const visible = product.colors.slice(0, MAX_VISIBLE);
                    const remaining = product.colors.length - MAX_VISIBLE;
                    return (
                        <div className="flex items-center gap-1.5 pt-1">
                            {visible.map((color, i) => (
                                <span
                                    key={i}
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                            {remaining > 0 && (
                                <span className="text-[11px] text-gray-400 ml-1">
                                    + {remaining} {remaining === 1 ? 'cor' : 'cores'}
                                </span>
                            )}
                        </div>
                    );
                })()}

                {/* Mobile Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="md:hidden text-[10px] uppercase tracking-widest border border-gray-300 rounded-lg py-2 px-4 mt-1 text-gray-600 hover:bg-[#66c2bb] hover:text-white hover:border-[#66c2bb] transition-all w-full"
                >
                    Adicionar à Sacola
                </button>
            </div>
        </div>
    );
}
