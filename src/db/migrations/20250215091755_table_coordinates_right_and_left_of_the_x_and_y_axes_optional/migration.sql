-- AlterTable
ALTER TABLE "coordinates" ALTER COLUMN "right_x" DROP NOT NULL,
ALTER COLUMN "left_x" DROP NOT NULL,
ALTER COLUMN "right_y" DROP NOT NULL,
ALTER COLUMN "left_y" DROP NOT NULL;
