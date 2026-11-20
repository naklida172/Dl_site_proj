export type Lang = 'ru' | 'ky';

export type LText =
  | {
    ru: string;
    ky: string;
  }
  | string;

export type RestaurantModuleId =
  | 'floor'
  | 'pos'
  | 'kitchen'
  | 'delivery'
  | 'comms'
  | 'menu'
  | 'inventory'
  | 'guests'
  | 'operations'
  | 'reports';

export interface SubTabDef {
  id: string;
  label: { ru: string; ky: string };
}

export interface ModuleDef {
  id: RestaurantModuleId;
  group: 'front' | 'back';
  label: { ru: string; ky: string };
  icon: string;
  searchPlaceholder: { ru: string; ky: string };
  tabs: SubTabDef[];
}

// 1. Floor & Reservations
export type HallZoneId = 'main' | 'terrace_vip';
export type TableStatus = 'free' | 'occupied' | 'reserved' | 'precheck';
export type TableShape = 'square' | 'round' | 'wide';

export interface RestaurantTable {
  id: string;
  number: string;
  zone: HallZoneId;
  seats: number;
  shape: TableShape;
  x: number; // percentage 0..100
  y: number; // percentage 0..100
  status: TableStatus;
  waiter?: string;
  guestCount?: number;
  openedAt?: string;
  activeOrderId?: string;
}

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  tableId: string;
  tableNumber: string;
  guestsCount: number;
  time: string;
  date: string;
  deposit: number;
  note: LText;
  status: 'confirmed' | 'seated' | 'cancelled';
}

// 2. Menu Directory (r_keeper 7 structure)
export interface MenuCategory {
  id: string;
  name: LText;
  sortOrder: number;
}

export interface ModifierOption {
  id: string;
  name: LText;
  priceDelta: number;
  active: boolean;
}

export interface ModifierGroup {
  id: string;
  name: LText;
  required: boolean;
  maxSelect: number;
  options: ModifierOption[];
}

export type PrintStationId = 'hot' | 'cold' | 'grill' | 'bar' | 'pastry';

export interface MenuDish {
  id: string;
  code: string;
  altCode: string;
  categoryId: string;
  name: LText;
  printName: LText;
  price: number;
  taxRate: number;
  stationId: PrintStationId;
  modifierGroupIds: string[];
  active: boolean;
  stopListed: boolean;
  remainingLimit?: number; // undefined = unlimited
  classification: LText;
}

export interface ComboSet {
  id: string;
  name: LText;
  dishIds: string[];
  price: number;
  active: boolean;
  description: LText;
}

export interface PriceSchedule {
  id: string;
  name: LText;
  type: LText;
  timeWindow: string;
  adjustmentLabel: string;
  active: boolean;
}

// 3. POS & Orders
export type CourseNumber = 1 | 2 | 3;

export interface OrderItem {
  id: string;
  dishId: string;
  name: LText;
  unitPrice: number;
  qty: number;
  guestSeat: number;
  course: CourseNumber;
  modifiers: { optionId: string; name: LText; priceDelta: number }[];
  note: string;
  sentToKitchen: boolean;
  stationId: PrintStationId;
}

export interface OrderTicket {
  id: string;
  orderNumber: string;
  type: 'dine_in' | 'fast_check';
  tableId?: string;
  tableNumber?: string;
  waiter: string;
  guestsCount: number;
  openedAt: string;
  precheckRequested: boolean;
  discountId?: string;
  items: OrderItem[];
}

export type PaymentMethod = 'cash' | 'card' | 'qr' | 'bonus';

export interface PaymentSplit {
  method: PaymentMethod;
  amount: number;
}

export interface ClosedCheck {
  id: string;
  checkNumber: string;
  orderNumber: string;
  tableLabel: LText;
  waiter: string;
  closedAt: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  payments: PaymentSplit[];
  itemsCount: number;
  refunded: boolean;
}

// 4. Kitchen (KDS & Service Print)
export type KitchenStatus = 'new' | 'cooking' | 'ready' | 'served';

export interface KitchenTicket {
  id: string;
  orderNumber: string;
  tableLabel: LText;
  stationId: PrintStationId;
  course: CourseNumber;
  createdAt: string;
  elapsedMin: number;
  status: KitchenStatus;
  waiter: string;
  items: {
    name: LText;
    qty: number;
    modifiers: LText[];
    note?: string;
  }[];
}

export interface PrintStation {
  id: PrintStationId;
  name: LText;
  printerName: string;
  backupPrinter: string;
  online: boolean;
  printedCount: number;
}

// 5. Delivery
export type DeliveryStatus = 'accepted' | 'cooking' | 'on_way' | 'delivered';

export interface DeliveryOrder {
  id: string;
  number: string;
  clientName: string;
  phone: string;
  address: string;
  zoneId: string;
  zoneName: LText;
  itemsSummary: LText;
  amount: number;
  deliveryFee: number;
  courierId?: string;
  courierName?: string;
  paymentType: 'cash' | 'card' | 'online';
  status: DeliveryStatus;
  eta: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  vehicle: LText;
  activeOrders: number;
  available: boolean;
}

export interface DeliveryZone {
  id: string;
  name: LText;
  minOrder: number;
  fee: number;
  avgEta: string;
  active: boolean;
}

