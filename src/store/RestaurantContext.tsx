import React, { createContext, useContext, useState } from 'react';
import {
  AutoRule,
  BanquetDeal,
  BanquetStage,
  CashDrawerOp,
  CashShift,
  ChecklistItem,
  ClosedCheck,
  ComboSet,
  Courier,
  CourseNumber,
  DeliveryOrder,
  DeliveryStatus,
  DeliveryZone,
  DiscountRule,
  GuestInboxThread,
  GuestProfile,
  GuestReview,
  GuestSegment,
  IngredientStock,
  KitchenTicket,
  Lang,
  LText,
  MarketingCampaign,
  MenuCategory,
  MenuDish,
  ModifierGroup,
  OrderItem,
  OrderTicket,
  PaymentSplit,
  PriceSchedule,
  PrintStation,
  PrintStationId,
  Reservation,
  RestaurantAlert,
  RestaurantEvent,
  RestaurantModuleId,
  RestaurantTable,
  RestIntegration,
  ShiftChatChannel,
  ShiftSlotType,
  ShiftTask,
  SopArticle,
  StaffAbsence,
  StaffMember,
  StaffPermissions,
  StaffWeeklyShift,
  StockDocument,
  SupplierItem,
  TechCard,
  ToastMessage,
} from '../types';
import {
  SEED_ALERTS,
  SEED_AUTO_RULES,
  SEED_BANQUETS,
  SEED_CAMPAIGNS,
  SEED_CASH_OPS,
  SEED_CATEGORIES,
  SEED_CHECKLISTS,
  SEED_CLOSED_CHECKS,
  SEED_COMBOS,
  SEED_COURIERS,
  SEED_DELIVERY_ORDERS,
  SEED_DELIVERY_ZONES,
  SEED_DISCOUNTS,
  SEED_DISHES,
  SEED_GUESTS,
  SEED_GUEST_INBOX,
  SEED_INGREDIENTS,
  SEED_KITCHEN_TICKETS,
  SEED_MODIFIER_GROUPS,
  SEED_ORDERS,
  SEED_PRICE_SCHEDULES,
  SEED_PRINT_STATIONS,
  SEED_RESERVATIONS,
  SEED_REST_EVENTS,
  SEED_REST_INTEGRATIONS,
  SEED_REVIEWS,
  SEED_SEGMENTS,
  SEED_SHIFT,
  SEED_SHIFT_CHATS,
  SEED_SHIFT_TASKS,
  SEED_SOPS,
  SEED_STAFF,
  SEED_STAFF_ABSENCES,
  SEED_STOCK_DOCS,
  SEED_SUPPLIERS,
  SEED_TABLES,
  SEED_TECHCARDS,
  SEED_WEEKLY_SHIFTS,
} from '../data/mockData';
import { RESTAURANT_MODULES } from '../i18n/translations';

