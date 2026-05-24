-- Canonical service categories for search filters
CREATE TABLE "service_categories" (
    "slug" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("slug")
);
