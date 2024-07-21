"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const services_1 = require("../../services");
const config_1 = require("../../config");
class AuthController {
    jwtSecret;
    constructor(jwtSecret) {
        this.jwtSecret = jwtSecret;
    }
    static async signIn(req, res) {
        const { email, password } = req.body;
        try {
            const token = await services_1.AuthService.signIn({
                jwtSecret: config_1.config.jwtSecret,
                password,
                email
            });
            if (!token)
                return res.status(401).json({ message: 'Invalid email or password' });
            return res.status(200).json({ token });
        }
        catch (error) {
            console.error('Error signing in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
exports.AuthController = AuthController;
