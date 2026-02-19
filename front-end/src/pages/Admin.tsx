import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import { Package, ShoppingCart, LogOut, Trash2, Plus, Edit, Save, X, Loader2, Image as ImageIcon, Settings } from 'lucide-react';
import AdminOrderList from '../components/AdminOrderList';
import AdminSettings from '../components/AdminSettings';

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
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'settings'>('products');
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
        <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="p-8 border-b border-slate-100">
                    <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                        flavia beauty
                        <span className="block text-[10px] tracking-[0.2em] text-slate-400 uppercase font-sans mt-0.5">Painel</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${activeTab === 'products'
                            ? 'bg-rose-50 text-slate-900 border border-rose-100'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        <Package size={18} />
                        Produtos
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${activeTab === 'orders'
                            ? 'bg-rose-50 text-slate-900 border border-rose-100'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        <ShoppingCart size={18} />
                        Pedidos
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium ${activeTab === 'settings'
                            ? 'bg-rose-50 text-slate-900 border border-rose-100'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                    >
                        <Settings size={18} />
                        Configurações
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 p-8 md:p-12">
                {activeTab === 'products' && (
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="font-serif text-3xl text-slate-900">Gerenciar Produtos</h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form */}
                            <div className="bg-white border border-slate-200 rounded-lg p-6 h-fit shadow-sm">
                                <h2 className="text-lg font-serif text-slate-900 mb-6 flex items-center gap-2">
                                    {isEditing ? <Edit size={18} className="text-pink-400" /> : <Plus size={18} className="text-pink-400" />}
                                    {isEditing ? 'Editar Produto' : 'Novo Produto'}
                                </h2>

                                <form onSubmit={handleCreateOrUpdate} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nome</label>
                                        <input
                                            placeholder="Ex: Velvet Lipstick"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Preço (R$)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={price}
                                            onChange={e => setPrice(e.target.value)}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Imagem URL</label>
                                        <div className="relative">
                                            <ImageIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                                            <input
                                                placeholder="https://..."
                                                value={imageUrl}
                                                onChange={e => setImageUrl(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Descrição</label>
                                        <textarea
                                            placeholder="Detalhes..."
                                            value={desc}
                                            onChange={e => setDesc(e.target.value)}
                                            rows={3}
                                            className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all resize-none text-sm"
                                        />
                                    </div>

                                    <div className="pt-2 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 text-sm uppercase tracking-wide"
                                        >
                                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                            {isEditing ? 'Atualizar' : 'Salvar'}
                                        </button>

                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium py-2.5 rounded transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            {/* List */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <h2 className="font-serif text-slate-900">Catálogo</h2>
                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total: {products.length}</div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-white text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
                                                <tr>
                                                    <th className="px-6 py-4 font-medium">Produto</th>
                                                    <th className="px-6 py-4 font-medium">Preço</th>
                                                    <th className="px-6 py-4 text-right font-medium">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {isLoading ? (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                                                            <div className="flex justify-center items-center gap-2">
                                                                <Loader2 className="animate-spin text-pink-300" /> Processando...
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm">
                                                            Nenhum produto encontrado.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((product) => (
                                                        <tr key={product.id} className="hover:bg-rose-50/30 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="h-12 w-12 bg-slate-100 overflow-hidden flex-shrink-0">
                                                                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-medium text-slate-900 text-sm">{product.name}</div>
                                                                        <div className="text-xs text-slate-500 truncate max-w-[200px] mt-0.5">{product.description}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-serif italic text-slate-600">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleEdit(product)}
                                                                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                                                        title="Editar"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(product.id)}
                                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                            <h2 className="font-serif text-3xl text-slate-900 mb-2">Pedidos</h2>
                            <p className="text-slate-500">Gerenciar vendas e status.</p>
                        </div>
                        <AdminOrderList />
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto py-8">
                        <div className="mb-8">
                            <h2 className="font-serif text-3xl text-slate-900 mb-2">Configurações da Loja</h2>
                            <p className="text-slate-500">Personalize a aparência da sua loja.</p>
                        </div>
                        <AdminSettings />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Admin;
