import React, { createContext, useContext, useState } from 'react';
import {
  AbsenceRecord,
  AdChannelStat,
  AudienceSegment,
  AutomationLog,
  BookingRecord,
  BookingResource,
  BookingService,
  CalendarEvent,
  CallRecord,
  CampaignItem,
  ChannelItem,
  ChatThread,
  CollabRoom,
  CompanyItem,
  ContactItem,
  DealItem,
  DealStage,
  EmployeeItem,
  IntegrationItem,
  InvoiceItem,
  KnowledgeArticle,
  Lang,
  LeadItem,
  MarketingTemplate,
  MeetingRoom,
  ModuleId,
  NotificationItem,
  OpenLineThread,
  OpenSlotDay,
  OrgDepartment,
  ProductItem,
  ProjectItem,
  RobotRule,
  SmartProcessItem,
  StockBalanceItem,
  TaskFlow,
  TaskItem,
  TaskStage,
  ToastMessage,
  TriggerRule,
  WaitlistEntry,
  WarehouseDoc,
  WarehouseLocation,
  WorkflowItem,
} from '../types';
import {
  SEED_ABSENCES,
  SEED_ADS,
  SEED_BALANCES,
  SEED_BOOKINGS,
  SEED_CALLS,
  SEED_CAMPAIGNS,
  SEED_CHANNELS,
  SEED_CHATS,
  SEED_COLLABS,
  SEED_COMPANIES,
  SEED_CONTACTS,
  SEED_DEALS,
  SEED_DEPARTMENTS,
  SEED_EMPLOYEES,
  SEED_EVENTS,
  SEED_FLOWS,
  SEED_INTEGRATIONS,
  SEED_INVOICES,
  SEED_KB,
  SEED_LEADS,
  SEED_LOGS,
  SEED_NOTIFICATIONS,
  SEED_OPENLINES,
  SEED_OPEN_SLOTS,
  SEED_PRODUCTS,
  SEED_PROJECTS,
  SEED_RESOURCES,
  SEED_ROBOTS,
  SEED_ROOMS,
  SEED_SEGMENTS,
  SEED_SERVICES,
  SEED_SMART_ITEMS,
  SEED_TASKS,
  SEED_TEMPLATES,
  SEED_TRIGGERS,
  SEED_WAITLIST,
  SEED_WAREHOUSES,
  SEED_WAREHOUSE_DOCS,
  SEED_WORKFLOWS,
} from '../data/mockData';
import { MODULES } from '../i18n/translations';

