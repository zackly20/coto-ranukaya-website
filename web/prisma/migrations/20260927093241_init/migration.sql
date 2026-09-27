-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "menus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "menus_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_code" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "order_type" TEXT NOT NULL,
    "address" TEXT,
    "table_number" TEXT,
    "pickup_time" TEXT,
    "total" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "payment_status" TEXT NOT NULL DEFAULT 'unpaid',
    "order_status" TEXT NOT NULL DEFAULT 'received',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "subtotal" INTEGER NOT NULL,
    CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_id" INTEGER,
    "customer_name" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "promos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "discount_type" TEXT NOT NULL,
    "discount_value" INTEGER NOT NULL,
    "start_date" DATETIME,
    "end_date" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'active'
);

-- CreateTable
CREATE TABLE "gallery" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'makanan',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "restaurant_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "maps_url" TEXT NOT NULL,
    "plusCode" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "price_range" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "operating_hours" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "open_time" TEXT NOT NULL,
    "close_time" TEXT NOT NULL,
    "is_open" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_code_key" ON "orders"("order_code");

-- CreateIndex
CREATE UNIQUE INDEX "operating_hours_day_key" ON "operating_hours"("day");
