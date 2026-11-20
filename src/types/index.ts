export type Lang = 'ru' | 'ky';

export type LText = {
  ru: string;
  ky: string;
} | string;

export type ModuleId =
  | 'messenger'
  | 'calendar'
  | 'tasks'
  | 'crm'
  | 'booking'
  | 'warehouse'
  | 'marketing'
  | 'automation'
  | 'employees';

export interface TabDef {
  id: string;
  label: { ru: string; ky: string };
}

export interface ModuleDef {
  id: ModuleId;
  label: { ru: string; ky: string };
  icon: string;
  tabs: TabDef[];
}

// 1. Messenger
export interface ChatMessage {
  id: string;
  sender: string;
  initials: string;
  text: LText;
  time: string;
  isMine: boolean;
}

export interface ChatThread {
  id: string;
  name: LText;
  role: LText;
  initials: string;
  online: boolean;
  unread: number;
  lastTime: string;
  messages: ChatMessage[];
}

export interface ChannelItem {
  id: string;
  name: LText;
  subscribers: number;
  description: LText;
  posts: { id: string; author: string; time: string; title: LText; body: LText }[];
}

export interface CollabRoom {
  id: string;
  name: LText;
  partner: LText;
  membersCount: number;
  status: LText;
  messages: ChatMessage[];
}

export interface CallRecord {
  id: string;
  contact: string;
  direction: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  time: string;
  note: LText;
}

export interface OpenLineThread {
  id: string;
  client: string;
  channel: 'WhatsApp' | 'Telegram' | 'Instagram' | 'Web-чат';
  status: 'new' | 'active' | 'closed';
  waitTime: string;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  module: LText;
  title: LText;
  time: string;
  read: boolean;
}

// 2. Calendar
export interface CalendarEvent {
  id: string;
  day: number; // 1..30 in Nov 2026
  time: string;
  title: LText;
  organizer: string;
  scope: 'personal' | 'company';
  category: 'meeting' | 'call' | 'deadline' | 'other';
  location: LText;
}

export interface OpenSlotDay {
  id: string;
  weekday: LText;
  slots: { time: string; enabled: boolean }[];
}

export interface MeetingRoom {
  id: string;
  name: LText;
  capacity: number;
  floor: LText;
  bookings: { id: string; time: string; title: LText; owner: string; day: string }[];
}

// 3. Tasks
export type TaskStage = 'new' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: LText;
  assignee: string;
  creator: string;
  project: LText;
  deadline: string;
  overdue?: boolean;
  priority: TaskPriority;
  stage: TaskStage;
  storyPoints: number;
  inSprint: boolean;
}

export interface ProjectItem {
  id: string;
  name: LText;
  lead: string;
  membersCount: number;
  openTasks: number;
  completedTasks: number;
  deadline: string;
  status: LText;
}

export interface TaskFlow {
  id: string;
  name: LText;
  owner: string;
  queueCount: number;
  efficiency: number;
  avgTime: LText;
  active: boolean;
}

// 4. CRM
export type DealStage = 'new' | 'prep' | 'invoice' | 'progress' | 'won';

export interface DealItem {
  id: string;
  title: LText;
  client: string;
  company: string;
  amount: number;
  stage: DealStage;
  responsible: string;
  date: string;
}

export type LeadStatus = 'new' | 'in_work' | 'qualified' | 'converted';

export interface LeadItem {
  id: string;
  title: LText;
  name: string;
  phone: string;
  source: LText;
  amount: number;
  status: LeadStatus;
  responsible: string;
}

export interface ContactItem {
  id: string;
  name: string;
  position: LText;
  company: string;
  phone: string;
  email: string;
  dealsCount: number;
}

export interface CompanyItem {
  id: string;
  name: string;
  industry: LText;
  city: LText;
  phone: string;
  revenue: number;
  responsible: string;
}

