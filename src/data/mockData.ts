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
  EmployeeItem,
  IntegrationItem,
  InvoiceItem,
  KnowledgeArticle,
  LeadItem,
  MarketingTemplate,
  MeetingRoom,
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
  TriggerRule,
  WaitlistEntry,
  WarehouseDoc,
  WarehouseLocation,
  WorkflowItem,
} from '../types';

export const SEED_CHATS: ChatThread[] = [
  {
    id: 'ch1',
    name: 'Айгерим Токтогулова',
    role: { ru: 'Руководитель отдела продаж', ky: 'Сатуу бөлүмүнүн жетекчиси' },
    initials: 'АТ',
    online: true,
    unread: 2,
    lastTime: '14:22',
    messages: [
      {
        id: 'm1',
        sender: 'Айгерим Токтогулова',
        initials: 'АТ',
        text: {
          ru: 'Азамат, клиент «Ала-Тоо Логистик» просит обновить КП до 16:00.',
          ky: 'Азамат, «Ала-Тоо Логистик» кардары 16:00гө чейин сунушту жаңыртууну суранып жатат.',
        },
        time: '14:15',
        isMine: false,
      },
      {
        id: 'm2',
        sender: 'Азамат Беков',
        initials: 'АБ',
        text: {
          ru: 'Принял, уже проверяю остатки по центральному складу и отправлю расчёт.',
          ky: 'Түшүндүм, борбордук кампадагы калдыктарды текшерип, эсепти жөнөтөм.',
        },
        time: '14:18',
        isMine: true,
      },
      {
        id: 'm3',
        sender: 'Айгерим Токтогулова',
        initials: 'АТ',
        text: {
          ru: 'Отлично, спасибо! Сообщи как выставишь счёт.',
          ky: 'Эң жакшы, рахмат! Эсеп коюлганда кабарлап кой.',
        },
        time: '14:22',
        isMine: false,
      },
    ],
  },
  {
    id: 'ch2',
    name: 'Дмитрий Соколов',
    role: { ru: 'Заведующий складом', ky: 'Кампа башчысы' },
    initials: 'ДС',
    online: true,
    unread: 0,
    lastTime: '13:05',
    messages: [
      {
        id: 'm4',
        sender: 'Дмитрий Соколов',
        initials: 'ДС',
        text: {
          ru: 'Приходная накладная №П-408 проведена, 240 позиций оприходовано.',
          ky: '№П-408 кирим кагазы өткөрүлдү, 240 даана товар кабыл алынды.',
        },
        time: '13:05',
        isMine: false,
      },
    ],
  },
  {
    id: 'ch3',
    name: { ru: 'Отдел внедрения и CRM', ky: 'Киргизүү жана CRM бөлүмү' },
    role: { ru: 'Групповой чат · 6 участников', ky: 'Топтук чат · 6 катышуучу' },
    initials: 'ОВ',
    online: true,
    unread: 1,
    lastTime: '11:40',
    messages: [
      {
        id: 'm5',
        sender: 'Нурлан Асанов',
        initials: 'НА',
        text: {
          ru: 'Настроили нового робота для автоматической постановки задач при оплате счёта.',
          ky: 'Эсеп төлөнгөндө автоматтык тапшырма коюучу жаңы робот орнотулду.',
        },
        time: '11:40',
        isMine: false,
      },
    ],
  },
  {
    id: 'ch4',
    name: 'Елена Морозова',
    role: { ru: 'Маркетолог', ky: 'Маркетолог' },
    initials: 'ЕМ',
    online: false,
    unread: 0,
    lastTime: '19.11',
    messages: [
      {
        id: 'm6',
        sender: 'Елена Морозова',
        initials: 'ЕМ',
        text: {
          ru: 'Сегмент B2B-клиентов по Бишкеку обновлён, всего 420 контактов.',
          ky: 'Бишкек боюнча B2B кардарлардын сегменти жаңыртылды, бардыгы 420 байланыш.',
        },
        time: '17:50',
        isMine: false,
      },
    ],
  },
];

export const SEED_CHANNELS: ChannelItem[] = [
  {
    id: 'cn1',
    name: { ru: 'Новости компании', ky: 'Компания жаңылыктары' },
    subscribers: 34,
    description: { ru: 'Официальные объявления, релизы и итоги недели', ky: 'Расмий жарыялар, жаңылыктар жана жумалык жыйынтыктар' },
    posts: [
      {
        id: 'p1',
        author: 'Азамат Беков',
        time: '20.11.2026, 10:00',
        title: { ru: 'Запуск филиала в Оше и расширение склада', ky: 'Ош шаарында филиал ачылышы жана кампаны кеңейтүү' },
        body: {
          ru: 'С 25 ноября открывается дополнительная точка отгрузки. Складские документы уже доступны в модуле «Складской учёт».',
          ky: '25-ноябрдан тарта кошумча жөнөтүү түйүнү ачылат. Кампа документтери «Кампа эсеби» бөлүмүндө жеткиликтүү.',
        },
      },
      {
        id: 'p2',
        author: 'Айгерим Токтогулова',
        time: '19.11.2026, 16:30',
        title: { ru: 'Выполнение плана продаж на 108%', ky: 'Сатуу планын 108% аткаруу' },
        body: {
          ru: 'Команда закрыла 19 крупных сделок за первую половину месяца. Благодарю всех менеджеров!',
          ky: 'Команда айдын биринчи жарымында 19 ири бүтүмдү ийгиликтүү жапты. Бардык менеджерлерге ыраазычылык!',
        },
      },
    ],
  },
  {
    id: 'cn2',
    name: { ru: 'Регламенты и обновления CRM', ky: 'CRM эрежелери жана жаңыртуулар' },
    subscribers: 28,
    description: { ru: 'Инструкции по работе с воронками и смарт-процессами', ky: 'Воронкалар жана смарт-процесстер менен иштөө нускамалары' },
    posts: [
      {
        id: 'p3',
        author: 'Нурлан Асанов',
        time: '18.11.2026',
        title: { ru: 'Новые этапы согласования договоров', ky: 'Келишимдерди макулдашуунун жаңы баскычтары' },
        body: {
          ru: 'Все договоры свыше 150 000 сом теперь автоматически проходят через смарт-процесс «Согласование договоров».',
          ky: '150 000 сомдон ашкан бардык келишимдер эми «Келишимдерди макулдашуу» смарт-процесси аркылуу автоматтык түрдө өтөт.',
        },
      },
    ],
  },
];

export const SEED_COLLABS: CollabRoom[] = [
  {
    id: 'col1',
    name: { ru: 'Коллаб: Поставка оборудования', ky: 'Коллаб: Жабдуу жеткирүү' },
    partner: 'ОсОО «Ала-Тоо Логистик»',
    membersCount: 7,
    status: { ru: 'Активен', ky: 'Активдүү' },
    messages: [
      {
        id: 'cm1',
        sender: 'Бектур Мамытов (Партнёр)',
        initials: 'БМ',
        text: {
          ru: 'Добрый день! Загрузили график прибытия груза на склад в Бишкеке.',
          ky: 'Саламатсыздарбы! Бишкектеги кампага жүктүн келүү графигин жүктөдүк.',
        },
        time: '12:15',
        isMine: false,
      },
      {
        id: 'cm2',
        sender: 'Азамат Беков',
        initials: 'АБ',
        text: {
          ru: 'Спасибо, слот разгрузки на 21 ноября подтвердили.',
          ky: 'Рахмат, 21-ноябрга түшүрүү убактысын тастыктадык.',
        },
        time: '12:30',
        isMine: true,
      },
    ],
  },
  {
    id: 'col2',
    name: { ru: 'Коллаб: Редизайн портала клиента', ky: 'Коллаб: Кардар порталынын дизайны' },
    partner: 'Студия «Nomad Digital»',
    membersCount: 5,
    status: { ru: 'На согласовании', ky: 'Макулдашууда' },
    messages: [
      {
        id: 'cm3',
        sender: 'Алина Жумабекова',
        initials: 'АЖ',
        text: {
          ru: 'Обновили макеты формы онлайн-записи в светло-серой палитре.',
          ky: 'Онлайн-жазылуу формасынын макеттерин ак-боз түстө жаңырттык.',
        },
        time: '10:45',
        isMine: false,
      },
    ],
  },
];

