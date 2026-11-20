import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plus, RefreshCw } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { DealStage, SmartProcessItem } from '../../types';
import { Modal } from '../Layout/Modal';

const DEAL_STAGES: DealStage[] = ['new', 'prep', 'invoice', 'progress', 'won'];

export const CrmModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
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
    employees,
    notify,
  } = useAppData();

  const [dealView, setDealView] = useState<'kanban' | 'list'>('kanban');
  const [dealModal, setDealModal] = useState(false);
  const [dTitle, setDTitle] = useState('');
  const [dClient, setDClient] = useState('');
  const [dCompany, setDCompany] = useState('');
  const [dAmount, setDAmount] = useState('120000');
  const [dStage, setDStage] = useState<DealStage>('new');

  const [leadModal, setLeadModal] = useState(false);
  const [lTitle, setLTitle] = useState('');
  const [lName, setLName] = useState('');
  const [lPhone, setLPhone] = useState('+996 555 ');
  const [lAmount, setLAmount] = useState('55000');

  const [clientTab, setClientTab] = useState<'contacts' | 'companies'>('contacts');
  const [clientModal, setClientModal] = useState(false);
  const [cName, setCName] = useState('');
  const [cSub, setCSub] = useState('');
  const [cPhone, setCPhone] = useState('+996 555 ');
  const [cEmail, setCEmail] = useState('');

  const [prodModal, setProdModal] = useState(false);
  const [pSku, setPSku] = useState('SKU-4012');
  const [pName, setPName] = useState('');
  const [pCat, setPCat] = useState('');
  const [pPrice, setPPrice] = useState('12500');
  const [pStock, setPStock] = useState('15');

  const [invModal, setInvModal] = useState(false);
  const [iTitle, setITitle] = useState('');
  const [iClient, setIClient] = useState('');
  const [iAmount, setIAmount] = useState('85000');

  const [smartPipe, setSmartPipe] = useState<SmartProcessItem['processId']>('contracts');
  const [smartModal, setSmartModal] = useState(false);
  const [spTitle, setSpTitle] = useState('');
  const [spStage, setSpStage] = useState('На согласовании');
  const [spAmount, setSpAmount] = useState('100000');

  const q = searchQuery.trim().toLowerCase();

  // 1. Deals
  if (activeTab === 'deals') {
    const filtered = deals.filter(
      (d) =>
        !q ||
        tx(d.title, lang).toLowerCase().includes(q) ||
        d.client.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q)
    );

    const handleCreateDeal = (e: React.FormEvent) => {
      e.preventDefault();
      if (!dTitle.trim()) return;
      addDeal({
        title: dTitle.trim(),
        client: dClient.trim() || (lang === 'ru' ? 'Новый контакт' : 'Жаңы байланыш'),
        company: dCompany.trim() || (lang === 'ru' ? 'ОсОО «Клиент»' : '«Кардар» ЖЧК'),
        amount: Number(dAmount) || 0,
        stage: dStage,
        responsible: employees[0]?.name ?? 'Азамат Беков',
        date: '20.11.2026',
      });
      setDTitle('');
      setDClient('');
      setDCompany('');
      setDealModal(false);
      notify(lang === 'ru' ? 'Сделка добавлена в воронку' : 'Бүтүм воронкага кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Сделки · Общая воронка' : 'Бүтүмдөр · Жалпы воронка'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? `Всего в воронке: ${formatSom(filtered.reduce((a, b) => a + b.amount, 0), lang)}` : `Воронкадагы жалпы сумма: ${formatSom(filtered.reduce((a, b) => a + b.amount, 0), lang)}`}
            </p>
          </div>
          <div className="page-actions">
            <div className="seg-control">
              <button type="button" className={`seg-btn ${dealView === 'kanban' ? 'active' : ''}`} onClick={() => setDealView('kanban')}>
                {tx(UI.common.kanban, lang)}
              </button>
              <button type="button" className={`seg-btn ${dealView === 'list' ? 'active' : ''}`} onClick={() => setDealView('list')}>
                {tx(UI.common.list, lang)}
              </button>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setDealModal(true)}>
              <Plus size={15} />
              {lang === 'ru' ? 'Добавить сделку' : 'Бүтүм кошуу'}
            </button>
          </div>
        </div>

        {dealView === 'kanban' ? (
          <div className="kanban-board">
            {DEAL_STAGES.map((stage, idx) => {
              const stageDeals = filtered.filter((d) => d.stage === stage);
              const stageSum = stageDeals.reduce((a, b) => a + b.amount, 0);
              return (
                <div key={stage} className="kanban-col">
                  <div className="kanban-col-head">
                    <div className="kanban-col-title-row">
                      <span>{tx(UI.dealStages[stage], lang)}</span>
                      <span className="badge badge-mid">{stageDeals.length}</span>
                    </div>
                    <div className="kanban-col-sum">{formatSom(stageSum, lang)}</div>
                  </div>
                  {stageDeals.map((d) => (
                    <div key={d.id} className="kanban-card">
                      <div className="kanban-card-title">{tx(d.title, lang)}</div>
                      <div className="kanban-card-meta">{d.company} · {d.client}</div>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatSom(d.amount, lang)}</div>
                      <div className="kanban-card-foot">
                        <button
                          type="button"
                          className="btn btn-sm btn-icon"
                          disabled={idx === 0}
                          onClick={() => moveDealStage(d.id, DEAL_STAGES[idx - 1])}
                        >
                          <ArrowLeft size={13} />
                        </button>
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{d.responsible.split(' ')[0]}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-icon"
                          disabled={idx === DEAL_STAGES.length - 1}
                          onClick={() => moveDealStage(d.id, DEAL_STAGES[idx + 1])}
                        >
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'ru' ? 'Сделка' : 'Бүтүм'}</th>
                  <th>{lang === 'ru' ? 'Компания / Клиент' : 'Компания / Кардар'}</th>
                  <th>{lang === 'ru' ? 'Стадия' : 'Баскыч'}</th>
                  <th>{tx(UI.common.amount, lang)}</th>
                  <th>{tx(UI.common.responsible, lang)}</th>
                  <th>{tx(UI.common.date, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{tx(d.title, lang)}</td>
                    <td>{d.company} ({d.client})</td>
                    <td><span className="badge badge-mid">{tx(UI.dealStages[d.stage], lang)}</span></td>
                    <td style={{ fontWeight: 600 }}>{formatSom(d.amount, lang)}</td>
                    <td>{d.responsible}</td>
                    <td>{d.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          open={dealModal}
          onClose={() => setDealModal(false)}
          title={lang === 'ru' ? 'Новая сделка' : 'Жаңы бүтүм'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDealModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="deal-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="deal-form" className="form-grid" onSubmit={handleCreateDeal}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={dTitle} onChange={(e) => setDTitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Контакт' : 'Байланыш'}</label>
                <input className="input" value={dClient} onChange={(e) => setDClient(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Компания' : 'Компания'}</label>
                <input className="input" value={dCompany} onChange={(e) => setDCompany(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.amount, lang)} (сом)</label>
                <input className="input" type="number" value={dAmount} onChange={(e) => setDAmount(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Этап' : 'Баскыч'}</label>
                <select className="select" value={dStage} onChange={(e) => setDStage(e.target.value as DealStage)}>
                  {DEAL_STAGES.map((st) => (
                    <option key={st} value={st}>{tx(UI.dealStages[st], lang)}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 2. Leads
  if (activeTab === 'leads') {
    const filtered = leads.filter(
      (l) => !q || tx(l.title, lang).toLowerCase().includes(q) || l.name.toLowerCase().includes(q)
    );
    const handleAddLead = (e: React.FormEvent) => {
      e.preventDefault();
      if (!lTitle.trim() || !lName.trim()) return;
      addLead({
        title: lTitle.trim(),
        name: lName.trim(),
        phone: lPhone.trim(),
        source: { ru: 'Ручной ввод', ky: 'Кол менен киргизүү' },
        amount: Number(lAmount) || 0,
        status: 'new',
        responsible: 'Азамат Беков',
      });
      setLTitle('');
      setLName('');
      setLeadModal(false);
      notify(lang === 'ru' ? 'Лид добавлен' : 'Лид кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Лиды' : 'Лиддер'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Входящие обращения до конвертации в сделку' : 'Бүтүмгө айланганга чейинки кирүүчү кайрылуулар'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setLeadModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить лид' : 'Лид кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Обращение' : 'Кайрылуу'}</th>
                <th>{tx(UI.common.client, lang)}</th>
                <th>{tx(UI.common.phone, lang)}</th>
                <th>{lang === 'ru' ? 'Источник' : 'Булагы'}</th>
                <th>{tx(UI.common.amount, lang)}</th>
                <th>{tx(UI.common.status, lang)}</th>
                <th>{tx(UI.common.actions, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{tx(l.title, lang)}</td>
                  <td>{l.name}</td>
                  <td>{l.phone}</td>
                  <td><span className="badge">{tx(l.source, lang)}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatSom(l.amount, lang)}</td>
                  <td>
                    <span className={`badge ${l.status === 'converted' ? 'badge-dark' : 'badge-mid'}`}>
                      {tx(UI.leadStatuses[l.status], lang)}
                    </span>
                  </td>
                  <td>
                    {l.status !== 'converted' ? (
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          convertLeadToDeal(l.id);
                          notify(lang === 'ru' ? 'Лид конвертирован в сделку' : 'Лид бүтүмгө өткөрүлдү');
                        }}
                      >
                        <RefreshCw size={12} />
                        {lang === 'ru' ? 'В сделку' : 'Бүтүмгө'}
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={leadModal}
          onClose={() => setLeadModal(false)}
          title={lang === 'ru' ? 'Новый лид' : 'Жаңы лид'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setLeadModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="lead-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="lead-form" className="form-grid" onSubmit={handleAddLead}>
            <div className="field">
              <label>{lang === 'ru' ? 'Суть обращения' : 'Кайрылуу мазмуну'}</label>
              <input className="input" required value={lTitle} onChange={(e) => setLTitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Имя клиента' : 'Кардардын аты'}</label>
                <input className="input" required value={lName} onChange={(e) => setLName(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={lPhone} onChange={(e) => setLPhone(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{tx(UI.common.amount, lang)} (сом)</label>
              <input className="input" type="number" value={lAmount} onChange={(e) => setLAmount(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 3. Clients (Contacts & Companies)
  if (activeTab === 'clients') {
    const handleAddClient = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cName.trim()) return;
      if (clientTab === 'contacts') {
        addContact({
          name: cName.trim(),
          position: cSub.trim() || { ru: 'Контактное лицо', ky: 'Байланыш адамы' },
          company: 'ОсОО «Партнёр»',
          phone: cPhone.trim(),
          email: cEmail.trim() || 'info@client.kg',
          dealsCount: 0,
        });
      } else {
        addCompany({
          name: cName.trim(),
          industry: cSub.trim() || { ru: 'Торговля', ky: 'Соода' },
          city: { ru: 'Бишкек', ky: 'Бишкек' },
          phone: cPhone.trim(),
          revenue: 0,
          responsible: 'Азамат Беков',
        });
      }
      setCName('');
      setCSub('');
      setCEmail('');
      setClientModal(false);
      notify(lang === 'ru' ? 'Клиент добавлен в базу' : 'Кардар базага кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Клиентская база' : 'Кардарлар базасы'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Единый реестр контактов и компаний' : 'Байланыштардын жана компаниялардын бирдиктүү тизмеси'}
            </p>
          </div>
          <div className="page-actions">
            <div className="seg-control">
              <button type="button" className={`seg-btn ${clientTab === 'contacts' ? 'active' : ''}`} onClick={() => setClientTab('contacts')}>
                {lang === 'ru' ? 'Контакты' : 'Байланыштар'} ({contacts.length})
              </button>
              <button type="button" className={`seg-btn ${clientTab === 'companies' ? 'active' : ''}`} onClick={() => setClientTab('companies')}>
                {lang === 'ru' ? 'Компании' : 'Компаниялар'} ({companies.length})
              </button>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setClientModal(true)}>
              <Plus size={15} />
              {tx(UI.common.add, lang)}
            </button>
          </div>
        </div>

        {clientTab === 'contacts' ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'ru' ? 'ФИО' : 'Аты-жөнү'}</th>
                  <th>{lang === 'ru' ? 'Должность' : 'Кызматы'}</th>
                  <th>{lang === 'ru' ? 'Компания' : 'Компания'}</th>
                  <th>{tx(UI.common.phone, lang)}</th>
                  <th>Email</th>
                  <th>{lang === 'ru' ? 'Сделки' : 'Бүтүмдөр'}</th>
                </tr>
              </thead>
              <tbody>
                {contacts
                  .filter((c) => !q || c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q))
                  .map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{tx(c.position, lang)}</td>
                      <td>{c.company}</td>
                      <td>{c.phone}</td>
                      <td>{c.email}</td>
                      <td><span className="badge">{c.dealsCount}</span></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'ru' ? 'Компания' : 'Компания'}</th>
                  <th>{lang === 'ru' ? 'Отрасль' : 'Тармагы'}</th>
                  <th>{lang === 'ru' ? 'Город' : 'Шаар'}</th>
                  <th>{tx(UI.common.phone, lang)}</th>
                  <th>{lang === 'ru' ? 'Оборот' : 'Жүгүртүү'}</th>
                  <th>{tx(UI.common.responsible, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {companies
                  .filter((c) => !q || c.name.toLowerCase().includes(q))
                  .map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td>{tx(c.industry, lang)}</td>
                      <td>{tx(c.city, lang)}</td>
                      <td>{c.phone}</td>
                      <td style={{ fontWeight: 600 }}>{formatSom(c.revenue, lang)}</td>
                      <td>{c.responsible}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          open={clientModal}
          onClose={() => setClientModal(false)}
          title={clientTab === 'contacts' ? (lang === 'ru' ? 'Новый контакт' : 'Жаңы байланыш') : (lang === 'ru' ? 'Новая компания' : 'Жаңы компания')}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setClientModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="client-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="client-form" className="form-grid" onSubmit={handleAddClient}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={cName} onChange={(e) => setCName(e.target.value)} />
            </div>
            <div className="field">
              <label>{clientTab === 'contacts' ? (lang === 'ru' ? 'Должность' : 'Кызматы') : (lang === 'ru' ? 'Отрасль' : 'Тармагы')}</label>
              <input className="input" value={cSub} onChange={(e) => setCSub(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={cPhone} onChange={(e) => setCPhone(e.target.value)} />
              </div>
              {clientTab === 'contacts' && (
                <div className="field">
                  <label>Email</label>
                  <input className="input" value={cEmail} onChange={(e) => setCEmail(e.target.value)} />
                </div>
              )}
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 4. Products
  if (activeTab === 'products') {
    const handleAddProduct = (e: React.FormEvent) => {
      e.preventDefault();
      if (!pName.trim()) return;
      addProduct({
        sku: pSku.trim() || 'SKU-NEW',
        name: pName.trim(),
        category: pCat.trim() || { ru: 'Оборудование', ky: 'Жабдуу' },
        price: Number(pPrice) || 0,
        unit: { ru: 'шт.', ky: 'даана' },
        stock: Number(pStock) || 0,
      });
      setPName('');
      setProdModal(false);
      notify(lang === 'ru' ? 'Товар добавлен в каталог' : 'Товар каталогго кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Каталог товаров и услуг' : 'Товарлар жана кызматтар каталогу'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Номенклатура, цены и доступный остаток' : 'Номенклатура, баалар жана жеткиликтүү калдык'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setProdModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить товар' : 'Товар кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Артикул' : 'Артикул'}</th>
                <th>{tx(UI.common.name, lang)}</th>
                <th>{lang === 'ru' ? 'Категория' : 'Категория'}</th>
                <th>{lang === 'ru' ? 'Цена' : 'Баасы'}</th>
                <th>{lang === 'ru' ? 'Остаток' : 'Калдык'}</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((p) => !q || tx(p.name, lang).toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
                .map((p) => (
                  <tr key={p.id}>
                    <td><span className="badge">{p.sku}</span></td>
                    <td style={{ fontWeight: 600 }}>{tx(p.name, lang)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx(p.category, lang)}</td>
                    <td style={{ fontWeight: 600 }}>{formatSom(p.price, lang)}</td>
                    <td>{p.stock} {tx(p.unit, lang)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={prodModal}
          onClose={() => setProdModal(false)}
          title={lang === 'ru' ? 'Новый товар' : 'Жаңы товар'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setProdModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="prod-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="prod-form" className="form-grid" onSubmit={handleAddProduct}>
            <div className="form-row-2">
              <div className="field">
                <label>SKU</label>
                <input className="input" value={pSku} onChange={(e) => setPSku(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Категория' : 'Категория'}</label>
                <input className="input" value={pCat} onChange={(e) => setPCat(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={pName} onChange={(e) => setPName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Цена (сом)' : 'Баасы (сом)'}</label>
                <input className="input" type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Количество' : 'Саны'}</label>
                <input className="input" type="number" value={pStock} onChange={(e) => setPStock(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 5. Sales (Invoices)
  if (activeTab === 'sales') {
    const handleAddInvoice = (e: React.FormEvent) => {
      e.preventDefault();
      if (!iTitle.trim()) return;
      addInvoice({
        number: `СЧ-2026-${115 + invoices.length}`,
        title: iTitle.trim(),
        client: iClient.trim() || 'ОсОО «Клиент»',
        amount: Number(iAmount) || 0,
        status: 'pending',
        date: '20.11.2026',
      });
      setITitle('');
      setIClient('');
      setInvModal(false);
      notify(lang === 'ru' ? 'Счёт выставлен' : 'Эсеп коюлду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Продажи · Счета и оплаты' : 'Сатуулар · Эсептер жана төлөмдөр'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Нажмите на статус счёта, чтобы отметить оплату' : 'Төлөмдү белгилөө үчүн эсептин абалын басыңыз'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setInvModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Выставить счёт' : 'Эсеп коюу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>№</th>
                <th>{lang === 'ru' ? 'Назначение' : 'Максаты'}</th>
                <th>{tx(UI.common.client, lang)}</th>
                <th>{tx(UI.common.amount, lang)}</th>
                <th>{tx(UI.common.date, lang)}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {invoices
                .filter((i) => !q || i.number.toLowerCase().includes(q) || tx(i.title, lang).toLowerCase().includes(q))
                .map((i) => (
                  <tr key={i.id}>
                    <td><strong>{i.number}</strong></td>
                    <td>{tx(i.title, lang)}</td>
                    <td>{i.client}</td>
                    <td style={{ fontWeight: 600 }}>{formatSom(i.amount, lang)}</td>
                    <td>{i.date}</td>
                    <td>
                      <button
                        type="button"
                        className={`badge ${i.status === 'paid' ? 'badge-dark' : 'badge-mid'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => toggleInvoiceStatus(i.id)}
                      >
                        {tx(UI.invoiceStatuses[i.status], lang)}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={invModal}
          onClose={() => setInvModal(false)}
          title={lang === 'ru' ? 'Выставить счёт' : 'Эсеп коюу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setInvModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="inv-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="inv-form" className="form-grid" onSubmit={handleAddInvoice}>
            <div className="field">
              <label>{lang === 'ru' ? 'Назначение платежа' : 'Төлөм максаты'}</label>
              <input className="input" required value={iTitle} onChange={(e) => setITitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.client, lang)}</label>
                <input className="input" value={iClient} onChange={(e) => setIClient(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.amount, lang)} (сом)</label>
                <input className="input" type="number" value={iAmount} onChange={(e) => setIAmount(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // 6. Analytics
  if (activeTab === 'analytics') {
    const totalDealsSum = deals.reduce((a, b) => a + b.amount, 0);
    const wonSum = deals.filter((d) => d.stage === 'won').reduce((a, b) => a + b.amount, 0);
    const avgCheck = deals.length > 0 ? Math.round(totalDealsSum / deals.length) : 0;

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Аналитика CRM' : 'CRM аналитикасы'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Динамика воронки продаж и показатели менеджеров' : 'Сатуу воронкасынын динамикасы жана менеджерлердин көрсөткүчтөрү'}
            </p>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Сумма сделок в воронке' : 'Воронкадагы бүтүмдөр суммасы'}</div>
            <div className="kpi-value">{formatSom(totalDealsSum, lang)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Закрыто успешно' : 'Ийгиликтүү жабылды'}</div>
            <div className="kpi-value">{formatSom(wonSum, lang)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Средний чек' : 'Орточо чек'}</div>
            <div className="kpi-value">{formatSom(avgCheck, lang)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Конверсия лидов' : 'Лид конверсиясы'}</div>
            <div className="kpi-value">34%</div>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ margin: '0 0 14px', fontSize: 14.5 }}>
            {lang === 'ru' ? 'Воронка продаж по этапам' : 'Баскычтар боюнча сатуу воронкасы'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {DEAL_STAGES.map((st) => {
              const stDeals = deals.filter((d) => d.stage === st);
              const sum = stDeals.reduce((a, b) => a + b.amount, 0);
              const pct = totalDealsSum > 0 ? Math.max(8, Math.round((sum / totalDealsSum) * 100)) : 0;
              return (
                <div key={st}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 500 }}>{tx(UI.dealStages[st], lang)} ({stDeals.length})</span>
                    <strong>{formatSom(sum, lang)}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 7. Smart-processes
  const pipeLabels: Record<SmartProcessItem['processId'], { ru: string; ky: string }> = {
    contracts: { ru: 'Согласование договоров', ky: 'Келишимдерди макулдашуу' },
    procurement: { ru: 'Закупки', ky: 'Сатып алуулар' },
    service: { ru: 'Сервисные заявки', ky: 'Тейлөө өтүнмөлөрү' },
  };
  const visibleSmart = smartItems.filter((s) => s.processId === smartPipe && (!q || tx(s.title, lang).toLowerCase().includes(q)));

  const handleAddSmart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spTitle.trim()) return;
    addSmartItem({
      processId: smartPipe,
      title: spTitle.trim(),
      stage: spStage,
      initiator: 'Азамат Беков',
      amount: Number(spAmount) || 0,
      date: '20.11.2026',
    });
    setSpTitle('');
    setSmartModal(false);
    notify(lang === 'ru' ? 'Элемент смарт-процесса создан' : 'Смарт-процесс элементи түзүлдү');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Смарт-процессы' : 'Смарт-процесстер'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Настраиваемые сущности CRM для внутренних процессов' : 'Ички процесстер үчүн ыңгайлаштырылуучу CRM элементтери'}
          </p>
        </div>
        <div className="page-actions">
          <div className="seg-control">
            {(['contracts', 'procurement', 'service'] as const).map((pid) => (
              <button
                key={pid}
                type="button"
                className={`seg-btn ${smartPipe === pid ? 'active' : ''}`}
                onClick={() => setSmartPipe(pid)}
              >
                {tx(pipeLabels[pid], lang)}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setSmartModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить элемент' : 'Элемент кошуу'}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{tx(UI.common.name, lang)}</th>
              <th>{lang === 'ru' ? 'Стадия' : 'Баскыч'}</th>
              <th>{lang === 'ru' ? 'Инициатор' : 'Демилгечи'}</th>
              <th>{tx(UI.common.amount, lang)}</th>
              <th>{tx(UI.common.date, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {visibleSmart.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{tx(item.title, lang)}</td>
                <td><span className="badge badge-mid">{tx(item.stage, lang)}</span></td>
                <td>{item.initiator}</td>
                <td style={{ fontWeight: 600 }}>{formatSom(item.amount, lang)}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={smartModal}
        onClose={() => setSmartModal(false)}
        title={tx(pipeLabels[smartPipe], lang)}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setSmartModal(false)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="smart-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
          </>
        }
      >
        <form id="smart-form" className="form-grid" onSubmit={handleAddSmart}>
          <div className="field">
            <label>{tx(UI.common.name, lang)}</label>
            <input className="input" required value={spTitle} onChange={(e) => setSpTitle(e.target.value)} />
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Стадия' : 'Баскыч'}</label>
              <input className="input" value={spStage} onChange={(e) => setSpStage(e.target.value)} />
            </div>
            <div className="field">
              <label>{tx(UI.common.amount, lang)} (сом)</label>
              <input className="input" type="number" value={spAmount} onChange={(e) => setSpAmount(e.target.value)} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
