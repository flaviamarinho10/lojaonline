import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Trash2, Plus, Minus, CreditCard, QrCode, MessageCircle, ArrowLeft } from 'lucide-react';

export default function CartSidebar() {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, total } = useCart();

    // Form state
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUf] = useState('');
    const [pagamento, setPagamento] = useState<'cartao' | 'pix' | ''>('');
    
    // UI state
    const [step, setStep] = useState<'cart' | 'checkout'>('cart');
    const [cepLoading, setCepLoading] = useState(false);
    const [manualAddress, setManualAddress] = useState(false);

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

    const isFormValid = nome.trim() && email.trim() && (manualAddress ? rua.trim() && numero.trim() : cep.replace(/\D/g, '').length === 8) && pagamento;

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = formatCep(e.target.value);
        setCep(val);
        const digits = val.replace(/\D/g, '');
        if (digits.length === 8) {
            setCepLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setRua(data.logradouro || '');
                    setBairro(data.bairro || '');
                    setCidade(data.localidade || '');
                    setUf(data.uf || '');
                    setManualAddress(true); // Abre os campos de endereço
                }
            } catch (err) {
                console.error(err);
            } finally {
                setCepLoading(false);
            }
        }
    };

    const handleWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const pagamentoLabel = pagamento === 'cartao' ? 'Cartão de Crédito' : 'PIX';

        const produtosTexto = items
            .map(
                (item) => {
                    const corLabel = item.color || item.colorHex;
                    const corTexto = corLabel ? `\n    └ Cor: ${corLabel}` : '';
                    return `• ${item.name} (x${item.quantity})${corTexto}\n    Valor: ${formatCurrency(item.price * item.quantity)}`;
                }
            )
            .join('\n\n');

        const enderecoFinal = manualAddress
            ? `${rua}, ${numero}${complemento ? ` - ${complemento}` : ''}${bairro ? ` - ${bairro}` : ''}${cidade ? ` - ${cidade}/${uf}` : ''}${cep ? ` (CEP: ${cep})` : ''}`
            : `CEP: ${cep}`;

        const mensagem = `*Novo Pedido - Shine Glam*\n\n` +
            `*Nome:* ${nome}\n` +
            `*E-mail:* ${email}\n` +
            `*Endereço:* ${enderecoFinal}\n` +
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
                        {step === 'cart' ? (
                            <button
                                onClick={handleClose}
                                className="md:hidden text-gray-400 hover:text-gray-700 transition-colors p-1"
                                aria-label="Voltar"
                            >
                                <ArrowLeft size={20} strokeWidth={1.5} />
                            </button>
                        ) : (
                            <button
                                onClick={() => setStep('cart')}
                                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                                aria-label="Voltar ao carrinho"
                            >
                                <ArrowLeft size={20} strokeWidth={1.5} />
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
                                const colorId = item.color || item.colorHex;
                                const cartKey = colorId ? `${item.id}__${colorId}` : item.id;
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
                                                    {(item.color || item.colorHex) && (
                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            <div
                                                                className="w-3 h-3 rounded-full border border-gray-200 shadow-inner"
                                                                style={{ backgroundColor: item.colorHex || '#e879a0' }}
                                                            />
                                                            {item.color && (
                                                                <span className="text-[11px] text-gray-500 font-medium">{item.color}</span>
                                                            )}
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
                                    const colorId = item.color || item.colorHex;
                                    const cartKey = colorId ? `${item.id}__${colorId}` : item.id;
                                    return (
                                        <div key={cartKey} className="flex flex-col text-sm">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-900 font-medium">
                                                    {item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span>
                                                </span>
                                                <span className="font-bold text-gray-900 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                            {(item.color || item.colorHex) && (
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <div
                                                        className="w-2.5 h-2.5 rounded-full border border-gray-200 shadow-inner"
                                                        style={{ backgroundColor: item.colorHex || '#e879a0' }}
                                                    />
                                                    {item.color && (
                                                        <span className="text-[10px] text-gray-500 font-medium">{item.color}</span>
                                                    )}
                                                </div>
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
                                    <label htmlFor="checkout-cep" className="block text-xs font-medium text-gray-600 mb-1">CEP {manualAddress && <span className="text-gray-400 font-normal">(Opcional)</span>}</label>
                                    <div className="relative">
                                        <input
                                            id="checkout-cep"
                                            type="text"
                                            required={!manualAddress}
                                            placeholder="00000-000"
                                            value={cep}
                                            onChange={handleCepChange}
                                            className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                        />
                                        {cepLoading && (
                                            <div className="absolute right-3 top-2.5">
                                                <div className="w-5 h-5 border-2 border-rosa-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    {!manualAddress && (
                                        <button 
                                            type="button" 
                                            onClick={() => setManualAddress(true)}
                                            className="text-[10px] text-gray-400 underline mt-1.5 hover:text-rosa-500 transition-colors"
                                        >
                                            Não sei meu cep
                                        </button>
                                    )}
                                </div>

                                {manualAddress && (
                                    <div className="space-y-3 animate-in fade-in duration-300">
                                        <div>
                                            <label htmlFor="checkout-rua" className="block text-xs font-medium text-gray-600 mb-1">Rua / Logradouro</label>
                                            <input
                                                id="checkout-rua"
                                                type="text"
                                                required
                                                placeholder="Ex: Rua das Flores"
                                                value={rua}
                                                onChange={(e) => setRua(e.target.value)}
                                                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="checkout-numero" className="block text-xs font-medium text-gray-600 mb-1">Número</label>
                                                <input
                                                    id="checkout-numero"
                                                    type="text"
                                                    required
                                                    placeholder="Ex: 123"
                                                    value={numero}
                                                    onChange={(e) => setNumero(e.target.value)}
                                                    className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="checkout-complemento" className="block text-xs font-medium text-gray-600 mb-1">Complemento</label>
                                                <input
                                                    id="checkout-complemento"
                                                    type="text"
                                                    placeholder="Apto, Bloco (Opcional)"
                                                    value={complemento}
                                                    onChange={(e) => setComplemento(e.target.value)}
                                                    className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rosa-500/30 focus:border-rosa-500 transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
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
