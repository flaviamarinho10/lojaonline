import { useEffect, useState } from 'react';
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

export default function CategoryGrid({ onSelectCategory, activeCategory }: CategoryCarouselProps) {
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

    if (loading) {
        return (
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="h-6 w-48 bg-gray-100 mx-auto mb-10" />
                    <div className="flex justify-center flex-wrap gap-8">
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

    const filteredCategories = categories.filter(cat => cat.active !== false);
    if (filteredCategories.length === 0) return null;

    return (
        <section className="py-8 md:py-12 bg-white" aria-label="Compre por Categoria">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Title */}
                <h2 className="text-center text-[15px] md:text-[18px] font-bold text-[#1a1a1a] mb-10">
                    Compre por Categoria
                </h2>

                {/* Categories Grid - Fixed non-scrollable */}
                <div className="flex flex-wrap md:flex-nowrap justify-center gap-x-4 gap-y-10 md:gap-x-8">
                    {filteredCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                if (onSelectCategory) {
                                    onSelectCategory(activeCategory === cat.id ? null : cat.id);
                                }
                            }}
                            className="flex flex-col items-center gap-3 group transition-all duration-300"
                            aria-label={`Categoria ${cat.name}`}
                        >
                            {/* Circle */}
                            <div
                                className={`w-[75px] h-[75px] md:w-[90px] md:h-[90px] lg:w-[105px] lg:h-[105px] rounded-full overflow-hidden transition-all duration-500 bg-[#fdf2f5] flex items-center justify-center ${
                                    activeCategory === cat.id 
                                        ? 'ring-2 ring-rosa-400 ring-offset-4 scale-105' 
                                        : 'hover:scale-110 shadow-sm hover:shadow-md'
                                }`}
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
                                        <div className="w-3/4 h-3/4 rounded-full bg-white/40" />
                                    </div>
                                )}
                            </div>
                            {/* Label */}
                            <span className={`text-[12px] md:text-[13px] font-medium transition-colors ${
                                activeCategory === cat.id 
                                    ? 'text-rosa-500' 
                                    : 'text-gray-600 group-hover:text-black'
                            }`}>
                                {cat.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
