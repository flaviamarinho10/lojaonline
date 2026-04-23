import { useState, useEffect } from 'react';
import {
    Truck, Tag, Flower, Percent, Heart, Star, Sparkles,
    ShieldCheck, Gift, CreditCard, ShoppingBag, Package, BadgeCheck, Smile
} from 'lucide-react';
import api from '../lib/axios';

const iconMap: Record<string, any> = {
    Truck, Tag, Flower, Percent, Heart, Star, Sparkles,
    ShieldCheck, Gift, CreditCard, ShoppingBag, Package, BadgeCheck, Smile
};

export default function BenefitsTicker() {
    const [settings, setSettings] = useState(() => {
        const cached = localStorage.getItem('shine_benefits_settings');
        return cached ? JSON.parse(cached) : {
            active: true,
            bgColor: '#fce0e5',
            text1: '',
            icon1: 'Truck',
            text2: '',
            icon2: 'Tag',
            text3: '',
            icon3: 'Flower',
            text4: '',
            icon4: 'Percent',
        };
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/appearance');
                if (res.data?.benefitsTicker) {
                    const newSettings = res.data.benefitsTicker;
                    setSettings(newSettings);
                    localStorage.setItem('shine_benefits_settings', JSON.stringify(newSettings));
                }
            } catch (error) {
                console.error('Failed to fetch benefits ticker settings:', error);
            }
        };
        fetchSettings();
    }, []);

    if (!settings.active) return null;

    const benefits = [
        { icon: iconMap[settings.icon1] || Star, text: settings.text1 },
        { icon: iconMap[settings.icon2] || Star, text: settings.text2 },
        { icon: iconMap[settings.icon3] || Star, text: settings.text3 },
        { icon: iconMap[settings.icon4] || Star, text: settings.text4 }
    ];

    // Create a duplicated array so the marquee animation is seamless
    const repeatedBenefits = [...benefits, ...benefits, ...benefits];

    return (
        <div
            className="w-full overflow-hidden py-3 transition-colors duration-300"
            style={{ backgroundColor: settings.bgColor || '#fce0e5' }}
        >
            <div className="flex animate-ticker whitespace-nowrap">
                {repeatedBenefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2.5 mx-5 flex-shrink-0">
                        <benefit.icon size={13} className="text-[#333]" strokeWidth={2.5} />
                        <span className="text-[11px] font-medium text-[#555] tracking-wide flex items-center pt-0.5">
                            {benefit.text}
                        </span>
                        {/* Separator */}
                        <div className="w-1.5 h-1.5 bg-[#444] rotate-45 ml-5 opacity-80"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
