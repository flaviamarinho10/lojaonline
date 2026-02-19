export default function AnnouncementBar() {
    return (
        <div
            className="w-full bg-turquesa py-2.5"
            role="banner"
            aria-label="Informações de benefícios"
        >
            <p className="text-white text-xs md:text-sm font-medium tracking-wide text-center">
                Frete grátis a partir de R$ 150 | Parcelamento em até 4x sem juros
            </p>
        </div>
    );
}
