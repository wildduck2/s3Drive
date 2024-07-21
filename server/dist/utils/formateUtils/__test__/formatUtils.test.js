"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const formatUtils_1 = require("../formatUtils");
// Test data
const testString = 'Hello, World!';
const base64String = 'SGVsbG8sIFdvcmxkIQ==';
const hmacParams = {
    key: 'supersecretkey',
    data: testString,
    encoding: 'hex'
};
const sha256Params = {
    data: testString,
    encoding: 'hex'
};
(0, vitest_1.describe)('FormatUtils', () => {
    (0, vitest_1.it)('should encode a string to Base64 format', () => {
        const encoded = formatUtils_1.FormatUtils.encode(testString);
        (0, vitest_1.expect)(encoded).toBe(base64String);
    });
    (0, vitest_1.it)('should decode a Base64 encoded string to its original format', () => {
        const decoded = formatUtils_1.FormatUtils.decode(base64String);
        (0, vitest_1.expect)(decoded).toBe(testString);
    });
    (0, vitest_1.it)('should validate if a string is Base64 encoded', () => {
        const isValid = formatUtils_1.FormatUtils.isBase64(base64String);
        (0, vitest_1.expect)(isValid).toBe(true);
    });
    (0, vitest_1.it)('should invalidate if a string is not Base64 encoded', () => {
        const isValid = formatUtils_1.FormatUtils.isBase64(testString);
        (0, vitest_1.expect)(isValid).toBe(false);
    });
    (0, vitest_1.it)('should create an HMAC using SHA-256', () => {
        const hmac = formatUtils_1.FormatUtils.hmac(hmacParams);
        (0, vitest_1.expect)(hmac).toBeTypeOf('string');
    });
    (0, vitest_1.it)('should create a SHA-256 hash of the given data', () => {
        const hash = formatUtils_1.FormatUtils.sha256(sha256Params);
        (0, vitest_1.expect)(hash).toBeTypeOf('string');
    });
});
