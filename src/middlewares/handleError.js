//src/middlewares/handleError.js
import { AppError, ValidationError } from "../utils/error.js"
import logger from "../utils/logger.js";

function cw(controller) {
    return async (req, res, next) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error)
        }
    }
};

// * Middleware de gestion d'erreurs
function errorHandler(err, req, res, next) {
    // Log de l'erreur avec Winston
    logger.error(`Erreur ${err.statusCode || 500}: ${err.message}`, {
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        stack: err.stack
    });

    // * Si c'est une de nos erreurs personnalisées 404 ou 400 (schémas)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
            // * Si l'érreur vient du schéma on ajoute les détails au message 
            ...(err instanceof ValidationError && { details: err.details })
        });
    }
    // * Pour les erreurs non gérées
    res.status(500).json({ 
        error: "Une erreur inattendue est survenue, merci de réessayer plus tard."
        });
}

// * Middleware pour les routes non trouvées
function notFoundHandler(req, res) {
    // Log des routes non trouvées
    logger.warn(`Route non trouvée: ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    res.status(404).json({
        error: "Route non trouvée"
    });
}

export { cw, errorHandler, notFoundHandler}