import React, { useState } from 'react';
import { CalendarCheck, Clock, Plus, UserPlus } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { Modal } from '../Layout/Modal';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export const BookingModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    bookings,
    addBooking,
    resources,
    toggleResourceActive,
    services,
    addService,
    waitlist,
    promoteWaitlist,
    notify,
  } = useAppData();

  const [bookModal, setBookModal] = useState(false);
  const [bClient, setBClient] = useState('');
  const [bPhone, setBPhone] = useState('+996 555 ');
  const [bServiceIdx, setBServiceIdx] = useState(0);
  const [bResId, setBResId] = useState(resources[0]?.id ?? '');
  const [bTime, setBTime] = useState('14:00');

  const [srvModal, setSrvModal] = useState(false);
  const [sName, setSName] = useState('');
  const [sCat, setSCat] = useState('Консалтинг');
  const [sDur, setSDur] = useState('60');
  const [sPrice, setSPrice] = useState('5000');

  // Widget state
  const [wServiceIdx, setWServiceIdx] = useState(0);
  const [wResId, setWResId] = useState(resources[0]?.id ?? '');
  const [wTime, setWTime] = useState('14:00');
  const [wClient, setWClient] = useState('');
  const [wPhone, setWPhone] = useState('');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'records') {
    const handleCreateBooking = (e: React.FormEvent) => {
      e.preventDefault();
      if (!bClient.trim()) return;
      const res = resources.find((r) => r.id === bResId) ?? resources[0];
      const srv = services[bServiceIdx] ?? services[0];
      addBooking({
        client: bClient.trim(),
        phone: bPhone.trim(),
        service: srv.name,
        resourceId: res.id,
        resourceName: res.name,
        time: bTime,
        date: '20.11.2026',
        status: 'confirmed',
      });
      setBClient('');
      setBookModal(false);
      notify(lang === 'ru' ? 'Запись создана в расписании' : 'Жазылуу жүгүртмөгө кошулду');
    };

    const filteredBookings = bookings.filter(
      (b) => !q || b.client.toLowerCase().includes(q) || b.resourceName.toLowerCase().includes(q)
    );

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Онлайн-запись · 20.11.2026' : 'Онлайн-жазылуу · 20.11.2026'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Сетка занятости специалистов и журнал записей' : 'Адистердин бош убакыт торчосу жана жазылуу журналы'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setBookModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новая запись' : 'Жаңы жазылуу'}
          </button>
        </div>

        <div className="table-wrap" style={{ marginBottom: 16 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Время' : 'Убакыт'}</th>
                {resources.map((r) => (
                  <th key={r.id}>{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot}>
                  <td style={{ fontWeight: 600, width: 88 }}>{slot}</td>
                  {resources.map((res) => {
                    const hit = filteredBookings.find((b) => b.resourceId === res.id && b.time === slot);
                    return (
                      <td key={res.id}>
                        {hit ? (
                          <div style={{ padding: '6px 9px', borderRadius: 6, background: 'var(--bg-well)', border: '1px solid var(--border-strong)' }}>
                            <div style={{ fontWeight: 600, fontSize: 12.5 }}>{hit.client}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{tx(hit.service, lang)}</div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{ opacity: res.active ? 0.75 : 0.35 }}
                            disabled={!res.active}
                            onClick={() => {
                              setBResId(res.id);
                              setBTime(slot);
                              setBookModal(true);
                            }}
                          >
                            + {lang === 'ru' ? 'Свободно' : 'Бош'}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={bookModal}
          onClose={() => setBookModal(false)}
          title={lang === 'ru' ? 'Новая запись клиента' : 'Кардарды жазуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setBookModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="booking-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="booking-form" className="form-grid" onSubmit={handleCreateBooking}>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.client, lang)}</label>
                <input className="input" required value={bClient} onChange={(e) => setBClient(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={bPhone} onChange={(e) => setBPhone(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Услуга' : 'Кызмат'}</label>
              <select className="select" value={bServiceIdx} onChange={(e) => setBServiceIdx(Number(e.target.value))}>
                {services.map((s, idx) => (
                  <option key={s.id} value={idx}>{tx(s.name, lang)}</option>
                ))}
              </select>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Специалист / Ресурс' : 'Адис / Ресурс'}</label>
                <select className="select" value={bResId} onChange={(e) => setBResId(e.target.value)}>
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Время' : 'Убактысы'}</label>
                <select className="select" value={bTime} onChange={(e) => setBTime(e.target.value)}>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'resources') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Ресурсы и специалисты' : 'Ресурстар жана адистер'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Управление доступностью специалистов для онлайн-записи' : 'Адистердин онлайн-жазылууга жеткиликтүүлүгүн башкаруу'}
            </p>
          </div>
        </div>

        <div className="cards-grid">
          {resources.map((r) => (
            <div key={r.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className={`badge ${r.active ? 'badge-dark' : ''}`}>
                  {r.active ? tx(UI.common.active, lang) : tx(UI.common.paused, lang)}
                </span>
                <button type="button" className={`switch-btn ${r.active ? 'on' : ''}`} onClick={() => toggleResourceActive(r.id)}>
                  <span className="switch-thumb" />
                </button>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{r.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 10px' }}>{tx(r.specialty, lang)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={13} /> {r.workHours}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'services') {
    const handleAddService = (e: React.FormEvent) => {
      e.preventDefault();
      if (!sName.trim()) return;
      addService({
        name: sName.trim(),
        category: sCat,
        durationMin: Number(sDur) || 60,
        price: Number(sPrice) || 0,
      });
      setSName('');
      setSrvModal(false);
      notify(lang === 'ru' ? 'Услуга добавлена' : 'Кызмат кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Услуги для записи' : 'Жазылуу кызматтары'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Длительность приёма и стоимость услуг' : 'Кабыл алуу узактыгы жана кызмат баалары'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setSrvModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить услугу' : 'Кызмат кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{tx(UI.common.name, lang)}</th>
                <th>{lang === 'ru' ? 'Категория' : 'Категория'}</th>
                <th>{lang === 'ru' ? 'Длительность' : 'Узактыгы'}</th>
                <th>{lang === 'ru' ? 'Стоимость' : 'Баасы'}</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{tx(s.name, lang)}</td>
                  <td><span className="badge">{tx(s.category, lang)}</span></td>
                  <td>{s.durationMin} {lang === 'ru' ? 'мин' : 'мүн'}</td>
                  <td style={{ fontWeight: 600 }}>
                    {s.price === 0 ? (lang === 'ru' ? 'Бесплатно' : 'Акысыз') : formatSom(s.price, lang)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={srvModal}
          onClose={() => setSrvModal(false)}
          title={lang === 'ru' ? 'Новая услуга' : 'Жаңы кызмат'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setSrvModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="srv-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="srv-form" className="form-grid" onSubmit={handleAddService}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={sName} onChange={(e) => setSName(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Категория' : 'Категория'}</label>
              <input className="input" value={sCat} onChange={(e) => setSCat(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Длительность (мин)' : 'Узактыгы (мүн)'}</label>
                <input className="input" type="number" value={sDur} onChange={(e) => setSDur(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Цена (сом)' : 'Баасы (сом)'}</label>
                <input className="input" type="number" value={sPrice} onChange={(e) => setSPrice(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'waitlist') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Лист ожидания' : 'Күтүү тизмеси'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Клиенты, ожидающие освобождения окна записи' : 'Бош убакытты күтүп жаткан кардарлар'}
            </p>
          </div>
        </div>

        {waitlist.length === 0 ? (
          <div className="empty-state">{lang === 'ru' ? 'Лист ожидания пуст' : 'Күтүү тизмеси бош'}</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{tx(UI.common.client, lang)}</th>
                  <th>{tx(UI.common.phone, lang)}</th>
                  <th>{lang === 'ru' ? 'Услуга' : 'Кызмат'}</th>
                  <th>{lang === 'ru' ? 'Желаемое время' : 'Каалаган убакыт'}</th>
                  <th>{tx(UI.common.comment, lang)}</th>
                  <th>{tx(UI.common.actions, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {waitlist.map((w) => (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 600 }}>{w.client}</td>
                    <td>{w.phone}</td>
                    <td>{tx(w.service, lang)}</td>
                    <td><span className="badge badge-mid">{w.preferredTime}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx(w.note, lang)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          promoteWaitlist(w.id);
                          notify(lang === 'ru' ? 'Клиент перенесён в расписание' : 'Кардар жүгүртмөгө жазылды');
                        }}
                      >
                        <UserPlus size={13} />
                        {lang === 'ru' ? 'Записать' : 'Жазуу'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // Widget tab
  const handleWidgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wClient.trim()) return;
    const srv = services[wServiceIdx] ?? services[0];
    const res = resources.find((r) => r.id === wResId) ?? resources[0];
    addBooking({
      client: wClient.trim(),
      phone: wPhone.trim() || '+996 555 000 000',
      service: srv.name,
      resourceId: res.id,
      resourceName: res.name,
      time: wTime,
      date: '20.11.2026',
      status: 'confirmed',
    });
    setWClient('');
    setWPhone('');
    notify(lang === 'ru' ? 'Заявка из виджета добавлена в журнал записи!' : 'Виджеттен келген өтүнмө журналга кошулду!');
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Виджет онлайн-записи' : 'Онлайн-жазылуу виджети'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Предпросмотр формы для сайта — отправка добавляет запись в расписание' : 'Сайт үчүн форманын көрүнүшү — жөнөтүү жүгүртмөгө жазуу кошот'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '12px auto' }} className="card card-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <div className="anchor-logo-box"><CalendarCheck size={13} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{lang === 'ru' ? 'Онлайн-запись на консультацию' : 'Консультацияга онлайн-жазылуу'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>CRM24 · Бишкек</div>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleWidgetSubmit}>
          <div className="field">
            <label>{lang === 'ru' ? '1. Выберите услугу' : '1. Кызматты тандаңыз'}</label>
            <select className="select" value={wServiceIdx} onChange={(e) => setWServiceIdx(Number(e.target.value))}>
              {services.map((s, idx) => (
                <option key={s.id} value={idx}>
                  {tx(s.name, lang)} ({s.price === 0 ? (lang === 'ru' ? 'Бесплатно' : 'Акысыз') : formatSom(s.price, lang)})
                </option>
              ))}
            </select>
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? '2. Специалист' : '2. Адис'}</label>
              <select className="select" value={wResId} onChange={(e) => setWResId(e.target.value)}>
                {resources.filter((r) => r.active).map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? '3. Время (20.11)' : '3. Убактысы (20.11)'}</label>
              <select className="select" value={wTime} onChange={(e) => setWTime(e.target.value)}>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Ваше имя' : 'Атыңыз'}</label>
              <input className="input" required value={wClient} onChange={(e) => setWClient(e.target.value)} />
            </div>
            <div className="field">
              <label>{tx(UI.common.phone, lang)}</label>
              <input className="input" value={wPhone} onChange={(e) => setWPhone(e.target.value)} placeholder="+996 ..." />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
            {lang === 'ru' ? 'Подтвердить запись' : 'Жазылууну ырастоо'}
          </button>
        </form>
      </div>
    </div>
  );
};
