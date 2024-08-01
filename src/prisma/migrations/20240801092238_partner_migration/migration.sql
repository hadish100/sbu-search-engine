/*
  Warnings:

  - You are about to drop the column `telegramChatId` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Student_telegramChatId_key` ON `Student`;

-- AlterTable
ALTER TABLE `Student` DROP COLUMN `telegramChatId`;

-- CreateTable
CREATE TABLE `Partnership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentAId` INTEGER NOT NULL,
    `studentBId` INTEGER NOT NULL,

    UNIQUE INDEX `Partnership_studentAId_studentBId_key`(`studentAId`, `studentBId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Partnership` ADD CONSTRAINT `Partnership_studentAId_fkey` FOREIGN KEY (`studentAId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Partnership` ADD CONSTRAINT `Partnership_studentBId_fkey` FOREIGN KEY (`studentBId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
