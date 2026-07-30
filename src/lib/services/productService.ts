import { prisma } from '../prisma';
import { MemoryDb } from '../dbStore';
import { Product } from '../../types';

export async function getProducts(): Promise<Product[]> {
  try {
    if (process.env.DATABASE_URL) {
      const dbProducts = await prisma.product.findMany({
        orderBy: { lastUpdated: 'desc' },
      });
      if (dbProducts.length > 0) {
        return dbProducts.map(p => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          category: p.category,
          price: Number(p.price),
          cost: Number(p.cost),
          stock: p.stock,
          minStock: p.minStock,
          warehouseZone: p.warehouseZone,
          batchNo: p.batchNo || '',
          barcode: p.barcode || '',
          imageUrl: p.imageUrl || '',
          status: p.status as any,
          lastUpdated: p.lastUpdated ? p.lastUpdated.toISOString() : new Date().toISOString(),
          supplier: p.supplier || '',
          rating: Number(p.rating || 5),
          description: p.description || undefined,
          tags: p.tags || [],
        }));
      }
    }
  } catch (error) {
    console.warn('Prisma getProducts failed, falling back to MemoryDb:', error);
  }
  return MemoryDb.products;
}

export async function createProduct(prodData: Omit<Product, 'id' | 'lastUpdated'>): Promise<Product> {
  const newProduct: Product = {
    ...prodData,
    id: `prod-${Date.now()}`,
    lastUpdated: new Date().toISOString(),
  };

  try {
    if (process.env.DATABASE_URL) {
      const dbProd = await prisma.product.create({
        data: {
          id: newProduct.id,
          sku: newProduct.sku,
          name: newProduct.name,
          category: newProduct.category,
          price: Number(newProduct.price),
          cost: Number(newProduct.cost),
          stock: Number(newProduct.stock),
          minStock: Number(newProduct.minStock),
          warehouseZone: newProduct.warehouseZone,
          batchNo: newProduct.batchNo,
          barcode: newProduct.barcode,
          imageUrl: newProduct.imageUrl,
          status: newProduct.status,
          supplier: newProduct.supplier,
          rating: Number(newProduct.rating),
          description: newProduct.description,
          tags: newProduct.tags || [],
        },
      });
      return {
        id: dbProd.id,
        sku: dbProd.sku,
        name: dbProd.name,
        category: dbProd.category,
        price: Number(dbProd.price),
        cost: Number(dbProd.cost),
        stock: dbProd.stock,
        minStock: dbProd.minStock,
        warehouseZone: dbProd.warehouseZone,
        batchNo: dbProd.batchNo || '',
        barcode: dbProd.barcode || '',
        imageUrl: dbProd.imageUrl || '',
        status: dbProd.status as any,
        lastUpdated: dbProd.lastUpdated ? dbProd.lastUpdated.toISOString() : new Date().toISOString(),
        supplier: dbProd.supplier || '',
        rating: Number(dbProd.rating || 5),
        description: dbProd.description || undefined,
        tags: dbProd.tags || [],
      };
    }
  } catch (error) {
    console.warn('Prisma createProduct failed, saving to MemoryDb:', error);
  }

  MemoryDb.products.unshift(newProduct);
  return newProduct;
}
