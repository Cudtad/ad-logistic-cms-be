-- CreateEnum
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShipmentType" AS ENUM ('DOMESTIC', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'PAY_ID', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UN_PAID', 'PARTIAL_PAID', 'PAID');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'ERROR');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('FFM', 'EPACKET');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('READ', 'UNREAD');

-- CreateTable
CREATE TABLE "Unit" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "code" VARCHAR(10) NOT NULL,
    "description" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitConfig" (
    "id" SERIAL NOT NULL,
    "unitId" INTEGER NOT NULL,
    "orderProcessFee" INTEGER NOT NULL,
    "accountRentFee" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnitConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(55) NOT NULL,
    "description" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZoneAddress" (
    "id" SERIAL NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "lines" TEXT[],
    "suburb" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "postcode" VARCHAR(25) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZoneAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "code" VARCHAR(25) NOT NULL,
    "from" JSONB NOT NULL,
    "to" JSONB NOT NULL,
    "status" "ShipmentStatus" NOT NULL,
    "type" "ShipmentType" NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'UNKNOWN',
    "paymentStatus" "PaymentStatus" NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "shippingPrice" INTEGER NOT NULL DEFAULT 0,
    "shipmentPrice" INTEGER NOT NULL DEFAULT 0,
    "approvedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "shipmentId" TEXT,
    "shipmentTrackingNumber" TEXT,
    "shipmentOrderId" TEXT,
    "shipmentSummary" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "sku" VARCHAR(25) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB NOT NULL,
    "shipmentItemId" VARCHAR(55) NOT NULL,
    "shipmentSku" VARCHAR(255) NOT NULL,
    "shipmentItemProductId" VARCHAR(25) NOT NULL,
    "shipmentItemSummary" JSONB NOT NULL,
    "shipmentTrackingDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShipmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "zoneId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "code" VARCHAR(25) NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "type" "OrderType" NOT NULL,
    "metadata" JSONB NOT NULL,
    "paidPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "shipmentOrderId" VARCHAR(55) NOT NULL,
    "shipmentStatus" VARCHAR(55) NOT NULL,
    "shipmentPaymentMethod" VARCHAR(55) NOT NULL,
    "shipmentOrderSummary" JSONB NOT NULL,
    "shipmentOrderMetadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageIds" INTEGER[],
    "labelUrl" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" SERIAL NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "code" VARCHAR(55) NOT NULL,
    "metadata" JSONB NOT NULL,
    "shipmentRequestId" VARCHAR(255) NOT NULL,
    "shipmentLabelUrl" VARCHAR(2000) NOT NULL,
    "shipmentStatus" VARCHAR(25) NOT NULL,
    "shipmentMetadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "etag" TEXT NOT NULL,
    "inUse" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuspostLog" (
    "id" SERIAL NOT NULL,
    "request" VARCHAR(2000) NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuspostLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuspostErrorLog" (
    "id" SERIAL NOT NULL,
    "statusCode" VARCHAR(10) NOT NULL,
    "request" VARCHAR(2000) NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuspostErrorLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "type" VARCHAR(25) NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UnitToZone" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Unit_code_key" ON "Unit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "UnitConfig_unitId_key" ON "UnitConfig"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "ZoneAddress_zoneId_key" ON "ZoneAddress"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_code_key" ON "Order"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_UnitToZone_AB_unique" ON "_UnitToZone"("A", "B");

-- CreateIndex
CREATE INDEX "_UnitToZone_B_index" ON "_UnitToZone"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitConfig" ADD CONSTRAINT "UnitConfig_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZoneAddress" ADD CONSTRAINT "ZoneAddress_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentItem" ADD CONSTRAINT "ShipmentItem_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "Shipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentItem" ADD CONSTRAINT "ShipmentItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToZone" ADD CONSTRAINT "_UnitToZone_A_fkey" FOREIGN KEY ("A") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToZone" ADD CONSTRAINT "_UnitToZone_B_fkey" FOREIGN KEY ("B") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
