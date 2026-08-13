-- CreateTable
CREATE TABLE "profils" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "github" TEXT,
    "linkedin" TEXT,
    "pays" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "adresse" TEXT,

    CONSTRAINT "profils_pkey" PRIMARY KEY ("id")
);
