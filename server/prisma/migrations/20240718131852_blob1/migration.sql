/*
  Warnings:

  - You are about to drop the column `data_id` on the `driver_log` table. All the data in the column will be lost.
  - Added the required column `dataId` to the `driver_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `driver_log` DROP FOREIGN KEY `driver_log_data_id_fkey`;

-- DropIndex
DROP INDEX `driver_log_id_data_id_idx` ON `driver_log`;

-- AlterTable
ALTER TABLE `driver_log` DROP COLUMN `data_id`,
    ADD COLUMN `dataId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `driver_log_id_dataId_idx` ON `driver_log`(`id`, `dataId`);

-- AddForeignKey
ALTER TABLE `driver_log` ADD CONSTRAINT `driver_log_dataId_fkey` FOREIGN KEY (`dataId`) REFERENCES `blobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
