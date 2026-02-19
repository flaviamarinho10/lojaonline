export default function AnnouncementBar() {
    const messages = [
        'Frete grátis a partir de R$ 180',
        'Compre em até 4x sem juros',
        'Entrega para todo o Brasil',
        'Frete grátis a partir de R$ 180',
        'Compre em até 4x sem juros',
        'Entrega para todo o Brasil',
    ];

    return (
        <div
            className="w-full bg-turquesa overflow-hidden"
            role="marquee"
            aria-label="Informações de benefícios e promoções"
        >
            <div className="animate-marquee flex whitespace-nowrap py-2.5">
                {messages.map((msg, i) => (
                    <span
                        key={i}
                        className="mx-8 text-white text-xs md:text-sm font-medium tracking-wide inline-flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />
                        {msg}
                    </span>
                ))}
                {/* Duplicate for seamless loop */}
                {messages.map((msg, i) => (
                    <span
                        key={`dup-${i}`}
                        className="mx-8 text-white text-xs md:text-sm font-medium tracking-wide inline-flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 bg-white/60 rounded-full flex-shrink-0" />
                        {msg}
                    </span>
                ))}
            </div>
        </div>
    );
}
