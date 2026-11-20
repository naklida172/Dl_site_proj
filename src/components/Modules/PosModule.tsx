import React, { useState } from 'react';
import { ArrowRightLeft, CreditCard, Flame, Minus, Plus, Printer, RotateCcw, Split, Trash2, Users } from 'lucide-react';
import { STATION_NAMES, UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { CourseNumber, LText, MenuDish, PaymentMethod } from '../../types';
import { Modal } from '../Layout/Modal';

export const PosModule: React.FC = () => {
  const {
    lang,
    activeTab,
    setActiveTab,
    searchQuery,
    orders,
    selectedOrderId,
    setSelectedOrderId,
    createFastOrder,
    closedChecks,
    tables,
    categories,
    dishes,
    modifierGroups,
    discounts,
    addDishToOrder,
    updateOrderItemQty,
    removeOrderItem,
    moveOrderItemToGuest,
    transferOrderToTable,
    applyOrderDiscount,
    requestPrecheck,
    sendOrderToKitchen,
    payAndCloseOrder,
    voidClosedCheck,
    notify,
  } = useRestaurant();

  const [catFilter, setCatFilter] = useState<string>('all');
  const [guestSeatFilter, setGuestSeatFilter] = useState<number>(1);
  const [maxSeats, setMaxSeats] = useState<number>(3);
  const [course, setCourse] = useState<CourseNumber>(1);

  // Automatic Modifier Modal (Art. Lebedev r_keeper behavior)
  const [modDish, setModDish] = useState<MenuDish | null>(null);
  const [selectedModIds, setSelectedModIds] = useState<string[]>([]);
  const [modNote, setModNote] = useState('');

  // Transfer Table Modal
  const [transferOpen, setTransferOpen] = useState(false);
  const [targetTableId, setTargetTableId] = useState('');

  // Split by Guests Modal
  const [splitOpen, setSplitOpen] = useState(false);

  // Payment Modal
  const [payOpen, setPayOpen] = useState(false);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('card');
  const [cashTendered, setCashTendered] = useState('');

  const q = searchQuery.trim().toLowerCase();
  const activeOrder = orders.find((o) => o.id === selectedOrderId) ?? orders[0];

  const calcOrderTotals = (ord = activeOrder) => {
    if (!ord) return { subtotal: 0, discountAmt: 0, total: 0 };
    const subtotal = ord.items.reduce(
      (sum, it) => sum + (it.unitPrice + it.modifiers.reduce((ms, m) => ms + m.priceDelta, 0)) * it.qty,
      0
    );
    const rule = discounts.find((d) => d.id === ord.discountId);
    const delta = rule ? Math.round((subtotal * rule.percent) / 100) * (rule.kind === 'discount' ? 1 : -1) : 0;
    return { subtotal, discountAmt: delta, total: Math.max(0, subtotal - delta) };
  };

  // Consolidated Orders Dashboard
  if (activeTab === 'all_orders') {
    const filteredOrders = orders.filter(
      (o) =>
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        (o.tableNumber ?? '').toLowerCase().includes(q) ||
        o.waiter.toLowerCase().includes(q)
    );
    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Активные заказы по залу и кассе' : 'Зал жана кассадагы активдүү буйрутмалар'} ({filteredOrders.length})
          </strong>
          <button type="button" className="btn btn-primary" onClick={createFastOrder}>
            <Plus size={15} />
            {tx(UI.common.quickOrder, lang)}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>№</th>
                <th>{tx(UI.common.table, lang)}</th>
                <th>{tx(UI.common.waiter, lang)}</th>
                <th>{lang === 'ru' ? 'Открыт' : 'Ачылды'}</th>
                <th>{lang === 'ru' ? 'Позиций' : 'Тамактар'}</th>
                <th>{tx(UI.common.sum, lang)}</th>
                <th>{tx(UI.common.status, lang)}</th>
                <th>{tx(UI.common.actions, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => {
                const { total } = calcOrderTotals(o);
                const unsentCount = o.items.filter((i) => !i.sentToKitchen).length;
                return (
                  <tr key={o.id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>
                      <span className="pill">
                        {o.tableNumber ? `${tx(UI.common.table, lang)} ${o.tableNumber}` : (lang === 'ru' ? 'Быстрый чек' : 'Тез чек')}
                      </span>
                    </td>
                    <td>{o.waiter}</td>
                    <td>{o.openedAt}</td>
                    <td>{o.items.reduce((a, b) => a + b.qty, 0)}</td>
                    <td style={{ fontWeight: 700 }}>{formatSom(total)}</td>
                    <td>
                      <span className={`pill ${o.precheckRequested ? 'pill-dark' : 'pill-mid'}`}>
                        {o.precheckRequested
                          ? tx(UI.tableStatus.precheck, lang)
                          : unsentCount > 0
                          ? lang === 'ru'
                            ? `Не отправлено: ${unsentCount}`
                            : `Жөнөтүлбөдү: ${unsentCount}`
                          : lang === 'ru'
                          ? 'На кухне'
                          : 'Ашканада'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          setSelectedOrderId(o.id);
                          setActiveTab('terminal');
                        }}
                      >
                        {lang === 'ru' ? 'Открыть' : 'Ачуу'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Closed Checks Archive
  if (activeTab === 'closed_checks') {
    const filteredChecks = closedChecks.filter(
      (c) => !q || c.checkNumber.toLowerCase().includes(q) || c.orderNumber.toLowerCase().includes(q)
    );
    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Архив фискальных чеков смены' : 'Нөөмөттүн жабылган чектери'} ({filteredChecks.length})
          </strong>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Чек №' : 'Чек №'}</th>
                <th>{lang === 'ru' ? 'Заказ' : 'Буйрутма'}</th>
                <th>{tx(UI.common.table, lang)}</th>
                <th>{tx(UI.common.waiter, lang)}</th>
                <th>{lang === 'ru' ? 'Закрыт' : 'Жабылды'}</th>
                <th>{lang === 'ru' ? 'Оплата' : 'Төлөм'}</th>
                <th>{tx(UI.common.sum, lang)}</th>
                <th>{tx(UI.common.actions, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredChecks.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.checkNumber}</strong></td>
                  <td>{c.orderNumber}</td>
                  <td>{tx(c.tableLabel, lang)}</td>
                  <td>{c.waiter}</td>
                  <td>{c.closedAt}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {c.payments.map((p, idx) => (
                        <span key={idx} className="pill">
                          {tx(UI.paymentMethods[p.method], lang)}: {formatSom(p.amount)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, textDecoration: c.refunded ? 'line-through' : 'none' }}>{formatSom(c.total)}</td>
                  <td>
                    {c.refunded ? (
                      <span className="pill pill-dark">{lang === 'ru' ? 'Возврат' : 'Кайтарылды'}</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          voidClosedCheck(c.id);
                          notify(lang === 'ru' ? `Выполнен возврат чека ${c.checkNumber}` : `${c.checkNumber} чеги кайтарылды`);
                        }}
                      >
                        <RotateCcw size={12} />
                        {lang === 'ru' ? 'Возврат' : 'Кайтаруу'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Order Terminal (POS)
  const handleDishClick = (dish: MenuDish) => {
    if (!activeOrder || dish.stopListed || !dish.active) return;
    if (dish.modifierGroupIds.length > 0) {
      // Pre-select first option for required groups
      const defaults: string[] = [];
      dish.modifierGroupIds.forEach((gid) => {
        const grp = modifierGroups.find((g) => g.id === gid);
        if (grp?.required && grp.options[0]) defaults.push(grp.options[0].id);
      });
      setSelectedModIds(defaults);
      setModNote('');
      setModDish(dish);
    } else {
      addDishToOrder(activeOrder.id, dish, guestSeatFilter, course, [], '');
      notify(`${tx(dish.name, lang)} +1`);
    }
  };

  const confirmModifierDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modDish || !activeOrder) return;
    const chosen: { optionId: string; name: LText; priceDelta: number }[] = [];
    modDish.modifierGroupIds.forEach((gid) => {
      const grp = modifierGroups.find((g) => g.id === gid);
      grp?.options.forEach((opt) => {
        if (selectedModIds.includes(opt.id)) {
          chosen.push({ optionId: opt.id, name: opt.name, priceDelta: opt.priceDelta });
        }
      });
    });
    addDishToOrder(activeOrder.id, modDish, guestSeatFilter, course, chosen, modNote.trim());
    setModDish(null);
    notify(`${tx(modDish.name, lang)} +1`);
  };

  const toggleModOption = (groupId: string, optionId: string, maxSelect: number) => {
    const grp = modifierGroups.find((g) => g.id === groupId);
    if (!grp) return;
    const grpOptIds = grp.options.map((o) => o.id);
    setSelectedModIds((prev) => {
      if (prev.includes(optionId)) {
        if (grp.required && prev.filter((id) => grpOptIds.includes(id)).length <= 1) return prev;
        return prev.filter((id) => id !== optionId);
      }
      if (maxSelect === 1) {
        return [...prev.filter((id) => !grpOptIds.includes(id)), optionId];
      }
      const curInGroup = prev.filter((id) => grpOptIds.includes(id));
      if (curInGroup.length >= maxSelect) return prev;
      return [...prev, optionId];
    });
  };

  const { subtotal, discountAmt, total } = calcOrderTotals(activeOrder);
  const unsentCount = activeOrder ? activeOrder.items.filter((i) => !i.sentToKitchen).length : 0;
  const freeTables = tables.filter((t) => !t.activeOrderId);

  const visibleDishes = dishes.filter((d) => {
    if (!d.active) return false;
    const catOk = catFilter === 'all' || d.categoryId === catFilter;
    const searchOk =
      !q ||
      tx(d.name, lang).toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.altCode.toLowerCase().includes(q);
    return catOk && searchOk;
  });

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;
    payAndCloseOrder(activeOrder.id, [{ method: payMethod, amount: total }]);
    setPayOpen(false);
    setCashTendered('');
    notify(lang === 'ru' ? `Чек закрыт на сумму ${formatSom(total)}` : `Чек ${formatSom(total)} суммасына жабылды`);
  };

  return (
    <div>
      {/* Order Switcher Strip */}
      <div className="toolbar-row">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {orders.map((o) => (
            <button
              key={o.id}
              type="button"
              className={`btn btn-sm ${activeOrder?.id === o.id ? 'btn-primary' : ''}`}
              onClick={() => setSelectedOrderId(o.id)}
            >
              {o.tableNumber ? `${tx(UI.common.table, lang)} ${o.tableNumber}` : (lang === 'ru' ? 'Быстрый' : 'Тез')} · {o.orderNumber}
            </button>
          ))}
          <button type="button" className="btn btn-sm" onClick={createFastOrder}>
            <Plus size={13} />
            {tx(UI.common.quickOrder, lang)}
          </button>
        </div>
      </div>

      {!activeOrder ? (
        <div className="empty-state">
          {lang === 'ru' ? 'Нет открытых заказов. Откройте стол на плане зала или создайте быстрый заказ.' : 'Ачык буйрутма жок. Зал планынан стол ачыңыз же тез буйрутма түзүңүз.'}
        </div>
      ) : (
        <div className="pos-layout">
          {/* Left Pane: Live Order Ticket */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>
                  {activeOrder.tableNumber
                    ? `${tx(UI.common.table, lang)} ${activeOrder.tableNumber} · ${activeOrder.orderNumber}`
                    : `${lang === 'ru' ? 'Быстрый чек' : 'Тез чек'} · ${activeOrder.orderNumber}`}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-secondary)' }}>
                  {activeOrder.waiter} · {lang === 'ru' ? 'Открыт в' : 'Ачылды'} {activeOrder.openedAt}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  className="btn btn-sm btn-icon"
                  title={lang === 'ru' ? 'Перенести на другой стол' : 'Башка столго которуу'}
                  onClick={() => {
                    setTargetTableId(freeTables[0]?.id ?? '');
                    setTransferOpen(true);
                  }}
                >
                  <ArrowRightLeft size={13} />
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-icon"
                  title={lang === 'ru' ? 'Разбить по гостям' : 'Конокторго бөлүү'}
                  onClick={() => setSplitOpen(true)}
                >
                  <Split size={13} />
                </button>
              </div>
            </div>

            {/* Guest seat & Course selectors */}
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-soft)', display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <Users size={13} style={{ color: 'var(--ink-muted)' }} />
                {Array.from({ length: maxSeats }, (_, i) => i + 1).map((seat) => (
                  <button
                    key={seat}
                    type="button"
                    className={`btn btn-sm ${guestSeatFilter === seat ? 'btn-primary' : ''}`}
                    style={{ height: 24, padding: '0 8px' }}
                    onClick={() => setGuestSeatFilter(seat)}
                  >
                    Г{seat}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn btn-sm"
                  style={{ height: 24, padding: '0 7px' }}
                  onClick={() => setMaxSeats((s) => Math.min(8, s + 1))}
                >
                  +
                </button>
              </div>

              <div className="seg-control">
                {([1, 2, 3] as CourseNumber[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`seg-btn ${course === c ? 'active' : ''}`}
                    style={{ padding: '3px 7px', fontSize: 11 }}
                    onClick={() => setCourse(c)}
                  >
                    {c === 3 ? (lang === 'ru' ? 'Десерт' : 'Десерт') : `${c} ${lang === 'ru' ? 'курс' : 'курс'}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 240 }}>
              {activeOrder.items.length === 0 ? (
                <div className="empty-state" style={{ margin: 'auto 0' }}>
                  {lang === 'ru' ? 'Выберите блюда из меню справа' : 'Оң жактан менюдан тамак тандаңыз'}
                </div>
              ) : (
                activeOrder.items.map((item) => {
                  const unitFull = item.unitPrice + item.modifiers.reduce((ms, m) => ms + m.priceDelta, 0);
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--border)',
                        background: item.sentToKitchen ? 'var(--bg-surface)' : 'var(--bg-surface-soft)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600 }}>
                            {tx(item.name, lang)}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--ink-muted)', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                            <span>Г{item.guestSeat}</span>
                            <span>· {item.course} к.</span>
                            <span>· {item.sentToKitchen ? (lang === 'ru' ? 'Отправлено' : 'Жөнөтүлдү') : (lang === 'ru' ? 'Новое' : 'Жаңы')}</span>
                          </div>
                          {item.modifiers.length > 0 && (
                            <div style={{ fontSize: 11.5, color: 'var(--ink-secondary)', marginTop: 3 }}>
                              + {item.modifiers.map((m) => tx(m.name, lang)).join(', ')}
                            </div>
                          )}
                          {item.note && (
                            <div style={{ fontSize: 11.5, fontStyle: 'italic', color: 'var(--ink-secondary)' }}>«{item.note}»</div>
                          )}
                        </div>
                        <strong style={{ whiteSpace: 'nowrap' }}>{formatSom(unitFull * item.qty)}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <button type="button" className="btn btn-sm btn-icon" onClick={() => updateOrderItemQty(activeOrder.id, item.id, -1)}>
                            <Minus size={12} />
                          </button>
                          <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 600 }}>{item.qty}</span>
                          <button type="button" className="btn btn-sm btn-icon" onClick={() => updateOrderItemQty(activeOrder.id, item.id, 1)}>
                            <Plus size={12} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <select
                            className="select"
                            style={{ height: 26, fontSize: 11, padding: '0 6px', width: 72 }}
                            value={item.guestSeat}
                            onChange={(e) => moveOrderItemToGuest(activeOrder.id, item.id, Number(e.target.value))}
                          >
                            {Array.from({ length: maxSeats }, (_, i) => i + 1).map((s) => (
                              <option key={s} value={s}>{lang === 'ru' ? `Гость ${s}` : `Конок ${s}`}</option>
                            ))}
                          </select>
                          <button type="button" className="btn btn-sm btn-icon" onClick={() => removeOrderItem(activeOrder.id, item.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Discount, Totals & Action Buttons */}
            <div style={{ padding: 12, borderTop: '1px solid var(--border)', background: 'var(--bg-surface-soft)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <select
                className="select"
                style={{ height: 32, fontSize: 12 }}
                value={activeOrder.discountId ?? ''}
                onChange={(e) => applyOrderDiscount(activeOrder.id, e.target.value || undefined)}
              >
                <option value="">{lang === 'ru' ? 'Без скидки / наценки' : 'Арзандатуу жок'}</option>
                {discounts.filter((d) => d.active).map((d) => (
                  <option key={d.id} value={d.id}>{tx(d.name, lang)}</option>
                ))}
              </select>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-secondary)' }}>
                <span>{lang === 'ru' ? 'Подытог' : 'Аралык жыйынтык'}</span>
                <span>{formatSom(subtotal)}</span>
              </div>
              {discountAmt !== 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-secondary)' }}>
                  <span>{discountAmt > 0 ? (lang === 'ru' ? 'Скидка' : 'Арзандатуу') : (lang === 'ru' ? 'Надбавка' : 'Кошумча')}</span>
                  <span>{discountAmt > 0 ? `-${formatSom(discountAmt)}` : `+${formatSom(Math.abs(discountAmt))}`}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17, fontWeight: 700, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
                <span>{lang === 'ru' ? 'Итого к оплате' : 'Төлөм суммасы'}</span>
                <span>{formatSom(total)}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <button
                  type="button"
                  className="btn"
                  disabled={unsentCount === 0}
                  onClick={() => {
                    sendOrderToKitchen(activeOrder.id);
                    notify(lang === 'ru' ? 'Сервис-печать отправлена на кухню (KDS)' : 'Буйрутма ашканага (KDS) жөнөтүлдү');
                  }}
                >
                  <Flame size={14} />
                  {lang === 'ru' ? `На кухню (${unsentCount})` : `Ашканага (${unsentCount})`}
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={activeOrder.items.length === 0}
                  onClick={() => {
                    requestPrecheck(activeOrder.id);
                    notify(lang === 'ru' ? 'Пречек распечатан' : 'Алдын ала эсеп чыгарылды');
                  }}
                >
                  <Printer size={14} />
                  {lang === 'ru' ? 'Пречек' : 'Пречек'}
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                disabled={activeOrder.items.length === 0}
                onClick={() => {
                  setCashTendered(String(total));
                  setPayOpen(true);
                }}
              >
                <CreditCard size={15} />
                {lang === 'ru' ? `Оплата · ${formatSom(total)}` : `Төлөө · ${formatSom(total)}`}
              </button>
            </div>
          </div>

          {/* Right Pane: Touch Menu Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`subnav-pill ${catFilter === 'all' ? 'active' : ''}`}
                style={{ border: '1px solid var(--border)' }}
                onClick={() => setCatFilter('all')}
              >
                {tx(UI.common.all, lang)}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`subnav-pill ${catFilter === cat.id ? 'active' : ''}`}
                  style={{ border: '1px solid var(--border)' }}
                  onClick={() => setCatFilter(cat.id)}
                >
                  {tx(cat.name, lang)}
                </button>
              ))}
            </div>

            <div className="pos-menu-grid">
              {visibleDishes.map((dish) => (
                <button
                  key={dish.id}
                  type="button"
                  disabled={dish.stopListed}
                  className={`dish-tile ${dish.stopListed ? 'stopped' : ''}`}
                  onClick={() => handleDishClick(dish)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 600 }}>#{dish.code}</span>
                    {dish.stopListed ? (
                      <span className="pill pill-dark">{lang === 'ru' ? 'Стоп' : 'Стоп'}</span>
                    ) : dish.remainingLimit !== undefined ? (
                      <span className="pill">{dish.remainingLimit} {lang === 'ru' ? 'ост.' : 'калды'}</span>
                    ) : dish.modifierGroupIds.length > 0 ? (
                      <span className="pill pill-outline">+ {lang === 'ru' ? 'мод.' : 'кош.'}</span>
                    ) : null}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{tx(dish.name, lang)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <strong style={{ fontSize: 14 }}>{formatSom(dish.price)}</strong>
                    <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{tx(STATION_NAMES[dish.stationId], lang)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Automatic Modifiers Modal */}
      <Modal
        open={Boolean(modDish)}
        onClose={() => setModDish(null)}
        title={modDish ? `${tx(modDish.name, lang)} · ${formatSom(modDish.price)}` : ''}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setModDish(null)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="pos-mod-form" className="btn btn-primary">{lang === 'ru' ? 'Добавить в заказ' : 'Буйрутмага кошуу'}</button>
          </>
        }
      >
        {modDish && (
          <form id="pos-mod-form" className="form-grid" onSubmit={confirmModifierDish}>
            {modDish.modifierGroupIds.map((gid) => {
              const grp = modifierGroups.find((g) => g.id === gid);
              if (!grp) return null;
              return (
                <div key={grp.id}>
                  <div style={{ fontWeight: 600, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{tx(grp.name, lang)}</span>
                    <span className="pill">{grp.required ? (lang === 'ru' ? 'Обязательно' : 'Милдеттүү') : (lang === 'ru' ? `До ${grp.maxSelect}` : `${grp.maxSelect} чейин`)}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {grp.options.map((opt) => {
                      const active = selectedModIds.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`btn btn-sm ${active ? 'btn-primary' : ''}`}
                          onClick={() => toggleModOption(grp.id, opt.id, grp.maxSelect)}
                        >
                          {tx(opt.name, lang)} {opt.priceDelta > 0 ? `+${opt.priceDelta}` : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="field">
              <label>{lang === 'ru' ? 'Комментарий на кухню' : 'Ашканага түшүндүрмө'}</label>
              <input className="input" value={modNote} onChange={(e) => setModNote(e.target.value)} placeholder={lang === 'ru' ? 'Например: без соли, подать сразу...' : 'Мисалы: тузу аз, дароо берүү...'} />
            </div>
          </form>
        )}
      </Modal>

      {/* Transfer Table Modal */}
      <Modal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        title={lang === 'ru' ? 'Перенести заказ на другой стол' : 'Буйрутманы башка столго которуу'}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setTransferOpen(false)}>{tx(UI.common.cancel, lang)}</button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!targetTableId || !activeOrder}
              onClick={() => {
                if (activeOrder && targetTableId) {
                  transferOrderToTable(activeOrder.id, targetTableId);
                  setTransferOpen(false);
                  notify(lang === 'ru' ? 'Заказ перенесён на новый стол' : 'Буйрутма жаңы столго которулду');
                }
              }}
            >
              {lang === 'ru' ? 'Перенести' : 'Которуу'}
            </button>
          </>
        }
      >
        <div className="field">
          <label>{lang === 'ru' ? 'Свободный стол' : 'Бош стол'}</label>
          <select className="select" value={targetTableId} onChange={(e) => setTargetTableId(e.target.value)}>
            {freeTables.map((t) => (
              <option key={t.id} value={t.id}>{tx(UI.common.table, lang)} {t.number} ({t.seats} м.)</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Split by Guests Modal */}
      <Modal
        open={splitOpen}
        onClose={() => setSplitOpen(false)}
        title={lang === 'ru' ? 'Разбивка счёта по гостям' : 'Эсепти коноктор боюнча бөлүү'}
        footer={<button type="button" className="btn btn-primary" onClick={() => setSplitOpen(false)}>{tx(UI.common.close, lang)}</button>}
      >
        {activeOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Array.from(new Set(activeOrder.items.map((i) => i.guestSeat)))
              .sort((a, b) => a - b)
              .map((seat) => {
                const seatItems = activeOrder.items.filter((i) => i.guestSeat === seat);
                const seatSum = seatItems.reduce(
                  (s, it) => s + (it.unitPrice + it.modifiers.reduce((ms, m) => ms + m.priceDelta, 0)) * it.qty,
                  0
                );
                return (
                  <div key={seat} className="card card-pad" style={{ background: 'var(--bg-surface-soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <strong>{lang === 'ru' ? `Гость ${seat}` : `Конок ${seat}`}</strong>
                      <strong>{formatSom(seatSum)}</strong>
                    </div>
                    {seatItems.map((it) => (
                      <div key={it.id} style={{ fontSize: 12, color: 'var(--ink-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{tx(it.name, lang)} × {it.qty}</span>
                        <span>{formatSom(it.unitPrice * it.qty)}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        )}
      </Modal>

      {/* Payment Modal */}
      <Modal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        title={lang === 'ru' ? 'Оплата и закрытие чека' : 'Төлөм жана чекти жабуу'}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setPayOpen(false)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="pos-pay-form" className="btn btn-primary">{lang === 'ru' ? 'Пробить чек' : 'Чекти жабуу'}</button>
          </>
        }
      >
        <form id="pos-pay-form" className="form-grid" onSubmit={handlePaySubmit}>
          <div style={{ padding: 12, borderRadius: 8, background: 'var(--bg-well)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>{lang === 'ru' ? 'К оплате:' : 'Төлөм суммасы:'}</span>
            <strong style={{ fontSize: 20 }}>{formatSom(total)}</strong>
          </div>
          <div className="field">
            <label>{lang === 'ru' ? 'Способ оплаты' : 'Төлөм ыкмасы'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {(['card', 'cash', 'qr', 'bonus'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`btn ${payMethod === m ? 'btn-primary' : ''}`}
                  onClick={() => setPayMethod(m)}
                >
                  {tx(UI.paymentMethods[m], lang)}
                </button>
              ))}
            </div>
          </div>
          {payMethod === 'cash' && (
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Получено от гостя' : 'Алынган сумма'}</label>
                <input className="input" type="number" value={cashTendered} onChange={(e) => setCashTendered(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Сдача' : 'Кайтарым'}</label>
                <div style={{ height: 35, display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: 15 }}>
                  {formatSom(Math.max(0, (Number(cashTendered) || 0) - total))}
                </div>
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
