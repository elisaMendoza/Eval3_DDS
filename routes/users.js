// Rutas de usuarios
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/auth.js';
import roleMiddleware from '../middleware/roles.js';

// Configurar __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Rutas protegidas para usuarios autenticados
router.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'dashboard.html'));
});

// Rutas protegidas solo para administradores
router.get('/admin', 
    authMiddleware, 
    roleMiddleware(['admin']), 
    (req, res) => {
        res.sendFile(path.join(__dirname, '../views', 'admin.html'));
    }
);

export default router;