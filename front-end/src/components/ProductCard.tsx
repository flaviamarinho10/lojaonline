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

    const discount = product.comparePrice && Number(product.comparePrice) > Number(product.price)
        ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
        : 0;

    const isSoldOut = product.badges?.includes('Esgotado');

    return (
        <div className="group cursor-pointer flex-shrink-0 w-[170px] md:w-[280px] flex flex-col h-full animate-entrance">
            {/* Image Container flutuante */}
            <div className={`relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-rosa-100/20 group-hover:-translate-y-1 border border-white flex items-center justify-center p-6 ${isSoldOut ? 'opacity-60 grayscale' : ''}`}>
                <img
                    src={formatImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-all duration-1000 ease-out group-hover:scale-110"
                />

                {/* Badges de Luxo */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {product.badges?.filter(b => b !== 'Esgotado').map(badge => (
                        <span key={badge} className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${
                            badge === 'Frete Grátis' ? 'bg-rosa-400/90 text-white' :
                            badge === 'Lançamento' ? 'bg-purple-500/90 text-white' :
                            'bg-white/80 text-gray-800'
                        }`}>
                            {badge}
                        </span>
                    ))}
                    {discount > 0 && (
                        <span className="bg-gray-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                            -{discount}% OFF
                        </span>
                    )}
                </div>

                {/* Overlay de Ação Rápida (Desktop) */}
                <div className="hidden md:flex absolute inset-0 bg-rosa-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-end justify-center pb-8 p-4">
                     <button
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                        className="w-full glass text-gray-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-gray-900 hover:text-white"
                    >
                        Adicionar
                    </button>
                </div>
            </div>

            {/* Conteúdo Textual minimalista */}
            <div className="px-2 pt-6 pb-2 space-y-2 flex-1 flex flex-col text-center md:text-left">
                <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rosa-300">Special Selection</p>
                    <h3 className="font-extrabold text-sm md:text-lg text-gray-900 leading-tight line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                </div>

                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 pt-2">
                    <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">
                        {formattedPrice}
                    </span>
                    {formattedComparePrice && (
                        <span className="text-xs text-gray-400 line-through font-medium">
                            {formattedComparePrice}
                        </span>
                    )}
                </div>

                {/* Botão Mobile */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
                    className="md:hidden w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-4 active:scale-95 transition-transform"
                >
                    Comprar
                </button>
            </div>
        </div>
    );
}
