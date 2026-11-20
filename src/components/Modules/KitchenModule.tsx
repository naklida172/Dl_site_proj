import React, { useState } from 'react';
import { Check, Clock, Flame, Printer } from 'lucide-react';
import { STATION_NAMES, UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { PrintStationId } from '../../types';

export const KitchenModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    kitchenTickets,
    printStations,
    advanceKitchenTicket,
    togglePrintStation,
    dishes,
    toggleDishStopList,
    setDishLimit,
    notify,
  } = useRestaurant();

  const [stationFilter, setStationFilter] = useState<'all' | PrintStationId>('all');
  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'kds') {
    const activeTickets = kitchenTickets.filter(
      (kt) =>
        kt.status !== 'served' &&
        (stationFilter === 'all' || kt.stationId === stationFilter) &&
        (!q || kt.orderNumber.toLowerCase().includes(q) || tx(kt.tableLabel, lang).toLowerCase().includes(q))
    );

    return (
      <div>
        <div className="toolbar-row">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`subnav-pill ${stationFilter === 'all' ? 'active' : ''}`}
              style={{ border: '1px solid var(--border)' }}
              onClick={() => setStationFilter('all')}
            >
              {tx(UI.common.all, lang)} ({kitchenTickets.filter((k) => k.status !== 'served').length})
            </button>
            {(Object.keys(STATION_NAMES) as PrintStationId[]).map((st) => (
              <button
                key={st}
                type="button"
                className={`subnav-pill ${stationFilter === st ? 'active' : ''}`}
                style={{ border: '1px solid var(--border)' }}
                onClick={() => setStationFilter(st)}
              >
                {tx(STATION_NAMES[st], lang)}
              </button>
            ))}
          </div>
        </div>

        {activeTickets.length === 0 ? (
          <div className="empty-state">
            {lang === 'ru' ? 'Все заказы приготовлены и отданы в зал' : 'Бардык буйрутмалар даярдалып берилди'}
          </div>
        ) : (
          <div className="kds-grid">
            {activeTickets.map((kt) => (
              <div key={kt.id} className={`kds-ticket status-${kt.status}`}>
                <div className="kds-ticket-head">
                  <div>
                    <strong>{kt.orderNumber} · {tx(kt.tableLabel, lang)}</strong>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>
                      {tx(STATION_NAMES[kt.stationId], lang)} · {kt.course} {lang === 'ru' ? 'курс' : 'курс'}
                    </div>
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 12 }}>
                    <Clock size={12} /> {kt.elapsedMin}m
                  </span>
                </div>

                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  {kt.items.map((item, idx) => (
                    <div key={idx} style={{ paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>{tx(item.name, lang)}</span>
                        <span>×{item.qty}</span>
                      </div>
                      {item.modifiers.length > 0 && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-secondary)', marginTop: 2 }}>
                          {item.modifiers.map((m) => tx(m, lang)).join(' · ')}
                        </div>
                      )}
                      {item.note && (
                        <div style={{ fontSize: 11.5, fontStyle: 'italic', color: 'var(--ink-secondary)', marginTop: 2 }}>
                          «{item.note}»
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pill">{tx(UI.kitchenStatus[kt.status], lang)}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      advanceKitchenTicket(kt.id);
                      notify(`${kt.orderNumber} → ${tx(UI.kitchenStatus[kt.status === 'new' ? 'cooking' : kt.status === 'cooking' ? 'ready' : 'served'], lang)}`);
                    }}
                  >
                    {kt.status === 'new' && (
                      <>
                        <Flame size={13} /> {lang === 'ru' ? 'Готовить' : 'Даярдоо'}
                      </>
                    )}
                    {kt.status === 'cooking' && (
                      <>
                        <Check size={13} /> {lang === 'ru' ? 'Готово' : 'Даяр'}
                      </>
                    )}
                    {kt.status === 'ready' && (
                      <>
                        <Check size={13} /> {lang === 'ru' ? 'Отдать' : 'Берүү'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'stations') {
    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Станции сервис-печати и резервирование (r_keeper)' : 'Сервис-басып чыгаруу станциялары'}
          </strong>
        </div>

        <div className="cards-grid">
          {printStations.map((st) => (
            <div key={st.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className={`pill ${st.online ? 'pill-dark' : ''}`}>
                  <Printer size={12} /> {st.online ? (lang === 'ru' ? 'В сети' : 'Онлайн') : (lang === 'ru' ? 'Оффлайн → Резерв' : 'Оффлайн → Резерв')}
                </span>
                <button type="button" className={`switch-btn ${st.online ? 'on' : ''}`} onClick={() => togglePrintStation(st.id)}>
                  <span className="switch-thumb" />
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{tx(st.name, lang)}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-secondary)', marginTop: 4 }}>
                {lang === 'ru' ? 'Основной принтер' : 'Негизги принтер'}: <strong>{st.printerName}</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-secondary)', marginTop: 2 }}>
                {lang === 'ru' ? 'Резервный' : 'Резервдик'}: {st.backupPrinter}
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--ink-muted)' }}>
                {lang === 'ru' ? 'Напечатано марок за смену' : 'Нөөмөттө басылды'}: <strong>{st.printedCount}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Stop-List tab
  const filteredDishes = dishes.filter((d) => !q || tx(d.name, lang).toLowerCase().includes(q) || d.code.includes(q));
  const stoppedCount = dishes.filter((d) => d.stopListed).length;

  return (
    <div>
      <div className="toolbar-row">
        <div>
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? `Управление стоп-листом и лимитами (${stoppedCount} в стоп-листе)` : `Стоп-лист жана чектөөлөр (${stoppedCount} стопто)`}
          </strong>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ru' ? 'Код' : 'Код'}</th>
              <th>{lang === 'ru' ? 'Блюдо' : 'Тамак'}</th>
              <th>{lang === 'ru' ? 'Цех' : 'Цех'}</th>
              <th>{lang === 'ru' ? 'Цена' : 'Баасы'}</th>
              <th>{lang === 'ru' ? 'Лимит порций' : 'Порция чеги'}</th>
              <th>{lang === 'ru' ? 'В стоп-листе' : 'Стоп-листте'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredDishes.map((d) => (
              <tr key={d.id}>
                <td><span className="pill">{d.code}</span></td>
                <td style={{ fontWeight: 600 }}>{tx(d.name, lang)}</td>
                <td>{tx(STATION_NAMES[d.stationId], lang)}</td>
                <td>{formatSom(d.price)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="number"
                      className="input"
                      style={{ width: 78, height: 28 }}
                      value={d.remainingLimit ?? ''}
                      placeholder="∞"
                      min={0}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDishLimit(d.id, val === '' ? undefined : Math.max(0, Number(val)));
                      }}
                    />
                    {d.remainingLimit !== undefined && (
                      <button type="button" className="btn btn-sm" onClick={() => setDishLimit(d.id, undefined)}>
                        ∞
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    className={`switch-btn ${d.stopListed ? 'on' : ''}`}
                    onClick={() => {
                      toggleDishStopList(d.id);
                      notify(`${tx(d.name, lang)} ${!d.stopListed ? '→ Стоп-лист' : '→ Доступно'}`);
                    }}
                  >
                    <span className="switch-thumb" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
