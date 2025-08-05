-- CreateTable
CREATE TABLE "public"."Solves" (
    "id" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "dnf" BOOLEAN,
    "plustTwo" BOOLEAN,

    CONSTRAINT "Solves_pkey" PRIMARY KEY ("id")
);
