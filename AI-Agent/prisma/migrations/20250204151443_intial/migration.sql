-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT NOT NULL,
    "tokenLogo" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "decimal" INTEGER NOT NULL,
    "chainId" INTEGER NOT NULL,
    "feeTier" INTEGER NOT NULL,
    "pythId" TEXT,
    "geckoTerminalAddress" TEXT NOT NULL,
    "isNative" BOOLEAN NOT NULL,
    "isStable" BOOLEAN NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainLogo" TEXT NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chainId_key" ON "Chain"("chainId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_chainId_fkey" FOREIGN KEY ("chainId") REFERENCES "Chain"("chainId") ON DELETE RESTRICT ON UPDATE CASCADE;
