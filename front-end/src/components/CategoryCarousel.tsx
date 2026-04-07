import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
    bgColor: string;
    sortOrder: number;
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
        <section className="py-10 md:py-14 bg-white" aria-label="Compre por Categoria">
            <div className="max-w-7xl mx-auto px-4">
                {/* Title */}
                <div className="flex items-center gap-2 mb-8">
                    <LayoutGrid size={20} className="text-rosa-400" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Categorias
                    </h2>
                </div>

                {/* Carousel wrapper */}
                <div className="relative">
                    {/* Prev arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute -left-3 top-[calc(50%-16px)] -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md items-center justify-center text-gray-500 hover:text-rosa-500 hover:shadow-lg transition-all duration-200 active:scale-90 border border-rosa-100/50"
                        aria-label="Categorias anteriores"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Scrollable list */}
                    <div
                        ref={scrollRef}
                        className="flex gap-5 md:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 pb-4 no-scrollbar"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    if (onSelectCategory) {
                                        onSelectCategory(activeCategory === cat.id ? null : cat.id);
                                    }
                                }}
                                className={`flex flex-col items-center gap-2.5 flex-shrink-0 group snap-start transition-all duration-300 ${
                                    activeCategory && activeCategory !== cat.id ? 'opacity-60 scale-95 hover:opacity-100 hover:scale-100' : 'scale-100'
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
                                            className="w-full h-full object-cover"
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

                    {/* Next arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute -right-3 top-[calc(50%-16px)] -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full shadow-md items-center justify-center text-gray-500 hover:text-rosa-500 hover:shadow-lg transition-all duration-200 active:scale-90 border border-rosa-100/50"
                        aria-label="Próximas categorias"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </section>
    );
}
