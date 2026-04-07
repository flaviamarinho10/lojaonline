import { useCart } from '../contexts/CartContext';
import { ShoppingBag } from 'lucide-react';

interface ProductColor {
    name: string;
    hex: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: string | number;
    comparePrice?: string | number;
    imageUrl: string;
    colors?: ProductColor[];
    badges?: string[];
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

    const formattedComparePrice = product.comparePrice ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(product.comparePrice)) : null;

    const discount = product.comparePrice && Number(product.comparePrice) > Number(product.price)
        ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
        : 0;

    const isSoldOut = product.badges?.includes('Esgotado');

    return (
        <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-lg flex-shrink-0 w-[175px] md:w-[240px] border border-gray-100/80">
            {/* Image Container */}
            <div className={`relative bg-gradient-to-b from-rosa-50/40 to-white rounded-2xl m-2 overflow-hidden ${isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                <div className="aspect-square flex items-center justify-center p-3">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
                    {product.badges?.filter(b => b !== 'Esgotado').map(badge => (
                        <span key={badge} className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
                            badge === 'Frete Grátis' ? 'bg-rosa-100 text-rosa-600' :
                            badge === 'Lançamento' ? 'bg-purple-50 text-purple-600' :
                            'bg-white/90 text-gray-600 backdrop-blur-md'
                        }`}>
                            {badge}
                        </span>
                    ))}
                    {discount > 0 && (
                        <span className="inline-flex items-center bg-rosa-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            -{discount}%
                        </span>
                    )}
                    {isSoldOut && (
                        <span className="inline-flex items-center bg-gray-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            Esgotado
                        </span>
                    )}
                </div>
            </div>

            {/* Text Content */}
            <div className="px-3.5 pb-3.5 pt-1 space-y-1">
                <h3 className="font-semibold text-sm text-gray-800 leading-snug line-clamp-2 group-hover:text-rosa-500 transition-colors">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>

                <div className="h-px bg-gray-100 my-1.5" />

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <p className="text-gray-900 font-bold text-base leading-tight">
                            {formattedPrice}
                        </p>
                        {discount > 0 && (
                            <p className="text-[11px] text-gray-400 line-through">
                                {formattedComparePrice}
                            </p>
                        )}
                    </div>

                    {/* Add to cart button */}
                    {!isSoldOut ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                            className="flex items-center gap-1.5 bg-rosa-400 hover:bg-rosa-500 text-white px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
                        >
                            <ShoppingBag size={13} />
                            <span className="hidden md:inline">Adicionar</span>
                            <span className="md:hidden">Add</span>
                        </button>
                    ) : (
                        <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-2 rounded-full">
                            Indisponível
                        </span>
                    )}
                </div>

                {/* Color Swatches */}
                {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (() => {
                    const MAX_VISIBLE = 4;
                    const visible = product.colors.slice(0, MAX_VISIBLE);
                    const remaining = product.colors.length - MAX_VISIBLE;
                    return (
                        <div className="flex items-center gap-1 pt-1">
                            {visible.map((color, i) => (
                                <span
                                    key={i}
                                    className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                            {remaining > 0 && (
                                <span className="text-[10px] text-gray-400 ml-0.5">
                                    +{remaining}
                                </span>
                            )}
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