export const SEED_CALLS: CallRecord[] = [
  {
    id: 'call1',
    contact: 'Канат Осмонов (Бишкек Строй)',
    direction: 'outgoing',
    duration: '06:42',
    time: '14:10',
    note: { ru: 'Обсуждение сроков отгрузки 2-й партии', ky: '2-партияны жөнөтүү мөөнөттөрүн талкуулоо' },
  },
  {
    id: 'call2',
    contact: 'Мээрим Сатыбалдиева',
    direction: 'incoming',
    duration: '03:18',
    time: '12:55',
    note: { ru: 'Консультация по онлайн-записи', ky: 'Онлайн-жазылуу боюнча консультация' },
  },
  {
    id: 'call3',
    contact: '+996 555 412 890',
    direction: 'missed',
    duration: '00:00',
    time: '11:20',
    note: { ru: 'Пропущенный вызов · Лид создан автоматически', ky: 'Кабыл алынбаган чалуу · Лид автоматтык түзүлдү' },
  },
];

export const SEED_OPENLINES: OpenLineThread[] = [
  {
    id: 'ol1',
    client: 'Жанарбек Усенов',
    channel: 'WhatsApp',
    status: 'active',
    waitTime: '1 мин',
    messages: [
      {
        id: 'olm1',
        sender: 'Жанарбек Усенов',
        initials: 'ЖУ',
        text: {
          ru: 'Здравствуйте! Подскажите, есть ли в наличии терминалы сбора данных и сколько стоит доставка по Бишкеку?',
          ky: 'Саламатсызбы! Маалымат топтоо терминалдары барбы жана Бишкек ичинде жеткирүү канча турат?',
        },
        time: '14:25',
        isMine: false,
      },
    ],
  },
  {
    id: 'ol2',
    client: 'Мария Ким',
    channel: 'Telegram',
    status: 'new',
    waitTime: '3 мин',
    messages: [
      {
        id: 'olm2',
        sender: 'Мария Ким',
        initials: 'МК',
        text: {
          ru: 'Хочу перенести запись на консультацию с пятницы на понедельник.',
          ky: 'Консультацияга жазылууну жума күндөн дүйшөмбүгө жылдыргым келет.',
        },
        time: '14:18',
        isMine: false,
      },
    ],
  },
  {
    id: 'ol3',
    client: 'Самат Токтомушев',
    channel: 'Instagram',
    status: 'active',
    waitTime: '5 мин',
    messages: [
      {
        id: 'olm3',
        sender: 'Самат Токтомушев',
        initials: 'СТ',
        text: {
          ru: 'Отправьте, пожалуйста, прайс-лист на кассовое оборудование.',
          ky: 'Кассалык жабдуулардын баа тизмесин жөнөтүп коюңузчу.',
        },
        time: '13:50',
        isMine: false,
      },
    ],
  },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    module: { ru: 'CRM', ky: 'CRM' },
    title: {
      ru: 'Сделка «Поставка серверного оборудования» перешла на этап «Счёт выставлен»',
      ky: '«Сервердик жабдуу жеткирүү» бүтүмү «Эсеп коюлду» баскычына өттү',
    },
    time: '14:20',
    read: false,
  },
  {
    id: 'n2',
    module: { ru: 'Задачи', ky: 'Тапшырмалар' },
    title: {
      ru: 'Срок задачи «Сверка остатков филиала Ош» истекает сегодня в 18:00',
      ky: '«Ош филиалынын калдыктарын салыштыруу» тапшырмасынын мөөнөтү бүгүн 18:00дө бүтөт',
    },
    time: '13:10',
    read: false,
  },
  {
    id: 'n3',
    module: { ru: 'Автоматизация', ky: 'Автоматташтыруу' },
    title: {
      ru: 'Робот отправил приветственное сообщение WhatsApp новому лиду',
      ky: 'Робот жаңы лидге WhatsApp аркылуу саламдашуу билдирүүсүн жөнөттү',
    },
    time: '11:05',
    read: true,
  },
];

export const SEED_EVENTS: CalendarEvent[] = [
  {
    id: 'ev1',
    day: 20,
    time: '10:00',
    title: { ru: 'Утренний стендап отдела продаж', ky: 'Сатуу бөлүмүнүн эртең мененки жыйыны' },
    organizer: 'Айгерим Токтогулова',
    scope: 'company',
    category: 'meeting',
    location: { ru: 'Зал «Ала-Тоо»', ky: '«Ала-Тоо» залы' },
  },
  {
    id: 'ev2',
    day: 20,
    time: '15:00',
    title: { ru: 'Звонок с ОсОО «Тянь-Шань Трейд»', ky: '«Тянь-Шань Трейд» ЖЧК менен чалуу' },
    organizer: 'Азамат Беков',
    scope: 'personal',
    category: 'call',
    location: { ru: 'Видеозвонок CRM24', ky: 'CRM24 видео чалуу' },
  },
  {
    id: 'ev3',
    day: 21,
    time: '11:30',
    title: { ru: 'Приёмка партии товара на склад', ky: 'Кампага товар партиясын кабыл алуу' },
    organizer: 'Дмитрий Соколов',
    scope: 'company',
    category: 'other',
    location: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
  },
  {
    id: 'ev4',
    day: 24,
    time: '14:00',
    title: { ru: 'Демо прототипа CRM для руководства', ky: 'Жетекчиликке CRM прототибин көрсөтүү' },
    organizer: 'Нурлан Асанов',
    scope: 'company',
    category: 'meeting',
    location: { ru: 'Переговорная «Чуй»', ky: '«Чүй» жыйын бөлмөсү' },
  },
  {
    id: 'ev5',
    day: 26,
    time: '17:00',
    title: { ru: 'Закрытие отчётного периода по накладным', ky: 'Коштомо кагаздар боюнча отчётту жабуу' },
    organizer: 'Азамат Беков',
    scope: 'personal',
    category: 'deadline',
    location: { ru: 'Онлайн', ky: 'Онлайн' },
  },
];

export const SEED_OPEN_SLOTS: OpenSlotDay[] = [
  {
    id: 'osd1',
    weekday: { ru: 'Понедельник', ky: 'Дүйшөмбү' },
    slots: [
      { time: '10:00', enabled: true },
      { time: '11:30', enabled: true },
      { time: '14:00', enabled: false },
      { time: '16:00', enabled: true },
    ],
  },
  {
    id: 'osd2',
    weekday: { ru: 'Вторник', ky: 'Шейшемби' },
    slots: [
      { time: '10:00', enabled: true },
      { time: '12:00', enabled: true },
      { time: '15:00', enabled: true },
      { time: '17:00', enabled: false },
    ],
  },
  {
    id: 'osd3',
    weekday: { ru: 'Среда', ky: 'Шаршемби' },
    slots: [
      { time: '09:30', enabled: false },
      { time: '11:00', enabled: true },
      { time: '14:30', enabled: true },
      { time: '16:30', enabled: true },
    ],
  },
  {
    id: 'osd4',
    weekday: { ru: 'Четверг', ky: 'Бейшемби' },
    slots: [
      { time: '10:00', enabled: true },
      { time: '13:00', enabled: true },
      { time: '15:00', enabled: true },
      { time: '17:30', enabled: true },
    ],
  },
  {
    id: 'osd5',
    weekday: { ru: 'Пятница', ky: 'Жума' },
    slots: [
      { time: '10:00', enabled: true },
      { time: '12:00', enabled: false },
      { time: '14:00', enabled: true },
      { time: '16:00', enabled: false },
    ],
  },
];

