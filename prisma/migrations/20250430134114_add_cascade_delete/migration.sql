-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_parentPostId_fkey`;

-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_rePostId_fkey`;

-- DropIndex
DROP INDEX `Post_parentPostId_fkey` ON `post`;

-- DropIndex
DROP INDEX `Post_rePostId_fkey` ON `post`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_rePostId_fkey` FOREIGN KEY (`rePostId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_parentPostId_fkey` FOREIGN KEY (`parentPostId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
