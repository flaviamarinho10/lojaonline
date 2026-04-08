import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
    bgColor: string;
    sortOrder: number;
    active?: boolean;
}

const BG_COLOR_MAP: Record<string, string> = {
    'bg-green-100': '#dcfce7',
    'bg-pink-100': '#fce7f3',
    'bg-pink-200': '#fbcfe8',
    'bg-rose-200': '#fecdd3',
    'bg-amber-100': '#fef3c7',
    'bg-blue-100': '#dbeafe',
    'bg-purple-100': '#f3e8ff',
    'bg-teal-100': '#ccfbf1',
};

interface CategoryCarouselProps {
    onSelectCategory?: (categoryId: string | null) => void;
    activeCategory?: string | null;
}

export default function CategoryCarousel({ onSelectCategory, activeCategory }: CategoryCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories(res.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.clientWidth * 0.7;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    const getBgHex = (bgClass: string) => BG_COLOR_MAP[bgClass] || '#fdf2f8';

    if (loading) {
        return (
            <section className="py-10 md:py-14 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-48 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="flex justify-center gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full bg-rosa-50" />
                                <div className="h-4 w-16 bg-gray-200 rounded-full" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-10 md:py-20 bg-white relative overflow-hidden" aria-label="Compre por Categoria">
            {/* Elemento de fundo estético para desktop */}
            <div className="hidden md:block absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-rosa-50/50 to-transparent -z-10 pointer-events-none rounded-l-full blur-3xl mix-blend-multiply"></div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
                    
                    {/* Bloco de Título (Agora em um "canto" no desktop) */}
                    <div className="md:w-[35%] flex flex-col items-center md:items-start text-center md:text-left shrink-0">
                        {/* Tag estilosa visível apenas no desktop */}
                        <div className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-rosa-500 font-bold text-[10px] tracking-widest uppercase mb-6 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-rosa-400 mr-2 animate-pulse"></span>
                            Descubra
                        </div>
                        
                        <h2 className="text-2xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 tracking-tight leading-[1.1] mb-2 md:mb-6">
                            Nossas <br className="hidden md:block" />
                            <span className="bg-clip-text bg-gradient-to-r from-rosa-400 to-pink-300">Categorias</span>
                        </h2>
                        
                        <p className="hidden md:block text-gray-500 text-lg leading-relaxed max-w-sm mb-8 font-medium">
                            Navegue por coleções exclusivas criadas para realçar cada detalhe da sua beleza.
                        </p>

                        {/* Indicadores de seta apenas no desktop para mostrar que é rolável */}
                        <div className="hidden md:flex gap-3">
                            <button
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:border-rosa-300 hover:text-rosa-500 hover:bg-rosa-50 transition-all duration-300 active:scale-90"
                                aria-label="Categorias anteriores"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-500 hover:border-rosa-300 hover:text-rosa-500 hover:bg-rosa-50 transition-all duration-300 active:scale-90"
                                aria-label="Próximas categorias"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Carousel wrapper (Lado Direto no desktop, Centralizado no Mobile) */}
                    <div className="relative w-full md:w-[65%]">
                        {/* Scrollable list */}
                        <div
                            ref={scrollRef}
                            className="flex justify-center md:justify-start gap-5 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 md:px-4 pb-8 md:pb-4 no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                        {categories.filter(cat => cat.active !== false).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    if (onSelectCategory) {
                                        onSelectCategory(activeCategory === cat.id ? null : cat.id);
                                    }
                                }}
                                className={`flex flex-col items-center gap-2.5 flex-shrink-0 group snap-start transition-all duration-300 ${
                                    activeCategory && activeCategory !== cat.id ? 'scale-95 hover:scale-100' : 'scale-100'
                                }`}
                                aria-label={`Categoria ${cat.name}`}
                            >
                                {/* Circle */}
                                <div
                                    className={`w-[100px] h-[100px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden border-4 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 shadow-sm ${
                                        activeCategory === cat.id ? 'border-rosa-400 shadow-rosa-200/50' : 'border-rosa-100/60 group-hover:border-rosa-300'
                                    }`}
                                    style={{ backgroundColor: getBgHex(cat.bgColor) }}
                                >
                                    {cat.imageUrl ? (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-3/4 h-3/4 rounded-full bg-white/30" />
                                        </div>
                                    )}
                                </div>
                                {/* Label */}
                                <span className="text-sm font-medium text-gray-600 group-hover:text-rosa-500 transition-colors">
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
