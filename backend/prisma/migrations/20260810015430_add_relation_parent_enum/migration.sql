-- CreateEnum
CREATE TYPE "RelationParent" AS ENUM ('MERE', 'PERE', 'TUTEUR', 'GRAND_PARENT', 'AUTRE');

-- AlterTable: add temp column with default, migrate data, swap columns
ALTER TABLE "EnfantParent" ADD COLUMN "relation_new" "RelationParent" NOT NULL DEFAULT 'AUTRE';

UPDATE "EnfantParent" SET "relation_new" =
  CASE
    WHEN "relation" IN ('mere', 'mère', 'MERE')            THEN 'MERE'::"RelationParent"
    WHEN "relation" IN ('pere', 'père', 'PERE')            THEN 'PERE'::"RelationParent"
    WHEN "relation" IN ('tuteur', 'tutrice', 'TUTEUR')     THEN 'TUTEUR'::"RelationParent"
    WHEN "relation" IN ('grand-parent', 'GRAND_PARENT')    THEN 'GRAND_PARENT'::"RelationParent"
    ELSE 'AUTRE'::"RelationParent"
  END;

ALTER TABLE "EnfantParent" DROP COLUMN "relation";
ALTER TABLE "EnfantParent" RENAME COLUMN "relation_new" TO "relation";
ALTER TABLE "EnfantParent" ALTER COLUMN "relation" DROP DEFAULT;
