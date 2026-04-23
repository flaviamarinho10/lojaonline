import { createContext, useContext, useState, type ReactNode } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    color?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number, event?: React.MouseEvent) => void;
    removeFromCart: (cartKey: string) => void;
    updateQuantity: (cartKey: string, type: 'increase' | 'decrease') => void;
    clearCart: () => void;
    total: number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate a unique cart key from product id + color
const getCartKey = (id: string, color?: string) => color ? `${id}__${color}` : id;

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>, quantity = 1, event?: React.MouseEvent) => {
        const cartKey = getCartKey(newItem.id, newItem.color);
        setItems((prev) => {
            const existing = prev.find((i) => getCartKey(i.id, i.color) === cartKey);
            if (existing) {
                return prev.map((i) =>
                    getCartKey(i.id, i.color) === cartKey ? { ...i, quantity: i.quantity + quantity } : i
                );
            }
            return [...prev, { ...newItem, quantity }];
        });

        const isMobile = window.innerWidth < 768;

        if (isMobile && event) {
            // Fly-to-cart animation on mobile
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            window.dispatchEvent(new CustomEvent('fly-to-cart', {
                detail: {
                    imageUrl: newItem.imageUrl,
                    startX,
                    startY,
                }
            }));
            showNotification(`Adicionado: ${newItem.name}`);
        } else {
            showNotification(`Adicionado: ${newItem.name}`);
            setIsCartOpen(true);
        }
    };

    const removeFromCart = (cartKey: string) => {
        setItems((prev) => prev.filter((i) => getCartKey(i.id, i.color) !== cartKey));
    };

    const updateQuantity = (cartKey: string, type: 'increase' | 'decrease') => {
        setItems((prev) => prev.map((item) => {
            if (getCartKey(item.id, item.color) === cartKey) {
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
                <div className="fixed top-20 left-1/2 -translate-x-1/2 md:top-auto md:bottom-4 md:right-4 md:left-auto md:translate-x-0 bg-gray-900 text-white px-5 py-2.5 rounded-full shadow-lg text-xs font-semibold z-[300] animate-fade-up whitespace-nowrap">
                    ✓ {notification}
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
