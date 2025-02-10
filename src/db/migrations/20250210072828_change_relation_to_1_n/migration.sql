/*
  Warnings:

  - You are about to drop the column `session_character_id` on the `coordinates` table. All the data in the column will be lost.
  - You are about to drop the column `session_character_id` on the `pictures` table. All the data in the column will be lost.
  - Added the required column `coordinate_id` to the `session_characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sprite_id` to the `session_characters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "coordinates" DROP CONSTRAINT "coordinates_session_character_id_fkey";

-- DropForeignKey
ALTER TABLE "pictures" DROP CONSTRAINT "pictures_session_character_id_fkey";

-- DropIndex
DROP INDEX "coordinates_session_character_id_key";

-- DropIndex
DROP INDEX "pictures_session_character_id_key";

-- AlterTable
ALTER TABLE "coordinates" DROP COLUMN "session_character_id";

-- AlterTable
ALTER TABLE "pictures" DROP COLUMN "session_character_id";

-- AlterTable
ALTER TABLE "session_characters" ADD COLUMN     "coordinate_id" INTEGER NOT NULL,
ADD COLUMN     "sprite_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "session_characters" ADD CONSTRAINT "session_characters_sprite_id_fkey" FOREIGN KEY ("sprite_id") REFERENCES "pictures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_characters" ADD CONSTRAINT "session_characters_coordinate_id_fkey" FOREIGN KEY ("coordinate_id") REFERENCES "coordinates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