export const SEED_ROOMS: MeetingRoom[] = [
  {
    id: 'rm1',
    name: { ru: 'Зал «Ала-Тоо»', ky: '«Ала-Тоо» залы' },
    capacity: 14,
    floor: { ru: '4 этаж · Проектор, ВКС', ky: '4-кабат · Проектор, ВКС' },
    bookings: [
      { id: 'rb1', day: '20.11', time: '10:00 - 11:00', title: { ru: 'Стендап отдела продаж', ky: 'Сатуу бөлүмүнүн жыйыны' }, owner: 'Айгерим Т.' },
      { id: 'rb2', day: '20.11', time: '15:30 - 16:30', title: { ru: 'Согласование бюджета Q4', ky: 'Q4 бюджетин макулдашуу' }, owner: 'Азамат Б.' },
    ],
  },
  {
    id: 'rm2',
    name: { ru: 'Переговорная «Чуй»', ky: '«Чүй» жыйын бөлмөсү' },
    capacity: 6,
    floor: { ru: '3 этаж · Доска, ТВ', ky: '3-кабат · Такта, ТВ' },
    bookings: [
      { id: 'rb3', day: '20.11', time: '13:00 - 14:00', title: { ru: 'Собеседование (Менеджер CRM)', ky: 'Маектешүү (CRM менеджери)' }, owner: 'Тимур К.' },
    ],
  },
  {
    id: 'rm3',
    name: { ru: 'Комната 302 (Фокус)', ky: '302-бөлмө (Фокус)' },
    capacity: 4,
    floor: { ru: '3 этаж · Тихая зона', ky: '3-кабат · Тынч бөлмө' },
    bookings: [],
  },
];

export const SEED_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: { ru: 'Подготовить договор для ОсОО «Ала-Тоо Логистик»', ky: '«Ала-Тоо Логистик» ЖЧК үчүн келишим даярдоо' },
    assignee: 'Азамат Беков',
    creator: 'Айгерим Токтогулова',
    project: { ru: 'B2B Продажи Q4', ky: 'B2B Сатуу Q4' },
    deadline: '20.11.2026',
    priority: 'high',
    stage: 'in_progress',
    storyPoints: 5,
    inSprint: true,
  },
  {
    id: 't2',
    title: { ru: 'Сверка остатков филиала Ош', ky: 'Ош филиалынын калдыктарын салыштыруу' },
    assignee: 'Дмитрий Соколов',
    creator: 'Азамат Беков',
    project: { ru: 'Запуск склада Ош', ky: 'Ош кампасын ишке киргизүү' },
    deadline: '19.11.2026',
    overdue: true,
    priority: 'high',
    stage: 'review',
    storyPoints: 3,
    inSprint: true,
  },
  {
    id: 't3',
    title: { ru: 'Настроить триггер WhatsApp при смене этапа сделки', ky: 'Бүтүм баскычы өзгөргөндө WhatsApp триггерин орнотуу' },
    assignee: 'Нурлан Асанов',
    creator: 'Азамат Беков',
    project: { ru: 'Автоматизация CRM', ky: 'CRM автоматташтыруу' },
    deadline: '22.11.2026',
    priority: 'medium',
    stage: 'new',
    storyPoints: 8,
    inSprint: true,
  },
  {
    id: 't4',
    title: { ru: 'Обновить базу email-сегмента для ноябрьской рассылки', ky: 'Ноябрь жөнөтүүсү үчүн email-сегментти жаңыртуу' },
    assignee: 'Елена Морозова',
    creator: 'Айгерим Токтогулова',
    project: { ru: 'Маркетинг Ноябрь', ky: 'Ноябрь Маркетинг' },
    deadline: '21.11.2026',
    priority: 'low',
    stage: 'done',
    storyPoints: 2,
    inSprint: true,
  },
  {
    id: 't5',
    title: { ru: 'Подготовить виджет онлайн-записи для сайта', ky: 'Сайт үчүн онлайн-жазылуу виджетин даярдоо' },
    assignee: 'Тимур Касымов',
    creator: 'Нурлан Асанов',
    project: { ru: 'Клиентский сервис', ky: 'Кардарларды тейлөө' },
    deadline: '25.11.2026',
    priority: 'medium',
    stage: 'in_progress',
    storyPoints: 5,
    inSprint: false,
  },
];

export const SEED_PROJECTS: ProjectItem[] = [
  {
    id: 'pr1',
    name: { ru: 'B2B Продажи Q4', ky: 'B2B Сатуу Q4' },
    lead: 'Айгерим Токтогулова',
    membersCount: 6,
    openTasks: 8,
    completedTasks: 21,
    deadline: '28.12.2026',
    status: { ru: 'Активен', ky: 'Активдүү' },
  },
  {
    id: 'pr2',
    name: { ru: 'Запуск склада Ош', ky: 'Ош кампасын ишке киргизүү' },
    lead: 'Дмитрий Соколов',
    membersCount: 4,
    openTasks: 3,
    completedTasks: 12,
    deadline: '30.11.2026',
    status: { ru: 'Завершение', ky: 'Аяктоодо' },
  },
  {
    id: 'pr3',
    name: { ru: 'Автоматизация CRM', ky: 'CRM автоматташтыруу' },
    lead: 'Нурлан Асанов',
    membersCount: 5,
    openTasks: 5,
    completedTasks: 9,
    deadline: '15.12.2026',
    status: { ru: 'Активен', ky: 'Активдүү' },
  },
];

export const SEED_FLOWS: TaskFlow[] = [
  {
    id: 'fl1',
    name: { ru: 'Согласование скидок и КП', ky: 'Арзандатуу жана сунуш макулдашуу' },
    owner: 'Айгерим Токтогулова',
    queueCount: 4,
    efficiency: 94,
    avgTime: { ru: '2.5 часа', ky: '2.5 саат' },
    active: true,
  },
  {
    id: 'fl2',
    name: { ru: 'IT-поддержка сотрудников', ky: 'Кызматкерлерди IT-колдоо' },
    owner: 'Нурлан Асанов',
    queueCount: 7,
    efficiency: 89,
    avgTime: { ru: '45 мин', ky: '45 мүн' },
    active: true,
  },
  {
    id: 'fl3',
    name: { ru: 'Отгрузка со склада Бишкек', ky: 'Бишкек кампасынан жөнөтүү' },
    owner: 'Дмитрий Соколов',
    queueCount: 2,
    efficiency: 97,
    avgTime: { ru: '1.2 часа', ky: '1.2 саат' },
    active: true,
  },
];

