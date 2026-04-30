import { useCart } from '../contexts/CartContext';
import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const hasColors = product.colors && product.colors.length > 0;

    const formatImageUrl = (url: string | undefined) => {
        if (!url) return "https://placehold.co/200x200/ffe4e6/be185d?text=Produto";
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }
        return url;
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasColors) {
            // Product has color variations — navigate to product page to select
            const encodedId = btoa(product.id);
            navigate(`/product/${encodedId}`);
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
        }, 1, e);
    };

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(product.price));

    const formattedComparePrice = product.comparePrice ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(product.comparePrice)) : null;

    const installmentPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(product.price) / 4);

    const discountPercentage = product.comparePrice
        ? Math.round((1 - (Number(product.price) / Number(product.comparePrice))) * 100)
        : 0;

    const isSoldOut = product.badges?.includes('Esgotado');

    const encodedId = btoa(product.id);

    return (
        <Link to={`/product/${encodedId}`} className="group flex-shrink-0 w-[160px] md:w-[240px] flex flex-col cursor-pointer bg-transparent no-underline decoration-transparent">
            {/* Image Container */}
            <div className={`relative aspect-square overflow-hidden flex items-center justify-center transition-all duration-300 ${isSoldOut ? 'opacity-60' : ''}`}>
                <img
                    src={formatImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isSoldOut && (
                        <span className="bg-gray-400 text-white text-[8px] font-medium tracking-wide px-1.5 py-0.5 rounded-sm">
                            Esgotado
                        </span>
                    )}
                    {product.badges?.filter(b => b !== 'Esgotado').map(badge => (
                        <span key={badge} className="bg-gray-200 text-gray-700 text-[8px] font-medium tracking-wide px-1.5 py-0.5 rounded-sm">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="pt-3 pb-3 flex-1 flex flex-col items-center text-center">
                {/* Product Name */}
                <h3 className="font-medium text-[10px] md:text-[12px] text-gray-800 leading-snug uppercase tracking-[0.05em] min-h-[30px] mb-2 group-hover:text-rosa-500 transition-colors line-clamp-2 px-1">
                    {product.name}
                </h3>

                {/* Rating Stars */}
                <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill="currentColor" />
                    ))}
                </div>

                {/* Color Swatches Preview */}
                {hasColors && (
                    <div className="flex items-center gap-1 mb-2">
                        {product.colors!.slice(0, 5).map((color, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full border border-gray-200 shadow-inner"
                                style={{ backgroundColor: color.hex }}
                                title={color.name || color.hex}
                            />
                        ))}
                        {product.colors!.length > 5 && (
                            <span className="text-[8px] text-gray-400 font-medium">+{product.colors!.length - 5}</span>
                        )}
                    </div>
                )}

                {/* Prices */}
                <div className="flex flex-col items-center gap-0.5 mb-3">
                    <div className="flex items-center gap-1.5">
                        {formattedComparePrice && (
                            <span className="text-[10px] text-gray-400 line-through font-light">
                                {formattedComparePrice}
                            </span>
                        )}
                        <span className="text-[12px] md:text-[14px] font-bold text-gray-900 tracking-tight">
                            {formattedPrice}
                        </span>
                        {discountPercentage > 0 && (
                            <span className="bg-rosa-400 text-white text-[8px] font-bold px-1 py-0.5 rounded-sm transform -translate-y-1">
                                -{discountPercentage}%
                            </span>
                        )}
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium italic">
                        ou em 4x de {installmentPrice}
                    </p>
                </div>

                {/* Buy Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full max-w-[125px] md:max-w-[180px] bg-black text-white text-[10px] font-bold uppercase tracking-[0.15em] py-2.5 px-3 rounded-full transition-all duration-300 hover:bg-rosa-500 hover:shadow-md hover:translate-y-[-1px] active:scale-[0.98] mt-auto"
                >
                    {hasColors ? 'Ver Opções' : 'Adicionar'}
                </button>

            </div>
        </Link>
    );
}
