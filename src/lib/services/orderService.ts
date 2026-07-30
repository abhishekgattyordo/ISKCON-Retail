import { prisma } from '../prisma';
import { MemoryDb } from '../dbStore';
import { POSOrder } from '../../types';

export async function getOrders(): Promise<POSOrder[]> {
  try {
    if (process.env.DATABASE_URL) {
      const dbOrders = await prisma.pOSOrder.findMany({
        include: { items: true },
        orderBy: { orderNumber: 'desc' },
      });
      if (dbOrders.length > 0) {
        return dbOrders.map(o => ({
          ...o,
          paymentMethod: o.paymentMethod as any,
          items: o.items.map(i => ({
            product: {
              id: i.productId,
              sku: i.productSku,
              name: i.productName,
              category: i.productCategory,
              price: i.productPrice,
              cost: 0,
              stock: 0,
              minStock: 0,
              warehouseZone: '',
              batchNo: '',
              barcode: '',
              imageUrl: '',
              status: 'in_stock' as any,
              lastUpdated: '',
              supplier: '',
              rating: 5,
            },
            quantity: i.quantity,
            discountPercent: i.discountPercent,
            customNote: i.customNote || undefined,
          })),
        }));
      }
    }
  } catch (error) {
    console.warn('Prisma getOrders failed, falling back to MemoryDb:', error);
  }
  return MemoryDb.orders;
}

export async function createOrder(orderData: Omit<POSOrder, 'id' | 'orderNumber' | 'timestamp'>): Promise<POSOrder> {
  const newOrder: POSOrder = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber: `#AR-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: 'Just now',
  };

  try {
    if (process.env.DATABASE_URL) {
      const dbOrder = await prisma.pOSOrder.create({
        data: {
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          subtotal: Number(newOrder.subtotal),
          discountAmount: Number(newOrder.discountAmount),
          taxAmount: Number(newOrder.taxAmount),
          total: Number(newOrder.total),
          paymentMethod: newOrder.paymentMethod,
          timestamp: newOrder.timestamp,
          cashierName: newOrder.cashierName,
          customerPhone: newOrder.customerPhone,
          customerName: newOrder.customerName,
          salesTag: newOrder.salesTag,
          upiId: newOrder.upiId,
          items: {
            create: newOrder.items.map(item => ({
              productId: item.product.id,
              productSku: item.product.sku,
              productName: item.product.name,
              productCategory: item.product.category,
              productPrice: Number(item.product.price),
              quantity: Number(item.quantity),
              discountPercent: Number(item.discountPercent),
              customNote: item.customNote,
            })),
          },
        },
        include: { items: true },
      });

      // Deduct product stock
      if (newOrder.items && Array.isArray(newOrder.items)) {
        for (const cartItem of newOrder.items) {
          const prod = await prisma.product.findFirst({
            where: {
              OR: [
                { id: cartItem.product?.id },
                { sku: cartItem.product?.sku }
              ]
            }
          });
          if (prod) {
            await prisma.product.update({
              where: { id: prod.id },
              data: {
                stock: Math.max(0, prod.stock - Number(cartItem.quantity)),
              },
            });
          }
        }
      }

      return {
        ...dbOrder,
        paymentMethod: dbOrder.paymentMethod as any,
        items: dbOrder.items.map(i => ({
          product: {
            id: i.productId,
            sku: i.productSku,
            name: i.productName,
            category: i.productCategory,
            price: i.productPrice,
            cost: 0,
            stock: 0,
            minStock: 0,
            warehouseZone: '',
            batchNo: '',
            barcode: '',
            imageUrl: '',
            status: 'in_stock' as any,
            lastUpdated: '',
            supplier: '',
            rating: 5,
          },
          quantity: i.quantity,
          discountPercent: i.discountPercent,
          customNote: i.customNote || undefined,
        })),
      };
    }
  } catch (error) {
    console.warn('Prisma createOrder failed, saving to MemoryDb:', error);
  }

  // Fallback to MemoryDb
  MemoryDb.orders.unshift(newOrder);

  // Deduct stock for sold items in MemoryDb
  if (newOrder.items && Array.isArray(newOrder.items)) {
    newOrder.items.forEach((cartItem: any) => {
      const prod = MemoryDb.products.find(p => p.id === cartItem.product?.id || p.sku === cartItem.product?.sku);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - Number(cartItem.quantity));
      }
    });
  }

  return newOrder;
}
