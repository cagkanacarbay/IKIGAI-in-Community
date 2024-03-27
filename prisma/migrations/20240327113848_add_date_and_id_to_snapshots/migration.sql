/*
  Warnings:

  - Added the required column `ikigai_id` to the `ikigai_snapshot` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ikigai_snapshot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ikigai_id" INTEGER NOT NULL, -- Removing the default value from the column definition
    CONSTRAINT "ikigai_snapshot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ikigai_snapshot" ("id", "data", "user_id", "createdAt", "ikigai_id") 
SELECT "id", "data", "user_id", "createdAt", 1 FROM "ikigai_snapshot"; -- Setting ikigai_id to 1 for existing rows explicitly
DROP TABLE "ikigai_snapshot";
ALTER TABLE "new_ikigai_snapshot" RENAME TO "ikigai_snapshot";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
