import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import api from '../lib/axios';

export default function CartSidebar() {
    const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isCartOpen) return null;

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

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-900 shadow-2xl flex flex-col h-full transform transition-transform animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-900">
                    <h2 className="text-xl font-bold text-white">Seu Carrinho</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in zoom-in">
                            <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                                <span className="text-3xl">✓</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Pedido Realizado!</h3>
                            <p className="text-zinc-400">Obrigado pela sua compra.</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="text-zinc-700">
                                <Trash2 size={48} />
                            </div>
                            <p className="text-zinc-500 text-lg">Seu carrinho está vazio.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-emerald-500 font-bold hover:underline"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-20 w-20 object-cover rounded bg-zinc-800"
                                />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-white line-clamp-1">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-zinc-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <span className="font-bold text-emerald-400">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                        </span>

                                        <div className="flex items-center gap-3 bg-zinc-950 rounded-lg px-2 py-1 border border-zinc-800">
                                            <button
                                                onClick={() => updateQuantity(item.id, 'decrease')}
                                                className="text-zinc-400 hover:text-white disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 'increase')}
                                                className="text-zinc-400 hover:text-white"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {!success && items.length > 0 && (
                    <div className="p-6 border-t border-zinc-900 bg-zinc-950 space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                            <span className="text-zinc-400">Total</span>
                            <span className="text-white text-xl">{formattedTotal}</span>
                        </div>

                        <form onSubmit={handleCheckout} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1 uppercase tracking-wider">
                                    Finalizar Pedido
                                </label>
                                <input
                                    type="email"
                                    placeholder="Seu melhor e-mail"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    'Finalizar Compra'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
