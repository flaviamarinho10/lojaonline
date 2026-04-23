
import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    active: boolean;
}

const Store: React.FC = () => {
    // Dummy data for visualization until backend is connected
    const [products] = useState<Product[]>([
        { id: '1', name: 'Minimalist Chair', description: 'Ergonomic design with premium wood.', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000', active: true },
        { id: '2', name: 'Ceramic Vase', description: 'Handcrafted ceramic vase for modern homes.', price: 45.50, imageUrl: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&q=80&w=1000', active: true },
        { id: '3', name: 'Table Lamp', description: 'Soft lighting for your workspace.', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1507473888900-52e1adad54cd?auto=format&fit=crop&q=80&w=1000', active: true },
        { id: '4', name: 'Leather Notebook', description: 'Premium leather bound notebook.', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000', active: true },
    ]);

    const { addToCart } = useCart();

    useEffect(() => {
        // fetch products from API in real implementation
        // fetch('http://localhost:3001/products')
        //   .then(res => res.json())
        //   .then(data => setProducts(data))
        //   .catch(err => console.error(err));
    }, []);

    return (
        <div className="container mx-auto p-6 md:p-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Curated Collection</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover our hand-picked items for a minimalist lifestyle. Quality, functionality, and aesthetics in every piece.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map(product => (
                    <Card key={product.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
                        <div className="relative aspect-square overflow-hidden bg-gray-100">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Product' }}
                            />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                                <span className="font-semibold text-primary">${product.price.toFixed(2)}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full font-semibold" onClick={(e) => addToCart({
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                imageUrl: product.imageUrl
                            }, 1, e)}>
                                Add to Cart
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Store;
