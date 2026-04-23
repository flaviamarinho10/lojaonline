import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '../lib/axios';

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(true);
    const [settings, setSettings] = useState(() => {
        const cached = localStorage.getItem('shine_announcement_settings');
        return cached ? JSON.parse(cached) : {
            active: true,
            message: '✨ FRETE GRÁTIS BRASIL A PARTIR DE R$ 129,90 ✨',
            bgColor: '#1a1a1a'
        };
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/appearance');
                if (res.data?.topBar) {
                    const newSettings = res.data.topBar;
                    setSettings(newSettings);
                    localStorage.setItem('shine_announcement_settings', JSON.stringify(newSettings));
                }
            } catch (error) {
                console.error('Failed to fetch announcement bar settings:', error);
            }
        };
        fetchSettings();
    }, []);

    if (!visible || settings.active === false) return null;

    return (
        <div
            className="w-full text-white py-2 relative z-[110] transition-colors duration-300"
            style={{ backgroundColor: settings.bgColor || '#1a1a1a' }}
            role="banner"
            aria-label="Informações de benefícios"
        >
            <div className="flex items-center justify-center gap-4 px-10">
                <button className="text-white/60 hover:text-white transition-colors hidden md:block" aria-label="Anterior">
                    <ChevronLeft size={16} />
                </button>

                <p className="text-[11px] md:text-xs font-semibold tracking-wider uppercase text-center">
                    {settings.message || '✨ FRETE GRÁTIS BRASIL A PARTIR DE R$ 129,90 ✨'}
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
