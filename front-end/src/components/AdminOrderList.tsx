import React, { useEffect, useState } from 'react';

import api from '../lib/axios';
import { Loader2, Package, Calendar, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Product {
    name: string;
    imageUrl: string;
}

interface OrderItem {
    id: string;
    quantity: number;
    price: string;
    product: Product;
}

interface Order {
    id: string;
    customerEmail: string;
    total: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    createdAt: string;
    items: OrderItem[];
}

const AdminOrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.put(`/orders/${orderId}`, { status: newStatus });
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status do pedido.');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
            COMPLETED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            CANCELED: 'bg-red-500/10 text-red-500 border-red-500/20'
        };
        const icons = {
            PENDING: <Clock size={14} />,
            COMPLETED: <CheckCircle size={14} />,
            CANCELED: <XCircle size={14} />
        };

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status as keyof typeof styles]}`}>
                {icons[status as keyof typeof icons]}
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-emerald-500">
                <Loader2 size={40} className="animate-spin" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-500">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhum pedido encontrado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div
                        className="p-6 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-zinc-500">#{order.id.slice(0, 8)}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className="flex items-center gap-2 text-zinc-300">
                                    <Mail size={16} className="text-zinc-500" />
                                    <span>{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-500">
                                    <Calendar size={14} />
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xl font-bold text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                                </span>
                                <div className="text-sm text-zinc-500">
                                    {order.items.length} itens
                                </div>
                            </div>
                        </div>
                    </div>

                    {expandedOrder === order.id && (
                        <div className="border-t border-zinc-800 bg-zinc-950/50 p-6 animate-in slide-in-from-top-2">
                            <h4 className="text-sm font-bold text-zinc-400 uppercase mb-4">Itens do Pedido</h4>
                            <div className="space-y-3 mb-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                        <img src={item.product?.imageUrl} alt={item.product?.name} className="h-12 w-12 rounded object-cover bg-zinc-800" />
                                        <div className="flex-1">
                                            <div className="font-bold text-white text-sm">{item.product?.name || 'Produto Removido'}</div>
                                            <div className="text-xs text-zinc-500">Qtd: {item.quantity} x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price))}</div>
                                        </div>
                                        <div className="font-bold text-emerald-400 text-sm">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                                <h4 className="text-sm font-bold text-zinc-400 uppercase self-center mr-2">Atualizar Status:</h4>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'PENDING'); }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${order.status === 'PENDING' ? 'bg-yellow-500 text-black border-yellow-500' : 'text-zinc-400 border-zinc-700 hover:border-yellow-500 hover:text-yellow-500'}`}
                                >
                                    Pendente
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'COMPLETED'); }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${order.status === 'COMPLETED' ? 'bg-emerald-500 text-black border-emerald-500' : 'text-zinc-400 border-zinc-700 hover:border-emerald-500 hover:text-emerald-500'}`}
                                >
                                    Concluído
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'CANCELED'); }}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${order.status === 'CANCELED' ? 'bg-red-500 text-black border-red-500' : 'text-zinc-400 border-zinc-700 hover:border-red-500 hover:text-red-500'}`}
                                >
                                    Cancelado
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdminOrderList;
