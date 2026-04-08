import { useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
    text: string;
    author: string;
    product: string;
    rating: number;
}

const reviews: Review[] = [
    {
        text: 'O brilho é sofisticado, nada grosseiro. Fica lindo tanto de dia quanto à noite. Gostei muito da textura, que não marca...',
        author: 'Priscila M.',
        product: 'ILUMINADOR COMPACTO GOLD',
        rating: 5,
    },
    {
        text: 'Comprei o gloss e fiquei impressionada com a textura. Não é pegajoso, fica confortável nos lábios e o brilho é lindo...',
        author: 'Mariana S.',
        product: 'GLOSS LABIAL ANGEL',
        rating: 5,
    },
    {
        text: 'Comprei a base por indicação e fiquei muito satisfeita. Uniformiza bem a pele, não transfere tanto e não craquela ao...',
        author: 'Camila S.',
        product: 'BASE LIQ. HYALURONIC MATTE',
        rating: 5,
    },
    {
        text: 'O blush é lindo e super fácil de aplicar. Dá pra construir camadas sem manchar e o resultado fica muito natural na pele...',
        author: 'Larissa P.',
        product: 'BLUSH COMPACTO ROSA QUENTE',
        rating: 5,
    },
    {
        text: 'As cores são muito bem pigmentadas e fáceis de esfumar. Uso tanto para makes mais básicas quanto para produções...',
        author: 'Daniela A.',
        product: 'PALETA DE SOMBRAS SWEET CARAMEL',
        rating: 5,
    },
];

export default function CustomerReviews() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 320;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="py-14 md:py-20 bg-white" aria-label="Avaliações de clientes">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-center text-lg md:text-xl font-bold uppercase tracking-[0.15em] text-gray-900 mb-10">
                    O Que Nossas Clientes Dizem
                </h2>

                <div className="relative">
                    <button
                        onClick={() => scroll('left')}
                        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center text-gray-400 hover:text-rosa-500 transition-all border border-gray-100"
                        aria-label="Avaliações anteriores"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x pb-4 no-scrollbar"
                    >
                        {reviews.map((review, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-[280px] md:w-[300px] bg-white rounded-xl p-6 shadow-sm border border-gray-100 snap-start hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Review Text */}
                                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4 min-h-[4.5rem]">
                                    "{review.text}"
                                </p>

                                {/* Stars */}
                                <div className="flex items-center gap-0.5 mb-4">
                                    {[...Array(review.rating)].map((_, j) => (
                                        <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Author */}
                                <div className="border-t border-gray-50 pt-3">
                                    <p className="font-bold text-sm text-gray-900">{review.author}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                                        {review.product}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md items-center justify-center text-gray-400 hover:text-rosa-500 transition-all border border-gray-100"
                        aria-label="Próximas avaliações"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
