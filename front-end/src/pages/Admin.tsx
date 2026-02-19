import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="flex gap-4 mb-6">
                <button onClick={() => setActiveTab('products')} className={`px-4 py-2 ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Products</button>
                <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 ${activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>Orders</button>
            </div>

            {activeTab === 'products' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
                    {/* Product form and table */}
                </div>
            )}

            {activeTab === 'orders' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Manage Orders</h2>
                    {/* Order list */}
                </div>
            )}
        </div>
    );
};

export default Admin;
