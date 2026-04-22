import { Router } from 'express';
import multer from 'multer';
import { supabase, STORAGE_BUCKET } from '../lib/supabase';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Somente imagens são permitidas!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post('/', (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro no processamento do arquivo', details: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
        }

        const ext = req.file.originalname.split('.').pop();
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return res.status(500).json({ error: 'Erro ao enviar imagem para o storage', details: uploadError.message });
        }

        const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

        res.json({ url: data.publicUrl });
    });
});

export default router;
