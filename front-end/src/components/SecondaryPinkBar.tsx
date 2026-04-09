export default function SecondaryPinkBar() {
    return (
        <div className="w-full bg-[#fce0e5] py-4 md:py-6 my-10 border-y border-rosa-200/30">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-2">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] text-rosa-500">
                    Vitrine
                </span>
                <p className="text-[14px] md:text-[18px] font-bold text-gray-800 tracking-tight">
                    Maquiagens escolhidas a dedo para destacar a sua melhor versão.
                </p>
                <div className="w-12 h-0.5 bg-rosa-400 rounded-full mt-2 opacity-60" />
            </div>
        </div>
    );
}
