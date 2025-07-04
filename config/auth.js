// Configuración de Jason  Web Token (JWT) para autenticación
// y otras configuraciones de seguridad relacionadas.
import dotenv from 'dotenv';

dotenv.config();

export default {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '24h',
    
    // Configuraciones adicionales de seguridad
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutTime: 15 * 60 * 1000, // 15 minutos
};