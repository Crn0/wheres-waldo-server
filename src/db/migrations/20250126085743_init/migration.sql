-- CreateTable
CREATE TABLE "delivery_types" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "delivery_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_types" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(20) NOT NULL,

    CONSTRAINT "resource_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pictures" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR NOT NULL,
    "artist" VARCHAR(255),
    "publicId" VARCHAR(255) NOT NULL,
    "version" INTEGER NOT NULL,
    "deliveryTypeId" INTEGER NOT NULL DEFAULT 1,
    "resourceTypeId" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "game_id" INTEGER,
    "character_id" INTEGER,
    "session_character_id" INTEGER,

    CONSTRAINT "pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) DEFAULT 'Nameless',
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "characters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_characters" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "session_id" INTEGER NOT NULL,
    "found" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "session_characters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coordinates" (
    "id" SERIAL NOT NULL,
    "character_id" INTEGER NOT NULL,
    "session_character_id" INTEGER,
    "normalized_x" DOUBLE PRECISION NOT NULL,
    "normalized_y" DOUBLE PRECISION NOT NULL,
    "right_x" INTEGER NOT NULL,
    "left_x" INTEGER NOT NULL,
    "right_y" INTEGER NOT NULL,
    "left_y" INTEGER NOT NULL,

    CONSTRAINT "coordinates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,
    "session_start" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "session_end" TIMESTAMPTZ(3),

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboards" (
    "id" SERIAL NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "leaderboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_types_type_key" ON "delivery_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "resource_types_type_key" ON "resource_types"("type");

-- CreateIndex
CREATE UNIQUE INDEX "pictures_url_key" ON "pictures"("url");

-- CreateIndex
CREATE UNIQUE INDEX "pictures_publicId_key" ON "pictures"("publicId");

-- CreateIndex
CREATE UNIQUE INDEX "pictures_game_id_key" ON "pictures"("game_id");

-- CreateIndex
CREATE UNIQUE INDEX "pictures_character_id_key" ON "pictures"("character_id");

-- CreateIndex
CREATE UNIQUE INDEX "pictures_session_character_id_key" ON "pictures"("session_character_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_session_id_key" ON "players"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_characters_id_session_id_key" ON "session_characters"("id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "coordinates_character_id_key" ON "coordinates"("character_id");

-- CreateIndex
CREATE UNIQUE INDEX "coordinates_session_character_id_key" ON "coordinates"("session_character_id");

-- CreateIndex
CREATE UNIQUE INDEX "leaderboards_game_id_key" ON "leaderboards"("game_id");

-- CreateIndex
CREATE UNIQUE INDEX "games_title_key" ON "games"("title");

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_resourceTypeId_fkey" FOREIGN KEY ("resourceTypeId") REFERENCES "resource_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_deliveryTypeId_fkey" FOREIGN KEY ("deliveryTypeId") REFERENCES "delivery_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_session_character_id_fkey" FOREIGN KEY ("session_character_id") REFERENCES "session_characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_characters" ADD CONSTRAINT "session_characters_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinates" ADD CONSTRAINT "coordinates_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "characters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coordinates" ADD CONSTRAINT "coordinates_session_character_id_fkey" FOREIGN KEY ("session_character_id") REFERENCES "session_characters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboards" ADD CONSTRAINT "leaderboards_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
