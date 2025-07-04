// Lógica de autenticación
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import authConfig from '../config/auth.js';

const authController = {
    // Registro de usuario
    async register(req, res) {
        try {
            const { email, password, confirmPassword } = req.body;
            
            // Validaciones
            if (!email || !password || !confirmPassword) {
                return res.status(400).json({ 
                    message: 'Todos los campos son obligatorios' 
                });
            }
            
            if (password !== confirmPassword) {
                return res.status(400).json({ 
                    message: 'Las contraseñas no coinciden' 
                });
            }
            
            if (password.length < 8) {
                return res.status(400).json({ 
                    message: 'La contraseña debe tener al menos 8 caracteres' 
                });
            }
            
            // Verificar si el usuario ya existe
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ 
                    message: 'El usuario ya existe' 
                });
            }
            
            // Crear nuevo usuario
            const newUser = await User.create({ email, password });
            
            // Generar JWT
            const token = jwt.sign(
                { 
                    userId: newUser.id, 
                    email: newUser.email, 
                    role: newUser.role 
                },
                authConfig.jwtSecret,
                { expiresIn: authConfig.jwtExpire }
            );
            
            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role
                }
            });
            
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor' 
            });
        }
    },
    
    // Inicio de sesión
    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            // Validaciones
            if (!email || !password) {
                return res.status(400).json({ 
                    message: 'Email y contraseña son obligatorios' 
                });
            }
            
            // Buscar usuario
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ 
                    message: 'Credenciales inválidas' 
                });
            }
            
            // Validar contraseña
            const isValidPassword = await User.validatePassword(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ 
                    message: 'Credenciales inválidas' 
                });
            }
            
            // Actualizar último login
            await User.updateLastLogin(user.id);
            
            // Generar JWT
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                authConfig.jwtSecret,
                { expiresIn: authConfig.jwtExpire }
            );
            
            res.json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });
            
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor' 
            });
        }
    }
};

export default authController;