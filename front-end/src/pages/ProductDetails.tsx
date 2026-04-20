import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ChevronRight, 
    Star, 
    Minus, 
    Plus, 
    Share2, 
    Heart, 
    ShieldCheck, 
    Truck, 
    CreditCard,
    Eye
} from 'lucide-react';
import Header from '../components/Header';
import AnnouncementBar from '../components/AnnouncementBar';
import BenefitsTicker from '../components/BenefitsTicker';
import CartSidebar from '../components/CartSidebar';
import BackToTop from '../components/BackToTop';
import { useCart } from '../contexts/CartContext';
import api from '../lib/axios';

interface ProductColor {
    name: string;
    hex: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    imageUrl: string;
    colors?: ProductColor[];
    badges?: string[];
    howToUse?: string;
    whyLoveIt?: string;
    composition?: string;
}

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [activeTab, setActiveTab] = useState('description');
    const [viewers, setViewers] = useState(12);
    const { addToCart } = useCart();

    useEffect(() => {
        if (!product) return;
        
        // Base viewers calc based on ID so it's consistentish per product
        const baseViewers = Math.floor(product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 25) + 8;
        setViewers(baseViewers);

        // Fluctuate every few seconds
        const interval = setInterval(() => {
            setViewers(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                const newViewers = prev + change;
                return newViewers < 5 ? 5 : (newViewers > 45 ? 45 : newViewers);
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [product]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
                if (response.data.colors && response.data.colors.length > 0) {
                    setSelectedColor(response.data.colors[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const formatImageUrl = (url: string | undefined) => {
        if (!url) return "https://placehold.co/600x600/ffe4e6/be185d?text=Produto";
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }
        return url;
    };

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
        }, quantity);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <AnnouncementBar />
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="flex flex-col md:flex-row gap-12 animate-pulse">
                        <div className="w-full md:w-1/2 aspect-square bg-gray-100 rounded-2xl" />
                        <div className="w-full md:w-1/2 space-y-6">
                            <div className="h-4 bg-gray-100 w-1/4 rounded" />
                            <div className="h-10 bg-gray-100 w-3/4 rounded" />
                            <div className="h-6 bg-gray-100 w-1/3 rounded" />
                            <div className="h-24 bg-gray-100 w-full rounded" />
                            <div className="h-12 bg-gray-100 w-full rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-black text-white px-6 py-2 rounded-full"
                >
                    Voltar para Home
                </button>
            </div>
        );
    }

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
    }).format(Number(product.price) / 5);

    const tabs = [
        { id: 'description', label: 'Descrição' },
        { id: 'usage', label: 'Como Usar' },
        { id: 'love', label: 'Por Que Você Vai Amar?' },
        { id: 'composition', label: 'Composição' },
    ];

    return (
        <div className="min-h-screen bg-white selection:bg-rosa-100 selection:text-rosa-600">
            <AnnouncementBar />
            <Header />
            <CartSidebar />
            
            <main className="max-w-7xl mx-auto px-4 pt-6 pb-20">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <span className="cursor-pointer hover:text-rosa-400 transition-colors" onClick={() => navigate('/')}>Home</span>
                    <ChevronRight size={10} />
                    <span className="cursor-pointer hover:text-rosa-400 transition-colors uppercase">Produtos</span>
                    <ChevronRight size={10} />
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left: Images */}
                    <div className="w-full lg:w-[55%] flex flex-col md:flex-row gap-4">

                        {/* Main Image */}
                        <div className="relative group flex-1 bg-gray-50 rounded-3xl overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-[500px]">
                            <img 
                                src={formatImageUrl(product.imageUrl)} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                {product.badges?.map((badge, i) => (
                                    <span key={i} className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                                        {badge}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="w-full lg:w-[45%] flex flex-col">
                        <div className="mb-2">
                            <span className="text-[11px] font-bold text-rosa-400 uppercase tracking-widest mb-2 block">Premium Collection</span>
                            <h1 className="text-2xl md:text-3xl font-light text-gray-900 leading-tight uppercase tracking-wide mb-3">
                                {product.name}
                            </h1>
                            
                            {/* Rating */}
                            <div className="flex items-center gap-1.5 mb-6">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium">(12 avaliações)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-4 mb-1">
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">{formattedPrice}</span>
                                {formattedComparePrice && (
                                    <span className="text-lg text-gray-400 line-through font-light">{formattedComparePrice}</span>
                                )}
                            </div>
                            <p className="text-[12px] text-gray-500 mb-8 font-medium">
                                ou em até 5x de {installmentPrice} sem juros
                            </p>
                        </div>

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-900">
                                        Cor: <span className="text-gray-400 font-normal ml-1">{selectedColor?.name}</span>
                                    </span>
                                    <button className="text-[10px] text-gray-400 underline hover:text-rosa-400 transition-colors uppercase tracking-widest">Guia de Cores</button>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                selectedColor?.name === color.name 
                                                    ? 'ring-2 ring-black ring-offset-2' 
                                                    : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-2'
                                            }`}
                                        >
                                            <div 
                                                className="w-full h-full rounded-full border border-gray-100 shadow-inner" 
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-10">
                                                {color.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center justify-between border border-gray-200 rounded-full px-4 py-3 min-w-[130px] bg-white">
                                <button 
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <button 
                                onClick={handleAddToCart}
                                className="flex-1 bg-black text-white rounded-full py-4 px-8 font-bold uppercase tracking-[0.2em] text-[12px] hover:bg-gray-800 transition-all shadow-xl hover:shadow-black/20 active:scale-[0.98]"
                            >
                                Adicionar à Sacola
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="bg-gray-50/50 rounded-2xl p-4 flex items-center gap-3 mb-10 border border-gray-100">
                            <div className="w-8 h-8 bg-rosa-50 rounded-full flex items-center justify-center text-rosa-400">
                                <Eye size={16} />
                            </div>
                            <p className="text-[11px] text-gray-500 font-medium">
                                <span className="text-gray-900 font-bold">{viewers} clientes</span> estão visualizando este produto agora
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-24">
                    <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar mb-10">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative min-w-fit whitespace-nowrap ${
                                    activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl animate-entrance">
                        {activeTab === 'description' && (
                            <div className="space-y-6">
                                <p className="text-sm text-gray-500 leading-relaxed font-light">
                                    {product.description || "Este produto foi desenvolvido com a mais alta tecnologia para proporcionar resultados incríveis. Sua fórmula exclusiva garante durabilidade e conforto durante todo o dia."}
                                </p>
                                <p className="text-sm text-gray-400 font-light italic border-l-2 border-rosa-300 pl-4 py-1">
                                    "Descubra o poder que existe em você. Na Shine Glam, cada detalhe é pensado para realçar a sua beleza autêntica e confiante."
                                </p>
                            </div>
                        )}
                        {activeTab === 'usage' && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Passo a Passo</h3>
                                {product.howToUse ? (
                                    <p className="text-sm text-gray-500 font-light leading-relaxed whitespace-pre-wrap">
                                        {product.howToUse}
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                        <li className="flex gap-4 items-start">
                                            <span className="w-6 h-6 rounded-full bg-rosa-50 text-rosa-500 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                                            <p className="text-sm text-gray-500 font-light">Prepare a área de aplicação garantindo que esteja limpa e seca.</p>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="w-6 h-6 rounded-full bg-rosa-50 text-rosa-500 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                                            <p className="text-sm text-gray-500 font-light">Aplique suavemente o produto do centro para as extremidades.</p>
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="w-6 h-6 rounded-full bg-rosa-50 text-rosa-500 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                                            <p className="text-sm text-gray-500 font-light">Aguarde alguns segundos para a secagem completa e acabamento perfeito.</p>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}
                        {activeTab === 'love' && (
                            <div className="space-y-4">
                                {product.whyLoveIt ? (
                                    <div className="bg-rosa-50/30 p-8 rounded-3xl border border-rosa-100/50">
                                        <Heart className="text-rosa-400 mb-4" />
                                        <p className="text-sm text-gray-500 font-light leading-relaxed whitespace-pre-wrap">
                                            {product.whyLoveIt}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-rosa-50/30 p-8 rounded-3xl border border-rosa-100">
                                            <Heart className="text-rosa-400 mb-4" />
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Textura Incomparável</h4>
                                            <p className="text-xs text-gray-500 font-light leading-relaxed">Sinta o toque aveludado e a leveza que só os produtos Shine Glam oferecem.</p>
                                        </div>
                                        <div className="bg-turquesa/5 p-8 rounded-3xl border border-turquesa/10">
                                            <ShieldCheck className="text-turquesa-dark mb-4" />
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Longa Duração</h4>
                                            <p className="text-xs text-gray-500 font-light leading-relaxed">Resistente e duradouro, mantém o visual impecável por até 12 horas.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'composition' && (
                            <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                <p className="text-[11px] text-gray-400 leading-relaxed font-mono uppercase whitespace-pre-wrap">
                                    {product.composition || "AQUA, PARAFFINUM LIQUIDUM, CETEARYL ALCOHOL, GLYCERIN, STEARIC ACID, GLYCERYL STEARATE, PEG-100 STEARATE, PHENOXYETHANOL, PARFUM, CARBOMER, TRIETHANOLAMINE, ETHYLHEXYLGLYCERIN, DISODIUM EDTA, LINALOOL, LIMONENE, GERANIOL."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Benefits Ticker before footer */}
            <div className="mb-20">
                <BenefitsTicker />
            </div>

            {/* Footer and Extras */}
            <div className="bg-white pt-14 pb-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] text-gray-400">SHINE GLAM — Onde sua beleza brilha mais forte.</p>
                </div>
            </div>

            <BackToTop />
        </div>
    );
}
