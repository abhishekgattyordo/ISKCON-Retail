import {
  INITIAL_PRODUCTS,
  INITIAL_INWARD_NOTES,
  INITIAL_ORDERS,
  INITIAL_EVENTS
} from '../data/initialData';
import { Product, MaterialInwardNote, POSOrder, SalesEvent } from '../types';

// Central in-memory DB store for Next.js API Routes fallback
export class MemoryDb {
  static products: Product[] = [...INITIAL_PRODUCTS];
  static inwardNotes: MaterialInwardNote[] = [...INITIAL_INWARD_NOTES];
  static orders: POSOrder[] = [...INITIAL_ORDERS];
  static events: SalesEvent[] = [...INITIAL_EVENTS];
}
