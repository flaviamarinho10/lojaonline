import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Loader2, Save, Image as ImageIcon, LayoutTemplate, Megaphone } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        topBar: {
            active: true,
            message: '',
            bgColor: '#66c2bb'
        },
        hero: {
            desktopImage: '',
            mobileImage: '',
            title: '',
            subtitle: '',
            buttonText: '',
            buttonLink: ''
        },
        storePhoto: {
            active: true,
            url: '',
            size: 96
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/appearance');
                setSettings(prev => ({
                    ...prev,
                    ...(res.data || {}),
                    topBar: { ...prev.topBar, ...(res.data?.topBar || {}) },
                    hero: { ...prev.hero, ...(res.data?.hero || {}) },
                    storePhoto: { ...prev.storePhoto, ...(res.data?.storePhoto || {}) }
                }));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await api.put('/settings/appearance', settings);
            setMessage({ type: 'success', text: 'Aparência da loja atualizada com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar aparência.' });
        } finally {
            setIsSaving(false);
        }
    };

    const updateTopBar = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, topBar: { ...prev.topBar, [field]: value } }));
    };

    const updateHero = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
    };

    const updateStorePhoto = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, storePhoto: { ...prev.storePhoto, [field]: value } }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 text-gray-400">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <LayoutTemplate className="text-[#66c2bb]" /> Personalizar Loja
            </h2>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Barra de Anúncios */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Megaphone size={20} className="text-gray-400" /> Barra de Anúncios
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.topBar.active}
                                onChange={(e) => updateTopBar('active', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#66c2bb]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#66c2bb]"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">Ativa</span>
                        </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mensagem</label>
                            <input
                                value={settings.topBar.message}
                                onChange={(e) => updateTopBar('message', e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                placeholder="Ex: Frete Grátis para todo o Brasil"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cor de Fundo</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.topBar.bgColor}
                                    onChange={(e) => updateTopBar('bgColor', e.target.value)}
                                    className="h-10 w-20 rounded cursor-pointer border border-gray-200"
                                />
                                <span className="text-sm text-gray-500 font-mono">{settings.topBar.bgColor}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner Principal */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                        <ImageIcon size={20} className="text-gray-400" /> Banner Principal (Hero)
                    </h3>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Imagem Desktop (URL)</label>
                                <input
                                    value={settings.hero.desktopImage}
                                    onChange={(e) => updateHero('desktopImage', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Imagem Mobile (URL - Opcional)</label>
                                <input
                                    value={settings.hero.mobileImage}
                                    onChange={(e) => updateHero('mobileImage', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Título Principal</label>
                                <input
                                    value={settings.hero.title}
                                    onChange={(e) => updateHero('title', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subtítulo</label>
                                <input
                                    value={settings.hero.subtitle}
                                    onChange={(e) => updateHero('subtitle', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Texto do Botão</label>
                                <input
                                    value={settings.hero.buttonText}
                                    onChange={(e) => updateHero('buttonText', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Link do Botão</label>
                                <input
                                    value={settings.hero.buttonLink}
                                    onChange={(e) => updateHero('buttonLink', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-sm"
                                    placeholder="/colecao-x"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Foto da Loja */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <ImageIcon size={20} className="text-gray-400" /> Foto da Loja (Home)
                        </h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.storePhoto?.active ?? true}
                                onChange={(e) => updateStorePhoto('active', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#66c2bb]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#66c2bb]"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">Visível</span>
                        </label>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Imagem da Logo</label>
                            
                            <div className="flex gap-2">
                                <label className="flex-1 bg-white border border-gray-200 border-dashed hover:bg-gray-50 hover:border-[#66c2bb] transition-all rounded-lg text-sm text-gray-500 font-medium cursor-pointer flex items-center justify-center gap-2 group p-2">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    if (typeof reader.result === 'string') {
                                                        updateStorePhoto('url', reader.result);
                                                    }
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <span className="group-hover:text-[#66c2bb] transition-colors">Fazer Upload</span>
                                </label>
                                {settings.storePhoto?.url && (
                                    <button 
                                        type="button"
                                        onClick={() => updateStorePhoto('url', '')}
                                        className="bg-red-50 text-red-500 hover:bg-red-100 rounded-lg px-3 text-sm font-medium transition-colors"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>

                            <input
                                value={settings.storePhoto?.url || ''}
                                onChange={(e) => updateStorePhoto('url', e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-[#66c2bb]/30 focus:border-[#66c2bb] outline-none transition-all text-xs"
                                placeholder="Ou cole a URL da imagem aqui..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex justify-between">
                                <span>Tamanho (px)</span>
                                <span className="text-[#66c2bb] font-bold">{settings.storePhoto?.size || 96}px</span>
                            </label>
                            <input
                                type="range"
                                min="48"
                                max="256"
                                step="8"
                                value={settings.storePhoto?.size || 96}
                                onChange={(e) => updateStorePhoto('size', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#66c2bb]"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                                <span>Pequeno</span>
                                <span>Grande</span>
                            </div>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`text-sm font-medium p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-[#66c2bb] hover:bg-[#55b0a9] text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 text-sm uppercase tracking-wide shadow-md hover:shadow-lg"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
