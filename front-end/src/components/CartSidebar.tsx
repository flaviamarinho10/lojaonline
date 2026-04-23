import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Trash2, Plus, Minus, CreditCard, QrCode, MessageCircle } from 'lucide-react';

export default function CartSidebar() {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, total } = useCart();

    // Form state
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [endereco, setEndereco] = useState('');
    const [cep, setCep] = useState('');
    const [pagamento, setPagamento] = useState<'cartao' | 'pix' | ''>('');

    // UI state
    const [step, setStep] = useState<'cart' | 'checkout'>('cart');

    if (!isCartOpen) return null;

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formattedTotal = formatCurrency(total);

    const formatCep = (value: string) => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        if (digits.length > 5) return digits.slice(0, 5) + '-' + digits.slice(5);
        return digits;
    };

    const isFormValid = nome.trim() && email.trim() && endereco.trim() && cep.trim() && pagamento;

    const handleWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const pagamentoLabel = pagamento === 'cartao' ? 'Cartão de Crédito' : 'PIX';

        const produtosTexto = items
            .map(
                (item) => {
                    const corTexto = item.color ? `\n    └ Cor: ${item.color}` : '';
                    return `• ${item.name} (x${item.quantity})${corTexto}\n    Valor: ${formatCurrency(item.price * item.quantity)}`;
                }
            )
            .join('\n\n');

        const mensagem = `*Novo Pedido - Shine Glam*\n\n` +
            `*Nome:* ${nome}\n` +
            `*E-mail:* ${email}\n` +
            `*Endereço:* ${endereco}\n` +
            `*CEP:* ${cep}\n` +
            `*Pagamento:* ${pagamentoLabel}\n\n` +
            `*Produtos:*\n${produtosTexto}\n\n` +
            `*Total: ${formattedTotal}*\n\n` +
            `Aguardo confirmação!`;

        const phone = '5584981407003';
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    };

    const handleClose = () => {
        setIsCartOpen(false);
        setStep('cart');
    };

    return (
        <div className="fixed inset-0 z-[200] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 transition-opacity"
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-[420px] bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.08)] flex flex-col h-full animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {step === 'checkout' && (
                            <button
                                onClick={() => setStep('cart')}
                                className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
                                aria-label="Voltar ao carrinho"
                            >
                                ←
                            </button>
                        )}
                        <h2 className="text-lg font-semibold text-gray-900">
                            {step === 'cart' ? `Carrinho (${itemCount})` : 'Finalizar Pedido'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                        aria-label="Fechar carrinho"
                    >
                        <X size={22} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-5">
                            <div className="text-gray-300">
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 30h40l-4 30H24L20 30z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path d="M28 30V22a12 12 0 0124 0v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <circle cx="34" cy="44" r="2" fill="currentColor" />
                                    <circle cx="46" cy="44" r="2" fill="currentColor" />
                                    <path d="M36 52c2 2 6 2 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                                </svg>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                    Seu carrinho está vazio no momento!
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Você pode conferir todos os produtos disponíveis e comprar alguns na loja.
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-full max-w-[280px] bg-rosa-500 hover:bg-rosa-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : step === 'cart' ? (
                        /* Cart Items */
                        <div className="p-4 space-y-4">
                            {items.map((item) => {
                                const cartKey = item.color ? `${item.id}__${item.color}` : item.id;
                                return (
                                    <div key={cartKey} className="flex gap-4 bg-[#f9f9f9] p-3 rounded-xl">
                                        <div className="h-20 w-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
                                                    {item.color && (
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <div className="w-2 h-2 rounded-full bg-rosa-400" />
                                                            <span className="text-[11px] text-rosa-500 font-bold uppercase tracking-wider">Cor: {item.color}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(cartKey)}
                                                    className="text-gray-300 hover:text-red-400 transition-colors"
                                                    aria-label={`Remover ${item.name}`}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-1.5">
                                                <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                                    <button
                                                        onClick={() => updateQuantity(cartKey, 'decrease')}
                                                        className="px-2 py-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <span className="text-xs font-semibold w-5 text-center text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(cartKey, 'increase')}
                                                        className="px-2 py-1 text-gray-400 hover:text-gray-900"
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                                <span className="font-semibold text-sm text-gray-900">
                                                    {formatCurrency(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Checkout Form */
                        <form id="checkout-form" onSubmit={handleWhatsApp} className="p-5 space-y-4">
                            {/* Resumo compacto */}
                            <div className="bg-[#fdf2f5] rounded-xl p-4 space-y-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Resumo do Pedido</h4>
                                {items.map((item) => {
                                    const cartKey = item.color ? `${item.id}__${item.color}` : item.id;
                                    return (
                                        <div key={cartKey} className="flex flex-col text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-medium">
                                                    {item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span>
                                                </span>
                                                <span className="font-bold text-gray-900 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                            {item.color && (
                                                <span className="text-[10px] text-rosa-400 font-bold uppercase tracking-widest mt-0.5">Cor selecionada: {item.color}</span>
                                            )}
                                        </div>
                                    );
                                })}
                                <div className="border-t border-rosa-200 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-gray-900 text-sm">Total</span>
                                    <span className="font-bold text-lg text-rosa-600">{formattedTotal}</span>
                                </div>
                            </div>

                            {/* Dados pessoais */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dados Pessoais</h4>

                                <div>
                                    <label htmlFor="checkout-nome" className="block text-xs font-medium text-gray-600 mb-1">Nome completo</label>
                                    <input
                                        id="checkout-nome"
                                        type="text"
                                        required
                                        placeholder="Seu nome completo"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="checkout-email" className="block text-xs font-medium text-gray-600 mb-1">E-mail</label>
                                    <input
                                        id="checkout-email"
                                        type="email"
                                        required
                                        placeholder="seu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Endereço de Entrega</h4>

                                <div>
                                    <label htmlFor="checkout-endereco" className="block text-xs font-medium text-gray-600 mb-1">Endereço completo</label>
                                    <input
                                        id="checkout-endereco"
                                        type="text"
                                        required
                                        placeholder="Rua, número, bairro, cidade - UF"
                                        value={endereco}
                                        onChange={(e) => setEndereco(e.target.value)}
                                        className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="checkout-cep" className="block text-xs font-medium text-gray-600 mb-1">CEP</label>
                                    <input
                                        id="checkout-cep"
                                        type="text"
                                        required
                                        placeholder="00000-000"
                                        value={cep}
                                        onChange={(e) => setCep(formatCep(e.target.value))}
                                        className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Pagamento */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Forma de Pagamento</h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPagamento('cartao')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${pagamento === 'cartao'
                                            ? 'border-rosa-500 bg-rosa-50 shadow-sm'
                                            : 'border-gray-200 bg-[#f7f7f7] hover:border-gray-300'
                                            }`}
                                    >
                                        <CreditCard size={24} className={pagamento === 'cartao' ? 'text-rosa-500' : 'text-gray-400'} />
                                        <span className={`text-xs font-semibold ${pagamento === 'cartao' ? 'text-rosa-600' : 'text-gray-600'}`}>
                                            Cartão
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPagamento('pix')}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${pagamento === 'pix'
                                            ? 'border-rosa-500 bg-rosa-50 shadow-sm'
                                            : 'border-gray-200 bg-[#f7f7f7] hover:border-gray-300'
                                            }`}
                                    >
                                        <QrCode size={24} className={pagamento === 'pix' ? 'text-rosa-500' : 'text-gray-400'} />
                                        <span className={`text-xs font-semibold ${pagamento === 'pix' ? 'text-rosa-600' : 'text-gray-600'}`}>
                                            PIX
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
                        {step === 'cart' ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-sm">Subtotal</span>
                                    <span className="text-xl font-bold text-gray-900">{formattedTotal}</span>
                                </div>
                                <p className="text-[11px] text-gray-400 text-center">O frete é calculado via WhatsApp</p>
                                <button
                                    onClick={() => setStep('checkout')}
                                    className="w-full bg-rosa-500 hover:bg-rosa-600 text-white py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-semibold text-sm"
                                >
                                    Continuar para Checkout
                                </button>
                            </div>
                        ) : (
                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={!isFormValid}
                                className="w-full bg-[#25D366] hover:bg-[#1fb855] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] font-semibold text-sm shadow-sm"
                            >
                                <MessageCircle size={18} />
                                Finalizar Pedido via WhatsApp
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
