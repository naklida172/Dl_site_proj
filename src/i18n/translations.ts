import { Lang, LText, ModuleDef, PrintStationId } from '../types';

export function tx(value: LText, lang: Lang): string {
  if (typeof value === 'string') return value;
  return value[lang] ?? value.ru;
}

export function formatSom(amount: number): string {
  return `${Math.round(amount).toLocaleString('ru-RU')} сом`;
}

export const RESTAURANT_MODULES: ModuleDef[] = [
  {
    id: 'floor',
    group: 'front',
    label: { ru: 'План зала', ky: 'Зал планы' },
    icon: 'LayoutGrid',
    searchPlaceholder: { ru: 'Поиск стола или гостя в брони...', ky: 'Стол же конокту издөө...' },
    tabs: [
      { id: 'main', label: { ru: 'Основной зал', ky: 'Негизги зал' } },
      { id: 'terrace_vip', label: { ru: 'Терраса и VIP', ky: 'Терраса жана VIP' } },
      { id: 'reservations', label: { ru: 'Бронирование', ky: 'Брондоо' } },
      { id: 'booking_widget', label: { ru: 'Виджет брони', ky: 'Брондоо виджети' } },
    ],
  },
  {
    id: 'pos',
    group: 'front',
    label: { ru: 'Касса и Заказы', ky: 'Касса жана буйрутмалар' },
    icon: 'Receipt',
    searchPlaceholder: { ru: 'Умный поиск блюда или кода...', ky: 'Тамакты же кодду тез издөө...' },
    tabs: [
      { id: 'terminal', label: { ru: 'Терминал заказа', ky: 'Буйрутма терминалы' } },
      { id: 'all_orders', label: { ru: 'Сводный список заказов', ky: 'Бардык буйрутмалар' } },
      { id: 'closed_checks', label: { ru: 'Закрытые чеки', ky: 'Жабылган чектер' } },
    ],
  },
  {
    id: 'kitchen',
    group: 'front',
    label: { ru: 'Кухня (KDS)', ky: 'Ашкана (KDS)' },
    icon: 'ChefHat',
    searchPlaceholder: { ru: 'Поиск заказа, стола или блюда...', ky: 'Буйрутма, стол же тамак издөө...' },
    tabs: [
      { id: 'kds', label: { ru: 'Экран повара (KDS)', ky: 'Ашпозчу экраны (KDS)' } },
      { id: 'stations', label: { ru: 'Цехи и принтеры', ky: 'Цехтер жана принтерлер' } },
      { id: 'stoplist', label: { ru: 'Стоп-лист', ky: 'Стоп-лист' } },
    ],
  },
  {
    id: 'delivery',
    group: 'front',
    label: { ru: 'Доставка', ky: 'Жеткирүү' },
    icon: 'Bike',
    searchPlaceholder: { ru: 'Поиск адреса, телефона или заказа...', ky: 'Дарек, телефон же буйрутма издөө...' },
    tabs: [
      { id: 'orders', label: { ru: 'Активные заказы', ky: 'Активдүү буйрутмалар' } },
      { id: 'couriers', label: { ru: 'Курьеры', ky: 'Курьерлер' } },
      { id: 'zones', label: { ru: 'Зоны доставки', ky: 'Жеткирүү аймактары' } },
    ],
  },
  {
    id: 'comms',
    group: 'front',
    label: { ru: 'Чат и обращения', ky: 'Чат жана кайрылуулар' },
    icon: 'MessageSquare',
    searchPlaceholder: { ru: 'Поиск в чате смены или сообщениях гостей...', ky: 'Чат же коноктордун каттарын издөө...' },
    tabs: [
      { id: 'shift_chat', label: { ru: 'Чат смены', ky: 'Нөөмөт чаты' } },
      { id: 'inbox', label: { ru: 'Сообщения гостей', ky: 'Коноктордун каттары' } },
      { id: 'alerts', label: { ru: 'Оповещения', ky: 'Билдирмелер' } },
    ],
  },
  {
    id: 'menu',
    group: 'back',
    label: { ru: 'Справочник «Меню»', ky: '«Меню» маалымдамасы' },
    icon: 'BookOpen',
    searchPlaceholder: { ru: 'Поиск блюда, кода или модификатора...', ky: 'Тамак, код же кошумча издөө...' },
    tabs: [
      { id: 'dishes', label: { ru: 'Блюда и категории', ky: 'Тамактар жана категориялар' } },
      { id: 'modifiers', label: { ru: 'Модификаторы и схемы', ky: 'Модификаторлор жана схемалар' } },
      { id: 'combos', label: { ru: 'Комбо-наборы', ky: 'Комбо топтомдор' } },
      { id: 'prices', label: { ru: 'Ценовые схемы', ky: 'Баа схемалары' } },
    ],
  },
  {
    id: 'inventory',
    group: 'back',
    label: { ru: 'Склад и техкарты', ky: 'Кампа жана техкарталар' },
    icon: 'Boxes',
    searchPlaceholder: { ru: 'Поиск продукта, техкарты или поставщика...', ky: 'Азык, техкарта же жеткирүүчү издөө...' },
    tabs: [
      { id: 'techcards', label: { ru: 'Техкарты (ТТК)', ky: 'Техкарталар (ТТК)' } },
      { id: 'stocks', label: { ru: 'Остатки продуктов', ky: 'Азык калдыктары' } },
      { id: 'docs', label: { ru: 'Накладные', ky: 'Коштомо кагаздар' } },
      { id: 'suppliers', label: { ru: 'Поставщики', ky: 'Жеткирүүчүлөр' } },
    ],
  },
  {
    id: 'guests',
    group: 'back',
    label: { ru: 'Гости и лояльность', ky: 'Коноктор жана лоялдуулук' },
    icon: 'HeartHandshake',
    searchPlaceholder: { ru: 'Поиск гостя, рассылки или банкета...', ky: 'Конок, жөнөтүү же банкет издөө...' },
    tabs: [
      { id: 'guests_list', label: { ru: 'База гостей', ky: 'Коноктор базасы' } },
      { id: 'discounts', label: { ru: 'Скидки и акции', ky: 'Арзандатуулар жана акциялар' } },
      { id: 'marketing', label: { ru: 'Рассылки и сегменты', ky: 'Жөнөтүүлөр жана сегменттер' } },
      { id: 'banquets', label: { ru: 'Банкеты и кейтеринг', ky: 'Банкеттер жана кейтеринг' } },
      { id: 'reviews', label: { ru: 'Отзывы и NPS', ky: 'Пикирлер жана NPS' } },
    ],
  },
  {
    id: 'operations',
    group: 'back',
    label: { ru: 'Операции и авто', ky: 'Операциялар жана авто' },
    icon: 'SlidersHorizontal',
    searchPlaceholder: { ru: 'Поиск чек-листа, задачи или стандарта...', ky: 'Текшерүү, тапшырма же стандарт издөө...' },
    tabs: [
      { id: 'checklists', label: { ru: 'Чек-листы и задачи', ky: 'Текшерүү жана тапшырмалар' } },
      { id: 'calendar', label: { ru: 'Календарь зала', ky: 'Зал календары' } },
      { id: 'automation', label: { ru: 'Роботы и интеграции', ky: 'Роботтор жана интеграциялар' } },
      { id: 'sops', label: { ru: 'Стандарты (БЗ)', ky: 'Стандарттар (ББ)' } },
    ],
  },
  {
    id: 'reports',
    group: 'back',
    label: { ru: 'Смены и отчёты', ky: 'Нөөмөт жана отчёттор' },
    icon: 'BarChart3',
    searchPlaceholder: { ru: 'Поиск по отчётам, сменам или сотрудникам...', ky: 'Отчёт, нөөмөт же кызматкер издөө...' },
    tabs: [
      { id: 'shift', label: { ru: 'Кассовая смена (X / Z)', ky: 'Касса нөөмөтү (X / Z)' } },
      { id: 'olap', label: { ru: 'OLAP-отчёты', ky: 'OLAP-отчёттор' } },
      { id: 'staff', label: { ru: 'Персонал и права', ky: 'Кызматкерлер жана укуктар' } },
      { id: 'schedule', label: { ru: 'График смен', ky: 'Нөөмөт графиги' } },
    ],
  },
];

