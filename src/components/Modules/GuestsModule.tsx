import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, Star } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { BanquetStage, GuestProfile, MarketingCampaign } from '../../types';
import { Modal } from '../Layout/Modal';

const BANQUET_STAGES: BanquetStage[] = ['inquiry', 'menu_prep', 'prepaid', 'done'];

export const GuestsModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
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
    notify,
  } = useRestaurant();

  const [guestModal, setGuestModal] = useState(false);
  const [gName, setGName] = useState('');
  const [gPhone, setGPhone] = useState('+996 555 ');
  const [gTier, setGTier] = useState<GuestProfile['tier']>('Silver');

  const [discModal, setDiscModal] = useState(false);
  const [dName, setDName] = useState('');
  const [dKind, setDKind] = useState<'discount' | 'surcharge'>('discount');
  const [dPct, setDPct] = useState('10');
  const [dCond, setDCond] = useState('');

  const [segModal, setSegModal] = useState(false);
  const [sgName, setSgName] = useState('');
  const [sgCrit, setSgCrit] = useState('');
  const [sgCount, setSgCount] = useState('50');

  const [cmpModal, setCmpModal] = useState(false);
  const [cmName, setCmName] = useState('');
  const [cmChan, setCmChan] = useState<MarketingCampaign['channel']>('WhatsApp');
  const [cmSeg, setCmSeg] = useState(tx(guestSegments[0]?.name ?? 'VIP-гости', 'ru'));

  const [bqModal, setBqModal] = useState(false);
  const [bTitle, setBTitle] = useState('');
  const [bClient, setBClient] = useState('');
  const [bDate, setBDate] = useState('29.11.2026');
  const [bGuests, setBGuests] = useState('20');
  const [bAmount, setBAmount] = useState('48000');
  const [bHall, setBHall] = useState('VIP-1');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'guests_list') {
    const filtered = guests.filter((g) => !q || g.name.toLowerCase().includes(q) || g.phone.includes(q));
    const handleAddGuest = (e: React.FormEvent) => {
      e.preventDefault();
      if (!gName.trim()) return;
      addGuest({
        name: gName.trim(),
        phone: gPhone.trim(),
        tier: gTier,
        bonusBalance: 500,
        visitsCount: 1,
        avgCheck: 1500,
        favoriteDish: { ru: 'Бешбармак классический', ky: 'Классикалык бешбармак' },
        lastVisit: '20.11.2026',
      });
      setGName('');
      setGuestModal(false);
      notify(lang === 'ru' ? 'Гость добавлен в программу лояльности' : 'Конок лоялдуулук программасына кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'CRM гостей и бонусные счета' : 'Коноктор CRMи жана бонустук эсептер'} ({filtered.length})
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setGuestModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить гостя' : 'Конок кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{tx(UI.common.guest, lang)}</th>
                <th>{tx(UI.common.phone, lang)}</th>
                <th>{lang === 'ru' ? 'Уровень' : 'Деңгээли'}</th>
                <th>{lang === 'ru' ? 'Бонусы' : 'Бонустар'}</th>
                <th>{lang === 'ru' ? 'Визитов' : 'Келүүлөр'}</th>
                <th>{lang === 'ru' ? 'Ср. чек' : 'Орточо чек'}</th>
                <th>{lang === 'ru' ? 'Любимое блюдо' : 'Сүйүктүү тамак'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td style={{ fontWeight: 600 }}>{g.name}</td>
                  <td>{g.phone}</td>
                  <td><span className={`pill ${g.tier === 'VIP' ? 'pill-dark' : 'pill-mid'}`}>{g.tier}</span></td>
                  <td><strong>{formatSom(g.bonusBalance)}</strong></td>
                  <td>{g.visitsCount}</td>
                  <td>{formatSom(g.avgCheck)}</td>
                  <td style={{ color: 'var(--ink-secondary)' }}>{tx(g.favoriteDish, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={guestModal}
          onClose={() => setGuestModal(false)}
          title={lang === 'ru' ? 'Новый гость' : 'Жаңы конок'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setGuestModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="guest-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="guest-form" className="form-grid" onSubmit={handleAddGuest}>
            <div className="field">
              <label>{lang === 'ru' ? 'ФИО гостя' : 'Коноктун аты-жөнү'}</label>
              <input className="input" required value={gName} onChange={(e) => setGName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={gPhone} onChange={(e) => setGPhone(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Статус карты' : 'Карта статусу'}</label>
                <select className="select" value={gTier} onChange={(e) => setGTier(e.target.value as GuestProfile['tier'])}>
                  <option value="Standard">Standard</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'discounts') {
    const handleAddDisc = (e: React.FormEvent) => {
      e.preventDefault();
      if (!dName.trim()) return;
      addDiscountRule({
        name: dName.trim(),
        kind: dKind,
        percent: Number(dPct) || 10,
        condition: dCond.trim() || { ru: 'По выбору кассира', ky: 'Кассирдин тандоосу боюнча' },
        active: true,
      });
      setDName('');
      setDCond('');
      setDiscModal(false);
      notify(lang === 'ru' ? 'Правило скидки добавлено' : 'Арзандатуу эрежеси кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Скидки, наценки и акции (r_keeper)' : 'Арзандатуулар жана кошумчалар'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setDiscModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить скидку' : 'Арзандатуу кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Название' : 'Аталышы'}</th>
                <th>{lang === 'ru' ? 'Тип' : 'Түрү'}</th>
                <th>%</th>
                <th>{lang === 'ru' ? 'Условие' : 'Шарты'}</th>
                <th>{tx(UI.common.active, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{tx(d.name, lang)}</td>
                  <td>
                    <span className={`pill ${d.kind === 'discount' ? 'pill-mid' : 'pill-dark'}`}>
                      {d.kind === 'discount' ? (lang === 'ru' ? 'Скидка' : 'Арзандатуу') : (lang === 'ru' ? 'Наценка' : 'Кошумча')}
                    </span>
                  </td>
                  <td><strong>{d.kind === 'discount' ? `-${d.percent}%` : `+${d.percent}%`}</strong></td>
                  <td style={{ color: 'var(--ink-secondary)' }}>{tx(d.condition, lang)}</td>
                  <td>
                    <button type="button" className={`switch-btn ${d.active ? 'on' : ''}`} onClick={() => toggleDiscountRule(d.id)}>
                      <span className="switch-thumb" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={discModal}
          onClose={() => setDiscModal(false)}
          title={lang === 'ru' ? 'Новое правило скидки' : 'Жаңы арзандатуу эрежеси'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDiscModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="disc-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="disc-form" className="form-grid" onSubmit={handleAddDisc}>
            <div className="field">
              <label>{lang === 'ru' ? 'Название' : 'Аталышы'}</label>
              <input className="input" required value={dName} onChange={(e) => setDName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Тип' : 'Түрү'}</label>
                <select className="select" value={dKind} onChange={(e) => setDKind(e.target.value as 'discount' | 'surcharge')}>
                  <option value="discount">{lang === 'ru' ? 'Скидка' : 'Арзандатуу'}</option>
                  <option value="surcharge">{lang === 'ru' ? 'Наценка' : 'Кошумча'}</option>
                </select>
              </div>
              <div className="field">
                <label>%</label>
                <input className="input" type="number" value={dPct} onChange={(e) => setDPct(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Условие' : 'Шарты'}</label>
              <input className="input" value={dCond} onChange={(e) => setDCond(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'marketing') {
    const handleAddSeg = (e: React.FormEvent) => {
      e.preventDefault();
      if (!sgName.trim()) return;
      addGuestSegment({
        name: sgName.trim(),
        criteria: sgCrit.trim() || { ru: 'Гости с картой лояльности', ky: 'Лоялдуулук карталуу коноктор' },
        count: Number(sgCount) || 30,
      });
      setSgName('');
      setSgCrit('');
      setSegModal(false);
      notify(lang === 'ru' ? 'Сегмент гостей создан' : 'Конок сегменти түзүлдү');
    };

    const handleAddCmp = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cmName.trim()) return;
      addMarketingCampaign({
        name: cmName.trim(),
        channel: cmChan,
        segment: cmSeg,
        sentCount: 64,
        openRate: 0,
        status: 'scheduled',
        date: '22.11.2026',
      });
      setCmName('');
      setCmpModal(false);
      notify(lang === 'ru' ? 'Рассылка запланирована' : 'Жөнөтүү пландалды');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Сегменты гостей' : 'Конок сегменттери'}
          </strong>
          <button type="button" className="btn" onClick={() => setSegModal(true)}>
            <Plus size={14} />
            {lang === 'ru' ? 'Создать сегмент' : 'Сегмент түзүү'}
          </button>
        </div>

        <div className="cards-grid" style={{ marginBottom: 20 }}>
          {guestSegments.map((s) => (
            <div key={s.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="pill pill-dark">{s.count} {lang === 'ru' ? 'гостей' : 'конок'}</span>
              </div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{tx(s.name, lang)}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>{tx(s.criteria, lang)}</div>
            </div>
          ))}
        </div>

        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Акции и рассылки (WhatsApp / SMS / Telegram)' : 'Акциялар жана жөнөтүүлөр'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setCmpModal(true)}>
            <Plus size={14} />
            {lang === 'ru' ? 'Создать рассылку' : 'Жөнөтүү түзүү'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Кампания' : 'Кампания'}</th>
                <th>{lang === 'ru' ? 'Канал' : 'Канал'}</th>
                <th>{lang === 'ru' ? 'Сегмент' : 'Сегмент'}</th>
                <th>{lang === 'ru' ? 'Получателей' : 'Алуучулар'}</th>
                <th>Open Rate</th>
                <th>{lang === 'ru' ? 'Дата' : 'Күнү'}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {marketingCampaigns
                .filter((c) => !q || tx(c.name, lang).toLowerCase().includes(q))
                .map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{tx(c.name, lang)}</td>
                    <td><span className="pill">{c.channel}</span></td>
                    <td>{tx(c.segment, lang)}</td>
                    <td>{c.sentCount}</td>
                    <td>{c.openRate}%</td>
                    <td>{c.date}</td>
                    <td>
                      <span className={`pill ${c.status === 'sent' ? 'pill-dark' : 'pill-mid'}`}>
                        {c.status === 'sent' ? (lang === 'ru' ? 'Отправлена' : 'Жөнөтүлдү') : (lang === 'ru' ? 'Запланирована' : 'Пландалды')}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={segModal}
          onClose={() => setSegModal(false)}
          title={lang === 'ru' ? 'Новый сегмент гостей' : 'Жаңы конок сегменти'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setSegModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="gseg-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="gseg-form" className="form-grid" onSubmit={handleAddSeg}>
            <div className="field">
              <label>{lang === 'ru' ? 'Название' : 'Аталышы'}</label>
              <input className="input" required value={sgName} onChange={(e) => setSgName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Критерии' : 'Критерийлер'}</label>
                <input className="input" value={sgCrit} onChange={(e) => setSgCrit(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Гостей в сегменте' : 'Конок саны'}</label>
                <input className="input" type="number" value={sgCount} onChange={(e) => setSgCount(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>

        <Modal
          open={cmpModal}
          onClose={() => setCmpModal(false)}
          title={lang === 'ru' ? 'Новая рассылка' : 'Жаңы жөнөтүү'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setCmpModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="gcmp-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="gcmp-form" className="form-grid" onSubmit={handleAddCmp}>
            <div className="field">
              <label>{lang === 'ru' ? 'Тема / текст предложения' : 'Тема / сунуш'}</label>
              <input className="input" required value={cmName} onChange={(e) => setCmName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Канал' : 'Канал'}</label>
                <select className="select" value={cmChan} onChange={(e) => setCmChan(e.target.value as MarketingCampaign['channel'])}>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Сегмент' : 'Сегмент'}</label>
                <select className="select" value={cmSeg} onChange={(e) => setCmSeg(e.target.value)}>
                  {guestSegments.map((s) => (
                    <option key={s.id} value={tx(s.name, 'ru')}>{tx(s.name, lang)}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'banquets') {
    const handleAddBq = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bTitle.trim()) return;
      addBanquetDeal({
        title: bTitle.trim(),
        clientName: bClient.trim() || 'Заказчик',
        phone: '+996 555 000 100',
        eventDate: bDate,
        guestsCount: Number(bGuests) || 15,
        amount: Number(bAmount) || 0,
        stage: 'inquiry',
        hall: bHall,
      });
      setBTitle('');
      setBClient('');
      setBqModal(false);
      notify(lang === 'ru' ? 'Банкетная заявка добавлена в воронку' : 'Банкет өтүнмөсү кошулду');
    };

    const filteredBanquets = banquets.filter(
      (b) => !q || tx(b.title, lang).toLowerCase().includes(q) || b.clientName.toLowerCase().includes(q)
    );

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Воронка банкетов, корпоративов и кейтеринга' : 'Банкеттер жана кейтеринг воронкасы'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setBqModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новый банкет' : 'Жаңы банкет'}
          </button>
        </div>

        <div className="kanban-board">
          {BANQUET_STAGES.map((st, idx) => {
            const colItems = filteredBanquets.filter((b) => b.stage === st);
            const colSum = colItems.reduce((a, b) => a + b.amount, 0);
            return (
              <div key={st} className="kanban-col">
                <div className="kanban-col-head">
                  <div className="kanban-col-title-row">
                    <span>{tx(UI.banquetStages[st], lang)}</span>
                    <span className="pill pill-mid">{colItems.length}</span>
                  </div>
                  <div className="kanban-col-sum">{formatSom(colSum)}</div>
                </div>

                {colItems.map((b) => (
                  <div key={b.id} className="kanban-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-muted)' }}>
                      <span>{b.eventDate}</span>
                      <span>{b.guestsCount} {lang === 'ru' ? 'гостей' : 'конок'}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{tx(b.title, lang)}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
                      {b.clientName} · {tx(b.hall, lang)}
                    </div>
                    <strong style={{ fontSize: 13.5 }}>{formatSom(b.amount)}</strong>
                    <div className="kanban-card-foot">
                      <button
                        type="button"
                        className="btn btn-sm btn-icon"
                        disabled={idx === 0}
                        onClick={() => moveBanquetStage(b.id, BANQUET_STAGES[idx - 1])}
                      >
                        <ArrowLeft size={13} />
                      </button>
                      <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{b.phone}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-icon"
                        disabled={idx === BANQUET_STAGES.length - 1}
                        onClick={() => moveBanquetStage(b.id, BANQUET_STAGES[idx + 1])}
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

        <Modal
          open={bqModal}
          onClose={() => setBqModal(false)}
          title={lang === 'ru' ? 'Новый банкет / кейтеринг' : 'Жаңы банкет / кейтеринг'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setBqModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="bq-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="bq-form" className="form-grid" onSubmit={handleAddBq}>
            <div className="field">
              <label>{lang === 'ru' ? 'Название события' : 'Иш-чара аталышы'}</label>
              <input className="input" required value={bTitle} onChange={(e) => setBTitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Заказчик' : 'Буйрутмачы'}</label>
                <input className="input" value={bClient} onChange={(e) => setBClient(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Зал' : 'Зал'}</label>
                <input className="input" value={bHall} onChange={(e) => setBHall(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Дата' : 'Күнү'}</label>
                <input className="input" value={bDate} onChange={(e) => setBDate(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.guests, lang)}</label>
                <input className="input" type="number" value={bGuests} onChange={(e) => setBGuests(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Бюджет (сом)' : 'Бюджет (сом)'}</label>
              <input className="input" type="number" value={bAmount} onChange={(e) => setBAmount(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Reviews & NPS
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {reviews.map((r) => (
        <div key={r.id} className="card card-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <strong>{r.guestName}</strong>
              <span className="pill">{tx(r.tableOrSource, lang)}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700 }}>
                <Star size={13} fill="currentColor" /> {r.rating}.0
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>{r.date}</span>
            </div>
            <div style={{ color: 'var(--ink-secondary)' }}>{tx(r.comment, lang)}</div>
          </div>
          {r.handled ? (
            <span className="pill">{lang === 'ru' ? 'Отработано' : 'Иштелди'}</span>
          ) : (
            <button type="button" className="btn btn-sm btn-primary" onClick={() => markReviewHandled(r.id)}>
              <Check size={13} />
              {lang === 'ru' ? 'Обработать' : 'Иштетүү'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