export interface ProductItem {
  id: string;
  sku: string;
  name: LText;
  category: LText;
  price: number;
  unit: LText;
  stock: number;
}

export interface InvoiceItem {
  id: string;
  number: string;
  title: LText;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

export interface SmartProcessItem {
  id: string;
  processId: 'contracts' | 'procurement' | 'service';
  title: LText;
  stage: LText;
  initiator: string;
  amount: number;
  date: string;
}

// 5. Booking
export interface BookingRecord {
  id: string;
  client: string;
  phone: string;
  service: LText;
  resourceId: string;
  resourceName: string;
  time: string;
  date: string;
  status: 'confirmed' | 'waiting' | 'completed';
}

export interface BookingResource {
  id: string;
  name: string;
  specialty: LText;
  workHours: string;
  active: boolean;
}

export interface BookingService {
  id: string;
  name: LText;
  category: LText;
  durationMin: number;
  price: number;
}

export interface WaitlistEntry {
  id: string;
  client: string;
  phone: string;
  service: LText;
  preferredTime: string;
  note: LText;
}

// 6. Warehouse
export type WarehouseDocType = 'receipt' | 'shipment' | 'transfer' | 'writeoff';

export interface WarehouseDoc {
  id: string;
  number: string;
  type: WarehouseDocType;
  warehouseFrom?: LText;
  warehouseTo: LText;
  itemsCount: number;
  totalAmount: number;
  status: 'conducted' | 'draft';
  date: string;
  responsible: string;
}

export interface WarehouseLocation {
  id: string;
  name: LText;
  address: LText;
  manager: string;
  skuCount: number;
  totalValue: number;
}

export interface StockBalanceItem {
  id: string;
  sku: string;
  productName: LText;
  warehouse: LText;
  available: number;
  reserved: number;
  minLimit: number;
  unit: LText;
}

// 7. Marketing
export interface CampaignItem {
  id: string;
  name: LText;
  channel: 'Email' | 'WhatsApp' | 'SMS' | 'Telegram';
  segment: LText;
  sentCount: number;
  openRate: number;
  clickRate: number;
  status: 'sent' | 'scheduled' | 'draft';
  date: string;
}

export interface AudienceSegment {
  id: string;
  name: LText;
  criteria: LText;
  count: number;
  updatedAt: string;
}

export interface AdChannelStat {
  id: string;
  name: string;
  budget: number;
  leads: number;
  cpl: number;
  roi: number;
  active: boolean;
}

export interface MarketingTemplate {
  id: string;
  name: LText;
  channel: string;
  subject: LText;
  previewText: LText;
}

// 8. Automation
export interface RobotRule {
  id: string;
  stage: DealStage;
  title: LText;
  actionDesc: LText;
  enabled: boolean;
}

export interface WorkflowItem {
  id: string;
  name: LText;
  entity: LText;
  description: LText;
  runsCount: number;
  lastRun: string;
}

export interface TriggerRule {
  id: string;
  event: LText;
  targetStage: LText;
  enabled: boolean;
}

export interface AutomationLog {
  id: string;
  time: string;
  source: LText;
  entity: LText;
  result: LText;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: LText;
  description: LText;
  connected: boolean;
}

// 9. Employees
export interface EmployeeItem {
  id: string;
  name: string;
  initials: string;
  role: LText;
  departmentId: string;
  department: LText;
  email: string;
  phone: string;
  status: 'online' | 'vacation' | 'offline';
  hoursWeek: number;
}

export interface OrgDepartment {
  id: string;
  name: LText;
  head: string;
  parentId?: string;
}

export interface AbsenceRecord {
  id: string;
  employee: string;
  type: 'vacation' | 'sick' | 'trip';
  from: string;
  to: string;
  comment: LText;
}

export interface KnowledgeArticle {
  id: string;
  title: LText;
  category: LText;
  author: string;
  updatedAt: string;
  content: LText;
}

export interface ToastMessage {
  id: string;
  text: string;
}
