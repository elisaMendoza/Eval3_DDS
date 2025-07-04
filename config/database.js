// Configuración de la base de datos

import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Verificar conexión
pool.on('connect', () => {
    console.log('✅ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Error en la conexión a la base de datos:', err);
});

export const query = (text, params) => pool.query(text, params);
export { pool };
export default { query, pool };