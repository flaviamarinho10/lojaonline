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
            PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            CANCELED: 'bg-red-50 text-red-700 border-red-200'
        };
        const icons = {
            PENDING: <Clock size={14} />,
            COMPLETED: <CheckCircle size={14} />,
            CANCELED: <XCircle size={14} />
        };

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status as keyof typeof styles]}`}>
                {icons[status as keyof typeof icons]}
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-slate-400">
                <Loader2 size={32} className="animate-spin" />
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 text-slate-400">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p className="font-serif italic">Nenhum pedido encontrado.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div
                        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-slate-400">#{order.id.slice(0, 8)}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Mail size={16} className="text-slate-400" />
                                    <span>{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={14} />
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR')}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <span className="text-lg font-serif font-bold text-slate-900">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(order.total))}
                                </span>
                                <div className="text-xs text-slate-500 uppercase tracking-wide">
                                    {order.items.length} itens
                                </div>
                            </div>
                        </div>
                    </div>

                    {expandedOrder === order.id && (
                        <div className="border-t border-slate-100 bg-slate-50/50 p-6 animate-in slide-in-from-top-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Itens do Pedido</h4>
                            <div className="space-y-3 mb-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 bg-white p-3 rounded border border-slate-200 shadow-sm">
                                        <div className="h-12 w-12 bg-slate-100 rounded overflow-hidden">
                                            <img src={item.product?.imageUrl} alt={item.product?.name} className="h-full w-full object-cover mix-blend-multiply" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900 text-sm">{item.product?.name || 'Produto Removido'}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Qtd: {item.quantity} x {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price))}</div>
                                        </div>
                                        <div className="font-serif text-slate-900 text-sm font-medium">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <h4 className="text-xs font-bold text-slate-400 uppercase self-center mr-2 tracking-widest">Atualizar Status:</h4>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'PENDING'); }}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors uppercase tracking-wider ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'text-slate-500 border-slate-200 hover:border-yellow-300 hover:text-yellow-600'}`}
                                >
                                    Pendente
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'COMPLETED'); }}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors uppercase tracking-wider ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'}`}
                                >
                                    Concluído
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'CANCELED'); }}
                                    className={`px-3 py-1.5 rounded text-[10px] font-bold border transition-colors uppercase tracking-wider ${order.status === 'CANCELED' ? 'bg-red-100 text-red-800 border-red-300' : 'text-slate-500 border-slate-200 hover:border-red-300 hover:text-red-600'}`}
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
