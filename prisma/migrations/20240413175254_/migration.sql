/*
  Warnings:

  - You are about to drop the column `uid` on the `answer` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `answer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_answer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_answer" ("answer", "created_at", "event", "id", "question") SELECT "answer", "created_at", "event", "id", "question" FROM "answer";
DROP TABLE "answer";
ALTER TABLE "new_answer" RENAME TO "answer";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
