-- CreateTable
CREATE TABLE "GeneratedItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaignId" TEXT,
    "createdAt" INTEGER NOT NULL,
    "content" JSONB NOT NULL,
    "type" TEXT NOT NULL
);
