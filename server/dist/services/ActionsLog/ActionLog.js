"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionLog = void 0;
const prisma_1 = require("../../utils/prisma");
/**
 * ActionLog Class
 *
 * The `ActionLog` class provides functionality to log actions to the database using Prisma ORM.
 */
class ActionLog {
    /**
     * Stores a log of an action in the database.
     *
     * @param {StoreActionType} param - An object containing the user ID and data ID.
     * @param {string} param.user_id - The ID of the user performing the action.
     * @param {string} param.data_id - The ID of the data associated with the action.
     * @param {string} param.action - The ID of the data associated with the action.
     *
     * @returns {Promise<DriverLog | null>} - Returns the created log record object if successful, otherwise returns `null`.
     */
    static async storeAction({ user_id, blobs_id, action }) {
        try {
            const record = await prisma_1.prisma.driverLog.create({
                data: {
                    blobs_id,
                    user_id,
                    action
                }
            });
            if (!record)
                return null;
            return record;
        }
        catch (error) {
            return null;
        }
    }
}
exports.ActionLog = ActionLog;
