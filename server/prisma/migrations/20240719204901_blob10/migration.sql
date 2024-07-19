-- DropForeignKey
ALTER TABLE `DriverLog` DROP FOREIGN KEY `DriverLog_blobs_id_fkey`;

-- AlterTable
ALTER TABLE `DriverLog` ADD COLUMN `blobId` CHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `DriverLog` ADD CONSTRAINT `DriverLog_blobs_id_fkey` FOREIGN KEY (`blobs_id`) REFERENCES `Blobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverLog` ADD CONSTRAINT `DriverLog_blobId_fkey` FOREIGN KEY (`blobId`) REFERENCES `Blob`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
