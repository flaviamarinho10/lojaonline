import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, type: 'increase' | 'decrease') => void;
    clearCart: () => void;
    total: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === newItem.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
        showNotification(`Adicionado: ${newItem.name}`);
        setIsCartOpen(true);
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const updateQuantity = (id: string, type: 'increase' | 'decrease') => {
        setItems((prev) => prev.map((item) => {
            if (item.id === id) {
                const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        }));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            total,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg font-bold animate-bounce z-50">
                    {notification}
                </div>
            )}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
