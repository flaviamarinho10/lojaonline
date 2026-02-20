import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/axios';
import {
    Package, ShoppingCart, LogOut, Trash2, Plus, Edit, Save, X, Loader2,
    Image as ImageIcon, Settings, LayoutGrid, Menu as MenuIcon,
    ChevronRight
} from 'lucide-react';
import AdminOrderList from '../components/AdminOrderList';
import AdminSettings from '../components/AdminSettings';

interface ProductColor {
    name: string;
    hex: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    imageUrl: string;
    active: boolean;
    colors: ProductColor[];
    badges: string[];
}

interface Category {
    id: string;
    name: string;
    imageUrl: string;
    bgColor: string;
}

const BG_COLOR_OPTIONS = [
    { value: 'bg-green-100', label: 'Verde', preview: '#dcfce7' },
    { value: 'bg-pink-100', label: 'Rosa', preview: '#fce7f3' },
    { value: 'bg-amber-100', label: 'Amarelo', preview: '#fef3c7' },
    { value: 'bg-blue-100', label: 'Azul', preview: '#dbeafe' },
    { value: 'bg-purple-100', label: 'Lilás', preview: '#f3e8ff' },
    { value: 'bg-teal-100', label: 'Menta', preview: '#ccfbf1' },
    { value: 'bg-rose-200', label: 'Rosé', preview: '#fecdd3' },
];

type TabType = 'products' | 'categories' | 'orders' | 'settings';

