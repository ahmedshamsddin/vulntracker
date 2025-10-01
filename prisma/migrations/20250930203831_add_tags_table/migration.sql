-- CreateTable
CREATE TABLE "Vulnerability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "vulnerabilityId" INTEGER NOT NULL,
    CONSTRAINT "Tag_vulnerabilityId_fkey" FOREIGN KEY ("vulnerabilityId") REFERENCES "Vulnerability" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