export const SEED_DEALS: DealItem[] = [
  {
    id: 'd1',
    title: { ru: 'Поставка серверного оборудования', ky: 'Сервердик жабдуу жеткирүү' },
    client: 'Бектур Мамытов',
    company: 'ОсОО «Ала-Тоо Логистик»',
    amount: 420000,
    stage: 'invoice',
    responsible: 'Азамат Беков',
    date: '20.11.2026',
  },
  {
    id: 'd2',
    title: { ru: 'Кассовые терминалы (12 шт.)', ky: 'Кассалык терминалдар (12 даана)' },
    client: 'Канат Осмонов',
    company: '«Бишкек Строй»',
    amount: 185000,
    stage: 'prep',
    responsible: 'Айгерим Токтогулова',
    date: '19.11.2026',
  },
  {
    id: 'd3',
    title: { ru: 'Внедрение CRM + обучение персонала', ky: 'CRM киргизүү + кызматкерлерди окутуу' },
    client: 'Салтанат Алиева',
    company: '«Тянь-Шань Трейд»',
    amount: 260000,
    stage: 'progress',
    responsible: 'Нурлан Асанов',
    date: '18.11.2026',
  },
  {
    id: 'd4',
    title: { ru: 'Лицензия CRM24 Корпоратив (год)', ky: 'CRM24 Корпоратив лицензиясы (1 жыл)' },
    client: 'Эркин Бакиров',
    company: '«КыргызТех»',
    amount: 145000,
    stage: 'won',
    responsible: 'Азамат Беков',
    date: '15.11.2026',
  },
  {
    id: 'd5',
    title: { ru: 'Оснащение торгового зала', ky: 'Соода залын жабдуу' },
    client: 'Динара Исакова',
    company: '«Номад Ритейл»',
    amount: 92000,
    stage: 'new',
    responsible: 'Тимур Касымов',
    date: '20.11.2026',
  },
];

export const SEED_LEADS: LeadItem[] = [
  {
    id: 'l1',
    title: { ru: 'Заявка с сайта: Складской учёт', ky: 'Сайттан өтүнмө: Кампа эсеби' },
    name: 'Руслан Жакыпов',
    phone: '+996 550 882 110',
    source: { ru: 'Сайт · Форма', ky: 'Сайт · Форма' },
    amount: 110000,
    status: 'qualified',
    responsible: 'Азамат Беков',
  },
  {
    id: 'l2',
    title: { ru: 'Запрос прайса на сканеры штрих-кода', ky: 'Штрих-код сканерлерине баа суроо' },
    name: 'Гульнара Сыдыкова',
    phone: '+996 700 314 220',
    source: { ru: 'WhatsApp', ky: 'WhatsApp' },
    amount: 48000,
    status: 'new',
    responsible: 'Айгерим Токтогулова',
  },
  {
    id: 'l3',
    title: { ru: 'Подключение IP-телефонии для колл-центра', ky: 'Колл-борбор үчүн IP-телефония кошуу' },
    name: 'Артур Ибраимов',
    phone: '+996 772 901 445',
    source: { ru: 'Входящий звонок', ky: 'Кирүүчү чалуу' },
    amount: 75000,
    status: 'in_work',
    responsible: 'Тимур Касымов',
  },
];

export const SEED_CONTACTS: ContactItem[] = [
  {
    id: 'ct1',
    name: 'Бектур Мамытов',
    position: { ru: 'Коммерческий директор', ky: 'Коммерциялык директор' },
    company: 'ОсОО «Ала-Тоо Логистик»',
    phone: '+996 555 210 340',
    email: 'b.mamytov@alatoo-log.kg',
    dealsCount: 4,
  },
  {
    id: 'ct2',
    name: 'Канат Осмонов',
    position: { ru: 'Руководитель закупок', ky: 'Сатып алуу жетекчиси' },
    company: '«Бишкек Строй»',
    phone: '+996 701 445 812',
    email: 'osmonov@bstroi.kg',
    dealsCount: 2,
  },
  {
    id: 'ct3',
    name: 'Салтанат Алиева',
    position: { ru: 'Операционный директор', ky: 'Операциялык директор' },
    company: '«Тянь-Шань Трейд»',
    phone: '+996 770 118 990',
    email: 's.alieva@tianshan.kg',
    dealsCount: 3,
  },
  {
    id: 'ct4',
    name: 'Эркин Бакиров',
    position: { ru: 'Генеральный директор', ky: 'Башкы директор' },
    company: '«КыргызТех»',
    phone: '+996 551 670 004',
    email: 'bakirov@kgtech.kg',
    dealsCount: 5,
  },
];

export const SEED_COMPANIES: CompanyItem[] = [
  {
    id: 'cp1',
    name: 'ОсОО «Ала-Тоо Логистик»',
    industry: { ru: 'Логистика и перевозки', ky: 'Логистика жана ташуу' },
    city: { ru: 'Бишкек', ky: 'Бишкек' },
    phone: '+996 312 650 100',
    revenue: 1250000,
    responsible: 'Азамат Беков',
  },
  {
    id: 'cp2',
    name: '«Бишкек Строй»',
    industry: { ru: 'Строительство', ky: 'Курулуш' },
    city: { ru: 'Бишкек', ky: 'Бишкек' },
    phone: '+996 312 480 220',
    revenue: 680000,
    responsible: 'Айгерим Токтогулова',
  },
  {
    id: 'cp3',
    name: '«Тянь-Шань Трейд»',
    industry: { ru: 'Оптовая торговля', ky: 'Дүң соода' },
    city: { ru: 'Ош', ky: 'Ош' },
    phone: '+996 3222 55 410',
    revenue: 910000,
    responsible: 'Нурлан Асанов',
  },
  {
    id: 'cp4',
    name: '«КыргызТех»',
    industry: { ru: 'ИТ и телеком', ky: 'ИТ жана телеком' },
    city: { ru: 'Бишкек', ky: 'Бишкек' },
    phone: '+996 312 900 500',
    revenue: 540000,
    responsible: 'Азамат Беков',
  },
];

export const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 'pd1',
    sku: 'SKU-1042',
    name: { ru: 'POS-терминал SmartPay Pro', ky: 'SmartPay Pro POS-терминалы' },
    category: { ru: 'Кассовое оборудование', ky: 'Кассалык жабдуу' },
    price: 15500,
    unit: { ru: 'шт.', ky: 'даана' },
    stock: 34,
  },
  {
    id: 'pd2',
    sku: 'SKU-1089',
    name: { ru: '2D-сканер штрих-кода Wireless', ky: 'Зымсыз 2D штрих-код сканери' },
    category: { ru: 'Периферия', ky: 'Периферия' },
    price: 6800,
    unit: { ru: 'шт.', ky: 'даана' },
    stock: 52,
  },
  {
    id: 'pd3',
    sku: 'SKU-2010',
    name: { ru: 'Серверная стойка Rack-42U', ky: 'Rack-42U сервердик стойкасы' },
    category: { ru: 'Серверы', ky: 'Серверлер' },
    price: 84000,
    unit: { ru: 'шт.', ky: 'даана' },
    stock: 6,
  },
  {
    id: 'pd4',
    sku: 'SKU-3005',
    name: { ru: 'Лицензия CRM24 Корпоратив (12 мес.)', ky: 'CRM24 Корпоратив лицензиясы (12 ай)' },
    category: { ru: 'Программное обеспечение', ky: 'Программалык камсыздоо' },
    price: 145000,
    unit: { ru: 'лиц.', ky: 'лиц.' },
    stock: 99,
  },
];

export const SEED_INVOICES: InvoiceItem[] = [
  {
    id: 'inv1',
    number: 'СЧ-2026-114',
    title: { ru: 'Поставка серверного оборудования', ky: 'Сервердик жабдуу жеткирүү' },
    client: 'ОсОО «Ала-Тоо Логистик»',
    amount: 420000,
    status: 'pending',
    date: '20.11.2026',
  },
  {
    id: 'inv2',
    number: 'СЧ-2026-112',
    title: { ru: 'Лицензия CRM24 Корпоратив', ky: 'CRM24 Корпоратив лицензиясы' },
    client: '«КыргызТех»',
    amount: 145000,
    status: 'paid',
    date: '15.11.2026',
  },
  {
    id: 'inv3',
    number: 'СЧ-2026-109',
    title: { ru: 'Техническое сопровождение за октябрь', ky: 'Октябрь айы үчүн техникалык колдоо' },
    client: '«Бишкек Строй»',
    amount: 45000,
    status: 'overdue',
    date: '05.11.2026',
  },
];

