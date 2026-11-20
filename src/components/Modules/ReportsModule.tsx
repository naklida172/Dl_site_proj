import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Lock, Plus, Printer, Unlock } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { StaffAbsence, StaffPermissions } from '../../types';
import { Modal } from '../Layout/Modal';

export const ReportsModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    cashShift,
    cashOps,
    staff,
    weeklyShifts,
    staffAbsences,
    categories,
    dishes,
    addCashDrawerOp,
    toggleCashShift,
    addStaffMember,
    toggleStaffOnShift,
    toggleStaffPermission,
    cycleStaffShift,
    addStaffAbsence,
    notify,
  } = useRestaurant();

  const [drawerModal, setDrawerModal] = useState<'in' | 'out' | null>(null);
  const [opAmount, setOpAmount] = useState('1000');
  const [opReason, setOpReason] = useState('');
  const [xReportOpen, setXReportOpen] = useState(false);

  const [staffModal, setStaffModal] = useState(false);
  const [sName, setSName] = useState('');
  const [sRole, setSRole] = useState('');
  const [sPin, setSPin] = useState('6010');

  const [absModal, setAbsModal] = useState(false);
  const [abStaff, setAbStaff] = useState(staff[0]?.name ?? 'Айжан Садыкова');
  const [abType, setAbType] = useState<StaffAbsence['type']>('vacation');
  const [abFrom, setAbFrom] = useState('24.11.2026');
  const [abTo, setAbTo] = useState('27.11.2026');
  const [abComment, setAbComment] = useState('');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'shift') {
    const totalRev = cashShift.cashTotal + cashShift.cardTotal + cashShift.qrTotal + cashShift.bonusTotal;

    const handleDrawerOp = (e: React.FormEvent) => {
      e.preventDefault();
      if (!drawerModal) return;
      addCashDrawerOp(drawerModal, Number(opAmount) || 0, opReason.trim() || 'Операция по кассе');
      setOpReason('');
      setDrawerModal(null);
      notify(lang === 'ru' ? 'Операция по денежному ящику проведена' : 'Касса операциясы өткөрүлдү');
    };

    return (
      <div>
        <div className="toolbar-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <strong style={{ fontSize: 16 }}>
              {tx(UI.common.shift, lang)} #{cashShift.shiftNumber}
            </strong>
            <span className={`pill ${cashShift.status === 'open' ? 'pill-dark' : ''}`}>
              {cashShift.status === 'open' ? tx(UI.common.shiftOpen, lang) : tx(UI.common.shiftClosed, lang)}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={() => setDrawerModal('in')}>
              <ArrowDownLeft size={14} /> {lang === 'ru' ? 'Внесение' : 'Киргизүү'}
            </button>
            <button type="button" className="btn" onClick={() => setDrawerModal('out')}>
              <ArrowUpRight size={14} /> {lang === 'ru' ? 'Изъятие' : 'Алуу'}
            </button>
            <button type="button" className="btn" onClick={() => setXReportOpen(true)}>
              <Printer size={14} /> {lang === 'ru' ? 'X-отчёт' : 'X-отчёт'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                toggleCashShift();
                notify(
                  cashShift.status === 'open'
                    ? lang === 'ru'
                      ? 'Z-отчёт снят, кассовая смена закрыта'
                      : 'Z-отчёт алынды, нөөмөт жабылды'
                    : lang === 'ru'
                    ? 'Новая кассовая смена открыта'
                    : 'Жаңы нөөмөт ачылды'
                );
              }}
            >
              {cashShift.status === 'open' ? <Lock size={14} /> : <Unlock size={14} />}
              {cashShift.status === 'open'
                ? lang === 'ru'
                  ? 'Закрыть смену (Z)'
                  : 'Нөөмөттү жабуу (Z)'
                : lang === 'ru'
                ? 'Открыть смену'
                : 'Нөөмөт ачуу'}
            </button>
          </div>
        </div>

        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Выручка смены' : 'Нөөмөт кирешеси'}</div>
            <div className="kpi-value">{formatSom(totalRev)}</div>
            <div className="kpi-sub">{cashShift.checksCount} {lang === 'ru' ? 'чеков' : 'чек'}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{tx(UI.paymentMethods.cash, lang)}</div>
            <div className="kpi-value">{formatSom(cashShift.cashTotal)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{tx(UI.paymentMethods.card, lang)}</div>
            <div className="kpi-value">{formatSom(cashShift.cardTotal)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">QR / MBank</div>
            <div className="kpi-value">{formatSom(cashShift.qrTotal)}</div>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Время' : 'Убактысы'}</th>
                <th>{lang === 'ru' ? 'Операция ящика' : 'Касса операциясы'}</th>
                <th>{tx(UI.common.sum, lang)}</th>
                <th>{lang === 'ru' ? 'Основание' : 'Негиздеме'}</th>
                <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
              </tr>
            </thead>
            <tbody>
              {cashOps.map((op) => (
                <tr key={op.id}>
                  <td>{op.time}</td>
                  <td>
                    <span className={`pill ${op.type === 'in' ? 'pill-mid' : 'pill-dark'}`}>
                      {op.type === 'in' ? (lang === 'ru' ? 'Внесение' : 'Киргизүү') : (lang === 'ru' ? 'Изъятие' : 'Алуу')}
                    </span>
                  </td>
                  <td><strong>{formatSom(op.amount)}</strong></td>
                  <td>{tx(op.reason, lang)}</td>
                  <td>{op.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={Boolean(drawerModal)}
          onClose={() => setDrawerModal(null)}
          title={drawerModal === 'in' ? (lang === 'ru' ? 'Внесение в кассу' : 'Кассага киргизүү') : (lang === 'ru' ? 'Изъятие из кассы' : 'Кассадан алуу')}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDrawerModal(null)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="drawer-op-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="drawer-op-form" className="form-grid" onSubmit={handleDrawerOp}>
            <div className="field">
              <label>{tx(UI.common.sum, lang)} (сом)</label>
              <input className="input" type="number" required value={opAmount} onChange={(e) => setOpAmount(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Комментарий' : 'Түшүндүрмө'}</label>
              <input className="input" required value={opReason} onChange={(e) => setOpReason(e.target.value)} />
            </div>
          </form>
        </Modal>

        <Modal
          open={xReportOpen}
          onClose={() => setXReportOpen(false)}
          title={`X-отчёт · ${tx(UI.common.shift, lang)} #${cashShift.shiftNumber}`}
          footer={<button type="button" className="btn btn-primary" onClick={() => setXReportOpen(false)}>{tx(UI.common.close, lang)}</button>}
        >
          <div style={{ fontFamily: 'monospace', background: 'var(--bg-surface-soft)', padding: 14, borderRadius: 8, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div>RESTAURANT CRM · RK7 PROTOTYPE</div>
            <div>Кассир: {cashShift.cashier}</div>
            <div>Открыта: {cashShift.openedAt}</div>
            <hr style={{ width: '100%', border: 'none', borderTop: '1px dashed var(--border-strong)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Наличные:</span><span>{formatSom(cashShift.cashTotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Карты:</span><span>{formatSom(cashShift.cardTotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>QR / MBank:</span><span>{formatSom(cashShift.qrTotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Бонусы:</span><span>{formatSom(cashShift.bonusTotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Возвраты:</span><span>{formatSom(cashShift.refundsTotal)}</span></div>
            <hr style={{ width: '100%', border: 'none', borderTop: '1px dashed var(--border-strong)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>ИТОГО:</span><span>{formatSom(totalRev)}</span></div>
          </div>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'olap') {
    const catSales = [
      { id: 'cat_nat', sum: 28400 },
      { id: 'cat_hot', sum: 19600 },
      { id: 'cat_bar', sum: 11200 },
      { id: 'cat_cold', sum: 6800 },
      { id: 'cat_soup', sum: 5400 },
      { id: 'cat_des', sum: 3900 },
    ];
    const maxCat = Math.max(...catSales.map((c) => c.sum));
    const totalOlap = catSales.reduce((a, b) => a + b.sum, 0);

    return (
      <div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Выручка (OLAP день)' : 'Күндүк киреше (OLAP)'}</div>
            <div className="kpi-value">{formatSom(totalOlap)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Средний чек' : 'Орточо чек'}</div>
            <div className="kpi-value">{formatSom(2480)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Средний Food Cost' : 'Орточо Food Cost'}</div>
            <div className="kpi-value">27.4%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">{lang === 'ru' ? 'Оборачиваемость стола' : 'Стол алмашуусу'}</div>
            <div className="kpi-value">3.2×</div>
          </div>
        </div>

        <div className="form-row-2" style={{ alignItems: 'start' }}>
          <div className="card card-pad">
            <h3 style={{ margin: '0 0 14px', fontSize: 14.5 }}>
              {lang === 'ru' ? 'Выручка по категориям меню' : 'Меню категориялары боюнча киреше'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {catSales.map((cs) => {
                const cat = categories.find((c) => c.id === cs.id);
                const pct = Math.round((cs.sum / maxCat) * 100);
                return (
                  <div key={cs.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>{cat ? tx(cat.name, lang) : cs.id}</span>
                      <strong>{formatSom(cs.sum)}</strong>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 14px', fontSize: 14.5 }}>
              {lang === 'ru' ? 'ABC-рейтинг блюд (Топ продаж)' : 'Тамактардын ABC-рейтинги'}
            </h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === 'ru' ? 'Блюдо' : 'Тамак'}</th>
                    <th>ABC</th>
                    <th>{lang === 'ru' ? 'Порций' : 'Даана'}</th>
                    <th>{tx(UI.common.sum, lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dish: dishes[0], abc: 'A', qty: 24, sum: 18720 },
                    { dish: dishes[7], abc: 'A', qty: 8, sum: 14800 },
                    { dish: dishes[1], abc: 'B', qty: 19, sum: 9310 },
                    { dish: dishes[9], abc: 'B', qty: 28, sum: 6720 },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{row.dish ? tx(row.dish.name, lang) : '—'}</td>
                      <td><span className={`pill ${row.abc === 'A' ? 'pill-dark' : 'pill-mid'}`}>{row.abc}</span></td>
                      <td>{row.qty}</td>
                      <td><strong>{formatSom(row.sum)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'schedule') {
    const dayNames = lang === 'ru' ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] : ['Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш', 'Жк'];

    const handleAddAbs = (e: React.FormEvent) => {
      e.preventDefault();
      addStaffAbsence({
        staffName: abStaff,
        type: abType,
        from: abFrom,
        to: abTo,
        comment: abComment.trim() || { ru: 'Согласовано с менеджером', ky: 'Менеджер менен макулдашылды' },
      });
      setAbComment('');
      setAbsModal(false);
      notify(lang === 'ru' ? 'Отсутствие добавлено в график' : 'Жок болуу графигине кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <div>
            <strong style={{ fontSize: 15 }}>
              {lang === 'ru' ? 'График смен персонала (Пн–Вс)' : 'Кызматкерлердин нөөмөт графиги (Дш–Жк)'}
            </strong>
            <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
              {lang === 'ru' ? 'Нажмите на ячейку дня, чтобы сменить смену: Утро → Вечер → Выходной' : 'Алмаштыруу үчүн уячаны басыңыз: Эртең → Кеч → Дем алыш'}
            </div>
          </div>
        </div>

        <div className="table-wrap" style={{ marginBottom: 20 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
                {dayNames.map((dn) => (
                  <th key={dn} style={{ textAlign: 'center' }}>{dn}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklyShifts
                .filter((ws) => !q || ws.staffName.toLowerCase().includes(q))
                .map((ws) => (
                  <tr key={ws.staffId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ws.staffName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>{tx(ws.role, lang)}</div>
                    </td>
                    {ws.days.map((slot, idx) => (
                      <td key={idx} style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className={`pill ${slot === 'morning' ? 'pill-mid' : slot === 'evening' ? 'pill-dark' : ''}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={() => cycleStaffShift(ws.staffId, idx)}
                        >
                          {tx(UI.shiftSlots[slot], lang)}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Отпуска, больничные и отгулы' : 'Өргүүлөр жана ооруп калуулар'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setAbsModal(true)}>
            <Plus size={14} />
            {lang === 'ru' ? 'Добавить отсутствие' : 'Жок болуу кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
                <th>{lang === 'ru' ? 'Причина' : 'Себеби'}</th>
                <th>{lang === 'ru' ? 'Период' : 'Мезгил'}</th>
                <th>{tx(UI.common.comment, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {staffAbsences.map((ab) => (
                <tr key={ab.id}>
                  <td style={{ fontWeight: 600 }}>{ab.staffName}</td>
                  <td><span className="pill pill-mid">{tx(UI.absenceTypes[ab.type], lang)}</span></td>
                  <td>{ab.from} — {ab.to}</td>
                  <td style={{ color: 'var(--ink-secondary)' }}>{tx(ab.comment, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={absModal}
          onClose={() => setAbsModal(false)}
          title={lang === 'ru' ? 'Добавить отсутствие' : 'Жок болуу кошуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setAbsModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="st-abs-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="st-abs-form" className="form-grid" onSubmit={handleAddAbs}>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</label>
                <select className="select" value={abStaff} onChange={(e) => setAbStaff(e.target.value)}>
                  {staff.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Причина' : 'Себеби'}</label>
                <select className="select" value={abType} onChange={(e) => setAbType(e.target.value as StaffAbsence['type'])}>
                  <option value="vacation">{tx(UI.absenceTypes.vacation, lang)}</option>
                  <option value="sick">{tx(UI.absenceTypes.sick, lang)}</option>
                  <option value="day_off">{tx(UI.absenceTypes.day_off, lang)}</option>
                </select>
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'С' : 'Башталышы'}</label>
                <input className="input" value={abFrom} onChange={(e) => setAbFrom(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'По' : 'Аякташы'}</label>
                <input className="input" value={abTo} onChange={(e) => setAbTo(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{tx(UI.common.comment, lang)}</label>
              <input className="input" value={abComment} onChange={(e) => setAbComment(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Staff & r_keeper Permissions Matrix
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) return;
    const initials = sName
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0].toUpperCase())
      .join('');
    addStaffMember({
      name: sName.trim(),
      initials: initials || 'НС',
      role: sRole.trim() || { ru: 'Официант', ky: 'Официант' },
      pinCode: sPin,
      onShift: true,
      ordersServed: 0,
      salesTotal: 0,
      permissions: { canVoidCheck: false, canApplyDiscount: false, canEditStopList: false, canCloseShift: false },
    });
    setSName('');
    setSRole('');
    setStaffModal(false);
    notify(lang === 'ru' ? 'Сотрудник добавлен' : 'Кызматкер кошулду');
  };

  const permKeys: { key: keyof StaffPermissions; label: { ru: string; ky: string } }[] = [
    { key: 'canVoidCheck', label: { ru: 'Возврат чека', ky: 'Чек кайтаруу' } },
    { key: 'canApplyDiscount', label: { ru: 'Скидки', ky: 'Арзандатуу' } },
    { key: 'canEditStopList', label: { ru: 'Стоп-лист', ky: 'Стоп-лист' } },
    { key: 'canCloseShift', label: { ru: 'Закрытие Z', ky: 'Z жабуу' } },
  ];

  return (
    <div>
      <div className="toolbar-row">
        <strong style={{ fontSize: 15 }}>
          {lang === 'ru' ? 'Персонал, PIN-коды и права кассы (r_keeper)' : 'Кызматкерлер, PIN-коддор жана касса укуктары'}
        </strong>
        <button type="button" className="btn btn-primary" onClick={() => setStaffModal(true)}>
          <Plus size={15} />
          {lang === 'ru' ? 'Добавить сотрудника' : 'Кызматкер кошуу'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
              <th>{lang === 'ru' ? 'Должность' : 'Кызматы'}</th>
              <th>PIN</th>
              <th>{lang === 'ru' ? 'На смене' : 'Нөөмөттө'}</th>
              {permKeys.map((pk) => (
                <th key={pk.key}>{tx(pk.label, lang)}</th>
              ))}
              <th>{lang === 'ru' ? 'Выручка' : 'Сатуу'}</th>
            </tr>
          </thead>
          <tbody>
            {staff
              .filter((st) => !q || st.name.toLowerCase().includes(q) || tx(st.role, lang).toLowerCase().includes(q))
              .map((st) => (
                <tr key={st.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="avatar-circle" style={{ width: 26, height: 26 }}>{st.initials}</span>
                      <strong>{st.name}</strong>
                    </div>
                  </td>
                  <td>{tx(st.role, lang)}</td>
                  <td><span className="pill">{st.pinCode}</span></td>
                  <td>
                    <button type="button" className={`switch-btn ${st.onShift ? 'on' : ''}`} onClick={() => toggleStaffOnShift(st.id)}>
                      <span className="switch-thumb" />
                    </button>
                  </td>
                  {permKeys.map((pk) => (
                    <td key={pk.key}>
                      <button
                        type="button"
                        className={`switch-btn ${st.permissions[pk.key] ? 'on' : ''}`}
                        onClick={() => toggleStaffPermission(st.id, pk.key)}
                      >
                        <span className="switch-thumb" />
                      </button>
                    </td>
                  ))}
                  <td><strong>{formatSom(st.salesTotal)}</strong></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={staffModal}
        onClose={() => setStaffModal(false)}
        title={lang === 'ru' ? 'Новый сотрудник ресторана' : 'Ресторандын жаңы кызматкери'}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setStaffModal(false)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="st-add-form" className="btn btn-primary">{tx(UI.common.add, lang)}</button>
          </>
        }
      >
        <form id="st-add-form" className="form-grid" onSubmit={handleAddStaff}>
          <div className="field">
            <label>{lang === 'ru' ? 'ФИО' : 'Аты-жөнү'}</label>
            <input className="input" required value={sName} onChange={(e) => setSName(e.target.value)} />
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Должность' : 'Кызматы'}</label>
              <input className="input" value={sRole} onChange={(e) => setSRole(e.target.value)} />
            </div>
            <div className="field">
              <label>PIN (4 цифры)</label>
              <input className="input" value={sPin} onChange={(e) => setSPin(e.target.value)} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
