import { Truck, Tag, Flower, Percent } from 'lucide-react';

const benefits = [
    { icon: Truck, text: 'Frete grátis a partir de R$ 129,90' },
    { icon: Tag, text: <>Parcelamento em até 6x sem juros</> },
    { icon: Flower, text: 'Desconto de 5% via PIX' },
    { icon: Percent, text: <>Cupom de 1ª compra <span className="underline ml-1">NINAE10</span></> },
    { icon: Truck, text: 'Frete grátis a partir de R$ 129,90' },
    { icon: Tag, text: <>Parcelamento em até 6x sem juros</> },
    { icon: Flower, text: 'Desconto de 5% via PIX' },
    { icon: Percent, text: <>Cupom de 1ª compra <span className="underline ml-1">NINAE10</span></> },
    { icon: Truck, text: 'Frete grátis a partir de R$ 129,90' },
    { icon: Tag, text: <>Parcelamento em até 6x sem juros</> },
    { icon: Flower, text: 'Desconto de 5% via PIX' },
    { icon: Percent, text: <>Cupom de 1ª compra <span className="underline ml-1">NINAE10</span></> },
];

export default function BenefitsTicker() {
    return (
        <div className="w-full bg-[#fce0e5] overflow-hidden py-3">
            <div className="flex animate-ticker whitespace-nowrap">
                {benefits.map((benefit, i) => (
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