export const STATION_NAMES: Record<PrintStationId, { ru: string; ky: string }> = {
  hot: { ru: 'Горячий цех', ky: 'Ысык цех' },
  cold: { ru: 'Холодный цех', ky: 'Муздак цех' },
  grill: { ru: 'Мангал / Гриль', ky: 'Мангал / Гриль' },
  bar: { ru: 'Бар', ky: 'Бар' },
  pastry: { ru: 'Кондитерская', ky: 'Таттуу цехи' },
};

export const UI = {
  groups: {
    front: { ru: 'Зал и касса', ky: 'Зал жана касса' },
    back: { ru: 'Управление', ky: 'Башкаруу' },
  },
  common: {
    brandSub: { ru: 'Ресторан · POS & Back', ky: 'Ресторан · POS & Back' },
    quickOrder: { ru: 'Быстрый заказ', ky: 'Тез буйрутма' },
    add: { ru: 'Добавить', ky: 'Кошуу' },
    create: { ru: 'Создать', ky: 'Түзүү' },
    save: { ru: 'Сохранить', ky: 'Сактоо' },
    cancel: { ru: 'Отмена', ky: 'Жокко чыгаруу' },
    close: { ru: 'Закрыть', ky: 'Жабуу' },
    all: { ru: 'Все', ky: 'Баары' },
    status: { ru: 'Статус', ky: 'Абалы' },
    active: { ru: 'Активно', ky: 'Активдүү' },
    inactive: { ru: 'Отключено', ky: 'Өчүрүлгөн' },
    sum: { ru: 'Сумма', ky: 'Суммасы' },
    guest: { ru: 'Гость', ky: 'Конок' },
    guests: { ru: 'Гостей', ky: 'Конок' },
    waiter: { ru: 'Официант', ky: 'Официант' },
    table: { ru: 'Стол', ky: 'Стол' },
    phone: { ru: 'Телефон', ky: 'Телефон' },
    comment: { ru: 'Комментарий', ky: 'Түшүндүрмө' },
    actions: { ru: 'Действия', ky: 'Аракеттер' },
    shift: { ru: 'Смена', ky: 'Нөөмөт' },
    shiftOpen: { ru: 'Открыта', ky: 'Ачык' },
    shiftClosed: { ru: 'Закрыта', ky: 'Жабык' },
    prototype: { ru: 'In-memory прототип', ky: 'Эс тутум прототиби' },
  },
  tableStatus: {
    free: { ru: 'Свободен', ky: 'Бош' },
    occupied: { ru: 'Занят', ky: 'Бош эмес' },
    reserved: { ru: 'Бронь', ky: 'Брондолгон' },
    precheck: { ru: 'Пречек', ky: 'Алдын ала эсеп' },
  },
  paymentMethods: {
    cash: { ru: 'Наличные', ky: 'Накталай' },
    card: { ru: 'Банк. карта', ky: 'Банк картасы' },
    qr: { ru: 'QR / MBank', ky: 'QR / MBank' },
    bonus: { ru: 'Бонусы', ky: 'Бонустар' },
  },
  kitchenStatus: {
    new: { ru: 'Новый', ky: 'Жаңы' },
    cooking: { ru: 'Готовится', ky: 'Даярдалууда' },
    ready: { ru: 'Готово', ky: 'Даяр' },
    served: { ru: 'Отдан', ky: 'Берилди' },
  },
  deliveryStatus: {
    accepted: { ru: 'Принят', ky: 'Кабыл алынды' },
    cooking: { ru: 'Готовится', ky: 'Даярдалууда' },
    on_way: { ru: 'В пути', ky: 'Жолдо' },
    delivered: { ru: 'Доставлен', ky: 'Жеткирилди' },
  },
  docTypes: {
    receipt: { ru: 'Приход', ky: 'Кирим' },
    writeoff: { ru: 'Списание', ky: 'Эсептен чыгаруу' },
    transfer: { ru: 'Перемещение', ky: 'Которуу' },
    inventory: { ru: 'Инвентаризация', ky: 'Инвентаризация' },
  },
  docStatus: {
    conducted: { ru: 'Проведён', ky: 'Өткөрүлдү' },
    draft: { ru: 'Черновик', ky: 'Долбоор' },
  },
  banquetStages: {
    inquiry: { ru: 'Запрос', ky: 'Суроо-талап' },
    menu_prep: { ru: 'Согласование меню', ky: 'Меню макулдашуу' },
    prepaid: { ru: 'Предоплата', ky: 'Алдын ала төлөм' },
    done: { ru: 'Проведён', ky: 'Өткөрүлдү' },
  },
  shiftSlots: {
    morning: { ru: 'Утро (09–17)', ky: 'Эртең (09–17)' },
    evening: { ru: 'Вечер (15–23)', ky: 'Кеч (15–23)' },
    off: { ru: 'Выходной', ky: 'Дем алыш' },
  },
  absenceTypes: {
    vacation: { ru: 'Отпуск', ky: 'Өргүү' },
    sick: { ru: 'Больничный', ky: 'Ооруп калуу' },
    day_off: { ru: 'Отгул', ky: 'Суранып кетүү' },
  },
  eventTypes: {
    banquet: { ru: 'Банкет', ky: 'Банкет' },
    music: { ru: 'Живая музыка', ky: 'Жандуу музыка' },
    delivery: { ru: 'Поставка', ky: 'Жеткирүү' },
    meeting: { ru: 'Планёрка', ky: 'Жыйын' },
  },
};
