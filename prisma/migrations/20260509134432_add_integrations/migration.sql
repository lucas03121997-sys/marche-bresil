-- CreateTable
CREATE TABLE "IntegrationConfig" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "storeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalOrder" (
    "id" SERIAL NOT NULL,
    "provider" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "codigoPedido" TEXT NOT NULL,
    "clienteNome" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NOVO',
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estoqueOrigem" TEXT,
    "rawData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalOrderItem" (
    "id" SERIAL NOT NULL,
    "externalOrderId" INTEGER NOT NULL,
    "produto" TEXT NOT NULL,
    "codigo" TEXT,
    "quantidade" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalOrderItem" ADD CONSTRAINT "ExternalOrderItem_externalOrderId_fkey" FOREIGN KEY ("externalOrderId") REFERENCES "ExternalOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
