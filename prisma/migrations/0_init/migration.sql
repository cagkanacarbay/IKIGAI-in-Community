-- CreateTable
CREATE TABLE "ikigai" (
    "ikigai_id" SERIAL NOT NULL,

    CONSTRAINT "ikigai_pkey" PRIMARY KEY ("ikigai_id")
);

-- CreateTable
CREATE TABLE "items" (
    "item_id" SERIAL NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "text" VARCHAR(255),
    "image_url" VARCHAR(255),
    "ikigai_id" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "positions" (
    "position_id" SERIAL NOT NULL,
    "item_id" INTEGER NOT NULL,
    "x_position" DOUBLE PRECISION NOT NULL,
    "y_position" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("position_id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_ikigai_id_fkey" FOREIGN KEY ("ikigai_id") REFERENCES "ikigai"("ikigai_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

