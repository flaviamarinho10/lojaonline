interface HeroBannerProps {
    settings: {
        desktopImage: string;
        mobileImage: string;
        title: string;
        subtitle: string;
        buttonText: string;
        buttonLink: string;
    };
}

export default function HeroBanner({ settings }: HeroBannerProps) {
    if (!settings.desktopImage) return null;

    return (
        <section className="relative w-full group overflow-hidden mx-auto max-w-7xl px-4 py-2">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-sm border border-rosa-100/40">
                {/* Images */}
                <img
                    src={settings.mobileImage || settings.desktopImage}
                    alt={settings.title}
                    className="w-full h-auto md:hidden block"
                />
                <img
                    src={settings.desktopImage}
                    alt={settings.title}
                    className="w-full h-auto hidden md:block transition-transform duration-1000 group-hover:scale-[1.02]"
                />

                {/* Overlay Content */}
                {(settings.title || settings.subtitle || settings.buttonText) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 text-center px-6">
                        <div className="max-w-3xl space-y-4">
                            {settings.title && (
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                    {settings.title}
                                </h2>
                            )}
                            {settings.subtitle && (
                                <p className="text-lg md:text-xl text-white/90 font-medium drop-shadow-md">
                                    {settings.subtitle}
                                </p>
                            )}
                            {settings.buttonText && (
                                <div className="pt-4">
                                    <a
                                        href={settings.buttonLink || '#'}
                                        className="inline-block bg-rosa-400 text-white border-2 border-rosa-400 px-8 py-3.5 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-white hover:text-rosa-500 hover:border-white transition-all duration-300 shadow-lg"
                                    >
                                        {settings.buttonText}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
