"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatUtils = void 0;
const js_base64_1 = require("js-base64");
const crypto_1 = __importDefault(require("crypto"));
/**
 * A utility class for encoding, decoding, and hashing operations.
 */
class FormatUtils {
    /**
     * Encodes a string to Base64 format.
     *
     * @param data - The string to encode.
     * @returns The Base64 encoded string.
     */
    static encode(data) {
        return js_base64_1.Base64.encode(data);
    }
    /**
     * Decodes a Base64 encoded string to its original format.
     *
     * @param base64 - The Base64 encoded string.
     * @returns The decoded string.
     */
    static decode(base64) {
        return js_base64_1.Base64.decode(base64);
    }
    /**
     * Checks if a given string is valid Base64 encoded data.
     *
     * @param data - The string to check.
     * @returns `true` if the string is valid Base64 encoded data, `false` otherwise.
     */
    static isBase64(data) {
        try {
            return btoa(atob(data)) === data;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Creates an HMAC (Hash-based Message Authentication Code) using SHA-256.
     *
     * @param params - The parameters for the HMAC operation.
     * @param params.key - The key used for HMAC.
     * @param params.data - The data to be hashed.
     * @param params.encoding - The encoding of the output (e.g., 'hex', 'base64').
     * @returns The resulting HMAC in the specified encoding.
     */
    static hmac({ key, data, encoding }) {
        return crypto_1.default
            .createHmac('sha256', key)
            .update(data, 'utf8')
            .digest(encoding);
    }
    /**
     * Creates a SHA-256 hash of the given data.
     *
     * @param params - The parameters for the SHA-256 hashing operation.
     * @param params.data - The data to be hashed.
     * @param params.encoding - The encoding of the output (e.g., 'hex', 'base64').
     * @returns The resulting SHA-256 hash in the specified encoding.
     */
    static sha256({ data, encoding }) {
        return crypto_1.default.createHash('sha256').update(data, 'utf8').digest(encoding);
    }
}
exports.FormatUtils = FormatUtils;
