-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('STACK', 'SOFT_SKILL', 'AUTRE');

-- CreateEnum
CREATE TYPE "TaggableType" AS ENUM ('EXPERIENCE', 'PROJET', 'ARTICLE');

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "type" "TagType" NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taggables" (
    "id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "taggable_type" "TaggableType" NOT NULL,
    "taggable_id" TEXT NOT NULL,

    CONSTRAINT "taggables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_nom_key" ON "tags"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "taggables_tag_id_taggable_type_taggable_id_key" ON "taggables"("tag_id", "taggable_type", "taggable_id");

-- AddForeignKey
ALTER TABLE "taggables" ADD CONSTRAINT "taggables_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
