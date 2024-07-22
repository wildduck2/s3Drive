"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
//NOTE: init the server
exports.app = (0, express_1.default)();
exports.app.use(body_parser_1.default.json({ limit: '40mb' }));
exports.app.use(body_parser_1.default.urlencoded({ limit: '40mb', extended: false }));
exports.app.use((0, cors_1.default)({
    origin: config_1.config.corsOrigin || 'https://upload-thing-theta.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    optionsSuccessStatus: 204
}));
console.log(config_1.config.corsOrigin);
exports.app.use(routes_1.blobRoutes);
exports.app.use(routes_1.authRouter);
exports.app.listen(config_1.config.port, () => console.log(`server is running on port: ${config_1.config.port}`));
exports.default = exports.app;
