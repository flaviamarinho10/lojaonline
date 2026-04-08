import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
    active?: boolean;
}

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
        const scrollAmount = scrollRef.current.clientWidth * 0.5;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (loading) {
        return (
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-6 w-48 bg-gray-100 mx-auto mb-10" />
                    <div className="flex justify-center gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                                <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full bg-gray-100" />
                                <div className="h-3 w-12 bg-gray-100" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-12 bg-white" aria-label="Compre por Categoria">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-center text-sm font-black uppercase tracking-widest text-[#222] mb-10">
                    COMPRE POR CATEGORIA
                </h2>

                {/* Carousel */}
                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center text-gray-400 hover:text-black transition-colors"
                        aria-label="Categorias anteriores"
                    >
                        <ChevronLeft size={24} strokeWidth={1} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex justify-start md:justify-center gap-4 md:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 pb-2 no-scrollbar"
                    >
                        {categories.filter(cat => cat.active !== false).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    if (onSelectCategory) {
                                        onSelectCategory(activeCategory === cat.id ? null : cat.id);
                                    }
                                }}
                                className="flex flex-col items-center gap-4 flex-shrink-0 group snap-start transition-all duration-300"
                                aria-label={`Categoria ${cat.name}`}
                            >
                                {/* Circle */}
                                <div
                                    className={`w-[95px] h-[95px] md:w-[130px] md:h-[130px] rounded-full overflow-hidden transition-all duration-500 bg-[#fdf2f5] flex items-center justify-center ${
                                        activeCategory === cat.id 
                                            ? 'ring-1 ring-black ring-offset-2' 
                                            : 'group-hover:scale-105'
                                    }`}
                                >
                                    {cat.imageUrl ? (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="w-full h-full object-cover p-2"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-3/4 h-3/4 rounded-full bg-white/40" />
                                        </div>
                                    )}
                                </div>
                                {/* Label */}
                                <span className={`text-[10px] md:text-[11px] font-normal tracking-wide transition-colors ${
                                    activeCategory === cat.id 
                                        ? 'text-black font-semibold' 
                                        : 'text-gray-500 group-hover:text-black'
                                }`}>
                                    {cat.name}
                                </span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center text-gray-400 hover:text-black transition-colors"
                        aria-label="Próximas categorias"
                    >
                        <ChevronRight size={24} strokeWidth={1} />
                    </button>
                </div>
            </div>
        </section>
    );
}
