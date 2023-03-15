/*
  Warnings:

  - You are about to drop the column `latitudee` on the `coffeeshop` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `CoffeeShop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coffeeshop` DROP COLUMN `latitudee`,
    ADD COLUMN `latitude` VARCHAR(255) NOT NULL;
