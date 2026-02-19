import { Package, QrCode, CreditCard, MessageCircle } from 'lucide-react';

const badges = [
    {
        icon: Package,
        title: 'Frete Grátis',
        description: 'em compras acima de R$ 180 em produtos',
    },
    {
        icon: QrCode,
        title: 'Pagamentos por PIX',
        description: 'facilite o pagamento',
    },
    {
        icon: CreditCard,
        title: 'Parcele em até 4x',
        description: 'parcela mínima R$50',
    },
    {
        icon: MessageCircle,
        title: 'Suporte Online',
        description: 'atendimento rápido e personalizado',
    },
];

export default function TrustBadges() {
    return (
        <section
            className="w-full bg-white py-8 md:py-10 border-y border-gray-100"
            aria-label="Benefícios da loja"
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
                    {badges.map((badge, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 md:gap-4 justify-center md:justify-start group"
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 group-hover:border-rosa-200 group-hover:bg-rosa-50 group-hover:text-rosa-500 transition-all duration-300">
                                <badge.icon size={20} strokeWidth={1.5} />
                            </div>
                            {/* Text */}
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 leading-tight">{badge.title}</p>
                                <p className="text-xs text-gray-500 leading-snug">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
