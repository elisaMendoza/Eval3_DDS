// Rutas de autenticación

import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/verify', authMiddleware, (req, res) => {
    res.json({
        message: 'Token válido',
        user: {
            id: req.user.userId,
            email: req.user.email,
            role: req.user.role
        }
    });
});

export default router;