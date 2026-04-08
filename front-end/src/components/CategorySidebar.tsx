import { useState, useEffect } from 'react';
import api from '../lib/axios';

interface Category {
    id: string;
    name: string;
    imageUrl: string;
    bgColor: string;
    sortOrder: number;
    active?: boolean;
}

interface CategorySidebarProps {
    onSelectCategory?: (categoryId: string | null) => void;
    activeCategory?: string | null;
}

export default function CategorySidebar({ onSelectCategory, activeCategory }: CategorySidebarProps) {
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

    const formatImageUrl = (url: string | undefined) => {
        if (!url) return undefined;
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (driveMatch && driveMatch[1]) {
            return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }
        return url;
    };

    if (loading) return null;
    if (categories.length === 0) return null;

    return (
        <div className="flex flex-col items-center gap-6 animate-entrance">
            {/* Decoração superior */}
            <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-200 opacity-30"></div>
            </div>

            {/* Scroll Container Vertical */}
            <div className="flex flex-col gap-6 items-center overflow-y-auto no-scrollbar max-h-[70vh] py-4 px-2">
                {/* Botão Geral */}
                <button
                    onClick={() => onSelectCategory?.(null)}
                    className={`flex flex-col items-center gap-3 shrink-0 snap-start transition-all duration-500 group ${
                        !activeCategory ? 'scale-105' : 'hover:scale-105'
                    }`}
                >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                        !activeCategory ? 'bg-gray-900 text-white ring-4 ring-rosa-100' : 'bg-white text-gray-400 border border-gray-100 group-hover:border-rosa-300'
                    }`}>
                        <div className="font-black text-[9px] uppercase tracking-tighter">Geral</div>
                    </div>
                </button>

                {categories.filter(cat => cat.active !== false).map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const finalImg = formatImageUrl(cat.imageUrl);
                    
                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory?.(isActive ? null : cat.id)}
                            className={`flex flex-col items-center gap-3 shrink-0 snap-start transition-all duration-500 group ${
                                isActive ? 'scale-105' : 'hover:scale-105'
                            }`}
                        >
                            <div className={`w-20 h-20 rounded-full overflow-hidden transition-all duration-500 shadow-sm border-2 ${
                                isActive ? 'border-rosa-400 ring-4 ring-rosa-100' : 'border-white group-hover:border-rosa-200'
                            }`}>
                                {finalImg ? (
                                    <img 
                                        src={finalImg} 
                                        alt={cat.name} 
                                        className={`w-full h-full object-cover transition-all duration-1000 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300 font-bold text-lg">
                                        {cat.name[0]}
                                    </div>
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors text-center ${
                                isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-900'
                            }`}>
                                {cat.name}
                            </span>
                        </button>
                    );
                })}
            </div>
            
            {/* Decoração inferior */}
            <div className="flex flex-col items-center gap-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-200 opacity-30"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-300 opacity-60"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-rosa-400"></div>
            </div>
        </div>
    );
}
