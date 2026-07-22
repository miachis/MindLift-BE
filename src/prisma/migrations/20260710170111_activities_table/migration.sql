-- CreateTable
CREATE TABLE "Activities" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Activities_pkey" PRIMARY KEY ("id")
);
