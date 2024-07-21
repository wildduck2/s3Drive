"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post('/auth/singin', (req, res) => {
    controllers_1.AuthController.signIn(req, res);
});