export const SEED_SMART_ITEMS: SmartProcessItem[] = [
  {
    id: 'sp1',
    processId: 'contracts',
    title: { ru: 'Договор поставки №84 — Ала-Тоо Логистик', ky: '№84 Жеткирүү келишими — Ала-Тоо Логистик' },
    stage: { ru: 'Юридическая проверка', ky: 'Юридикалык текшерүү' },
    initiator: 'Азамат Беков',
    amount: 420000,
    date: '20.11.2026',
  },
  {
    id: 'sp2',
    processId: 'contracts',
    title: { ru: 'Доп. соглашение — Тянь-Шань Трейд', ky: 'Кошумча макулдашуу — Тянь-Шань Трейд' },
    stage: { ru: 'На подписи директора', ky: 'Директордун колунда' },
    initiator: 'Айгерим Токтогулова',
    amount: 260000,
    date: '19.11.2026',
  },
  {
    id: 'sp3',
    processId: 'procurement',
    title: { ru: 'Закуп термоленты 80мм (1000 рул.)', ky: '80мм термолента сатып алуу (1000 түрмөк)' },
    stage: { ru: 'Одобрено фин. отделом', ky: 'Каржы бөлүмү жактырды' },
    initiator: 'Дмитрий Соколов',
    amount: 65000,
    date: '18.11.2026',
  },
  {
    id: 'sp4',
    processId: 'service',
    title: { ru: 'Замена блока питания POS-терминала', ky: 'POS-терминалдын кубат блогун алмаштыруу' },
    stage: { ru: 'Выезд инженера', ky: 'Инженер жөнөдү' },
    initiator: 'Тимур Касымов',
    amount: 4500,
    date: '20.11.2026',
  },
];

export const SEED_RESOURCES: BookingResource[] = [
  {
    id: 'res1',
    name: 'Азамат Беков',
    specialty: { ru: 'Внедрение CRM и интеграции', ky: 'CRM киргизүү жана интеграция' },
    workHours: '09:00 – 18:00',
    active: true,
  },
  {
    id: 'res2',
    name: 'Нурлан Асанов',
    specialty: { ru: 'Настройка автоматизации и IP-телефонии', ky: 'Автоматташтыруу жана IP-телефония' },
    workHours: '10:00 – 19:00',
    active: true,
  },
  {
    id: 'res3',
    name: 'Тимур Касымов',
    specialty: { ru: 'Обучение персонала и техподдержка', ky: 'Кызматкерлерди окутуу жана колдоо' },
    workHours: '09:00 – 18:00',
    active: true,
  },
];

export const SEED_SERVICES: BookingService[] = [
  {
    id: 'srv1',
    name: { ru: 'Первичная консультация и аудит CRM', ky: 'Баштапкы консультация жана CRM аудит' },
    category: { ru: 'Консалтинг', ky: 'Консалтинг' },
    durationMin: 60,
    price: 0,
  },
  {
    id: 'srv2',
    name: { ru: 'Настройка воронки продаж (под ключ)', ky: 'Сатуу воронкасын толук орнотуу' },
    category: { ru: 'Внедрение', ky: 'Киргизүү' },
    durationMin: 120,
    price: 12000,
  },
  {
    id: 'srv3',
    name: { ru: 'Выездная настройка кассового узла', ky: 'Кассалык түйүндү барып орнотуу' },
    category: { ru: 'Сервис', ky: 'Тейлөө' },
    durationMin: 90,
    price: 4500,
  },
];

export const SEED_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk1',
    client: 'Максат Алымкулов',
    phone: '+996 555 901 234',
    service: { ru: 'Первичная консультация и аудит CRM', ky: 'Баштапкы консультация жана CRM аудит' },
    resourceId: 'res1',
    resourceName: 'Азамат Беков',
    time: '10:00',
    date: '20.11.2026',
    status: 'confirmed',
  },
  {
    id: 'bk2',
    client: 'Айдана Жумабаева',
    phone: '+996 708 112 330',
    service: { ru: 'Настройка воронки продаж (под ключ)', ky: 'Сатуу воронкасын толук орнотуу' },
    resourceId: 'res2',
    resourceName: 'Нурлан Асанов',
    time: '12:00',
    date: '20.11.2026',
    status: 'confirmed',
  },
  {
    id: 'bk3',
    client: 'Чынгыз Эсенов',
    phone: '+996 771 450 882',
    service: { ru: 'Выездная настройка кассового узла', ky: 'Кассалык түйүндү барып орнотуу' },
    resourceId: 'res3',
    resourceName: 'Тимур Касымов',
    time: '15:00',
    date: '20.11.2026',
    status: 'waiting',
  },
];

export const SEED_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl1',
    client: 'Бакыт Сулайманов',
    phone: '+996 558 770 120',
    service: { ru: 'Первичная консультация и аудит CRM', ky: 'Баштапкы консультация жана CRM аудит' },
    preferredTime: '16:00',
    note: { ru: 'Удобно сегодня во второй половине дня', ky: 'Бүгүн түштөн кийин ыңгайлуу' },
  },
  {
    id: 'wl2',
    client: 'Жибек Назарова',
    phone: '+996 705 229 011',
    service: { ru: 'Настройка воронки продаж (под ключ)', ky: 'Сатуу воронкасын толук орнотуу' },
    preferredTime: '11:00',
    note: { ru: 'Просит уведомить за час в WhatsApp', ky: 'WhatsApp аркылуу 1 саат мурун эскертүүнү суранды' },
  },
];

export const SEED_WAREHOUSES: WarehouseLocation[] = [
  {
    id: 'wh1',
    name: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
    address: { ru: 'ул. Льва Толстого, 114Б', ky: 'Лев Толстой көч., 114Б' },
    manager: 'Дмитрий Соколов',
    skuCount: 142,
    totalValue: 3840000,
  },
  {
    id: 'wh2',
    name: { ru: 'Филиал Ош', ky: 'Ош филиалы' },
    address: { ru: 'ул. Масалиева, 48', ky: 'Масалиев көч., 48' },
    manager: 'Кубанычбек Ташиев',
    skuCount: 64,
    totalValue: 1120000,
  },
  {
    id: 'wh3',
    name: { ru: 'Шоурум Центр', ky: 'Борбордук шоурум' },
    address: { ru: 'пр. Чуй, 155', ky: 'Чүй проспектиси, 155' },
    manager: 'Тимур Касымов',
    skuCount: 28,
    totalValue: 490000,
  },
];

export const SEED_WAREHOUSE_DOCS: WarehouseDoc[] = [
  {
    id: 'wd1',
    number: 'ПХ-00408',
    type: 'receipt',
    warehouseTo: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
    itemsCount: 24,
    totalAmount: 372000,
    status: 'conducted',
    date: '20.11.2026',
    responsible: 'Дмитрий Соколов',
  },
  {
    id: 'wd2',
    number: 'РЛ-00912',
    type: 'shipment',
    warehouseTo: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
    itemsCount: 12,
    totalAmount: 186000,
    status: 'conducted',
    date: '19.11.2026',
    responsible: 'Азамат Беков',
  },
  {
    id: 'wd3',
    number: 'ПР-00105',
    type: 'transfer',
    warehouseFrom: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
    warehouseTo: { ru: 'Филиал Ош', ky: 'Ош филиалы' },
    itemsCount: 15,
    totalAmount: 215000,
    status: 'draft',
    date: '20.11.2026',
    responsible: 'Дмитрий Соколов',
  },
  {
    id: 'wd4',
    number: 'СП-00034',
    type: 'writeoff',
    warehouseTo: { ru: 'Шоурум Центр', ky: 'Борбордук шоурум' },
    itemsCount: 2,
    totalAmount: 13600,
    status: 'conducted',
    date: '17.11.2026',
    responsible: 'Тимур Касымов',
  },
];

