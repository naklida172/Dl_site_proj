import { Lang, LText, ModuleDef } from '../types';

export function tx(value: LText, lang: Lang): string {
  if (typeof value === 'string') return value;
  return value[lang] ?? value.ru;
}

export function formatSom(amount: number, lang: Lang): string {
  const formatted = amount.toLocaleString('ru-RU');
  return lang === 'ru' ? `${formatted} сом` : `${formatted} сом`;
}

export const MODULES: ModuleDef[] = [
  {
    id: 'crm',
    label: { ru: 'CRM', ky: 'CRM' },
    icon: 'Briefcase',
    tabs: [
      { id: 'deals', label: { ru: 'Сделки', ky: 'Бүтүмдөр' } },
      { id: 'leads', label: { ru: 'Лиды', ky: 'Лиддер' } },
      { id: 'clients', label: { ru: 'Клиенты', ky: 'Кардарлар' } },
      { id: 'products', label: { ru: 'Товары', ky: 'Товарлар' } },
      { id: 'sales', label: { ru: 'Продажи', ky: 'Сатуулар' } },
      { id: 'analytics', label: { ru: 'Аналитика', ky: 'Аналитика' } },
      { id: 'smart', label: { ru: 'Смарт-процессы', ky: 'Смарт-процесстер' } },
    ],
  },
  {
    id: 'messenger',
    label: { ru: 'Мессенджер', ky: 'Мессенджер' },
    icon: 'MessageSquare',
    tabs: [
      { id: 'chats', label: { ru: 'Чаты', ky: 'Чаттар' } },
      { id: 'channels', label: { ru: 'Каналы', ky: 'Каналдар' } },
      { id: 'collabs', label: { ru: 'Коллабы', ky: 'Коллабдар' } },
      { id: 'calls', label: { ru: 'Звонки', ky: 'Чалуулар' } },
      { id: 'openlines', label: { ru: 'Открытые линии', ky: 'Ачык линиялар' } },
      { id: 'notifications', label: { ru: 'Уведомления', ky: 'Билдирмелер' } },
    ],
  },
  {
    id: 'calendar',
    label: { ru: 'Календарь', ky: 'Календарь' },
    icon: 'CalendarDays',
    tabs: [
      { id: 'my', label: { ru: 'Мой календарь', ky: 'Менин календарым' } },
      { id: 'company', label: { ru: 'Календарь компании', ky: 'Компаниянын календары' } },
      { id: 'slots', label: { ru: 'Свободные слоты', ky: 'Бош убакыттар' } },
      { id: 'rooms', label: { ru: 'Переговорные', ky: 'Жыйын залдары' } },
      { id: 'schedule', label: { ru: 'Расписание', ky: 'Жүгүртмө' } },
    ],
  },
  {
    id: 'tasks',
    label: { ru: 'Задачи и проекты', ky: 'Тапшырмалар' },
    icon: 'CheckSquare',
    tabs: [
      { id: 'list', label: { ru: 'Задачи', ky: 'Тапшырмалар' } },
      { id: 'kanban', label: { ru: 'Канбан', ky: 'Канбан' } },
      { id: 'projects', label: { ru: 'Проекты', ky: 'Долбоорлор' } },
      { id: 'scrum', label: { ru: 'Скрам', ky: 'Скрам' } },
      { id: 'flows', label: { ru: 'Потоки', ky: 'Агымдар' } },
      { id: 'efficiency', label: { ru: 'Эффективность', ky: 'Натыйжалуулук' } },
    ],
  },
  {
    id: 'booking',
    label: { ru: 'Онлайн-запись', ky: 'Онлайн-жазылуу' },
    icon: 'CalendarClock',
    tabs: [
      { id: 'records', label: { ru: 'Запись', ky: 'Жазылуу' } },
      { id: 'resources', label: { ru: 'Ресурсы', ky: 'Ресурстар' } },
      { id: 'services', label: { ru: 'Услуги', ky: 'Кызматтар' } },
      { id: 'waitlist', label: { ru: 'Лист ожидания', ky: 'Күтүү тизмеси' } },
      { id: 'widget', label: { ru: 'Виджет записи', ky: 'Жазылуу виджети' } },
    ],
  },
  {
    id: 'warehouse',
    label: { ru: 'Складской учёт', ky: 'Кампа эсеби' },
    icon: 'Package',
    tabs: [
      { id: 'docs', label: { ru: 'Документы', ky: 'Документтер' } },
      { id: 'receipt', label: { ru: 'Приход', ky: 'Кирим' } },
      { id: 'shipment', label: { ru: 'Реализация', ky: 'Сатуу' } },
      { id: 'transfer', label: { ru: 'Перемещение', ky: 'Которуу' } },
      { id: 'warehouses', label: { ru: 'Склады', ky: 'Кампалар' } },
      { id: 'balances', label: { ru: 'Остатки', ky: 'Калдыктар' } },
    ],
  },
  {
    id: 'marketing',
    label: { ru: 'Маркетинг', ky: 'Маркетинг' },
    icon: 'Megaphone',
    tabs: [
      { id: 'campaigns', label: { ru: 'Рассылки', ky: 'Жөнөтүүлөр' } },
      { id: 'segments', label: { ru: 'Сегменты', ky: 'Сегменттер' } },
      { id: 'ads', label: { ru: 'Реклама', ky: 'Жарнама' } },
      { id: 'templates', label: { ru: 'Шаблоны', ky: 'Калыптар' } },
      { id: 'analytics', label: { ru: 'Аналитика', ky: 'Аналитика' } },
    ],
  },
  {
    id: 'automation',
    label: { ru: 'Автоматизация', ky: 'Автоматташтыруу' },
    icon: 'Workflow',
    tabs: [
      { id: 'robots', label: { ru: 'Роботы', ky: 'Роботтор' } },
      { id: 'workflows', label: { ru: 'Бизнес-процессы', ky: 'Бизнес-процесстер' } },
      { id: 'triggers', label: { ru: 'Триггеры', ky: 'Триггерлер' } },
      { id: 'logs', label: { ru: 'Журнал запусков', ky: 'Иштөө журналы' } },
      { id: 'integrations', label: { ru: 'Интеграции', ky: 'Интеграциялар' } },
    ],
  },
  {
    id: 'employees',
    label: { ru: 'Сотрудники', ky: 'Кызматкерлер' },
    icon: 'Users',
    tabs: [
      { id: 'directory', label: { ru: 'Сотрудники', ky: 'Кызматкерлер' } },
      { id: 'structure', label: { ru: 'Структура компании', ky: 'Компания түзүмү' } },
      { id: 'timetrack', label: { ru: 'Время и отчёты', ky: 'Убакыт жана отчёттор' } },
      { id: 'absences', label: { ru: 'График отсутствий', ky: 'Жок болуу графиги' } },
      { id: 'kb', label: { ru: 'База знаний', ky: 'Билим базасы' } },
    ],
  },
];

