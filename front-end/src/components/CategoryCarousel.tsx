import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function CategoryCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeDot, setActiveDot] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const totalDots = Math.max(1, Math.ceil(categories.length / 5));

    // Fetch categories from API
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

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        setActiveDot(Math.round(progress * (totalDots - 1)));
    };

    const getBgHex = (bgClass: string) => BG_COLOR_MAP[bgClass] || '#f3f4f6';

    if (loading) {
        return (
            <section className="py-12 md:py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#333333] text-center mb-10">
                        Compre por Categoria
                    </h2>
                    <div className="flex justify-center gap-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-gray-200" />
                                <div className="h-4 w-16 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-white" aria-label="Compre por Categoria">
            <div className="max-w-7xl mx-auto px-4">
                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#333333] text-center mb-10">
                    Compre por Categoria
                </h2>

                {/* Carousel wrapper */}
                <div className="relative">
                    {/* Prev arrow */}
                    <button
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute left-2 top-[calc(50%-16px)] -translate-y-1/2 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 active:scale-90"
                        aria-label="Categorias anteriores"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Scrollable list */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-6 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 pb-4 no-scrollbar"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className="flex flex-col items-center gap-3 flex-shrink-0 group snap-start"
                                aria-label={`Categoria ${cat.name}`}
                            >
                                {/* Circle */}
                                <div
                                    className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full overflow-hidden border-2 border-transparent group-hover:border-pink-300 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
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
                                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-500 transition-colors">
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Next arrow */}
                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute right-2 top-[calc(50%-16px)] -translate-y-1/2 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full shadow-md items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-lg transition-all duration-200 active:scale-90"
                        aria-label="Próximas categorias"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Dot indicators */}
                <div className="flex justify-center gap-3 mt-6">
                    {Array.from({ length: totalDots }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (!scrollRef.current) return;
                                const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                                const target = totalDots > 1 ? (i / (totalDots - 1)) * maxScroll : 0;
                                scrollRef.current.scrollTo({ left: target, behavior: 'smooth' });
                            }}
                            className={`rounded-full transition-all duration-300 ${i === activeDot
                                ? 'w-4 h-4 border-2 border-gray-700 bg-transparent flex items-center justify-center p-0'
                                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`Página ${i + 1}`}
                        >
                            {i === activeDot && (
                                <span className="w-1.5 h-1.5 bg-gray-700 rounded-full block" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
