"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const ActionLog_1 = require("../ActionLog"); // Adjust the import path
const __1 = require("../../..");
// Mock the Prisma client
vitest_1.vi.mock('../../..', () => ({
    prisma: {
        driverLog: {
            create: vitest_1.vi.fn()
        }
    }
}));
(0, vitest_1.describe)('ActionLog', () => {
    (0, vitest_1.it)('should store an action log and return the created record', async () => {
        const mockLog = {
            id: '1',
            user_id: 'user1',
            blobs_id: 'blob1',
            action: 'ACTION_CREATED',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        __1.prisma.driverLog.create.mockResolvedValue(mockLog);
        const result = await ActionLog_1.ActionLog.storeAction({
            user_id: 'user1',
            blobs_id: 'blob1',
            action: 'ACTION_CREATED'
        });
        (0, vitest_1.expect)(result).toEqual(mockLog);
    });
    (0, vitest_1.it)('should return null if the Prisma create method fails', async () => {
        // Mock the Prisma create method to throw an error
        ;
        __1.prisma.driverLog.create.mockRejectedValue(new Error('Database error'));
        const result = await ActionLog_1.ActionLog.storeAction({
            user_id: 'user1',
            blobs_id: 'blob1',
            action: 'ACTION_CREATED'
        });
        (0, vitest_1.expect)(result).toBeNull();
    });
});