export const UI = {
  common: {
    searchPlaceholder: { ru: 'Поиск...', ky: 'Издөө...' },
    prototypeNote: { ru: 'Прототип · In-memory', ky: 'Прототип · Эс тутумда' },
    add: { ru: 'Добавить', ky: 'Кошуу' },
    create: { ru: 'Создать', ky: 'Түзүү' },
    save: { ru: 'Сохранить', ky: 'Сактоо' },
    cancel: { ru: 'Отмена', ky: 'Жокко чыгаруу' },
    close: { ru: 'Закрыть', ky: 'Жабуу' },
    all: { ru: 'Все', ky: 'Баары' },
    status: { ru: 'Статус', ky: 'Абалы' },
    date: { ru: 'Дата', ky: 'Күнү' },
    responsible: { ru: 'Ответственный', ky: 'Жооптуу' },
    amount: { ru: 'Сумма', ky: 'Суммасы' },
    actions: { ru: 'Действия', ky: 'Аракеттер' },
    name: { ru: 'Название', ky: 'Аталышы' },
    client: { ru: 'Клиент', ky: 'Кардар' },
    phone: { ru: 'Телефон', ky: 'Телефон' },
    email: { ru: 'Email', ky: 'Email' },
    comment: { ru: 'Комментарий', ky: 'Түшүндүрмө' },
    nothingFound: { ru: 'Записи не найдены', ky: 'Маалымат табылган жок' },
    kanban: { ru: 'Канбан', ky: 'Канбан' },
    list: { ru: 'Список', ky: 'Тизме' },
    send: { ru: 'Отправить', ky: 'Жөнөтүү' },
    active: { ru: 'Активен', ky: 'Активдүү' },
    paused: { ru: 'Пауза', ky: 'Тыныгуу' },
    run: { ru: 'Запустить', ky: 'Иштетүү' },
    open: { ru: 'Открыть', ky: 'Ачуу' },
    connected: { ru: 'Подключено', ky: 'Туташкан' },
    disconnected: { ru: 'Отключено', ky: 'Өчүрүлгөн' },
  },
  dealStages: {
    new: { ru: 'Новая заявка', ky: 'Жаңы өтүнмө' },
    prep: { ru: 'Подготовка КП', ky: 'Сунуш даярдоо' },
    invoice: { ru: 'Счёт выставлен', ky: 'Эсеп коюлду' },
    progress: { ru: 'В работе', ky: 'Иштелүүдө' },
    won: { ru: 'Успешно', ky: 'Ийгиликтүү' },
  },
  leadStatuses: {
    new: { ru: 'Новый', ky: 'Жаңы' },
    in_work: { ru: 'В обработке', ky: 'Иштелүүдө' },
    qualified: { ru: 'Квалифицирован', ky: 'Текшерилди' },
    converted: { ru: 'Конвертирован', ky: 'Бүтүмгө өттү' },
  },
  taskStages: {
    new: { ru: 'Новые', ky: 'Жаңы' },
    in_progress: { ru: 'В работе', ky: 'Иштелүүдө' },
    review: { ru: 'Ждут контроля', ky: 'Текшерүүдө' },
    done: { ru: 'Завершены', ky: 'Аяктады' },
  },
  priorities: {
    high: { ru: 'Высокий', ky: 'Жогорку' },
    medium: { ru: 'Средний', ky: 'Орточо' },
    low: { ru: 'Низкий', ky: 'Төмөн' },
  },
  invoiceStatuses: {
    paid: { ru: 'Оплачен', ky: 'Төлөндү' },
    pending: { ru: 'Ожидает оплаты', ky: 'Төлөм күтүүдө' },
    overdue: { ru: 'Просрочен', ky: 'Мөөнөтү өттү' },
  },
  docTypes: {
    receipt: { ru: 'Приход', ky: 'Кирим' },
    shipment: { ru: 'Реализация', ky: 'Сатуу' },
    transfer: { ru: 'Перемещение', ky: 'Которуу' },
    writeoff: { ru: 'Списание', ky: 'Эсептен чыгаруу' },
  },
  docStatuses: {
    conducted: { ru: 'Проведён', ky: 'Өткөрүлдү' },
    draft: { ru: 'Черновик', ky: 'Долбоор' },
  },
  absenceTypes: {
    vacation: { ru: 'Отпуск', ky: 'Өргүү' },
    sick: { ru: 'Больничный', ky: 'Ооруп калуу' },
    trip: { ru: 'Командировка', ky: 'Иш сапар' },
  },
};