// 6. Inventory & Tech Cards (StoreHouse integration)
export interface IngredientStock {
  id: string;
  code: string;
  name: LText;
  unit: LText;
  inStock: number;
  minStock: number;
  costPerUnit: number;
  warehouse: LText;
}

export interface TechCardIngredient {
  ingredientId: string;
  name: LText;
  grossQty: number;
  netQty: number;
  unit: LText;
  costPerUnit: number;
}

export interface TechCard {
  id: string;
  dishId: string;
  dishName: LText;
  outputWeight: string;
  sellingPrice: number;
  ingredients: TechCardIngredient[];
}

export type StockDocType = 'receipt' | 'writeoff' | 'transfer' | 'inventory';

export interface StockDocument {
  id: string;
  number: string;
  type: StockDocType;
  warehouse: LText;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: 'conducted' | 'draft';
  responsible: string;
}

// 7. Guests & Loyalty
export interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
  bonusBalance: number;
  visitsCount: number;
  avgCheck: number;
  favoriteDish: LText;
  lastVisit: string;
}

export interface DiscountRule {
  id: string;
  name: LText;
  kind: 'discount' | 'surcharge';
  percent: number;
  condition: LText;
  active: boolean;
}

export interface GuestReview {
  id: string;
  guestName: string;
  rating: number;
  tableOrSource: LText;
  comment: LText;
  date: string;
  handled: boolean;
}

// 8. Cash Shifts, OLAP & Staff
export interface CashShift {
  shiftNumber: number;
  status: 'open' | 'closed';
  openedAt: string;
  cashier: string;
  cashTotal: number;
  cardTotal: number;
  qrTotal: number;
  bonusTotal: number;
  checksCount: number;
  refundsTotal: number;
}

export interface CashDrawerOp {
  id: string;
  type: 'in' | 'out';
  amount: number;
  reason: LText;
  time: string;
  author: string;
}

export interface StaffPermissions {
  canVoidCheck: boolean;
  canApplyDiscount: boolean;
  canEditStopList: boolean;
  canCloseShift: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  initials: string;
  role: LText;
  pinCode: string;
  onShift: boolean;
  ordersServed: number;
  salesTotal: number;
  permissions: StaffPermissions;
}

export interface ToastMessage {
  id: string;
  text: string;
}

// 9. Comms (Shift Chat, Guest Inbox, Alerts)
export interface ShiftChatMessage {
  id: string;
  sender: string;
  initials: string;
  text: LText;
  time: string;
  isMine: boolean;
}

export interface ShiftChatChannel {
  id: string;
  name: LText;
  description: LText;
  unread: number;
  messages: ShiftChatMessage[];
}

export interface GuestInboxThread {
  id: string;
  guestName: string;
  phone: string;
  channel: 'WhatsApp' | 'Instagram' | 'Telegram';
  status: 'new' | 'replied' | 'converted';
  time: string;
  messages: ShiftChatMessage[];
}

export interface RestaurantAlert {
  id: string;
  source: LText;
  title: LText;
  time: string;
  read: boolean;
}

// 10. Suppliers
export interface SupplierItem {
  id: string;
  name: string;
  category: LText;
  contact: string;
  phone: string;
  deliveryDays: LText;
  leadTime: LText;
}

// 11. Marketing & Banquets
export interface GuestSegment {
  id: string;
  name: LText;
  criteria: LText;
  count: number;
}

export interface MarketingCampaign {
  id: string;
  name: LText;
  channel: 'WhatsApp' | 'SMS' | 'Telegram';
  segment: LText;
  sentCount: number;
  openRate: number;
  status: 'sent' | 'scheduled';
  date: string;
}

export type BanquetStage = 'inquiry' | 'menu_prep' | 'prepaid' | 'done';

export interface BanquetDeal {
  id: string;
  title: LText;
  clientName: string;
  phone: string;
  eventDate: string;
  guestsCount: number;
  amount: number;
  stage: BanquetStage;
  hall: LText;
}

// 12. Operations (Checklists, Tasks, Calendar, Automation, SOPs)
export interface ChecklistItem {
  id: string;
  zone: 'hall' | 'kitchen' | 'bar';
  title: LText;
  done: boolean;
  timeSlot: string;
}

export interface ShiftTask {
  id: string;
  title: LText;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  done: boolean;
}

export interface RestaurantEvent {
  id: string;
  day: number;
  time: string;
  title: LText;
  type: 'banquet' | 'music' | 'delivery' | 'meeting';
  note: LText;
}

export interface AutoRule {
  id: string;
  trigger: LText;
  action: LText;
  enabled: boolean;
}

export interface RestIntegration {
  id: string;
  name: string;
  category: LText;
  desc: LText;
  connected: boolean;
}

export interface SopArticle {
  id: string;
  title: LText;
  category: LText;
  author: string;
  updatedAt: string;
  content: LText;
}

// 13. Weekly Schedule & Absences
export type ShiftSlotType = 'morning' | 'evening' | 'off';

export interface StaffWeeklyShift {
  staffId: string;
  staffName: string;
  role: LText;
  days: ShiftSlotType[]; // 7 items: Mon..Sun
}

export interface StaffAbsence {
  id: string;
  staffName: string;
  type: 'vacation' | 'sick' | 'day_off';
  from: string;
  to: string;
  comment: LText;
}
