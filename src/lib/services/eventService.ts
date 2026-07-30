import { prisma } from '../prisma';
import { MemoryDb } from '../dbStore';
import { SalesEvent } from '../../types';

export async function getEvents(): Promise<SalesEvent[]> {
  try {
    if (process.env.DATABASE_URL) {
      const dbEvents = await prisma.salesEvent.findMany({
        orderBy: { startDate: 'desc' },
      });
      if (dbEvents.length > 0) {
        return dbEvents.map(e => ({
          ...e,
          type: e.type as any,
          status: e.status as any,
          booksSoldQty: e.booksSoldQty || undefined,
          booksSoldRevenue: e.booksSoldRevenue || undefined,
          giftsSoldQty: e.giftsSoldQty || undefined,
          giftsSoldRevenue: e.giftsSoldRevenue || undefined,
        }));
      }
    }
  } catch (error) {
    console.warn('Prisma getEvents failed, falling back to MemoryDb:', error);
  }
  return MemoryDb.events;
}

export async function createEvent(evtData: Omit<SalesEvent, 'id' | 'currentRevenue'>): Promise<SalesEvent> {
  const newEvent: SalesEvent = {
    ...evtData,
    id: `evt-${Date.now()}`,
    currentRevenue: 0,
  };

  try {
    if (process.env.DATABASE_URL) {
      const dbEvent = await prisma.salesEvent.create({
        data: {
          id: newEvent.id,
          name: newEvent.name,
          type: newEvent.type,
          startDate: newEvent.startDate,
          endDate: newEvent.endDate,
          status: newEvent.status,
          targetRevenue: Number(newEvent.targetRevenue),
          currentRevenue: Number(newEvent.currentRevenue),
          allocatedSKUs: Number(newEvent.allocatedSKUs),
          discountRule: newEvent.discountRule,
          description: newEvent.description,
          bannerColor: newEvent.bannerColor,
          stallLocation: newEvent.stallLocation,
          managerName: newEvent.managerName,
          booksSoldQty: newEvent.booksSoldQty,
          booksSoldRevenue: newEvent.booksSoldRevenue,
          giftsSoldQty: newEvent.giftsSoldQty,
          giftsSoldRevenue: newEvent.giftsSoldRevenue,
        },
      });
      return {
        ...dbEvent,
        type: dbEvent.type as any,
        status: dbEvent.status as any,
        booksSoldQty: dbEvent.booksSoldQty || undefined,
        booksSoldRevenue: dbEvent.booksSoldRevenue || undefined,
        giftsSoldQty: dbEvent.giftsSoldQty || undefined,
        giftsSoldRevenue: dbEvent.giftsSoldRevenue || undefined,
      };
    }
  } catch (error) {
    console.warn('Prisma createEvent failed, saving to MemoryDb:', error);
  }

  MemoryDb.events.push(newEvent);
  return newEvent;
}
