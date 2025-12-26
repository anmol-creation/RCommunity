-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('BIKE', 'SCOOTER', 'CYCLE', 'EV_SCOOTER', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "platforms" TEXT[],
ADD COLUMN     "vehicleType" "VehicleType",
ADD COLUMN     "yearsExperience" INTEGER DEFAULT 0;
