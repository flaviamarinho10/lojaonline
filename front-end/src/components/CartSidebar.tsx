import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Trash2, Plus, Minus, Loader2, Truck } from 'lucide-react';
import api from '../lib/axios';

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartSidebar() {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isCartOpen) return null;

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
    const progress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            await api.post('/orders', {
                email,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            });

            setSuccess(true);
            clearCart();
            setTimeout(() => {
                setSuccess(false);
                setIsCartOpen(false);
                setEmail('');
            }, 3000);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Erro ao finalizar pedido. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(total);

    const formattedRemaining = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(remaining);

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-[400px] bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.08)] flex flex-col h-full animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Carrinho de compras ({itemCount})
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                        aria-label="Fechar carrinho"
                    >
                        <X size={22} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Shipping Progress Bar */}
                <div className="px-6 py-4 bg-[#f7f7f7]">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Truck icon in circle */}
                        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                            <Truck size={16} strokeWidth={1.5} />
                        </div>
                        {/* Progress bar */}
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-turquesa rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {remaining > 0 ? (
                            <>Compre mais {formattedRemaining} para ganhar <strong className="text-gray-700">Frete grátis!</strong></>
                        ) : (
                            <span className="text-turquesa-600 font-semibold">🎉 Parabéns! Você ganhou Frete grátis!</span>
                        )}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {success ? (
                        /* Success State */
                        <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-turquesa-50 flex items-center justify-center">
                                <CheckCircle size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Pedido Confirmado!</h3>
                            <p className="text-gray-500 text-sm">Obrigada por comprar na Shine Glam.</p>
                        </div>
                    ) : items.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center h-full text-center px-8 space-y-5">
                            {/* Cute basket SVG */}
                            <div className="text-gray-300">
                                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 30h40l-4 30H24L20 30z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    <path d="M28 30V22a12 12 0 0124 0v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    {/* Cute face */}
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
                                onClick={() => setIsCartOpen(false)}
                                className="w-full max-w-[280px] bg-turquesa hover:bg-turquesa-500 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 active:scale-95 shadow-sm"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        /* Cart Items */
                        <div className="p-4 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 bg-[#f9f9f9] p-3 rounded-xl">
                                    <div className="h-20 w-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-sm font-medium text-gray-900 leading-tight">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-300 hover:text-red-400 transition-colors"
                                                aria-label={`Remover ${item.name}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-end justify-between mt-1.5">
                                            <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                                                <button
                                                    onClick={() => updateQuantity(item.id, 'decrease')}
                                                    className="px-2 py-1 text-gray-400 hover:text-gray-900 disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                    aria-label="Diminuir quantidade"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-semibold w-5 text-center text-gray-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 'increase')}
                                                    className="px-2 py-1 text-gray-400 hover:text-gray-900"
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            <span className="font-semibold text-sm text-gray-900">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer / Checkout */}
                {!success && items.length > 0 && (
                    <div className="p-5 border-t border-gray-100 bg-white space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-sm">Subtotal</span>
                            <span className="text-xl font-bold text-gray-900">{formattedTotal}</span>
                        </div>
                        <p className="text-[11px] text-gray-400 text-center">Frete calculado na finalização</p>

                        <form onSubmit={handleCheckout} className="space-y-3">
                            <input
                                type="email"
                                placeholder="Seu e-mail para finalizar"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-turquesa/30 focus:border-turquesa transition-all text-sm"
                                aria-label="E-mail para checkout"
                            />

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-turquesa hover:bg-turquesa-500 text-white py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    'Finalizar Pedido'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

function CheckCircle({ size, strokeWidth }: { size: number; strokeWidth: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-turquesa-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
