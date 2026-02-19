import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Trash2, Plus, Minus, Loader2, ShoppingBag } from 'lucide-react';
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
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform animate-in slide-in-from-right duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h2 className="font-serif text-2xl text-slate-900">Your Bag</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <X size={24} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                    {success ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center text-slate-900 border border-rose-100">
                                <CheckCircle size={32} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-serif text-2xl text-slate-900">Order Confirmed</h3>
                                <p className="text-slate-500 font-light">Thank you for shopping with Night Peri.</p>
                            </div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="text-slate-300">
                                <ShoppingBag size={48} strokeWidth={1} />
                            </div>
                            <p className="text-slate-500 font-light text-lg">Your shopping bag is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-slate-900 text-xs uppercase tracking-widest font-bold border-b border-slate-900 pb-0.5 hover:text-pink-600 hover:border-pink-600 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-5 bg-white p-4 rounded-sm border border-slate-100 shadow-sm">
                                <div className="h-24 w-20 bg-slate-100 overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-full w-full object-cover mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-serif text-slate-900 text-lg leading-tight">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-300 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex items-end justify-between mt-2">
                                        <div className="flex items-center border border-slate-200 rounded-sm">
                                            <button
                                                onClick={() => updateQuantity(item.id, 'decrease')}
                                                className="px-2 py-1 text-slate-400 hover:text-slate-900 disabled:opacity-30"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span className="text-xs font-medium w-4 text-center text-slate-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 'increase')}
                                                className="px-2 py-1 text-slate-400 hover:text-slate-900"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        <span className="font-medium text-slate-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Checkout */}
                {!success && items.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-white space-y-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-sm uppercase tracking-wide">Subtotal</span>
                            <span className="font-serif text-2xl text-slate-900">{formattedTotal}</span>
                        </div>
                        <p className="text-xs text-slate-400 text-center font-light">Shipping & taxes calculated at checkout</p>

                        <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email Address for Checkout"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest text-xs font-bold"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Checkout'
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

// Icon for Success State
function CheckCircle({ size, strokeWidth }: { size: number, strokeWidth: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
