// Middleware de roles

const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;
            
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    message: 'No tienes permisos para acceder a este recurso' 
                });
            }
            
            next();
            
        } catch (error) {
            console.error('Error en middleware de roles:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor' 
            });
        }
    };
};

export default roleMiddleware;