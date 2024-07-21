"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
//NOTE: init prisma client
exports.prisma = new client_1.PrismaClient();
//NOTE: init the server
exports.app = (0, express_1.default)();
exports.app.use(body_parser_1.default.json({ limit: '40mb' }));
exports.app.use(body_parser_1.default.urlencoded({ limit: '40mb', extended: false }));
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
exports.app.use(routes_1.blobRoutes);
exports.app.use(routes_1.authRouter);
exports.app.listen(config_1.config.port, () => console.log(`server is running on port: ${config_1.config.port}`));
