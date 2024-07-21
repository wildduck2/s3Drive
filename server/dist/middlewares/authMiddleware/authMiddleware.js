"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const services_1 = require("../../services");
const config_1 = require("../../config");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        services_1.AuthService.verifyToken(token, config_1.config.jwtSecret);
        next();
    }
    else {
        res.status(401).send({ error: 'Unauthorized' });
    }
};
exports.authMiddleware = authMiddleware;
