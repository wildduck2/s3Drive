"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const crypto_1 = __importDefault(require("crypto"));
const s3_1 = require("../s3");
(0, vitest_1.describe)('S3', () => {
    const accessKey = 'fakeAccessKey';
    const secretAccessKey = 'fakeSecretKey';
    const region = 'us-east-1';
    const url = 'https://example.com/path/to/object';
    (0, vitest_1.it)('should generate a signed URL for AWS S3', async () => {
        const request = {
            method: 'GET',
            url,
            headers: {
                Host: new URL(url).host,
                'x-amz-content-sha256': crypto_1.default
                    .createHash('sha256')
                    .update('')
                    .digest('hex'),
                'x-amz-date': new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
            },
            data: Buffer.from('')
        };
        const signedUrl = await s3_1.S3.getSignedURL(request, {
            accessKey,
            secretAccessKey,
            region
        });
        // Extract query parameters from the signed URL
        const urlParams = new URL(signedUrl).searchParams;
        const expectedAlgorithm = 'AWS4-HMAC-SHA256';
        const expectedExpires = '86400';
        const expectedSignedHeaders = 'host;x-amz-content-sha256;x-amz-date';
        const expectedCredentialScope = `${new Date()
            .toISOString()
            .replace(/[:\-]|\.\d{3}/g, '')
            .substring(0, 8)}/${region}/s3/aws4_request`;
        (0, vitest_1.expect)(urlParams.get('X-Amz-Algorithm')).toBe(expectedAlgorithm);
        (0, vitest_1.expect)(urlParams.get('X-Amz-Credential')).toContain(accessKey);
        (0, vitest_1.expect)(urlParams.get('X-Amz-Date')).toBeDefined();
        (0, vitest_1.expect)(urlParams.get('X-Amz-Expires')).toBe(expectedExpires);
        (0, vitest_1.expect)(urlParams.get('X-Amz-SignedHeaders')).toBe(expectedSignedHeaders);
        (0, vitest_1.expect)(urlParams.get('X-Amz-Signature')).toBeDefined();
    });
    (0, vitest_1.it)('should generate the HMAC-SHA256 signing key for AWS Signature Version 4', () => {
        const date = new Date()
            .toISOString()
            .replace(/[:\-]|\.\d{3}/g, '')
            .substring(0, 8);
        const service = 's3';
        const signingKey = s3_1.S3.getSignatureKey(secretAccessKey, date, region, service);
        const expectedSigningKey = crypto_1.default
            .createHmac('sha256', 'AWS4' + secretAccessKey)
            .update(date)
            .digest();
        const kRegion = crypto_1.default
            .createHmac('sha256', expectedSigningKey)
            .update(region)
            .digest();
        const kService = crypto_1.default
            .createHmac('sha256', kRegion)
            .update(service)
            .digest();
        const expectedFinalKey = crypto_1.default
            .createHmac('sha256', kService)
            .update('aws4_request')
            .digest();
        (0, vitest_1.expect)(signingKey.toString('hex')).toBe(expectedFinalKey.toString('hex'));
    });
});
