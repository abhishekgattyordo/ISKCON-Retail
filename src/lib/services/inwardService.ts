import { prisma } from '../prisma';
import { MemoryDb } from '../dbStore';
import { MaterialInwardNote } from '../../types';

export async function getInwardNotes(): Promise<MaterialInwardNote[]> {
  try {
    if (process.env.DATABASE_URL) {
      const dbNotes = await prisma.materialInwardNote.findMany({
        include: { items: true },
        orderBy: { grnNumber: 'desc' },
      });
      if (dbNotes.length > 0) {
        return dbNotes.map(n => ({
          ...n,
          status: n.status as any,
          items: n.items.map(i => ({
            ...i,
            sellingPrice: i.sellingPrice || undefined,
          })),
        }));
      }
    }
  } catch (error) {
    console.warn('Prisma getInwardNotes failed, falling back to MemoryDb:', error);
  }
  return MemoryDb.inwardNotes;
}

export async function createInwardNote(noteData: Omit<MaterialInwardNote, 'id'>): Promise<MaterialInwardNote> {
  const newNote: MaterialInwardNote = {
    ...noteData,
    id: `min-${Date.now()}`,
  };

  try {
    if (process.env.DATABASE_URL) {
      const dbNote = await prisma.materialInwardNote.create({
        data: {
          id: newNote.id,
          grnNumber: newNote.grnNumber,
          poNumber: newNote.poNumber,
          vendorName: newNote.vendorName,
          invoiceDate: newNote.invoiceDate,
          warehouse: newNote.warehouse,
          status: newNote.status,
          totalValue: Number(newNote.totalValue),
          receivedBy: newNote.receivedBy,
          timestamp: newNote.timestamp,
          notes: newNote.notes,
          items: {
            create: newNote.items.map(item => ({
              sku: item.sku,
              name: item.name,
              quantity: Number(item.quantity),
              unitCost: Number(item.unitCost),
              sellingPrice: item.sellingPrice ? Number(item.sellingPrice) : null,
              batchNo: item.batchNo,
              expiryDate: item.expiryDate,
              taxRate: Number(item.taxRate),
              total: Number(item.total),
            })),
          },
        },
        include: { items: true },
      });

      // Update product stocks, costs, and selling prices
      if (newNote.items && Array.isArray(newNote.items)) {
        for (const item of newNote.items) {
          const prod = await prisma.product.findUnique({ where: { sku: item.sku } });
          if (prod) {
            await prisma.product.update({
              where: { sku: item.sku },
              data: {
                stock: prod.stock + Number(item.quantity),
                cost: item.unitCost ? Number(item.unitCost) : prod.cost,
                price: item.sellingPrice ? Number(item.sellingPrice) : prod.price,
                batchNo: item.batchNo || prod.batchNo,
                lastUpdated: new Date(),
              },
            });
          }
        }
      }

      return {
        ...dbNote,
        status: dbNote.status as any,
        items: dbNote.items.map(i => ({
          ...i,
          sellingPrice: i.sellingPrice || undefined,
        })),
      };
    }
  } catch (error) {
    console.warn('Prisma createInwardNote failed, saving to MemoryDb:', error);
  }

  // Fallback to MemoryDb
  MemoryDb.inwardNotes.unshift(newNote);

  // Automatically update product stock, cost, and selling price in MemoryDb
  if (newNote.items && Array.isArray(newNote.items)) {
    newNote.items.forEach((item: any) => {
      const prod = MemoryDb.products.find(p => p.sku === item.sku);
      if (prod) {
        prod.stock += Number(item.quantity);
        if (item.unitCost) prod.cost = Number(item.unitCost);
        if (item.sellingPrice) prod.price = Number(item.sellingPrice);
        if (item.batchNo) prod.batchNo = item.batchNo;
        prod.lastUpdated = new Date().toISOString();
      }
    });
  }

  return newNote;
}
