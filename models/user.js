// Modelo de usuario
import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
// Se crea la clase User para manejar la lógica de usuarios
class User {
    // método estático para crear usuarios (puede ser llamado sin instanciar la clase)
    static async create(userData) {
        const { email, password, role = 'user' } = userData;
        const id = uuidv4(); // Generar UUID para el ID
        
        // Hash de la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const query = `
            INSERT INTO users (id, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, email, role, created_at
        `;
        
        const result = await db.query(query, [id, email, hashedPassword, role]);
        return result.rows[0];
    }
    // Método estático para buscar usuarios por correo electrónico
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }
    // Método estático para buscar usuarios por ID
    static async findById(id) {
        const query = 'SELECT id, email, role, created_at FROM users WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
    // Método estático para verfiicación de contraseña
    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
    // Trakea el último inicio de sesión del usuario
    static async updateLastLogin(id) {
        const query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1';
        await db.query(query, [id]);
    }
}

export default User;