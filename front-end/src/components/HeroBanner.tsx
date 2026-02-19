import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    tag: string;
    title: string;
    subtitle: string;
    highlight: string;
    highlightSub: string;
    bgColor: string;
    imageUrl: string;
}

const slides: Slide[] = [
    {
        tag: 'PROMOÇÃO EXCLUSIVA',
        title: 'Compre &',
        subtitle: 'Ganhe!',
        highlight: 'em compras acima de R$ 150,00 no nosso site, você ganha um brinde especial!',
        highlightSub: 'Kit Beauty Exclusivo',
        bgColor: 'from-rosa-200 via-rosa-100 to-rosa-50',
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'LANÇAMENTO',
        title: 'Nova',
        subtitle: 'Coleção!',
        highlight: 'Descubra as últimas tendências em skincare e maquiagem premium.',
        highlightSub: 'Linha Glow Radiance',
        bgColor: 'from-rosa-100 via-rosa-50 to-white',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    },
    {
        tag: 'KITS ESPECIAIS',
        title: 'Monte',
        subtitle: 'Seu Kit!',
        highlight: 'Combine seus produtos favoritos e ganhe até 30% de desconto.',
        highlightSub: 'Oferta por Tempo Limitado',
        bgColor: 'from-turquesa-100 via-rosa-50 to-white',
        imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

    const slide = slides[current];

    return (
        <section
            className="relative w-full overflow-hidden"
            aria-label="Banner promocional"
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} transition-all duration-700`} />

            {/* Decorative circles */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-rosa-300/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-turquesa/10 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center min-h-[420px] md:min-h-[480px] py-10 md:py-0 gap-8">

                    {/* Left: Image */}
                    <div className="w-full md:w-5/12 flex justify-center order-2 md:order-1">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl shadow-rosa-400/20 border-4 border-white/60">
                            <img
                                src={slide.imageUrl}
                                alt={slide.highlightSub}
                                className="w-full h-full object-cover transition-all duration-700"
                            />
                            {/* Image overlay tag */}
                            <div className="absolute bottom-3 left-3 right-3">
                                <span className="inline-block bg-white/90 backdrop-blur-sm text-rosa-600 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                    {slide.tag}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Promo card */}
                    <div className="w-full md:w-7/12 flex justify-center order-1 md:order-2">
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-xl border border-rosa-100/50 max-w-lg w-full text-center space-y-5 transition-all duration-700">
                            <div className="inline-block bg-turquesa/10 text-turquesa-600 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-turquesa/20">
                                {slide.tag}
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {slide.title}{' '}
                                <span className="text-rosa-500 block md:inline">{slide.subtitle}</span>
                            </h2>

                            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                                {slide.highlight}
                            </p>

                            <div className="bg-rosa-500 text-white px-6 py-3 rounded-xl inline-block shadow-lg shadow-rosa-500/30">
                                <span className="font-bold text-lg tracking-wide">{slide.highlightSub}</span>
                            </div>

                            <div className="pt-2">
                                <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20 active:scale-95">
                                    Conferir Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation arrows */}
            <button
                onClick={prev}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 hover:text-rosa-500 rounded-full p-2.5 shadow-lg transition-all duration-200 backdrop-blur-sm active:scale-90"
                aria-label="Slide anterior"
            >
                <ChevronLeft size={22} />
            </button>
            <button
                onClick={next}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 hover:text-rosa-500 rounded-full p-2.5 shadow-lg transition-all duration-200 backdrop-blur-sm active:scale-90"
                aria-label="Próximo slide"
            >
                <ChevronRight size={22} />
            </button>

            {/* Dots indicator */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${i === current
                                ? 'w-8 bg-rosa-500'
                                : 'w-2.5 bg-gray-400/40 hover:bg-gray-400/70'
                            }`}
                        aria-label={`Ir para slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