export const SEED_BALANCES: StockBalanceItem[] = [
  {
    id: 'sb1',
    sku: 'SKU-1042',
    productName: { ru: 'POS-терминал SmartPay Pro', ky: 'SmartPay Pro POS-терминалы' },
    warehouse: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
    available: 28,
    reserved: 6,
    minLimit: 10,
    unit: { ru: 'шт.', ky: 'даана' },
  },
  {
    id: 'sb2',
    sku: 'SKU-1089',
    productName: { ru: '2D-сканер штрих-кода Wireless', ky: 'Зымсыз 2D штрих-код сканери' },
    warehouse: { ru: 'Филиал Ош', ky: 'Ош филиалы' },
    available: 9,
    reserved: 2,
    minLimit: 10,
    unit: { ru: 'шт.', ky: 'даана' },
  },
  {
    id: 'sb3',
    sku: 'SKU-2010',
    productName: { ru: 'Серверная стойка Rack-42U', ky: 'Rack-42U сервердик стойкасы' },
    warehouse: { ru: 'Центральный склад Бишкек', ky: 'Бишкек борбордук кампасы' },
    available: 4,
    reserved: 2,
    minLimit: 3,
    unit: { ru: 'шт.', ky: 'даана' },
  },
  {
    id: 'sb4',
    sku: 'SKU-1042',
    productName: { ru: 'POS-терминал SmartPay Pro', ky: 'SmartPay Pro POS-терминалы' },
    warehouse: { ru: 'Шоурум Центр', ky: 'Борбордук шоурум' },
    available: 5,
    reserved: 0,
    minLimit: 3,
    unit: { ru: 'шт.', ky: 'даана' },
  },
];

export const SEED_CAMPAIGNS: CampaignItem[] = [
  {
    id: 'cmp1',
    name: { ru: 'Осеннее обновление кассового ПО', ky: 'Кассалык программаны күзгү жаңыртуу' },
    channel: 'Email',
    segment: { ru: 'B2B-клиенты Бишкек', ky: 'Бишкек B2B кардарлары' },
    sentCount: 420,
    openRate: 46,
    clickRate: 14,
    status: 'sent',
    date: '18.11.2026',
  },
  {
    id: 'cmp2',
    name: { ru: 'Приглашение на бизнес-завтрак CRM24', ky: 'CRM24 бизнес-таңкы тамагына чакыруу' },
    channel: 'WhatsApp',
    segment: { ru: 'VIP-партнёры', ky: 'VIP-өнөктөштөр' },
    sentCount: 85,
    openRate: 88,
    clickRate: 39,
    status: 'sent',
    date: '19.11.2026',
  },
  {
    id: 'cmp3',
    name: { ru: 'Скидка 15% на терминалы при предзаказе', ky: 'Алдын ала буйрутмада терминалдарга 15% арзандатуу' },
    channel: 'Telegram',
    segment: { ru: 'Тёплые лиды за 60 дней', ky: 'Акыркы 60 күндүн лиддери' },
    sentCount: 190,
    openRate: 0,
    clickRate: 0,
    status: 'scheduled',
    date: '22.11.2026',
  },
];

export const SEED_SEGMENTS: AudienceSegment[] = [
  {
    id: 'sg1',
    name: { ru: 'B2B-клиенты Бишкек', ky: 'Бишкек B2B кардарлары' },
    criteria: { ru: 'Город: Бишкек · Сделок ≥ 1', ky: 'Шаар: Бишкек · Бүтүмдөр ≥ 1' },
    count: 420,
    updatedAt: '20.11.2026',
  },
  {
    id: 'sg2',
    name: { ru: 'VIP-партнёры', ky: 'VIP-өнөктөштөр' },
    criteria: { ru: 'Выручка > 250 000 сом', ky: 'Киреше > 250 000 сом' },
    count: 85,
    updatedAt: '19.11.2026',
  },
  {
    id: 'sg3',
    name: { ru: 'Тёплые лиды за 60 дней', ky: 'Акыркы 60 күндүн лиддери' },
    criteria: { ru: 'Статус: В обработке / Квалифицирован', ky: 'Абалы: Иштелүүдө / Текшерилди' },
    count: 190,
    updatedAt: '20.11.2026',
  },
];

export const SEED_ADS: AdChannelStat[] = [
  { id: 'ad1', name: 'Instagram Ads', budget: 45000, leads: 112, cpl: 402, roi: 240, active: true },
  { id: 'ad2', name: 'Google Ads (Поиск)', budget: 60000, leads: 98, cpl: 612, roi: 315, active: true },
  { id: 'ad3', name: '2GIS Промо', budget: 18000, leads: 41, cpl: 439, roi: 190, active: true },
  { id: 'ad4', name: 'TikTok Business', budget: 22000, leads: 38, cpl: 579, roi: 135, active: false },
];

export const SEED_TEMPLATES: MarketingTemplate[] = [
  {
    id: 'tpl1',
    name: { ru: 'Коммерческое предложение B2B', ky: 'B2B коммерциялык сунуш' },
    channel: 'Email',
    subject: { ru: 'Индивидуальные условия поставки оборудования', ky: 'Жабдууларды жеткирүүнүн жеке шарттары' },
    previewText: {
      ru: 'Здравствуйте! Подготовили для вашей компании расчёт стоимости внедрения и оборудования со скидкой 10% при оплате в ноябре.',
      ky: 'Саламатсыздарбы! Сиздин компания үчүн ноябрда төлөмдө 10% арзандатуу менен жабдуу жана орнотуу эсебин даярдадык.',
    },
  },
  {
    id: 'tpl2',
    name: { ru: 'Напоминание об онлайн-записи', ky: 'Онлайн-жазылуу эскертмеси' },
    channel: 'WhatsApp',
    subject: { ru: 'Подтверждение визита на консультацию', ky: 'Консультацияга жазылууну тастыктоо' },
    previewText: {
      ru: 'Добрый день! Напоминаем о вашей записи на завтра. При необходимости вы можете перенести время в один клик.',
      ky: 'Кутман күн! Эртеңки жазылууңуз тууралуу эскертебиз. Зарыл болсо убакытты оңой жылдыра аласыз.',
    },
  },
  {
    id: 'tpl3',
    name: { ru: 'Реактивация спящих клиентов', ky: 'Уктап жаткан кардарларды кайтаруу' },
    channel: 'SMS / Telegram',
    subject: { ru: 'Персональный бонус 5 000 сом на обслуживание', ky: 'Тейлөөгө 5 000 сом жеке бонус' },
    previewText: {
      ru: 'Мы обновили линейку оборудования и запустили быструю доставку по регионам. Активируйте бонус до конца месяца.',
      ky: 'Биз жабдуулар тизмесин жаңырттык жана аймактарга тез жеткирүүнү ишке киргиздик. Ай аягына чейин бонусту колдонуңуз.',
    },
  },
];

