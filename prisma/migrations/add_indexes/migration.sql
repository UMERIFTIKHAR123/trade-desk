-- Add indexes for better query performance

-- Index for Product queries
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_isDeleted_idx" ON "Product"("isDeleted");
CREATE INDEX IF NOT EXISTS "Product_name_idx" ON "Product"("name");
CREATE INDEX IF NOT EXISTS "Product_createdAt_idx" ON "Product"("createdAt");

-- Index for PurchaseOrder queries
CREATE INDEX IF NOT EXISTS "PurchaseOrder_customerId_idx" ON "PurchaseOrder"("customerId");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_orderNo_idx" ON "PurchaseOrder"("orderNo");
CREATE INDEX IF NOT EXISTS "PurchaseOrder_createdAt_idx" ON "PurchaseOrder"("createdAt");

-- Index for PurchaseOrderItem queries
CREATE INDEX IF NOT EXISTS "PurchaseOrderItem_purchaseOrderId_idx" ON "PurchaseOrderItem"("purchaseOrderId");
CREATE INDEX IF NOT EXISTS "PurchaseOrderItem_productId_idx" ON "PurchaseOrderItem"("productId");

-- Index for VendorProductRate queries
CREATE INDEX IF NOT EXISTS "VendorProductRate_vendorId_idx" ON "VendorProductRate"("vendorId");
CREATE INDEX IF NOT EXISTS "VendorProductRate_productId_idx" ON "VendorProductRate"("productId");

-- Composite index for common Product search queries
CREATE INDEX IF NOT EXISTS "Product_isDeleted_categoryId_idx" ON "Product"("isDeleted", "categoryId");





