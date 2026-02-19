import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Loader2, Save, Image as ImageIcon } from 'lucide-react';

const AdminSettings = () => {
    const [bannerUrl, setBannerUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings/banner');
                setBannerUrl(res.data.url);
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
            await api.put('/settings/banner', { url: bannerUrl });
            setMessage({ type: 'success', text: 'Banner atualizado com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao atualizar banner.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-8 text-slate-400">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-serif text-slate-900 mb-6 border-b border-slate-100 pb-2">Banner Principal</h3>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL da Imagem</label>
                    <div className="relative">
                        <ImageIcon size={18} className="absolute left-3 top-3.5 text-slate-400" />
                        <input
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-10 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all text-sm"
                            placeholder="https://..."
                            required
                        />
                    </div>
                </div>

                {/* Preview */}
                {bannerUrl && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pré-visualização</label>
                        <div className="aspect-[21/9] w-full bg-slate-100 rounded overflow-hidden border border-slate-200">
                            <img src={bannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                {message && (
                    <div className={`text-sm font-medium p-3 rounded ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded flex items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 text-sm uppercase tracking-wide font-bold"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
