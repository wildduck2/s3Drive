/*
  Warnings:

  - The primary key for the `blobs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `blobs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.

*/
-- AlterTable
ALTER TABLE `blobs` DROP PRIMARY KEY,
    MODIFY `id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `driver_log` (
    `id` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_id` VARCHAR(191) NOT NULL,

    INDEX `driver_log_id_data_id_idx`(`id`, `data_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `blobs_id_idx` ON `blobs`(`id`);

-- AddForeignKey
ALTER TABLE `driver_log` ADD CONSTRAINT `driver_log_data_id_fkey` FOREIGN KEY (`data_id`) REFERENCES `blobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
