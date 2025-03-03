-- DropForeignKey
ALTER TABLE "coordinates" DROP CONSTRAINT "coordinates_character_id_fkey";

-- AddForeignKey
ALTER TABLE "coordinates" ADD CONSTRAINT "coordinates_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
