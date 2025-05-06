/*
  Warnings:

  - You are about to drop the column `repostId` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_repostId_fkey`;

-- DropIndex
DROP INDEX `Post_repostId_fkey` ON `post`;

-- AlterTable
ALTER TABLE `post` DROP COLUMN `repostId`,
    ADD COLUMN `rePostId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `job` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_rePostId_fkey` FOREIGN KEY (`rePostId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