interface AppDataContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  activeModule: ModuleId;
  setActiveModule: (m: ModuleId, tabId?: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toasts: ToastMessage[];
  notify: (text: string) => void;

  // Messenger
  chats: ChatThread[];
  addChatMessage: (chatId: string, text: string) => void;
  addNewChat: (name: string, role: string) => string;
  channels: ChannelItem[];
  addChannelPost: (channelId: string, title: string, body: string) => void;
  collabs: CollabRoom[];
  addCollabMessage: (collabId: string, text: string) => void;
  calls: CallRecord[];
  addCallLog: (contact: string, direction: CallRecord['direction'], note: string) => void;
  openLines: OpenLineThread[];
  replyOpenLine: (threadId: string, text: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Calendar
  events: CalendarEvent[];
  addCalendarEvent: (ev: Omit<CalendarEvent, 'id'>) => void;
  openSlotDays: OpenSlotDay[];
  toggleOpenSlot: (dayId: string, time: string) => void;
  rooms: MeetingRoom[];
  addRoomBooking: (roomId: string, day: string, time: string, title: string, owner: string) => void;

  // Tasks
  tasks: TaskItem[];
  addTask: (t: Omit<TaskItem, 'id'>) => void;
  toggleTaskDone: (id: string) => void;
  moveTaskStage: (id: string, stage: TaskStage) => void;
  projects: ProjectItem[];
  addProject: (name: string, lead: string, deadline: string) => void;
  flows: TaskFlow[];
  toggleFlowActive: (id: string) => void;

  // CRM
  deals: DealItem[];
  addDeal: (d: Omit<DealItem, 'id'>) => void;
  moveDealStage: (id: string, stage: DealStage) => void;
  leads: LeadItem[];
  addLead: (l: Omit<LeadItem, 'id'>) => void;
  convertLeadToDeal: (leadId: string) => void;
  contacts: ContactItem[];
  addContact: (c: Omit<ContactItem, 'id'>) => void;
  companies: CompanyItem[];
  addCompany: (c: Omit<CompanyItem, 'id'>) => void;
  products: ProductItem[];
  addProduct: (p: Omit<ProductItem, 'id'>) => void;
  invoices: InvoiceItem[];
  addInvoice: (inv: Omit<InvoiceItem, 'id'>) => void;
  toggleInvoiceStatus: (id: string) => void;
  smartItems: SmartProcessItem[];
  addSmartItem: (item: Omit<SmartProcessItem, 'id'>) => void;

  // Booking
  bookings: BookingRecord[];
  addBooking: (b: Omit<BookingRecord, 'id'>) => void;
  resources: BookingResource[];
  toggleResourceActive: (id: string) => void;
  services: BookingService[];
  addService: (s: Omit<BookingService, 'id'>) => void;
  waitlist: WaitlistEntry[];
  promoteWaitlist: (id: string) => void;

  // Warehouse
  warehouseDocs: WarehouseDoc[];
  addWarehouseDoc: (doc: Omit<WarehouseDoc, 'id'>) => void;
  toggleDocStatus: (id: string) => void;
  warehouses: WarehouseLocation[];
  addWarehouse: (wh: Omit<WarehouseLocation, 'id'>) => void;
  balances: StockBalanceItem[];

  // Marketing
  campaigns: CampaignItem[];
  addCampaign: (c: Omit<CampaignItem, 'id'>) => void;
  segments: AudienceSegment[];
  addSegment: (s: Omit<AudienceSegment, 'id'>) => void;
  ads: AdChannelStat[];
  toggleAdActive: (id: string) => void;
  templates: MarketingTemplate[];

  // Automation
  robots: RobotRule[];
  addRobot: (r: Omit<RobotRule, 'id'>) => void;
  toggleRobot: (id: string) => void;
  workflows: WorkflowItem[];
  runWorkflow: (id: string) => void;
  triggers: TriggerRule[];
  toggleTrigger: (id: string) => void;
  automationLogs: AutomationLog[];
  integrations: IntegrationItem[];
  toggleIntegration: (id: string) => void;

  // Employees
  employees: EmployeeItem[];
  addEmployee: (emp: Omit<EmployeeItem, 'id'>) => void;
  departments: OrgDepartment[];
  workdayActive: boolean;
  workdayStart: string;
  toggleWorkday: () => void;
  absences: AbsenceRecord[];
  addAbsence: (ab: Omit<AbsenceRecord, 'id'>) => void;
  kbArticles: KnowledgeArticle[];
}

const AppDataContext = createContext<AppDataContextType | null>(null);

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('ru');
  const [activeModule, setActiveModuleState] = useState<ModuleId>('crm');
  const [activeTab, setActiveTab] = useState<string>('deals');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Module datasets
  const [chats, setChats] = useState<ChatThread[]>(SEED_CHATS);
  const [channels, setChannels] = useState<ChannelItem[]>(SEED_CHANNELS);
  const [collabs, setCollabs] = useState<CollabRoom[]>(SEED_COLLABS);
  const [calls, setCalls] = useState<CallRecord[]>(SEED_CALLS);
  const [openLines, setOpenLines] = useState<OpenLineThread[]>(SEED_OPENLINES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);

  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);
  const [openSlotDays, setOpenSlotDays] = useState<OpenSlotDay[]>(SEED_OPEN_SLOTS);
  const [rooms, setRooms] = useState<MeetingRoom[]>(SEED_ROOMS);

  const [tasks, setTasks] = useState<TaskItem[]>(SEED_TASKS);
  const [projects, setProjects] = useState<ProjectItem[]>(SEED_PROJECTS);
  const [flows, setFlows] = useState<TaskFlow[]>(SEED_FLOWS);

  const [deals, setDeals] = useState<DealItem[]>(SEED_DEALS);
  const [leads, setLeads] = useState<LeadItem[]>(SEED_LEADS);
  const [contacts, setContacts] = useState<ContactItem[]>(SEED_CONTACTS);
  const [companies, setCompanies] = useState<CompanyItem[]>(SEED_COMPANIES);
  const [products, setProducts] = useState<ProductItem[]>(SEED_PRODUCTS);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(SEED_INVOICES);
  const [smartItems, setSmartItems] = useState<SmartProcessItem[]>(SEED_SMART_ITEMS);

  const [bookings, setBookings] = useState<BookingRecord[]>(SEED_BOOKINGS);
  const [resources, setResources] = useState<BookingResource[]>(SEED_RESOURCES);
  const [services, setServices] = useState<BookingService[]>(SEED_SERVICES);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(SEED_WAITLIST);

  const [warehouseDocs, setWarehouseDocs] = useState<WarehouseDoc[]>(SEED_WAREHOUSE_DOCS);
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>(SEED_WAREHOUSES);
  const [balances] = useState<StockBalanceItem[]>(SEED_BALANCES);

  const [campaigns, setCampaigns] = useState<CampaignItem[]>(SEED_CAMPAIGNS);
  const [segments, setSegments] = useState<AudienceSegment[]>(SEED_SEGMENTS);
  const [ads, setAds] = useState<AdChannelStat[]>(SEED_ADS);
  const [templates] = useState<MarketingTemplate[]>(SEED_TEMPLATES);

  const [robots, setRobots] = useState<RobotRule[]>(SEED_ROBOTS);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(SEED_WORKFLOWS);
  const [triggers, setTriggers] = useState<TriggerRule[]>(SEED_TRIGGERS);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(SEED_LOGS);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(SEED_INTEGRATIONS);

  const [employees, setEmployees] = useState<EmployeeItem[]>(SEED_EMPLOYEES);
  const [departments] = useState<OrgDepartment[]>(SEED_DEPARTMENTS);
  const [workdayActive, setWorkdayActive] = useState<boolean>(true);
  const [workdayStart, setWorkdayStart] = useState<string>('09:05');
  const [absences, setAbsences] = useState<AbsenceRecord[]>(SEED_ABSENCES);
  const [kbArticles] = useState<KnowledgeArticle[]>(SEED_KB);

  const notify = (text: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const setActiveModule = (m: ModuleId, tabId?: string) => {
    setActiveModuleState(m);
    const modDef = MODULES.find((x) => x.id === m);
    if (modDef) {
      setActiveTab(tabId ?? modDef.tabs[0].id);
    }
    setSearchQuery('');
  };

  // Messenger mutations
  const addChatMessage = (chatId: string, text: string) => {
    const time = nowHHMM();
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              unread: 0,
              lastTime: time,
              messages: [
                ...c.messages,
                { id: `msg-${Date.now()}`, sender: 'Азамат Беков', initials: 'АБ', text, time, isMine: true },
              ],
            }
          : c
      )
    );
  };

  const addNewChat = (name: string, role: string) => {
    const id = `ch-${Date.now()}`;
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join('');
    setChats((prev) => [
      {
        id,
        name,
        role: role || { ru: 'Сотрудник', ky: 'Кызматкер' },
        initials: initials || 'НЧ',
        online: true,
        unread: 0,
        lastTime: nowHHMM(),
        messages: [],
      },
      ...prev,
    ]);
    return id;
  };

  const addChannelPost = (channelId: string, title: string, body: string) => {
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === channelId
          ? {
              ...ch,
              posts: [{ id: `post-${Date.now()}`, author: 'Азамат Беков', time: nowHHMM(), title, body }, ...ch.posts],
            }
          : ch
      )
    );
  };

  const addCollabMessage = (collabId: string, text: string) => {
    setCollabs((prev) =>
      prev.map((col) =>
        col.id === collabId
          ? {
              ...col,
              messages: [
                ...col.messages,
                { id: `cm-${Date.now()}`, sender: 'Азамат Беков', initials: 'АБ', text, time: nowHHMM(), isMine: true },
              ],
            }
          : col
      )
    );
  };

  const addCallLog = (contact: string, direction: CallRecord['direction'], note: string) => {
    setCalls((prev) => [
      { id: `call-${Date.now()}`, contact, direction, duration: direction === 'missed' ? '00:00' : '01:24', time: nowHHMM(), note },
      ...prev,
    ]);
  };

  const replyOpenLine = (threadId: string, text: string) => {
    setOpenLines((prev) =>
      prev.map((ol) =>
        ol.id === threadId
          ? {
              ...ol,
              status: 'active',
              messages: [
                ...ol.messages,
                { id: `olm-${Date.now()}`, sender: 'Азамат Беков', initials: 'АБ', text, time: nowHHMM(), isMine: true },
              ],
            }
          : ol
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Calendar mutations
  const addCalendarEvent = (ev: Omit<CalendarEvent, 'id'>) => {
    setEvents((prev) => [...prev, { ...ev, id: `ev-${Date.now()}` }]);
  };

  const toggleOpenSlot = (dayId: string, time: string) => {
    setOpenSlotDays((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, slots: d.slots.map((s) => (s.time === time ? { ...s, enabled: !s.enabled } : s)) }
          : d
      )
    );
  };

  const addRoomBooking = (roomId: string, day: string, time: string, title: string, owner: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, bookings: [...r.bookings, { id: `rb-${Date.now()}`, day, time, title, owner }] } : r
      )
    );
  };

  // Tasks mutations
  const addTask = (t: Omit<TaskItem, 'id'>) => {
    setTasks((prev) => [{ ...t, id: `t-${Date.now()}` }, ...prev]);
  };

  const toggleTaskDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, stage: t.stage === 'done' ? 'in_progress' : 'done' } : t))
    );
  };

  const moveTaskStage = (id: string, stage: TaskStage) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, stage } : t)));
  };

  const addProject = (name: string, lead: string, deadline: string) => {
    setProjects((prev) => [
      {
        id: `pr-${Date.now()}`,
        name,
        lead,
        membersCount: 4,
        openTasks: 1,
        completedTasks: 0,
        deadline,
        status: { ru: 'Активен', ky: 'Активдүү' },
      },
      ...prev,
    ]);
  };

  const toggleFlowActive = (id: string) => {
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  // CRM mutations
  const addDeal = (d: Omit<DealItem, 'id'>) => {
    setDeals((prev) => [{ ...d, id: `d-${Date.now()}` }, ...prev]);
  };

  const moveDealStage = (id: string, stage: DealStage) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  };

  const addLead = (l: Omit<LeadItem, 'id'>) => {
    setLeads((prev) => [{ ...l, id: `l-${Date.now()}` }, ...prev]);
  };

  const convertLeadToDeal = (leadId: string) => {
    const target = leads.find((l) => l.id === leadId);
    if (!target || target.status === 'converted') return;
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: 'converted' } : l)));
    addDeal({
      title: target.title,
      client: target.name,
      company: target.name,
      amount: target.amount,
      stage: 'new',
      responsible: target.responsible,
      date: '20.11.2026',
    });
  };

  const addContact = (c: Omit<ContactItem, 'id'>) => {
    setContacts((prev) => [{ ...c, id: `ct-${Date.now()}` }, ...prev]);
  };

  const addCompany = (c: Omit<CompanyItem, 'id'>) => {
    setCompanies((prev) => [{ ...c, id: `cp-${Date.now()}` }, ...prev]);
  };

  const addProduct = (p: Omit<ProductItem, 'id'>) => {
    setProducts((prev) => [{ ...p, id: `pd-${Date.now()}` }, ...prev]);
  };

  const addInvoice = (inv: Omit<InvoiceItem, 'id'>) => {
    setInvoices((prev) => [{ ...inv, id: `inv-${Date.now()}` }, ...prev]);
  };

  const toggleInvoiceStatus = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: inv.status === 'paid' ? 'pending' : 'paid' } : inv))
    );
  };

  const addSmartItem = (item: Omit<SmartProcessItem, 'id'>) => {
    setSmartItems((prev) => [{ ...item, id: `sp-${Date.now()}` }, ...prev]);
  };

  // Booking mutations
  const addBooking = (b: Omit<BookingRecord, 'id'>) => {
    setBookings((prev) => [{ ...b, id: `bk-${Date.now()}` }, ...prev]);
  };

  const toggleResourceActive = (id: string) => {
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const addService = (s: Omit<BookingService, 'id'>) => {
    setServices((prev) => [{ ...s, id: `srv-${Date.now()}` }, ...prev]);
  };

  const promoteWaitlist = (id: string) => {
    const entry = waitlist.find((w) => w.id === id);
    if (!entry) return;
    setWaitlist((prev) => prev.filter((w) => w.id !== id));
    const defaultRes = resources.find((r) => r.active) ?? resources[0];
    addBooking({
      client: entry.client,
      phone: entry.phone,
      service: entry.service,
      resourceId: defaultRes.id,
      resourceName: defaultRes.name,
      time: entry.preferredTime,
      date: '20.11.2026',
      status: 'confirmed',
    });
  };

  // Warehouse mutations
  const addWarehouseDoc = (doc: Omit<WarehouseDoc, 'id'>) => {
    setWarehouseDocs((prev) => [{ ...doc, id: `wd-${Date.now()}` }, ...prev]);
  };

  const toggleDocStatus = (id: string) => {
    setWarehouseDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: d.status === 'conducted' ? 'draft' : 'conducted' } : d))
    );
  };

  const addWarehouse = (wh: Omit<WarehouseLocation, 'id'>) => {
    setWarehouses((prev) => [{ ...wh, id: `wh-${Date.now()}` }, ...prev]);
  };

  // Marketing mutations
  const addCampaign = (c: Omit<CampaignItem, 'id'>) => {
    setCampaigns((prev) => [{ ...c, id: `cmp-${Date.now()}` }, ...prev]);
  };

  const addSegment = (s: Omit<AudienceSegment, 'id'>) => {
    setSegments((prev) => [{ ...s, id: `sg-${Date.now()}` }, ...prev]);
  };

  const toggleAdActive = (id: string) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  };

  // Automation mutations
  const addRobot = (r: Omit<RobotRule, 'id'>) => {
    setRobots((prev) => [...prev, { ...r, id: `rb-${Date.now()}` }]);
  };

  const toggleRobot = (id: string) => {
    setRobots((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const runWorkflow = (id: string) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;
    const t = nowHHMM();
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, runsCount: w.runsCount + 1, lastRun: `20.11.2026 ${t}` } : w))
    );
    setAutomationLogs((prev) => [
      {
        id: `lg-${Date.now()}`,
        time: t,
        source: wf.name,
        entity: wf.entity,
        result: { ru: 'Запущен вручную', ky: 'Кол менен иштетилди' },
      },
      ...prev,
    ]);
  };

  const toggleTrigger = (id: string) => {
    setTriggers((prev) => prev.map((tr) => (tr.id === id ? { ...tr, enabled: !tr.enabled } : tr)));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)));
  };

  // Employees mutations
  const addEmployee = (emp: Omit<EmployeeItem, 'id'>) => {
    setEmployees((prev) => [...prev, { ...emp, id: `emp-${Date.now()}` }]);
  };

  const toggleWorkday = () => {
    setWorkdayActive((prev) => {
      const next = !prev;
      if (next) setWorkdayStart(nowHHMM());
      return next;
    });
  };

  const addAbsence = (ab: Omit<AbsenceRecord, 'id'>) => {
    setAbsences((prev) => [{ ...ab, id: `ab-${Date.now()}` }, ...prev]);
  };

  return (
    <AppDataContext.Provider
      value={{
        lang,
        setLang,
        activeModule,
        setActiveModule,
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        searchQuery,
        setSearchQuery,
        toasts,
        notify,
        chats,
        addChatMessage,
        addNewChat,
        channels,
        addChannelPost,
        collabs,
        addCollabMessage,
        calls,
        addCallLog,
        openLines,
        replyOpenLine,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        events,
        addCalendarEvent,
        openSlotDays,
        toggleOpenSlot,
        rooms,
        addRoomBooking,
        tasks,
        addTask,
        toggleTaskDone,
        moveTaskStage,
        projects,
        addProject,
        flows,
        toggleFlowActive,
        deals,
        addDeal,
        moveDealStage,
        leads,
        addLead,
        convertLeadToDeal,
        contacts,
        addContact,
        companies,
        addCompany,
        products,
        addProduct,
        invoices,
        addInvoice,
        toggleInvoiceStatus,
        smartItems,
        addSmartItem,
        bookings,
        addBooking,
        resources,
        toggleResourceActive,
        services,
        addService,
        waitlist,
        promoteWaitlist,
        warehouseDocs,
        addWarehouseDoc,
        toggleDocStatus,
        warehouses,
        addWarehouse,
        balances,
        campaigns,
        addCampaign,
        segments,
        addSegment,
        ads,
        toggleAdActive,
        templates,
        robots,
        addRobot,
        toggleRobot,
        workflows,
        runWorkflow,
        triggers,
        toggleTrigger,
        automationLogs,
        integrations,
        toggleIntegration,
        employees,
        addEmployee,
        departments,
        workdayActive,
        workdayStart,
        toggleWorkday,
        absences,
        addAbsence,
        kbArticles,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export function useAppData(): AppDataContextType {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider');
  return ctx;
}
