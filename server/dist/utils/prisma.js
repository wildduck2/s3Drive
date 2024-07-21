"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("../../prisma/generated/client");
let prisma;
if (process.env.NODE_ENV === 'production') {
    exports.prisma = prisma = new client_1.PrismaClient();
}
else {
    // @ts-expect-error prisma
    if (!global.prisma) {
        // @ts-expect-error prisma
        global.prisma = new client_1.PrismaClient();
    }
    // @ts-expect-error prisma
    exports.prisma = prisma = global.prisma;
}
