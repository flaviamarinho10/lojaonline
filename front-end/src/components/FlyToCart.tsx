import { useEffect, useState } from 'react';

interface FlyingItem {
    id: string;
    imageUrl: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export default function FlyToCart() {
    const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);

    useEffect(() => {
        const handleFlyToCart = (e: CustomEvent) => {
            const { imageUrl, startX, startY } = e.detail;

            // Find the cart icon target
            const cartIcon = document.getElementById('cart-icon-target');
            if (!cartIcon) return;

            const cartRect = cartIcon.getBoundingClientRect();
            const endX = cartRect.left + cartRect.width / 2;
            const endY = cartRect.top + cartRect.height / 2;

            const itemId = `fly-${Date.now()}-${Math.random()}`;

            setFlyingItems(prev => [...prev, {
                id: itemId,
                imageUrl,
                startX,
                startY,
                endX,
                endY,
            }]);

            // Remove after animation ends
            setTimeout(() => {
                setFlyingItems(prev => prev.filter(item => item.id !== itemId));

                // Trigger cart icon bounce
                if (cartIcon) {
                    cartIcon.classList.add('cart-bounce');
                    setTimeout(() => cartIcon.classList.remove('cart-bounce'), 500);
                }
            }, 650);
        };

        window.addEventListener('fly-to-cart', handleFlyToCart as EventListener);
        return () => window.removeEventListener('fly-to-cart', handleFlyToCart as EventListener);
    }, []);

    if (flyingItems.length === 0) return null;

    return (
        <>
            {flyingItems.map(item => {
                const deltaX = item.endX - item.startX;
                const deltaY = item.endY - item.startY;

                return (
                    <div
                        key={item.id}
                        className="fixed pointer-events-none z-[9999]"
                        style={{
                            left: item.startX,
                            top: item.startY,
                            transform: 'translate(-50%, -50%)',
                            animation: 'flyToCart 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                            ['--fly-dx' as string]: `${deltaX}px`,
                            ['--fly-dy' as string]: `${deltaY}px`,
                        }}
                    >
                        <div className="w-14 h-14 rounded-full overflow-hidden shadow-xl border-2 border-white bg-white"
                            style={{ animation: 'flyScale 0.65s ease-in forwards' }}
                        >
                            <img
                                src={(() => {
                                    const url = item.imageUrl;
                                    const driveMatch = url?.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
                                    if (driveMatch && driveMatch[1]) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
                                    return url || '';
                                })()}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
}
