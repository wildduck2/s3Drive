/*
  Warnings:

  - You are about to drop the column `user_name` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_user_name_key` ON `User`;

-- DropIndex
DROP INDEX `user` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `user_name`;

-- CreateIndex
CREATE INDEX `user` ON `User`(`email`);
