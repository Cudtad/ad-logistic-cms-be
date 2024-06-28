-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROOT', 'ADMIN', 'MANAGER', 'SALE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER,
    "email" VARCHAR(55) NOT NULL,
    "name" VARCHAR(55),
    "role" "Role" NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "lastLoggedIn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
