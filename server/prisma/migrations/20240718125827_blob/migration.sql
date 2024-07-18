-- CreateTable
CREATE TABLE `blobs` (
    `id` CHAR(36) NOT NULL,
    `blob_data` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `blobs_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `driver_log` (
    `id` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_id` VARCHAR(191) NOT NULL,

    INDEX `driver_log_id_data_id_idx`(`id`, `data_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `driver_log` ADD CONSTRAINT `driver_log_data_id_fkey` FOREIGN KEY (`data_id`) REFERENCES `blobs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
