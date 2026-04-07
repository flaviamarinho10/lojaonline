-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "badges" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "colors" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "comparePrice" DECIMAL(10,2);
