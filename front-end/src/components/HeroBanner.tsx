import { useState, useEffect, useCallback, useRef } from 'react';

const banners = [
    {
        id: 1,
        url: "/Banner/Gemini_Generated_Image_3mg85p3mg85p3mg8.png",
        alt: "Conheça nossos produtos"
    },
    {
        id: 2,
        url: "/AirBrush_20260408095904.jpg",
        alt: "Queridinhos da Internet"
    }
];

export default function HeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [startX, setStartX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragMoved, setDragMoved] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartX(e.pageX);
        setIsDragging(true);
        setDragMoved(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        if (Math.abs(e.pageX - startX) > 10) {
            setDragMoved(true);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const endX = e.pageX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            setIsAutoPlaying(false);
        }
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        let interval: any;
        if (isAutoPlaying) {
            // Give more time to the first banner (highlight)
            const duration = currentIndex === 0 ? 8000 : 4000;
            interval = setTimeout(() => {
                nextSlide();
            }, duration);
        }
        return () => clearTimeout(interval);
    }, [isAutoPlaying, currentIndex, nextSlide]);

    return (
        <section 
            ref={containerRef}
            className="relative w-full overflow-hidden group select-none"
        >
            {/* Banners */}
            <div 
                className={`relative w-full bg-gray-100 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClickCapture={(e) => {
                    if (dragMoved) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }}
            >
                {banners.map((banner, index) => (
                    <img
                        key={banner.id}
                        src={banner.url}
                        alt={banner.alt}
                        draggable="false"
                        className={`w-full h-auto transition-opacity duration-1000 ease-in-out ${
                            index === currentIndex 
                                ? 'relative opacity-100 z-10' 
                                : 'absolute top-0 left-0 opacity-0 z-0'
                        }`}
                    />
                ))}
            </div>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex 
                                ? 'bg-white w-4 md:w-6' 
                                : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Ir para o banner ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
