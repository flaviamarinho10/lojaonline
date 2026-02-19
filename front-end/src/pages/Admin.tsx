import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

import api from '../lib/axios';
import { Package, ShoppingCart, LogOut, Trash2, Plus, Edit, Save, X, Loader2, Image as ImageIcon } from 'lucide-react';
import AdminOrderList from '../components/AdminOrderList';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    active: boolean;
}

const Admin: React.FC = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
    const [products, setProducts] = useState<Product[]>([]);

    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        }
    }, [activeTab]);

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                name,
                description: desc,
                price: parseFloat(price),
                imageUrl: imageUrl || 'https://placehold.co/400',
                active: true
            };

            if (isEditing) {
                await api.put(`/products/${isEditing}`, payload);
            } else {
                await api.post('/products', payload);
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product', error);
            alert('Erro ao salvar produto.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (p: Product) => {
        setName(p.name);
        setPrice(p.price.toString());
        setDesc(p.description);
        setImageUrl(p.imageUrl);
        setIsEditing(p.id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product', error);
            alert('Erro ao excluir produto.');
        }
    };

    const resetForm = () => {
        setName('');
        setPrice('');
        setDesc('');
        setImageUrl('');
        setIsEditing(null);
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-2">
                    <div className="h-8 w-8 bg-emerald-500 rounded flex items-center justify-center text-black font-bold text-xl">
                        S
                    </div>
                    <span className="text-xl font-bold text-white tracking-tighter">
                        Admin<span className="text-emerald-500">Panel</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'products'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <Package size={20} />
                        <span className="font-medium">Produtos</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'orders'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            }`}
                    >
                        <ShoppingCart size={20} />
                        <span className="font-medium">Pedidos</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-zinc-950 p-8">
                {activeTab === 'products' && (
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-white">Gerenciar Produtos</h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit shadow-lg shadow-black/20">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    {isEditing ? <Edit size={20} className="text-emerald-500" /> : <Plus size={20} className="text-emerald-500" />}
                                    {isEditing ? 'Editar Produto' : 'Novo Produto'}
                                </h2>

                                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Nome do Produto</label>
                                        <input
                                            placeholder="Ex: Whey Protein Isolado"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Preço (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            required
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">URL da Imagem</label>
                                        <div className="relative">
                                            <ImageIcon size={18} className="absolute left-3 top-3.5 text-zinc-600" />
                                            <input
                                                placeholder="https://..."
                                                value={imageUrl}
                                                onChange={e => setImageUrl(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400">Descrição</label>
                                        <textarea
                                            placeholder="Detalhes do produto..."
                                            value={desc}
                                            onChange={e => setDesc(e.target.value)}
                                            rows={3}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none"
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
                                        >
                                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            {isEditing ? 'Atualizar' : 'Salvar'}
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-all"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg shadow-black/20">
                                    <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-white">Catálogo</h2>
                                        <div className="text-sm text-zinc-400">Total: {products.length} produtos</div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-zinc-950/50 text-zinc-400 uppercase text-xs font-bold">
                                                <tr>
                                                    <th className="px-6 py-4">Produto</th>
                                                    <th className="px-6 py-4">Preço</th>
                                                    <th className="px-6 py-4 text-right">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-800">
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                                                            <div className="flex justify-center items-center gap-2">
                                                                <Loader2 className="animate-spin text-emerald-500" /> Carregando...
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center text-zinc-500">
                                                            Nenhum produto cadastrado.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((product) => (
                                                        <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-10 w-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                                                                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-white">{product.name}</div>
                                                                        <div className="text-xs text-zinc-500 truncate max-w-[200px]">{product.description}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-mono text-emerald-400">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleEdit(product)}
                                                                        className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(product.id)}
                                                                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                        title="Excluir"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="max-w-4xl mx-auto py-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Gestão de Pedidos</h2>
                            <p className="text-zinc-400">Acompanhe e atualize o status dos pedidos.</p>
                        </div>
                        <AdminOrderList />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
