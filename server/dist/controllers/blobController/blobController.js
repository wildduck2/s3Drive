"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobController = void 0;
const services_1 = require("../../services");
const formateUtils_1 = require("../../utils/formateUtils");
const user_id = '4e32491a-aaf3-4e29-a22b-c0cf8668c43b';
class BlobController {
    storageService;
    constructor(adapterService) {
        this.storageService = adapterService;
    }
    async storeBlob(req, res) {
        const { id, name, size, type, data } = req.body;
        let Base64Data = data;
        try {
            //NOTE: checking if the file is base64 if not formate it
            if (!formateUtils_1.FormatUtils.isBase64(Base64Data)) {
                Base64Data = formateUtils_1.FormatUtils.encode(Base64Data);
            }
            //NOTE: saving the blob
            const blob = await this.storageService.adapter.saveBlob({
                id,
                name,
                type,
                data,
                size,
                user_id
            });
            if (!blob)
                return res
                    .status(404)
                    .send({ error: 'failed to store blob', data: null });
            //NOTE: tracking actions
            const action = await services_1.ActionLog.storeAction({
                action: 'uploading file to the s3 bucket',
                user_id,
                blobs_id: id
            });
            if (!action)
                return res
                    .status(404)
                    .json({ error: 'failed to track this action', data });
            return res.status(200).send({
                error: null,
                data
            });
        }
        catch (error) {
            return res.status(400).send({ error: 'Invalid Base64 data' });
        }
    }
    async retrieveBlob(req, res) {
        const { id } = req.params;
        try {
            //NOTE: getting metadata
            const blobMetaData = await this.storageService.adapter.getBlob({
                id,
                user_id
            });
            if (!blobMetaData)
                return res
                    .status(404)
                    .json({ error: 'failed to get blob metadata', blobMetaData });
            //NOTE: tracking actions
            const action = await services_1.ActionLog.storeAction({
                action: 'getting blob form the s3 bucket',
                user_id,
                blobs_id: id
            });
            if (!action)
                return res
                    .status(404)
                    .json({ error: 'failed to track this action', blobMetaData });
            return res.status(200).json({ error: null, data: blobMetaData });
        }
        catch (error) {
            return res.send({ error: 'Blob not found', data: null });
        }
    }
    async listBucketBlobs(req, res) {
        // @ts-expect-error-error query
        const { pageSize, page } = req.query;
        try {
            const blobs = await services_1.DBService.listBlobsMetaData({ pageSize, page });
            if (!blobs)
                return res
                    .status(404)
                    .json({ error: 'Failed to show bucket content', data: null });
            return res.status(200).json({ error: null, data: blobs });
        }
        catch (error) {
            return res.status(404).json({
                error: 'Failed to show bucket content',
                data: null,
                errorr: error
            });
        }
    }
}
exports.BlobController = BlobController;
