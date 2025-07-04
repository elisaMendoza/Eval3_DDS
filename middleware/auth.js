// Middleware de autenticación

import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js';

const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                message: 'Token de acceso requerido' 
            });
        }
        
        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Formato de token inválido' 
            });
        }
        
        // Verificar token
        const decoded = jwt.verify(token, authConfig.jwtSecret);
        req.user = decoded;
        
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expirado' 
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Token inválido' 
            });
        }
        
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor' 
        });
    }
};

export default authMiddleware;