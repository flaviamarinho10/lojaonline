import { useCart } from '../contexts/CartContext';
import { Star } from 'lucide-react';

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

    const formatImageUrl = (url: string | undefined) => {
        if (!url) return "https://placehold.co/200x200/ffe4e6/be185d?text=Produto";
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }
        return url;
    };

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

    const installmentPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(Number(product.price) / 4);

    const isSoldOut = product.badges?.includes('Esgotado');

    return (
        <div className="group flex-shrink-0 w-[180px] md:w-[240px] flex flex-col cursor-pointer bg-transparent">
            {/* Image Container */}
            <div className={`relative aspect-square overflow-hidden flex items-center justify-center transition-all duration-300 ${isSoldOut ? 'opacity-60' : ''}`}>
                <img
                    src={formatImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isSoldOut && (
                        <span className="bg-gray-400 text-white text-[9px] font-medium tracking-wide px-2 py-0.5 rounded-sm">
                            Esgotado
                        </span>
                    )}
                    {product.badges?.filter(b => b !== 'Esgotado').map(badge => (
                        <span key={badge} className="bg-gray-200 text-gray-700 text-[9px] font-medium tracking-wide px-2 py-0.5 rounded-sm">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="pt-3 pb-2 flex-1 flex flex-col text-center">
                {/* Product Name */}
                <h3 className="font-light text-[10px] md:text-[11px] text-gray-500 leading-snug uppercase tracking-widest mb-1.5">
                    {product.name}
                </h3>

                {/* Color swatches - Centered */}
                {product.colors && product.colors.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 ">
                        {product.colors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full border border-gray-100 shadow-sm"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                        {product.colors.length > 4 && (
                            <span className="text-[10px] text-gray-400 font-light">+{product.colors.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
