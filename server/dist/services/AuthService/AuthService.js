"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("../..");
class AuthService {
    static generateToken(payload, jwtSecret) {
        try {
            return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: '1h' });
        }
        catch (error) {
            throw new Error('Error generating token');
        }
    }
    static verifyToken(token, jwtSecret) {
        return jsonwebtoken_1.default.verify(token, jwtSecret);
    }
    static async signIn({ jwtSecret, email, password }) {
        try {
            const user = await __1.prisma.user.findUnique({
                where: { email }
            });
            if (!user)
                return null;
            const isPasswordValid = user.password === password; // await bcrypt.compare(password, user.password)
            if (!isPasswordValid)
                return null;
            const token = this.generateToken({ user_id: user.id, email: user.email }, jwtSecret);
            return token;
        }
        catch (error) {
            return null;
        }
    }
}
exports.AuthService = AuthService;
