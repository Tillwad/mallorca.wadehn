/*
  Warnings:

  - You are about to drop the column `status` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BookingCompanions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BookingCompanions" DROP CONSTRAINT "_BookingCompanions_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingCompanions" DROP CONSTRAINT "_BookingCompanions_B_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "status",
DROP COLUMN "userId",
ADD COLUMN     "guest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personen" TEXT[];

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_BookingCompanions";

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "Role";