export const SEED_ROBOTS: RobotRule[] = [
  {
    id: 'rb1',
    stage: 'new',
    title: { ru: 'Приветственное сообщение WhatsApp', ky: 'WhatsApp саламдашуу билдирүүсү' },
    actionDesc: { ru: 'Отправить шаблон клиенту сразу после создания', ky: 'Түзүлгөндөн кийин дароо кардарга калып жөнөтүү' },
    enabled: true,
  },
  {
    id: 'rb2',
    stage: 'prep',
    title: { ru: 'Контроль срока подготовки КП', ky: 'Сунуш даярдоо мөөнөтүн көзөмөлдөө' },
    actionDesc: { ru: 'Поставить задачу менеджеру через 4 часа', ky: '4 сааттан кийин менеджерге тапшырма коюу' },
    enabled: true,
  },
  {
    id: 'rb3',
    stage: 'invoice',
    title: { ru: 'Резерв товара на складе', ky: 'Кампада товарды резервдөө' },
    actionDesc: { ru: 'Создать черновик реализации в Складском учёте', ky: 'Кампа эсебинде сатуу долбоорун түзүү' },
    enabled: true,
  },
  {
    id: 'rb4',
    stage: 'progress',
    title: { ru: 'Уведомление руководителя о крупной сумме', ky: 'Ири сумма тууралуу жетекчиге билдирүү' },
    actionDesc: { ru: 'Если сумма > 200 000 сом — уведомить в чат', ky: 'Сумма > 200 000 сом болсо чатка билдирүү' },
    enabled: false,
  },
  {
    id: 'rb5',
    stage: 'won',
    title: { ru: 'Запрос оценки качества сервиса', ky: 'Тейлөө сапатын баалоо суроосу' },
    actionDesc: { ru: 'Отправить NPS-опрос через 2 дня после закрытия', ky: 'Жабылгандан 2 күндөн кийин NPS-сурамжылоо жөнөтүү' },
    enabled: true,
  },
];

export const SEED_WORKFLOWS: WorkflowItem[] = [
  {
    id: 'wf1',
    name: { ru: 'Согласование договора поставки', ky: 'Жеткирүү келишимин макулдашуу' },
    entity: { ru: 'Смарт-процесс · Договоры', ky: 'Смарт-процесс · Келишимдер' },
    description: { ru: 'Юрист → Финансовый директор → Генеральный директор', ky: 'Юрист → Каржы директору → Башкы директор' },
    runsCount: 48,
    lastRun: '20.11.2026 11:15',
  },
  {
    id: 'wf2',
    name: { ru: 'Оформление командировки сотрудника', ky: 'Кызматкердин иш сапарын тариздөө' },
    entity: { ru: 'Сотрудники · Заявка', ky: 'Кызматкерлер · Өтүнмө' },
    description: { ru: 'Руководитель отдела → Бухгалтерия → Выдача аванса', ky: 'Бөлүм башчысы → Бухгалтерия → Аванс берүү' },
    runsCount: 19,
    lastRun: '18.11.2026 16:40',
  },
  {
    id: 'wf3',
    name: { ru: 'Заявка на закупку ТМЦ со склада', ky: 'Кампага товар сатып алуу өтүнмөсү' },
    entity: { ru: 'Складской учёт', ky: 'Кампа эсеби' },
    description: { ru: 'Зав. складом → Отдел закупок → Приходная накладная', ky: 'Кампа башчысы → Сатып алуу бөлүмү → Кирим кагазы' },
    runsCount: 31,
    lastRun: '19.11.2026 09:50',
  },
];

export const SEED_TRIGGERS: TriggerRule[] = [
  {
    id: 'tr1',
    event: { ru: 'Входящее сообщение в WhatsApp', ky: 'WhatsAppка кирүүчү билдирүү' },
    targetStage: { ru: 'Сделки → В работе', ky: 'Бүтүмдөр → Иштелүүдө' },
    enabled: true,
  },
  {
    id: 'tr2',
    event: { ru: 'Оплата счёта по MBank / Элкарт', ky: 'MBank / Элкарт аркылуу эсепти төлөө' },
    targetStage: { ru: 'Сделки → Успешно', ky: 'Бүтүмдөр → Ийгиликтүү' },
    enabled: true,
  },
  {
    id: 'tr3',
    event: { ru: 'Повторный пропущенный звонок', ky: 'Кайталанган кабыл алынбаган чалуу' },
    targetStage: { ru: 'Лиды → Срочная обработка', ky: 'Лиддер → Шашылыш иштөө' },
    enabled: false,
  },
];

export const SEED_LOGS: AutomationLog[] = [
  {
    id: 'lg1',
    time: '14:20',
    source: { ru: 'Робот: Резерв товара на складе', ky: 'Робот: Кампада товарды резервдөө' },
    entity: { ru: 'Сделка «Поставка серверного оборудования»', ky: '«Сервердик жабдуу жеткирүү» бүтүмү' },
    result: { ru: 'Выполнено успешно', ky: 'Ийгиликтүү аткарылды' },
  },
  {
    id: 'lg2',
    time: '12:45',
    source: { ru: 'Триггер: Входящее сообщение WhatsApp', ky: 'Триггер: WhatsApp кирүүчү билдирүү' },
    entity: { ru: 'Лид «Запрос прайса на сканеры»', ky: '«Сканерлерге баа суроо» лиди' },
    result: { ru: 'Статус обновлён', ky: 'Абалы жаңыртылды' },
  },
  {
    id: 'lg3',
    time: '11:15',
    source: { ru: 'Бизнес-процесс: Согласование договора', ky: 'Бизнес-процесс: Келишим макулдашуу' },
    entity: { ru: 'Договор поставки №84', ky: '№84 Жеткирүү келишими' },
    result: { ru: 'Передано юристу', ky: 'Юристке өткөрүлдү' },
  },
];

export const SEED_INTEGRATIONS: IntegrationItem[] = [
  {
    id: 'int1',
    name: 'WhatsApp Business API',
    category: { ru: 'Мессенджеры', ky: 'Мессенджерлер' },
    description: { ru: 'Двусторонняя переписка в Открытых линиях и рассылки', ky: 'Ачык линияларда эки тараптуу жазышуу жана жөнөтүүлөр' },
    connected: true,
  },
  {
    id: 'int2',
    name: 'Telegram Bot',
    category: { ru: 'Мессенджеры', ky: 'Мессенджерлер' },
    description: { ru: 'Приём заявок клиентов и уведомления сотрудников', ky: 'Кардар өтүнмөлөрүн кабыл алуу жана билдирмелер' },
    connected: true,
  },
  {
    id: 'int3',
    name: '1С:Бухгалтерия 8.3',
    category: { ru: 'Учёт и финансы', ky: 'Эсеп жана каржы' },
    description: { ru: 'Синхронизация счетов, номенклатуры и складских остатков', ky: 'Эсептерди, товарларды жана кампа калдыктарын синхрондоо' },
    connected: true,
  },
  {
    id: 'int4',
    name: 'IP-телефония (SIP)',
    category: { ru: 'Связь', ky: 'Байланыш' },
    description: { ru: 'Запись разговоров, карточки звонков и автосоздание лидов', ky: 'Сүйлөшүүлөрдү жазуу жана лиддерди автоматтык түзүү' },
    connected: true,
  },
  {
    id: 'int5',
    name: 'MBank / Элкарт QR',
    category: { ru: 'Платежи', ky: 'Төлөмдөр' },
    description: { ru: 'Автоматическое подтверждение оплаты счетов', ky: 'Эсептердин төлөнүшүн автоматтык тастыктоо' },
    connected: false,
  },
  {
    id: 'int6',
    name: 'Google Календарь',
    category: { ru: 'Календари', ky: 'Календарлар' },
    description: { ru: 'Двусторонняя синхронизация встреч и слотов', ky: 'Жолугушууларды жана слотторду эки тараптуу синхрондоо' },
    connected: false,
  },
];

