import { useState, useEffect } from 'react';
import { ChevronsUp } from 'lucide-react';

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-800 hover:shadow-xl transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            aria-label="Voltar ao topo"
        >
            <ChevronsUp size={22} strokeWidth={1.5} />
        </button>
    );
}