const Admin: React.FC = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('products');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Products state
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [comparePrice, setComparePrice] = useState('');
    const [desc, setDesc] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [productColors, setProductColors] = useState<ProductColor[]>([]);
    const [badges, setBadges] = useState<string[]>([]);
    const [isActive, setIsActive] = useState(true);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Categories state (API-driven)
    const [categories, setCategories] = useState<Category[]>([]);
    const [catName, setCatName] = useState('');
    const [catImageUrl, setCatImageUrl] = useState('');
    const [catBgColor, setCatBgColor] = useState('bg-green-100');
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [isCatLoading, setIsCatLoading] = useState(false);
    const [isCatSaving, setIsCatSaving] = useState(false);

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

    const fetchCategories = async () => {
        setIsCatLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsCatLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'products') {
            fetchProducts();
        }
        if (activeTab === 'categories') {
            fetchCategories();
        }
    }, [activeTab]);

    // ── Product handlers ──
    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                name,
                description: desc,
                price: parseFloat(price),
                comparePrice: comparePrice ? parseFloat(comparePrice) : null,
                imageUrl: imageUrl || 'https://placehold.co/400',
                active: isActive,
                colors: productColors,
                badges: badges
            };

            if (isEditing) {
                await api.put(`/products/${isEditing}`, payload);
            } else {
                await api.post('/products', payload);
            }

            resetProductForm();
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
        setComparePrice(p.comparePrice ? p.comparePrice.toString() : '');
        setDesc(p.description);
        setImageUrl(p.imageUrl);
        setIsActive(p.active);
        setProductColors(Array.isArray(p.colors) ? p.colors : []);
        setBadges(Array.isArray(p.badges) ? p.badges : []);
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

    const resetProductForm = () => {
        setName('');
        setPrice('');
        setComparePrice('');
        setDesc('');
        setImageUrl('');
        setIsActive(true);
        setProductColors([]);
        setBadges([]);
        setIsEditing(null);
    };

    // ── Category handlers (API) ──
    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catName.trim()) return;
        setIsCatSaving(true);

        try {
            const payload = { name: catName, imageUrl: catImageUrl, bgColor: catBgColor };

            if (editingCatId) {
                await api.put(`/categories/${editingCatId}`, payload);
            } else {
                await api.post('/categories', payload);
            }

            resetCatForm();
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Erro ao salvar categoria.');
        } finally {
            setIsCatSaving(false);
        }
    };

    const handleEditCategory = (cat: Category) => {
        setCatName(cat.name);
        setCatImageUrl(cat.imageUrl);
        setCatBgColor(cat.bgColor);
        setEditingCatId(cat.id);
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Excluir esta categoria?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Erro ao excluir categoria.');
        }
    };

    const resetCatForm = () => {
        setCatName('');
        setCatImageUrl('');
        setCatBgColor('bg-green-100');
        setEditingCatId(null);
    };

    const getBgPreview = (value: string) => BG_COLOR_OPTIONS.find(o => o.value === value)?.preview || '#f3f4f6';

    const navItems: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: 'products', label: 'Produtos', icon: <Package size={18} /> },
        { key: 'categories', label: 'Categorias', icon: <LayoutGrid size={18} /> },
        { key: 'orders', label: 'Pedidos', icon: <ShoppingCart size={18} /> },
        { key: 'settings', label: 'Configurações', icon: <Settings size={18} /> },
    ];

    return (
        <div className="flex h-screen bg-[#f9f9f9] text-gray-900 font-sans">

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                        Flavia <span className="font-light">Beauty</span>
                    </h1>
                    <p className="text-[11px] text-gray-400 mt-0.5">Painel Administrativo</p>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Menu do painel">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${activeTab === item.key
                                ? 'bg-[#e8f7f6] text-[#66c2bb] border border-[#66c2bb]/20'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                            {activeTab === item.key && (
                                <ChevronRight size={14} className="ml-auto" />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar (mobile) */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                        aria-label="Abrir menu"
                    >
                        <MenuIcon size={22} />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">
                        Flavia <span className="font-light">Beauty</span>
                    </h1>
                    <div className="w-10" />
                </div>

                <div className="p-6 md:p-10">
                    {/* ═══════════ PRODUCTS TAB ═══════════ */}
                    {activeTab === 'products' && (
                        <div className="max-w-6xl mx-auto space-y-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gerenciar Produtos</h1>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Form */}
                                <div className="bg-white border border-gray-100 rounded-xl p-6 h-fit shadow-sm">
                                    <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                                        {isEditing ? <Edit size={18} className="text-[#66c2bb]" /> : <Plus size={18} className="text-[#66c2bb]" />}
                                        {isEditing ? 'Editar Produto' : 'Novo Produto'}
                                    </h2>

                                    <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nome</label>
                                            <input
                                                placeholder="Ex: Batom Matte"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                required
                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preço (R$)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={price}
                                                    onChange={e => setPrice(e.target.value)}
                                                    required
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preço Promocional (Opcional)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={comparePrice}
                                                    onChange={e => setComparePrice(e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Imagem URL</label>
                                            <div className="relative">
                                                <ImageIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    placeholder="https://..."
                                                    value={imageUrl}
                                                    onChange={e => setImageUrl(e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descrição</label>
                                            <textarea
                                                placeholder="Detalhes do produto..."
                                                value={desc}
                                                onChange={e => setDesc(e.target.value)}
                                                rows={3}
                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all resize-none text-sm"
                                            />
                                        </div>

                                        {/* Cores/Variações */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cores / Variações</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setProductColors([...productColors, { name: '', hex: '#d4a89a' }])}
                                                    className="flex items-center gap-1 text-[11px] font-semibold text-[#66c2bb] hover:text-[#55b0a9] transition-colors"
                                                >
                                                    <Plus size={14} />
                                                    Adicionar Cor
                                                </button>
                                            </div>

                                            {productColors.length > 0 && (
                                                <div className="space-y-2">
                                                    {productColors.map((color, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                                                            <input
                                                                type="color"
                                                                value={color.hex}
                                                                onChange={(e) => {
                                                                    const updated = [...productColors];
                                                                    updated[idx] = { ...updated[idx], hex: e.target.value };
                                                                    setProductColors(updated);
                                                                }}
                                                                className="w-8 h-8 rounded-md border border-gray-200 cursor-pointer flex-shrink-0"
                                                                style={{ padding: 0 }}
                                                            />
                                                            <input
                                                                placeholder="Nome da cor (ex: Bege Claro)"
                                                                value={color.name}
                                                                onChange={(e) => {
                                                                    const updated = [...productColors];
                                                                    updated[idx] = { ...updated[idx], name: e.target.value };
                                                                    setProductColors(updated);
                                                                }}
                                                                className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none"
                                                            />
                                                            <span className="text-[10px] text-gray-400 font-mono w-16 text-center">{color.hex}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setProductColors(productColors.filter((_, i) => i !== idx))}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Badges e Status */}
                                        <div className="space-y-4 pt-2 border-t border-gray-100">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block">Tags / Badges</label>
                                                <div className="flex flex-wrap gap-3">
                                                    {['Frete Grátis', 'Parceria Oficial', 'Lançamento', 'Esgotado'].map(tag => (
                                                        <label key={tag} className="inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={badges.includes(tag)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) setBadges([...badges, tag]);
                                                                    else setBadges(badges.filter(b => b !== tag));
                                                                }}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 text-gray-600 peer-checked:bg-[#66c2bb] peer-checked:text-white peer-checked:border-[#66c2bb] transition-all select-none">
                                                                {tag}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                                <span className="text-sm font-medium text-gray-700">Visibilidade do Produto</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isActive}
                                                        onChange={(e) => setIsActive(e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#66c2bb]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#66c2bb]"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-700">{isActive ? 'Ativo' : 'Rascunho'}</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-2 flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex-1 bg-[#66c2bb] hover:bg-[#55b0a9] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 text-sm"
                                            >
                                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                {isEditing ? 'Atualizar' : 'Salvar'}
                                            </button>

                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    onClick={resetProductForm}
                                                    className="px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2.5 rounded-lg transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Product Table */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                            <h2 className="font-semibold text-gray-900">Catálogo</h2>
                                            <span className="text-xs text-gray-400 font-medium">Total: {products.length}</span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-3.5 font-medium">Produto</th>
                                                        <th className="px-6 py-3.5 font-medium">Preço</th>
                                                        <th className="px-6 py-3.5 text-right font-medium">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {isLoading ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                                                <div className="flex justify-center items-center gap-2">
                                                                    <Loader2 className="animate-spin text-[#66c2bb]" /> Carregando...
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : products.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                                Nenhum produto encontrado.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        products.map((product) => (
                                                            <tr key={product.id} className="hover:bg-[#e8f7f6]/30 transition-colors group">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                                                            <div className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{product.description}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-gray-600 font-medium text-sm">
                                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                                                </td>
                                                                <td className="px-6 py-4 text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => handleEdit(product)}
                                                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                            title="Editar"
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(product.id)}
                                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

                    {/* ═══════════ CATEGORIES TAB ═══════════ */}
                    {activeTab === 'categories' && (
                        <div className="max-w-6xl mx-auto space-y-8">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gerenciar Categorias</h1>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Add/Edit Category Form */}
                                <div className="bg-white border border-gray-100 rounded-xl p-6 h-fit shadow-sm">
                                    <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                                        {editingCatId ? <Edit size={18} className="text-[#66c2bb]" /> : <Plus size={18} className="text-[#66c2bb]" />}
                                        {editingCatId ? 'Editar Categoria' : 'Nova Categoria'}
                                    </h2>

                                    <form onSubmit={handleSaveCategory} className="space-y-4">
                                        {/* Name */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nome</label>
                                            <input
                                                placeholder="Ex: Pele, Olhos, Lábios..."
                                                value={catName}
                                                onChange={e => setCatName(e.target.value)}
                                                required
                                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                            />
                                        </div>

                                        {/* Image URL */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL da Imagem</label>
                                            <div className="relative">
                                                <ImageIcon size={16} className="absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    placeholder="https://..."
                                                    value={catImageUrl}
                                                    onChange={e => setCatImageUrl(e.target.value)}
                                                    className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Background Color */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cor de Fundo</label>
                                            <div className="flex flex-wrap gap-2">
                                                {BG_COLOR_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => setCatBgColor(opt.value)}
                                                        className={`w-9 h-9 rounded-full border-2 transition-all ${catBgColor === opt.value
                                                            ? 'border-[#66c2bb] scale-110 shadow-md'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                        style={{ backgroundColor: opt.preview }}
                                                        title={opt.label}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Preview */}
                                        <div className="space-y-2 pt-2">
                                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preview</label>
                                            <div className="flex flex-col items-center gap-2 py-4 bg-[#f9f9f9] rounded-lg">
                                                <div
                                                    className="w-[120px] h-[120px] rounded-full overflow-hidden border-2 border-white shadow-md"
                                                    style={{ backgroundColor: getBgPreview(catBgColor) }}
                                                >
                                                    {catImageUrl ? (
                                                        <img
                                                            src={catImageUrl}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <div className="w-3/4 h-3/4 rounded-full bg-white/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {catName || 'Nome'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-2 flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={isCatSaving}
                                                className="flex-1 bg-[#66c2bb] hover:bg-[#55b0a9] text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                            >
                                                {isCatSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                                {editingCatId ? 'Atualizar' : 'Adicionar Categoria'}
                                            </button>

                                            {editingCatId && (
                                                <button
                                                    type="button"
                                                    onClick={resetCatForm}
                                                    className="px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium py-2.5 rounded-lg transition-all"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Categories Table */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                            <h2 className="font-semibold text-gray-900">Categorias Cadastradas</h2>
                                            <span className="text-xs text-gray-400 font-medium">Total: {categories.length}</span>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold tracking-wider border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-6 py-3.5 font-medium">Imagem</th>
                                                        <th className="px-6 py-3.5 font-medium">Nome</th>
                                                        <th className="px-6 py-3.5 text-right font-medium">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {isCatLoading ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                                                                <div className="flex justify-center items-center gap-2">
                                                                    <Loader2 className="animate-spin text-[#66c2bb]" /> Carregando...
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : categories.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">
                                                                Nenhuma categoria cadastrada.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        categories.map((cat) => (
                                                            <tr key={cat.id} className="hover:bg-[#e8f7f6]/30 transition-colors group">
                                                                <td className="px-6 py-3">
                                                                    <div
                                                                        className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border border-gray-100"
                                                                        style={{ backgroundColor: getBgPreview(cat.bgColor) }}
                                                                    >
                                                                        {cat.imageUrl ? (
                                                                            <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center">
                                                                                <div className="w-3/4 h-3/4 rounded-full bg-white/30" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    <span className="font-medium text-gray-900 text-sm">{cat.name}</span>
                                                                </td>
                                                                <td className="px-6 py-3 text-right">
                                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => handleEditCategory(cat)}
                                                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                                            title="Editar"
                                                                        >
                                                                            <Edit size={16} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeleteCategory(cat.id)}
                                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

                    {/* ═══════════ ORDERS TAB ═══════════ */}
                    {activeTab === 'orders' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Pedidos</h1>
                                <p className="text-gray-400 text-sm">Gerenciar vendas e status.</p>
                            </div>
                            <AdminOrderList />
                        </div>
                    )}

                    {/* ═══════════ SETTINGS TAB ═══════════ */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Configurações da Loja</h1>
                                <p className="text-gray-400 text-sm">Personalize a aparência da sua loja.</p>
                            </div>
                            <AdminSettings />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