export const SEED_DEPARTMENTS: OrgDepartment[] = [
  { id: 'dep_ceo', name: { ru: 'Руководство компании', ky: 'Компания жетекчилиги' }, head: 'Азамат Беков' },
  { id: 'dep_sales', name: { ru: 'Отдел продаж и CRM', ky: 'Сатуу жана CRM бөлүмү' }, head: 'Айгерим Токтогулова', parentId: 'dep_ceo' },
  { id: 'dep_wh', name: { ru: 'Склад и логистика', ky: 'Кампа жана логистика' }, head: 'Дмитрий Соколов', parentId: 'dep_ceo' },
  { id: 'dep_tech', name: { ru: 'ИТ и автоматизация', ky: 'ИТ жана автоматташтыруу' }, head: 'Нурлан Асанов', parentId: 'dep_ceo' },
  { id: 'dep_mkt', name: { ru: 'Маркетинг и сервис', ky: 'Маркетинг жана тейлөө' }, head: 'Елена Морозова', parentId: 'dep_ceo' },
];

export const SEED_EMPLOYEES: EmployeeItem[] = [
  {
    id: 'emp1',
    name: 'Азамат Беков',
    initials: 'АБ',
    role: { ru: 'Операционный руководитель', ky: 'Операциялык жетекчи' },
    departmentId: 'dep_ceo',
    department: { ru: 'Руководство компании', ky: 'Компания жетекчилиги' },
    email: 'a.bekov@crm24.kg',
    phone: '+996 555 100 001',
    status: 'online',
    hoursWeek: 42,
  },
  {
    id: 'emp2',
    name: 'Айгерим Токтогулова',
    initials: 'АТ',
    role: { ru: 'Руководитель отдела продаж', ky: 'Сатуу бөлүмүнүн жетекчиси' },
    departmentId: 'dep_sales',
    department: { ru: 'Отдел продаж и CRM', ky: 'Сатуу жана CRM бөлүмү' },
    email: 'a.toktogulova@crm24.kg',
    phone: '+996 700 100 002',
    status: 'online',
    hoursWeek: 40,
  },
  {
    id: 'emp3',
    name: 'Дмитрий Соколов',
    initials: 'ДС',
    role: { ru: 'Заведующий складом', ky: 'Кампа башчысы' },
    departmentId: 'dep_wh',
    department: { ru: 'Склад и логистика', ky: 'Кампа жана логистика' },
    email: 'd.sokolov@crm24.kg',
    phone: '+996 550 100 003',
    status: 'online',
    hoursWeek: 39,
  },
  {
    id: 'emp4',
    name: 'Нурлан Асанов',
    initials: 'НА',
    role: { ru: 'Инженер автоматизации CRM', ky: 'CRM автоматташтыруу инженери' },
    departmentId: 'dep_tech',
    department: { ru: 'ИТ и автоматизация', ky: 'ИТ жана автоматташтыруу' },
    email: 'n.asanov@crm24.kg',
    phone: '+996 772 100 004',
    status: 'online',
    hoursWeek: 41,
  },
  {
    id: 'emp5',
    name: 'Елена Морозова',
    initials: 'ЕМ',
    role: { ru: 'Ведущий маркетолог', ky: 'Башкы маркетолог' },
    departmentId: 'dep_mkt',
    department: { ru: 'Маркетинг и сервис', ky: 'Маркетинг жана тейлөө' },
    email: 'e.morozova@crm24.kg',
    phone: '+996 551 100 005',
    status: 'offline',
    hoursWeek: 36,
  },
  {
    id: 'emp6',
    name: 'Тимур Касымов',
    initials: 'ТК',
    role: { ru: 'Менеджер по клиентам', ky: 'Кардарлар боюнча менеджер' },
    departmentId: 'dep_sales',
    department: { ru: 'Отдел продаж и CRM', ky: 'Сатуу жана CRM бөлүмү' },
    email: 't.kasymov@crm24.kg',
    phone: '+996 708 100 006',
    status: 'vacation',
    hoursWeek: 16,
  },
];

export const SEED_ABSENCES: AbsenceRecord[] = [
  {
    id: 'ab1',
    employee: 'Тимур Касымов',
    type: 'vacation',
    from: '18.11.2026',
    to: '24.11.2026',
    comment: { ru: 'Ежегодный оплачиваемый отпуск', ky: 'Жылдык акы төлөнүүчү өргүү' },
  },
  {
    id: 'ab2',
    employee: 'Кубанычбек Ташиев',
    type: 'trip',
    from: '20.11.2026',
    to: '22.11.2026',
    comment: { ru: 'Командировка: открытие склада в Оше', ky: 'Иш сапар: Ошто кампаны ачуу' },
  },
];

export const SEED_KB: KnowledgeArticle[] = [
  {
    id: 'kb1',
    title: { ru: 'Регламент ведения сделок в CRM', ky: 'CRMде бүтүмдөрдү жүргүзүү эрежеси' },
    category: { ru: 'Продажи', ky: 'Сатуу' },
    author: 'Айгерим Токтогулова',
    updatedAt: '15.11.2026',
    content: {
      ru: 'Каждая входящая заявка должна быть переведена из статуса «Лид» в «Сделка» в течение 2 рабочих часов после первичной квалификации. При переходе на этап «Счёт выставлен» обязательно прикреплять коммерческое предложение и проверять резерв на складе.',
      ky: 'Ар бир кирүүчү өтүнмө баштапкы текшерүүдөн кийин 2 жумуш саатынын ичинде «Лид» абалынан «Бүтүмгө» өткөрүлүшү керек. «Эсеп коюлду» баскычына өткөндө коммерциялык сунушту тиркөө жана кампадагы резервди текшерүү милдеттүү.',
    },
  },
  {
    id: 'kb2',
    title: { ru: 'Оформление прихода и перемещения товаров', ky: 'Товарлардын киримин жана которуусун тариздөө' },
    category: { ru: 'Складской учёт', ky: 'Кампа эсеби' },
    author: 'Дмитрий Соколов',
    updatedAt: '12.11.2026',
    content: {
      ru: 'Все приходные накладные создаются в модуле «Складской учёт → Приход» в день поступления товара. После физической проверки количества документ переводится в статус «Проведён», что автоматически увеличивает доступные остатки.',
      ky: 'Бардык кирим кагаздары товар келген күнү «Кампа эсеби → Кирим» бөлүмүндө түзүлөт. Санын текшергенден кийин документ «Өткөрүлдү» абалына которулат, бул жеткиликтүү калдыктарды автоматтык түрдө көбөйтөт.',
    },
  },
  {
    id: 'kb3',
    title: { ru: 'Настройка виджета онлайн-записи для клиентов', ky: 'Кардарлар үчүн онлайн-жазылуу виджетин орнотуу' },
    category: { ru: 'Клиентский сервис', ky: 'Кардарларды тейлөө' },
    author: 'Нурлан Асанов',
    updatedAt: '10.11.2026',
    content: {
      ru: 'Для добавления нового специалиста в форму записи активируйте ресурс во вкладке «Онлайн-запись → Ресурсы» и проверьте доступные часы работы. Заявки из виджета сразу попадают в общий журнал и лист ожидания.',
      ky: 'Жазылуу формасына жаңы адисти кошуу үчүн «Онлайн-жазылуу → Ресурстар» бөлүмүндө ресурсту жандырып, иш убактысын текшериңиз. Виджеттеги өтүнмөлөр дароо жалпы журналга түшөт.',
    },
  },
];
