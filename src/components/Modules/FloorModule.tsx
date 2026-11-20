import React, { useState } from 'react';
import { CalendarPlus, Check, Plus, Receipt, Users } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { HallZoneId, TableStatus } from '../../types';
import { Modal } from '../Layout/Modal';

export const FloorModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    tables,
    orders,
    reservations,
    openTableOrder,
    addReservation,
    seatReservation,
    notify,
  } = useRestaurant();

  const [statusFilter, setStatusFilter] = useState<'all' | TableStatus>('all');
  const [selectedTableId, setSelectedTableId] = useState<string>(tables[1]?.id ?? tables[0]?.id ?? '');
  const [resModalOpen, setResModalOpen] = useState(false);

  const [rName, setRName] = useState('');
  const [rPhone, setRPhone] = useState('+996 555 ');
  const [rTableId, setRTableId] = useState(tables[0]?.id ?? '');
  const [rGuests, setRGuests] = useState('4');
  const [rTime, setRTime] = useState('19:30');
  const [rDeposit, setRDeposit] = useState('0');
  const [rNote, setRNote] = useState('');

  const [wZone, setWZone] = useState<HallZoneId>('main');
  const [wGuests, setWGuests] = useState('4');
  const [wDate, setWDate] = useState('20.11.2026');
  const [wTime, setWTime] = useState('19:30');
  const [wName, setWName] = useState('');
  const [wPhone, setWPhone] = useState('');
  const [wNote, setWNote] = useState('');

  const q = searchQuery.trim().toLowerCase();

  const getOrderSum = (orderId?: string): number => {
    if (!orderId) return 0;
    const ord = orders.find((o) => o.id === orderId);
    if (!ord) return 0;
    return ord.items.reduce(
      (sum, it) => sum + (it.unitPrice + it.modifiers.reduce((ms, m) => ms + m.priceDelta, 0)) * it.qty,
      0
    );
  };

  const handleCreateRes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rName.trim()) return;
    const tbl = tables.find((t) => t.id === rTableId) ?? tables[0];
    addReservation({
      guestName: rName.trim(),
      phone: rPhone.trim(),
      tableId: tbl.id,
      tableNumber: tbl.number,
      guestsCount: Number(rGuests) || 2,
      time: rTime,
      date: '20.11.2026',
      deposit: Number(rDeposit) || 0,
      note: rNote.trim() || { ru: 'Бронь из CRM', ky: 'CRMден брондоо' },
    });
    setRName('');
    setRNote('');
    setResModalOpen(false);
    notify(lang === 'ru' ? `Стол ${tbl.number} забронирован` : `Стол ${tbl.number} брондолду`);
  };

  if (activeTab === 'reservations') {
    const filteredRes = reservations.filter(
      (r) => !q || r.guestName.toLowerCase().includes(q) || r.tableNumber.toLowerCase().includes(q)
    );

    return (
      <div>
        <div className="toolbar-row">
          <div>
            <strong style={{ fontSize: 15 }}>
              {lang === 'ru' ? 'Журнал бронирования столов · 20.11.2026' : 'Столдорду брондоо журналы · 20.11.2026'}
            </strong>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setResModalOpen(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новая бронь' : 'Жаңы бронь'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{tx(UI.common.guest, lang)}</th>
                <th>{tx(UI.common.phone, lang)}</th>
                <th>{tx(UI.common.table, lang)}</th>
                <th>{tx(UI.common.guests, lang)}</th>
                <th>{lang === 'ru' ? 'Время' : 'Убактысы'}</th>
                <th>{lang === 'ru' ? 'Депозит' : 'Депозит'}</th>
                <th>{tx(UI.common.comment, lang)}</th>
                <th>{tx(UI.common.status, lang)}</th>
                <th>{tx(UI.common.actions, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRes.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.guestName}</td>
                  <td>{r.phone}</td>
                  <td><span className="pill">{r.tableNumber}</span></td>
                  <td>{r.guestsCount}</td>
                  <td><strong>{r.time}</strong></td>
                  <td>{r.deposit > 0 ? formatSom(r.deposit) : '—'}</td>
                  <td style={{ color: 'var(--ink-secondary)' }}>{tx(r.note, lang)}</td>
                  <td>
                    <span className={`pill ${r.status === 'seated' ? 'pill-dark' : 'pill-mid'}`}>
                      {r.status === 'confirmed'
                        ? lang === 'ru'
                          ? 'Ожидается'
                          : 'Күтүлүүдө'
                        : lang === 'ru'
                        ? 'Посажен'
                        : 'Отургузулду'}
                    </span>
                  </td>
                  <td>
                    {r.status === 'confirmed' ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          seatReservation(r.id);
                          notify(lang === 'ru' ? `Гости посажены за стол ${r.tableNumber}` : `Коноктор ${r.tableNumber}-столго отургузулду`);
                        }}
                      >
                        <Check size={13} />
                        {lang === 'ru' ? 'Посадить' : 'Отургузуу'}
                      </button>
                    ) : (
                      <span style={{ color: 'var(--ink-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={resModalOpen}
          onClose={() => setResModalOpen(false)}
          title={lang === 'ru' ? 'Новое бронирование стола' : 'Жаңы стол брондоо'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setResModalOpen(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="res-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="res-form" className="form-grid" onSubmit={handleCreateRes}>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.guest, lang)}</label>
                <input className="input" required value={rName} onChange={(e) => setRName(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={rPhone} onChange={(e) => setRPhone(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.table, lang)}</label>
                <select className="select" value={rTableId} onChange={(e) => setRTableId(e.target.value)}>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {tx(UI.common.table, lang)} {t.number} ({t.seats} {lang === 'ru' ? 'мест' : 'орун'})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Время' : 'Убактысы'}</label>
                <input className="input" value={rTime} onChange={(e) => setRTime(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.guests, lang)}</label>
                <input className="input" type="number" min={1} max={16} value={rGuests} onChange={(e) => setRGuests(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Депозит (сом)' : 'Депозит (сом)'}</label>
                <input className="input" type="number" value={rDeposit} onChange={(e) => setRDeposit(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{tx(UI.common.comment, lang)}</label>
              <input className="input" value={rNote} onChange={(e) => setRNote(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'booking_widget') {
    const handleWidgetBooking = (e: React.FormEvent) => {
      e.preventDefault();
      if (!wName.trim()) return;
      const freeTbl =
        tables.find((t) => t.zone === wZone && t.status === 'free') ??
        tables.find((t) => t.status === 'free') ??
        tables[0];
      addReservation({
        guestName: wName.trim(),
        phone: wPhone.trim() || '+996 555 000 000',
        tableId: freeTbl.id,
        tableNumber: freeTbl.number,
        guestsCount: Number(wGuests) || 2,
        time: wTime,
        date: wDate,
        deposit: 0,
        note: wNote.trim() || { ru: 'Онлайн-бронь с виджета', ky: 'Виджеттен онлайн-бронь' },
      });
      setWName('');
      setWPhone('');
      setWNote('');
      notify(lang === 'ru' ? `Стол ${freeTbl.number} забронирован через виджет!` : `Виджет аркылуу ${freeTbl.number}-стол брондолду!`);
    };

    return (
      <div style={{ maxWidth: 490, margin: '10px auto' }} className="card card-pad">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12, marginBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <span className="brand-emblem">R</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {lang === 'ru' ? 'Виджет онлайн-бронирования стола' : 'Столду онлайн-брондоо виджети'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
              {lang === 'ru' ? 'Гостевая форма для сайта — сразу создаёт бронь в журнале' : 'Сайт үчүн конок формасы — дароо журналга жазат'}
            </div>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleWidgetBooking}>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Зона зала' : 'Зал бөлүгү'}</label>
              <select className="select" value={wZone} onChange={(e) => setWZone(e.target.value as HallZoneId)}>
                <option value="main">{lang === 'ru' ? 'Основной зал' : 'Негизги зал'}</option>
                <option value="terrace_vip">{lang === 'ru' ? 'Терраса и VIP' : 'Терраса жана VIP'}</option>
              </select>
            </div>
            <div className="field">
              <label>{tx(UI.common.guests, lang)}</label>
              <input className="input" type="number" min={1} max={16} value={wGuests} onChange={(e) => setWGuests(e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Дата' : 'Күнү'}</label>
              <input className="input" value={wDate} onChange={(e) => setWDate(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Время' : 'Убактысы'}</label>
              <input className="input" value={wTime} onChange={(e) => setWTime(e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Ваше имя' : 'Атыңыз'}</label>
              <input className="input" required value={wName} onChange={(e) => setWName(e.target.value)} />
            </div>
            <div className="field">
              <label>{tx(UI.common.phone, lang)}</label>
              <input className="input" value={wPhone} onChange={(e) => setWPhone(e.target.value)} placeholder="+996 ..." />
            </div>
          </div>
          <div className="field">
            <label>{lang === 'ru' ? 'Пожелания к столу' : 'Каалоолор'}</label>
            <input className="input" value={wNote} onChange={(e) => setWNote(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 4 }}>
            <CalendarPlus size={15} />
            {lang === 'ru' ? 'Забронировать стол' : 'Стол брондоо'}
          </button>
        </form>
      </div>
    );
  }

  // Interactive Floor Map (main or terrace_vip)
  const zone: HallZoneId = activeTab === 'terrace_vip' ? 'terrace_vip' : 'main';
  const zoneTables = tables.filter((t) => t.zone === zone);
  const visibleTables = zoneTables.filter(
    (t) =>
      (statusFilter === 'all' || t.status === statusFilter) &&
      (!q || t.number.toLowerCase().includes(q) || (t.waiter ?? '').toLowerCase().includes(q))
  );
  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? zoneTables[0];
  const selectedOrder = selectedTable?.activeOrderId ? orders.find((o) => o.id === selectedTable.activeOrderId) : undefined;
  const selectedOrderSum = getOrderSum(selectedTable?.activeOrderId);

  return (
    <div>
      <div className="toolbar-row">
        <div className="seg-control">
          {(['all', 'free', 'occupied', 'reserved', 'precheck'] as const).map((st) => (
            <button
              key={st}
              type="button"
              className={`seg-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'all' ? `${tx(UI.common.all, lang)} (${zoneTables.length})` : tx(UI.tableStatus[st], lang)}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn"
          onClick={() => {
            if (selectedTable) setRTableId(selectedTable.id);
            setResModalOpen(true);
          }}
        >
          <CalendarPlus size={14} />
          {lang === 'ru' ? 'Забронировать стол' : 'Стол брондоо'}
        </button>
      </div>

      <div className="floor-layout">
        {/* Dot-grid Architectural Floor Canvas */}
        <div className="floor-canvas">
          {visibleTables.map((tbl) => {
            const sum = getOrderSum(tbl.activeOrderId);
            const isSel = selectedTable?.id === tbl.id;
            const dims =
              tbl.shape === 'wide'
                ? { width: 162, height: 84 }
                : tbl.shape === 'round'
                ? { width: 96, height: 96 }
                : { width: 112, height: 92 };

            return (
              <button
                key={tbl.id}
                type="button"
                className={`floor-table-node shape-${tbl.shape} status-${tbl.status} ${isSel ? 'selected' : ''}`}
                style={{ left: `${tbl.x}%`, top: `${tbl.y}%`, ...dims }}
                onClick={() => setSelectedTableId(tbl.id)}
                onDoubleClick={() => openTableOrder(tbl.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 4 }}>
                  <strong style={{ fontSize: 13.5 }}>{tbl.number}</strong>
                  <span style={{ fontSize: 11, opacity: 0.75, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    <Users size={11} /> {tbl.guestCount ?? tbl.seats}
                  </span>
                </div>
                <div style={{ fontSize: 11, opacity: 0.85 }}>{tx(UI.tableStatus[tbl.status], lang)}</div>
                {sum > 0 && <div style={{ fontWeight: 700, fontSize: 12 }}>{formatSom(sum)}</div>}
              </button>
            );
          })}
        </div>

        {/* Right Table Inspector Card */}
        <div className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedTable ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    {tx(UI.common.table, lang)} {selectedTable.number}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
                    {selectedTable.seats} {lang === 'ru' ? 'посадочных мест' : 'орундук'}
                  </div>
                </div>
                <span className={`pill ${selectedTable.status === 'precheck' ? 'pill-dark' : 'pill-mid'}`}>
                  {tx(UI.tableStatus[selectedTable.status], lang)}
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedOrder ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-secondary)' }}>{lang === 'ru' ? 'Заказ' : 'Буйрутма'}</span>
                      <strong>{selectedOrder.orderNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-secondary)' }}>{tx(UI.common.waiter, lang)}</span>
                      <span>{selectedOrder.waiter}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--ink-secondary)' }}>{lang === 'ru' ? 'Позиций' : 'Тамактар'}</span>
                      <span>{selectedOrder.items.reduce((a, b) => a + b.qty, 0)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                      <strong>{tx(UI.common.sum, lang)}</strong>
                      <strong>{formatSom(selectedOrderSum)}</strong>
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--ink-muted)', padding: '12px 0' }}>
                    {lang === 'ru'
                      ? 'Стол свободен. Откройте заказ, чтобы начать обслуживание.'
                      : 'Стол бош. Тейлөөнү баштоо үчүн буйрутма ачыңыз.'}
                  </div>
                )}
              </div>

              <button type="button" className="btn btn-primary" onClick={() => openTableOrder(selectedTable.id)}>
                <Receipt size={15} />
                {selectedOrder
                  ? lang === 'ru'
                    ? 'Перейти к заказу'
                    : 'Буйрутмага өтүү'
                  : lang === 'ru'
                  ? 'Открыть заказ'
                  : 'Буйрутма ачуу'}
              </button>

              {!selectedOrder && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setRTableId(selectedTable.id);
                    setResModalOpen(true);
                  }}
                >
                  <CalendarPlus size={14} />
                  {lang === 'ru' ? 'Создать бронь' : 'Бронь түзүү'}
                </button>
              )}
            </>
          ) : null}
        </div>
      </div>

      <Modal
        open={resModalOpen}
        onClose={() => setResModalOpen(false)}
        title={lang === 'ru' ? 'Бронирование стола' : 'Стол брондоо'}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setResModalOpen(false)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="res-form-map" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
          </>
        }
      >
        <form id="res-form-map" className="form-grid" onSubmit={handleCreateRes}>
          <div className="form-row-2">
            <div className="field">
              <label>{tx(UI.common.guest, lang)}</label>
              <input className="input" required value={rName} onChange={(e) => setRName(e.target.value)} />
            </div>
            <div className="field">
              <label>{tx(UI.common.phone, lang)}</label>
              <input className="input" value={rPhone} onChange={(e) => setRPhone(e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{tx(UI.common.table, lang)}</label>
              <select className="select" value={rTableId} onChange={(e) => setRTableId(e.target.value)}>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>{tx(UI.common.table, lang)} {t.number}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Время' : 'Убактысы'}</label>
              <input className="input" value={rTime} onChange={(e) => setRTime(e.target.value)} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
