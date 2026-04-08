import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div
            className="w-full bg-[#1a1a1a] text-white py-2 relative z-[110]"
            role="banner"
            aria-label="Informações de benefícios"
        >
            <div className="flex items-center justify-center gap-4 px-10">
                <button className="text-white/60 hover:text-white transition-colors hidden md:block" aria-label="Anterior">
                    <ChevronLeft size={16} />
                </button>

                <p className="text-[11px] md:text-xs font-semibold tracking-wider uppercase text-center">
                    ✨ FRETE GRÁTIS BRASIL A PARTIR DE R$ 129,90 ✨
                </p>

                <button className="text-white/60 hover:text-white transition-colors hidden md:block" aria-label="Próximo">
                    <ChevronRight size={16} />
                </button>
            </div>

            <button
                onClick={() => setVisible(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                aria-label="Fechar barra de anúncios"
            >
                <X size={14} />
            </button>
        </div>
    );
}
