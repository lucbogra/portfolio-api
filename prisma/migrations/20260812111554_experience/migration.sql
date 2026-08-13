-- CreateEnum
CREATE TYPE "Contexte" AS ENUM ('FREELANCE', 'CDI', 'CONSULTANT', 'CDD');

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3),
    "titre" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "contexte" "Contexte" NOT NULL,
    "description" TEXT NOT NULL,
    "lien_demo" TEXT,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projets" (
    "id" TEXT NOT NULL,
    "experience_id" TEXT,
    "slug" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "image" TEXT,
    "date_debut" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3),
    "github" TEXT,
    "details" TEXT NOT NULL,
    "lien_demo" TEXT,

    CONSTRAINT "projets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "experiences_slug_key" ON "experiences"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projets_slug_key" ON "projets"("slug");

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "experiences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