interface RestaurantContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  activeModule: RestaurantModuleId;
  setActiveModule: (m: RestaurantModuleId, tabId?: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
  railCollapsed: boolean;
  setRailCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastMessage[];
  notify: (text: string) => void;

  // Floor & Reservations
  tables: RestaurantTable[];
  reservations: Reservation[];
  openTableOrder: (tableId: string) => void;
  createFastOrder: () => void;
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => void;
  seatReservation: (resId: string) => void;

  // POS & Orders
  orders: OrderTicket[];
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  closedChecks: ClosedCheck[];
  addDishToOrder: (
    orderId: string,
    dish: MenuDish,
    guestSeat: number,
    course: CourseNumber,
    modifiers: { optionId: string; name: LText; priceDelta: number }[],
    note: string
  ) => void;
  updateOrderItemQty: (orderId: string, itemId: string, delta: number) => void;
  removeOrderItem: (orderId: string, itemId: string) => void;
  moveOrderItemToGuest: (orderId: string, itemId: string, seat: number) => void;
  transferOrderToTable: (orderId: string, targetTableId: string) => void;
  applyOrderDiscount: (orderId: string, discountId: string | undefined) => void;
  requestPrecheck: (orderId: string) => void;
  sendOrderToKitchen: (orderId: string) => void;
  payAndCloseOrder: (orderId: string, payments: PaymentSplit[]) => void;
  voidClosedCheck: (checkId: string) => void;

  // Kitchen & Stop-list
  kitchenTickets: KitchenTicket[];
  printStations: PrintStation[];
  advanceKitchenTicket: (ticketId: string) => void;
  togglePrintStation: (stationId: PrintStationId) => void;

  // Menu Directory
  categories: MenuCategory[];
  modifierGroups: ModifierGroup[];
  dishes: MenuDish[];
  combos: ComboSet[];
  priceSchedules: PriceSchedule[];
  toggleDishStopList: (dishId: string) => void;
  setDishLimit: (dishId: string, limit: number | undefined) => void;
  toggleDishActive: (dishId: string) => void;
  addMenuDish: (dish: Omit<MenuDish, 'id'>) => void;
  addModifierOption: (groupId: string, name: string, priceDelta: number) => void;
  addComboSet: (name: string, dishIds: string[], price: number, desc: string) => void;
  togglePriceSchedule: (id: string) => void;

  // Delivery
  deliveryOrders: DeliveryOrder[];
  couriers: Courier[];
  deliveryZones: DeliveryZone[];
  addDeliveryOrder: (d: Omit<DeliveryOrder, 'id' | 'number' | 'status'>) => void;
  advanceDeliveryOrder: (id: string) => void;
  assignCourier: (orderId: string, courierId: string) => void;
  toggleCourierAvail: (courierId: string) => void;
  toggleDeliveryZone: (zoneId: string) => void;

  // Comms (Shift Chat, Guest Inbox, Alerts)
  shiftChats: ShiftChatChannel[];
  guestInbox: GuestInboxThread[];
  alerts: RestaurantAlert[];
  sendShiftChatMessage: (channelId: string, text: string) => void;
  replyGuestInbox: (threadId: string, text: string) => void;
  convertInboxToReservation: (threadId: string) => void;
  convertInboxToDelivery: (threadId: string) => void;
  markAlertRead: (id: string) => void;
  markAllAlertsRead: () => void;

  // Inventory, Tech Cards & Suppliers
  ingredients: IngredientStock[];
  techCards: TechCard[];
  stockDocs: StockDocument[];
  suppliers: SupplierItem[];
  addTechCardIngredient: (tcId: string, ingredientId: string, grossQty: number) => void;
  addStockDocument: (doc: Omit<StockDocument, 'id'>) => void;
  toggleStockDocStatus: (docId: string) => void;
  addSupplier: (s: Omit<SupplierItem, 'id'>) => void;
  orderFromSupplier: (supplierId: string) => void;

  // Guests, Marketing & Banquets
  guests: GuestProfile[];
  discounts: DiscountRule[];
  reviews: GuestReview[];
  guestSegments: GuestSegment[];
  marketingCampaigns: MarketingCampaign[];
  banquets: BanquetDeal[];
  addGuest: (g: Omit<GuestProfile, 'id'>) => void;
  addDiscountRule: (d: Omit<DiscountRule, 'id'>) => void;
  toggleDiscountRule: (id: string) => void;
  markReviewHandled: (id: string) => void;
  addGuestSegment: (s: Omit<GuestSegment, 'id'>) => void;
  addMarketingCampaign: (c: Omit<MarketingCampaign, 'id'>) => void;
  addBanquetDeal: (b: Omit<BanquetDeal, 'id'>) => void;
  moveBanquetStage: (id: string, stage: BanquetStage) => void;

  // Operations (Checklists, Tasks, Calendar, Automation, SOPs)
  checklists: ChecklistItem[];
  shiftTasks: ShiftTask[];
  restEvents: RestaurantEvent[];
  autoRules: AutoRule[];
  restIntegrations: RestIntegration[];
  sopArticles: SopArticle[];
  toggleChecklistItem: (id: string) => void;
  addShiftTask: (t: Omit<ShiftTask, 'id'>) => void;
  toggleShiftTask: (id: string) => void;
  addRestaurantEvent: (ev: Omit<RestaurantEvent, 'id'>) => void;
  toggleAutoRule: (id: string) => void;
  addAutoRule: (r: Omit<AutoRule, 'id'>) => void;
  toggleRestIntegration: (id: string) => void;
  addSopArticle: (a: Omit<SopArticle, 'id'>) => void;

  // Cash Shift, Staff & Weekly Schedule
  cashShift: CashShift;
  cashOps: CashDrawerOp[];
  staff: StaffMember[];
  weeklyShifts: StaffWeeklyShift[];
  staffAbsences: StaffAbsence[];
  addCashDrawerOp: (type: 'in' | 'out', amount: number, reason: string) => void;
  toggleCashShift: () => void;
  addStaffMember: (s: Omit<StaffMember, 'id'>) => void;
  toggleStaffOnShift: (id: string) => void;
  toggleStaffPermission: (id: string, key: keyof StaffPermissions) => void;
  cycleStaffShift: (staffId: string, dayIndex: number) => void;
  addStaffAbsence: (ab: Omit<StaffAbsence, 'id'>) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('ru');
  const [activeModule, setActiveModuleState] = useState<RestaurantModuleId>('floor');
  const [activeTab, setActiveTab] = useState<string>('main');
  const [railCollapsed, setRailCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [tables, setTables] = useState<RestaurantTable[]>(SEED_TABLES);
  const [reservations, setReservations] = useState<Reservation[]>(SEED_RESERVATIONS);
  const [orders, setOrders] = useState<OrderTicket[]>(SEED_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(SEED_ORDERS[0]?.id ?? '');
  const [closedChecks, setClosedChecks] = useState<ClosedCheck[]>(SEED_CLOSED_CHECKS);

  const [kitchenTickets, setKitchenTickets] = useState<KitchenTicket[]>(SEED_KITCHEN_TICKETS);
  const [printStations, setPrintStations] = useState<PrintStation[]>(SEED_PRINT_STATIONS);

  const [categories] = useState<MenuCategory[]>(SEED_CATEGORIES);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(SEED_MODIFIER_GROUPS);
  const [dishes, setDishes] = useState<MenuDish[]>(SEED_DISHES);
  const [combos, setCombos] = useState<ComboSet[]>(SEED_COMBOS);
  const [priceSchedules, setPriceSchedules] = useState<PriceSchedule[]>(SEED_PRICE_SCHEDULES);

  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(SEED_DELIVERY_ORDERS);
  const [couriers, setCouriers] = useState<Courier[]>(SEED_COURIERS);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(SEED_DELIVERY_ZONES);

  const [shiftChats, setShiftChats] = useState<ShiftChatChannel[]>(SEED_SHIFT_CHATS);
  const [guestInbox, setGuestInbox] = useState<GuestInboxThread[]>(SEED_GUEST_INBOX);
  const [alerts, setAlerts] = useState<RestaurantAlert[]>(SEED_ALERTS);

  const [ingredients] = useState<IngredientStock[]>(SEED_INGREDIENTS);
  const [techCards, setTechCards] = useState<TechCard[]>(SEED_TECHCARDS);
  const [stockDocs, setStockDocs] = useState<StockDocument[]>(SEED_STOCK_DOCS);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>(SEED_SUPPLIERS);

  const [guests, setGuests] = useState<GuestProfile[]>(SEED_GUESTS);
  const [discounts, setDiscounts] = useState<DiscountRule[]>(SEED_DISCOUNTS);
  const [reviews, setReviews] = useState<GuestReview[]>(SEED_REVIEWS);
  const [guestSegments, setGuestSegments] = useState<GuestSegment[]>(SEED_SEGMENTS);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(SEED_CAMPAIGNS);
  const [banquets, setBanquets] = useState<BanquetDeal[]>(SEED_BANQUETS);

  const [checklists, setChecklists] = useState<ChecklistItem[]>(SEED_CHECKLISTS);
  const [shiftTasks, setShiftTasks] = useState<ShiftTask[]>(SEED_SHIFT_TASKS);
  const [restEvents, setRestEvents] = useState<RestaurantEvent[]>(SEED_REST_EVENTS);
  const [autoRules, setAutoRules] = useState<AutoRule[]>(SEED_AUTO_RULES);
  const [restIntegrations, setRestIntegrations] = useState<RestIntegration[]>(SEED_REST_INTEGRATIONS);
  const [sopArticles, setSopArticles] = useState<SopArticle[]>(SEED_SOPS);

  const [cashShift, setCashShift] = useState<CashShift>(SEED_SHIFT);
  const [cashOps, setCashOps] = useState<CashDrawerOp[]>(SEED_CASH_OPS);
  const [staff, setStaff] = useState<StaffMember[]>(SEED_STAFF);
  const [weeklyShifts, setWeeklyShifts] = useState<StaffWeeklyShift[]>(SEED_WEEKLY_SHIFTS);
  const [staffAbsences, setStaffAbsences] = useState<StaffAbsence[]>(SEED_STAFF_ABSENCES);

  const notify = (text: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  };

  const setActiveModule = (m: RestaurantModuleId, tabId?: string) => {
    setActiveModuleState(m);
    const modDef = RESTAURANT_MODULES.find((x) => x.id === m);
    if (modDef) {
      setActiveTab(tabId ?? modDef.tabs[0].id);
    }
    setSearchQuery('');
  };

  // Floor & Orders
  const openTableOrder = (tableId: string) => {
    const tbl = tables.find((t) => t.id === tableId);
    if (!tbl) return;
    if (tbl.activeOrderId) {
      setSelectedOrderId(tbl.activeOrderId);
      setActiveModule('pos', 'terminal');
      return;
    }
    const newId = `ord-${Date.now()}`;
    const ordNum = `ЗК-${1044 + orders.length}`;
    const newOrder: OrderTicket = {
      id: newId,
      orderNumber: ordNum,
      type: 'dine_in',
      tableId: tbl.id,
      tableNumber: tbl.number,
      waiter: 'Айжан С.',
      guestsCount: tbl.seats,
      openedAt: nowHHMM(),
      precheckRequested: false,
      items: [],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId
          ? { ...t, status: 'occupied', waiter: 'Айжан С.', guestCount: tbl.seats, openedAt: newOrder.openedAt, activeOrderId: newId }
          : t
      )
    );
    setSelectedOrderId(newId);
    setActiveModule('pos', 'terminal');
  };

  const createFastOrder = () => {
    const newId = `ord-${Date.now()}`;
    const newOrder: OrderTicket = {
      id: newId,
      orderNumber: `ФЧ-${200 + orders.length + closedChecks.length}`,
      type: 'fast_check',
      waiter: 'Айжан С.',
      guestsCount: 1,
      openedAt: nowHHMM(),
      precheckRequested: false,
      items: [],
    };
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newId);
    setActiveModule('pos', 'terminal');
  };

  const addReservation = (res: Omit<Reservation, 'id' | 'status'>) => {
    setReservations((prev) => [{ ...res, id: `res-${Date.now()}`, status: 'confirmed' }, ...prev]);
    setTables((prev) =>
      prev.map((t) => (t.id === res.tableId && t.status === 'free' ? { ...t, status: 'reserved' } : t))
    );
  };

  const seatReservation = (resId: string) => {
    const r = reservations.find((x) => x.id === resId);
    if (!r) return;
    setReservations((prev) => prev.map((x) => (x.id === resId ? { ...x, status: 'seated' } : x)));
    openTableOrder(r.tableId);
  };

  const addDishToOrder = (
    orderId: string,
    dish: MenuDish,
    guestSeat: number,
    course: CourseNumber,
    modifiers: { optionId: string; name: LText; priceDelta: number }[],
    note: string
  ) => {
    const newItem: OrderItem = {
      id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      dishId: dish.id,
      name: dish.name,
      unitPrice: dish.price,
      qty: 1,
      guestSeat,
      course,
      modifiers,
      note,
      sentToKitchen: false,
      stationId: dish.stationId,
    };
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, items: [...o.items, newItem] } : o)));
    if (dish.remainingLimit !== undefined && dish.remainingLimit > 0) {
      setDishes((prev) =>
        prev.map((d) =>
          d.id === dish.id
            ? {
                ...d,
                remainingLimit: Math.max(0, (d.remainingLimit ?? 1) - 1),
                stopListed: Math.max(0, (d.remainingLimit ?? 1) - 1) === 0 ? true : d.stopListed,
              }
            : d
        )
      );
    }
  };

  const updateOrderItemQty = (orderId: string, itemId: string, delta: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          items: o.items
            .map((it) => (it.id === itemId ? { ...it, qty: it.qty + delta } : it))
            .filter((it) => it.qty > 0),
        };
      })
    );
  };

  const removeOrderItem = (orderId: string, itemId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, items: o.items.filter((i) => i.id !== itemId) } : o))
    );
  };

  const moveOrderItemToGuest = (orderId: string, itemId: string, seat: number) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, items: o.items.map((it) => (it.id === itemId ? { ...it, guestSeat: seat } : it)) }
          : o
      )
    );
  };

  const transferOrderToTable = (orderId: string, targetTableId: string) => {
    const order = orders.find((o) => o.id === orderId);
    const target = tables.find((t) => t.id === targetTableId);
    if (!order || !target || target.activeOrderId) return;
    const oldTableId = order.tableId;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, type: 'dine_in', tableId: target.id, tableNumber: target.number } : o
      )
    );
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === oldTableId) {
          return { ...t, status: 'free', waiter: undefined, guestCount: undefined, openedAt: undefined, activeOrderId: undefined };
        }
        if (t.id === targetTableId) {
          return {
            ...t,
            status: order.precheckRequested ? 'precheck' : 'occupied',
            waiter: order.waiter,
            guestCount: order.guestsCount,
            openedAt: order.openedAt,
            activeOrderId: order.id,
          };
        }
        return t;
      })
    );
  };

  const applyOrderDiscount = (orderId: string, discountId: string | undefined) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, discountId } : o)));
  };

  const requestPrecheck = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, precheckRequested: true } : o)));
    if (order.tableId) {
      setTables((prev) => prev.map((t) => (t.id === order.tableId ? { ...t, status: 'precheck' } : t)));
    }
  };

  const sendOrderToKitchen = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const unsent = order.items.filter((i) => !i.sentToKitchen);
    if (unsent.length === 0) return;

    const groups = new Map<string, OrderItem[]>();
    unsent.forEach((it) => {
      const key = `${it.stationId}__${it.course}`;
      const list = groups.get(key) ?? [];
      list.push(it);
      groups.set(key, list);
    });

    const newTickets: KitchenTicket[] = [];
    const stationIncrements: Record<string, number> = {};
    groups.forEach((items, key) => {
      const [stationId, courseStr] = key.split('__') as [PrintStationId, string];
      stationIncrements[stationId] = (stationIncrements[stationId] ?? 0) + 1;
      newTickets.push({
        id: `kt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        orderNumber: order.orderNumber,
        tableLabel: order.tableNumber
          ? { ru: `Стол ${order.tableNumber}`, ky: `Стол ${order.tableNumber}` }
          : { ru: 'Быстрый чек', ky: 'Тез чек' },
        stationId,
        course: Number(courseStr) as CourseNumber,
        createdAt: nowHHMM(),
        elapsedMin: 0,
        status: 'new',
        waiter: order.waiter,
        items: items.map((i) => ({
          name: i.name,
          qty: i.qty,
          modifiers: i.modifiers.map((m) => m.name),
          note: i.note || undefined,
        })),
      });
    });

    setKitchenTickets((prev) => [...newTickets, ...prev]);
    setPrintStations((prev) =>
      prev.map((ps) =>
        stationIncrements[ps.id] ? { ...ps, printedCount: ps.printedCount + stationIncrements[ps.id] } : ps
      )
    );
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, items: o.items.map((i) => ({ ...i, sentToKitchen: true })) } : o
      )
    );
  };

  const payAndCloseOrder = (orderId: string, payments: PaymentSplit[]) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    const subtotal = order.items.reduce(
      (sum, it) => sum + (it.unitPrice + it.modifiers.reduce((ms, m) => ms + m.priceDelta, 0)) * it.qty,
      0
    );
    const rule = discounts.find((d) => d.id === order.discountId);
    const discountAmount = rule
      ? Math.round((subtotal * rule.percent) / 100) * (rule.kind === 'discount' ? 1 : -1)
      : 0;
    const total = Math.max(0, subtotal - discountAmount);

    const newCheck: ClosedCheck = {
      id: `chk-${Date.now()}`,
      checkNumber: `Ч-${String(4219 + closedChecks.length).padStart(5, '0')}`,
      orderNumber: order.orderNumber,
      tableLabel: order.tableNumber
        ? { ru: `Стол ${order.tableNumber}`, ky: `Стол ${order.tableNumber}` }
        : { ru: 'Быстрый чек', ky: 'Тез чек' },
      waiter: order.waiter,
      closedAt: nowHHMM(),
      subtotal,
      discountAmount: Math.max(0, discountAmount),
      total,
      payments,
      itemsCount: order.items.reduce((a, b) => a + b.qty, 0),
      refunded: false,
    };

    setClosedChecks((prev) => [newCheck, ...prev]);
    const remainingOrders = orders.filter((o) => o.id !== orderId);
    setOrders(remainingOrders);
    setSelectedOrderId(remainingOrders[0]?.id ?? '');

    if (order.tableId) {
      setTables((prev) =>
        prev.map((t) =>
          t.id === order.tableId
            ? { ...t, status: 'free', waiter: undefined, guestCount: undefined, openedAt: undefined, activeOrderId: undefined }
            : t
        )
      );
    }

    setCashShift((prev) => {
      let cash = prev.cashTotal;
      let card = prev.cardTotal;
      let qr = prev.qrTotal;
      let bonus = prev.bonusTotal;
      payments.forEach((p) => {
        if (p.method === 'cash') cash += p.amount;
        if (p.method === 'card') card += p.amount;
        if (p.method === 'qr') qr += p.amount;
        if (p.method === 'bonus') bonus += p.amount;
      });
      return { ...prev, cashTotal: cash, cardTotal: card, qrTotal: qr, bonusTotal: bonus, checksCount: prev.checksCount + 1 };
    });
  };

  const voidClosedCheck = (checkId: string) => {
    const chk = closedChecks.find((c) => c.id === checkId);
    if (!chk || chk.refunded) return;
    setClosedChecks((prev) => prev.map((c) => (c.id === checkId ? { ...c, refunded: true } : c)));
    setCashShift((prev) => ({ ...prev, refundsTotal: prev.refundsTotal + chk.total }));
  };

  // Kitchen
  const advanceKitchenTicket = (ticketId: string) => {
    const flow = ['new', 'cooking', 'ready', 'served'] as const;
    setKitchenTickets((prev) =>
      prev.map((kt) => {
        if (kt.id !== ticketId) return kt;
        const idx = flow.indexOf(kt.status);
        return idx < flow.length - 1 ? { ...kt, status: flow[idx + 1] } : kt;
      })
    );
  };

  const togglePrintStation = (stationId: PrintStationId) => {
    setPrintStations((prev) => prev.map((s) => (s.id === stationId ? { ...s, online: !s.online } : s)));
  };

  // Menu Directory
  const toggleDishStopList = (dishId: string) => {
    setDishes((prev) => prev.map((d) => (d.id === dishId ? { ...d, stopListed: !d.stopListed } : d)));
  };

  const setDishLimit = (dishId: string, limit: number | undefined) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, remainingLimit: limit, stopListed: limit === 0 } : d))
    );
  };

  const toggleDishActive = (dishId: string) => {
    setDishes((prev) => prev.map((d) => (d.id === dishId ? { ...d, active: !d.active } : d)));
  };

  const addMenuDish = (dish: Omit<MenuDish, 'id'>) => {
    setDishes((prev) => [{ ...dish, id: `d-${Date.now()}` }, ...prev]);
  };

  const addModifierOption = (groupId: string, name: string, priceDelta: number) => {
    setModifierGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, options: [...g.options, { id: `mo-${Date.now()}`, name, priceDelta, active: true }] }
          : g
      )
    );
  };

  const addComboSet = (name: string, dishIds: string[], price: number, desc: string) => {
    setCombos((prev) => [{ id: `cmb-${Date.now()}`, name, dishIds, price, active: true, description: desc }, ...prev]);
  };

  const togglePriceSchedule = (id: string) => {
    setPriceSchedules((prev) => prev.map((ps) => (ps.id === id ? { ...ps, active: !ps.active } : ps)));
  };

  // Delivery
  const addDeliveryOrder = (d: Omit<DeliveryOrder, 'id' | 'number' | 'status'>) => {
    setDeliveryOrders((prev) => [
      { ...d, id: `dlv-${Date.now()}`, number: `ДЛ-${512 + prev.length}`, status: 'accepted' },
      ...prev,
    ]);
  };

  const advanceDeliveryOrder = (id: string) => {
    const seq: DeliveryStatus[] = ['accepted', 'cooking', 'on_way', 'delivered'];
    setDeliveryOrders((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const idx = seq.indexOf(d.status);
        return idx < seq.length - 1 ? { ...d, status: seq[idx + 1] } : d;
      })
    );
  };

  const assignCourier = (orderId: string, courierId: string) => {
    const cur = couriers.find((c) => c.id === courierId);
    if (!cur) return;
    setDeliveryOrders((prev) =>
      prev.map((d) => (d.id === orderId ? { ...d, courierId: cur.id, courierName: cur.name } : d))
    );
  };

  const toggleCourierAvail = (courierId: string) => {
    setCouriers((prev) => prev.map((c) => (c.id === courierId ? { ...c, available: !c.available } : c)));
  };

  const toggleDeliveryZone = (zoneId: string) => {
    setDeliveryZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, active: !z.active } : z)));
  };

  // Comms
  const sendShiftChatMessage = (channelId: string, text: string) => {
    const t = nowHHMM();
    setShiftChats((prev) =>
      prev.map((ch) =>
        ch.id === channelId
          ? {
              ...ch,
              unread: 0,
              messages: [
                ...ch.messages,
                { id: `scm-${Date.now()}`, sender: 'Айжан Садыкова', initials: 'АС', text, time: t, isMine: true },
              ],
            }
          : ch
      )
    );
  };

  const replyGuestInbox = (threadId: string, text: string) => {
    const t = nowHHMM();
    setGuestInbox((prev) =>
      prev.map((th) =>
        th.id === threadId
          ? {
              ...th,
              status: th.status === 'converted' ? 'converted' : 'replied',
              time: t,
              messages: [
                ...th.messages,
                { id: `gim-${Date.now()}`, sender: 'Айжан Садыкова', initials: 'АС', text, time: t, isMine: true },
              ],
            }
          : th
      )
    );
  };

  const convertInboxToReservation = (threadId: string) => {
    const th = guestInbox.find((x) => x.id === threadId);
    if (!th) return;
    const freeTbl = tables.find((t) => t.status === 'free') ?? tables[0];
    addReservation({
      guestName: th.guestName,
      phone: th.phone,
      tableId: freeTbl.id,
      tableNumber: freeTbl.number,
      guestsCount: freeTbl.seats,
      time: '19:30',
      date: '20.11.2026',
      deposit: 0,
      note: { ru: `Бронь из ${th.channel}`, ky: `${th.channel}тан бронь` },
    });
    setGuestInbox((prev) => prev.map((x) => (x.id === threadId ? { ...x, status: 'converted' } : x)));
  };

  const convertInboxToDelivery = (threadId: string) => {
    const th = guestInbox.find((x) => x.id === threadId);
    if (!th) return;
    const zone = deliveryZones[0];
    addDeliveryOrder({
      clientName: th.guestName,
      phone: th.phone,
      address: 'ул. Киевская, 114 (уточнить)',
      zoneId: zone.id,
      zoneName: zone.name,
      itemsSummary: th.messages[0]?.text ?? { ru: 'Заказ из переписки', ky: 'Катташуудан буйрутма' },
      amount: 1800,
      deliveryFee: zone.fee,
      paymentType: 'cash',
      eta: '15:55',
    });
    setGuestInbox((prev) => prev.map((x) => (x.id === threadId ? { ...x, status: 'converted' } : x)));
  };

  const markAlertRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const markAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  // Inventory, Tech Cards & Suppliers
  const addTechCardIngredient = (tcId: string, ingredientId: string, grossQty: number) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    if (!ing) return;
    setTechCards((prev) =>
      prev.map((tc) =>
        tc.id === tcId
          ? {
              ...tc,
              ingredients: [
                ...tc.ingredients,
                {
                  ingredientId: ing.id,
                  name: ing.name,
                  grossQty,
                  netQty: Number((grossQty * 0.9).toFixed(3)),
                  unit: ing.unit,
                  costPerUnit: ing.costPerUnit,
                },
              ],
            }
          : tc
      )
    );
  };

  const addStockDocument = (doc: Omit<StockDocument, 'id'>) => {
    setStockDocs((prev) => [{ ...doc, id: `sd-${Date.now()}` }, ...prev]);
  };

  const toggleStockDocStatus = (docId: string) => {
    setStockDocs((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: d.status === 'conducted' ? 'draft' : 'conducted' } : d))
    );
  };

  const addSupplier = (s: Omit<SupplierItem, 'id'>) => {
    setSuppliers((prev) => [...prev, { ...s, id: `sup-${Date.now()}` }]);
  };

  const orderFromSupplier = (supplierId: string) => {
    const sup = suppliers.find((s) => s.id === supplierId);
    if (!sup) return;
    addStockDocument({
      number: `ЗКП-${String(10 + stockDocs.length).padStart(4, '0')}`,
      type: 'receipt',
      warehouse: { ru: `Поставка: ${sup.name}`, ky: `Жеткирүү: ${sup.name}` },
      date: '20.11.2026',
      itemsCount: 5,
      totalAmount: 18500,
      status: 'draft',
      responsible: 'Марат Э.',
    });
  };

  // Guests, Marketing & Banquets
  const addGuest = (g: Omit<GuestProfile, 'id'>) => {
    setGuests((prev) => [{ ...g, id: `g-${Date.now()}` }, ...prev]);
  };

  const addDiscountRule = (d: Omit<DiscountRule, 'id'>) => {
    setDiscounts((prev) => [{ ...d, id: `disc-${Date.now()}` }, ...prev]);
  };

  const toggleDiscountRule = (id: string) => {
    setDiscounts((prev) => prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d)));
  };

  const markReviewHandled = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, handled: true } : r)));
  };

  const addGuestSegment = (s: Omit<GuestSegment, 'id'>) => {
    setGuestSegments((prev) => [...prev, { ...s, id: `gs-${Date.now()}` }]);
  };

  const addMarketingCampaign = (c: Omit<MarketingCampaign, 'id'>) => {
    setMarketingCampaigns((prev) => [{ ...c, id: `mc-${Date.now()}` }, ...prev]);
  };

  const addBanquetDeal = (b: Omit<BanquetDeal, 'id'>) => {
    setBanquets((prev) => [{ ...b, id: `bq-${Date.now()}` }, ...prev]);
  };

  const moveBanquetStage = (id: string, stage: BanquetStage) => {
    setBanquets((prev) => prev.map((b) => (b.id === id ? { ...b, stage } : b)));
  };

  // Operations
  const toggleChecklistItem = (id: string) => {
    setChecklists((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  };

  const addShiftTask = (t: Omit<ShiftTask, 'id'>) => {
    setShiftTasks((prev) => [{ ...t, id: `stask-${Date.now()}` }, ...prev]);
  };

  const toggleShiftTask = (id: string) => {
    setShiftTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const addRestaurantEvent = (ev: Omit<RestaurantEvent, 'id'>) => {
    setRestEvents((prev) => [...prev, { ...ev, id: `re-${Date.now()}` }]);
  };

  const toggleAutoRule = (id: string) => {
    setAutoRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const addAutoRule = (r: Omit<AutoRule, 'id'>) => {
    setAutoRules((prev) => [...prev, { ...r, id: `ar-${Date.now()}` }]);
  };

  const toggleRestIntegration = (id: string) => {
    setRestIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)));
  };

  const addSopArticle = (a: Omit<SopArticle, 'id'>) => {
    setSopArticles((prev) => [{ ...a, id: `sop-${Date.now()}` }, ...prev]);
  };

  // Shift, Staff & Weekly Schedule
  const addCashDrawerOp = (type: 'in' | 'out', amount: number, reason: string) => {
    setCashOps((prev) => [
      { id: `co-${Date.now()}`, type, amount, reason, time: nowHHMM(), author: 'Айжан С.' },
      ...prev,
    ]);
  };

  const toggleCashShift = () => {
    setCashShift((prev) =>
      prev.status === 'open'
        ? { ...prev, status: 'closed' }
        : {
            shiftNumber: prev.shiftNumber + 1,
            status: 'open',
            openedAt: nowHHMM(),
            cashier: 'Айжан Садыкова',
            cashTotal: 0,
            cardTotal: 0,
            qrTotal: 0,
            bonusTotal: 0,
            checksCount: 0,
            refundsTotal: 0,
          }
    );
  };

  const addStaffMember = (s: Omit<StaffMember, 'id'>) => {
    const id = `st-${Date.now()}`;
    setStaff((prev) => [...prev, { ...s, id }]);
    setWeeklyShifts((prev) => [
      ...prev,
      { staffId: id, staffName: s.name, role: s.role, days: ['morning', 'morning', 'morning', 'morning', 'morning', 'off', 'off'] },
    ]);
  };

  const toggleStaffOnShift = (id: string) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, onShift: !s.onShift } : s)));
  };

  const toggleStaffPermission = (id: string, key: keyof StaffPermissions) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, permissions: { ...s.permissions, [key]: !s.permissions[key] } } : s))
    );
  };

  const cycleStaffShift = (staffId: string, dayIndex: number) => {
    const order: ShiftSlotType[] = ['morning', 'evening', 'off'];
    setWeeklyShifts((prev) =>
      prev.map((ws) => {
        if (ws.staffId !== staffId) return ws;
        const nextDays = [...ws.days];
        const curIdx = order.indexOf(nextDays[dayIndex]);
        nextDays[dayIndex] = order[(curIdx + 1) % order.length];
        return { ...ws, days: nextDays };
      })
    );
  };

  const addStaffAbsence = (ab: Omit<StaffAbsence, 'id'>) => {
    setStaffAbsences((prev) => [{ ...ab, id: `sa-${Date.now()}` }, ...prev]);
  };

  return (
    <RestaurantContext.Provider
      value={{
        lang,
        setLang,
        activeModule,
        setActiveModule,
        activeTab,
        setActiveTab,
        railCollapsed,
        setRailCollapsed,
        searchQuery,
        setSearchQuery,
        toasts,
        notify,
        tables,
        reservations,
        openTableOrder,
        createFastOrder,
        addReservation,
        seatReservation,
        orders,
        selectedOrderId,
        setSelectedOrderId,
        closedChecks,
        addDishToOrder,
        updateOrderItemQty,
        removeOrderItem,
        moveOrderItemToGuest,
        transferOrderToTable,
        applyOrderDiscount,
        requestPrecheck,
        sendOrderToKitchen,
        payAndCloseOrder,
        voidClosedCheck,
        kitchenTickets,
        printStations,
        advanceKitchenTicket,
        togglePrintStation,
        categories,
        modifierGroups,
        dishes,
        combos,
        priceSchedules,
        toggleDishStopList,
        setDishLimit,
        toggleDishActive,
        addMenuDish,
        addModifierOption,
        addComboSet,
        togglePriceSchedule,
        deliveryOrders,
        couriers,
        deliveryZones,
        addDeliveryOrder,
        advanceDeliveryOrder,
        assignCourier,
        toggleCourierAvail,
        toggleDeliveryZone,
        shiftChats,
        guestInbox,
        alerts,
        sendShiftChatMessage,
        replyGuestInbox,
        convertInboxToReservation,
        convertInboxToDelivery,
        markAlertRead,
        markAllAlertsRead,
        ingredients,
        techCards,
        stockDocs,
        suppliers,
        addTechCardIngredient,
        addStockDocument,
        toggleStockDocStatus,
        addSupplier,
        orderFromSupplier,
        guests,
        discounts,
        reviews,
        guestSegments,
        marketingCampaigns,
        banquets,
        addGuest,
        addDiscountRule,
        toggleDiscountRule,
        markReviewHandled,
        addGuestSegment,
        addMarketingCampaign,
        addBanquetDeal,
        moveBanquetStage,
        checklists,
        shiftTasks,
        restEvents,
        autoRules,
        restIntegrations,
        sopArticles,
        toggleChecklistItem,
        addShiftTask,
        toggleShiftTask,
        addRestaurantEvent,
        toggleAutoRule,
        addAutoRule,
        toggleRestIntegration,
        addSopArticle,
        cashShift,
        cashOps,
        staff,
        weeklyShifts,
        staffAbsences,
        addCashDrawerOp,
        toggleCashShift,
        addStaffMember,
        toggleStaffOnShift,
        toggleStaffPermission,
        cycleStaffShift,
        addStaffAbsence,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export function useRestaurant(): RestaurantContextType {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used inside RestaurantProvider');
  return ctx;
}
