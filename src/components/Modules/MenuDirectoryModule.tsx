import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { STATION_NAMES, UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { PrintStationId } from '../../types';
import { Modal } from '../Layout/Modal';

export const MenuDirectoryModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    categories,
    dishes,
    modifierGroups,
    combos,
    priceSchedules,
    toggleDishActive,
    addMenuDish,
    addModifierOption,
    addComboSet,
    togglePriceSchedule,
    notify,
  } = useRestaurant();

  const [catFilter, setCatFilter] = useState<string>('all');
  const [dishModal, setDishModal] = useState(false);
  const [dCode, setDCode] = useState('701');
  const [dName, setDName] = useState('');
  const [dPrint, setDPrint] = useState('');
  const [dCatId, setDCatId] = useState(categories[0]?.id ?? 'cat_nat');
  const [dPrice, setDPrice] = useState('550');
  const [dStation, setDStation] = useState<PrintStationId>('hot');

  const [modModal, setModModal] = useState(false);
  const [mGroupId, setMGroupId] = useState(modifierGroups[0]?.id ?? '');
  const [mName, setMName] = useState('');
  const [mPrice, setMPrice] = useState('80');

  const [cmbModal, setCmbModal] = useState(false);
  const [cbName, setCbName] = useState('');
  const [cbPrice, setCbPrice] = useState('950');
  const [cbDesc, setCbDesc] = useState('');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'dishes') {
    const filtered = dishes.filter(
      (d) =>
        (catFilter === 'all' || d.categoryId === catFilter) &&
        (!q ||
          tx(d.name, lang).toLowerCase().includes(q) ||
          d.code.toLowerCase().includes(q) ||
          d.altCode.toLowerCase().includes(q))
    );

    const handleAddDish = (e: React.FormEvent) => {
      e.preventDefault();
      if (!dName.trim()) return;
      addMenuDish({
        code: dCode.trim() || String(700 + dishes.length),
        altCode: `NEW-${dishes.length + 1}`,
        categoryId: dCatId,
        name: dName.trim(),
        printName: (dPrint.trim() || dName.trim()).toUpperCase(),
        price: Number(dPrice) || 0,
        taxRate: 12,
        stationId: dStation,
        modifierGroupIds: [],
        active: true,
        stopListed: false,
        classification: tx(categories.find((c) => c.id === dCatId)?.name ?? '', 'ru'),
      });
      setDName('');
      setDPrint('');
      setDishModal(false);
      notify(lang === 'ru' ? 'Блюдо добавлено и сразу доступно на кассе' : 'Тамак кошулду жана кассада жеткиликтүү');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Иерархический справочник меню (RK7)' : 'Меню маалымдамасы (RK7)'} ({filtered.length})
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setDishModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить блюдо' : 'Тамак кошуу'}
          </button>
        </div>

        <div className="split-2">
          {/* Category Tree */}
          <div className="card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <button
              type="button"
              className={`rail-item ${catFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCatFilter('all')}
            >
              <span>{tx(UI.common.all, lang)}</span>
              <span className="pill">{dishes.length}</span>
            </button>
            {categories.map((c) => {
              const cnt = dishes.filter((d) => d.categoryId === c.id).length;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`rail-item ${catFilter === c.id ? 'active' : ''}`}
                  onClick={() => setCatFilter(c.id)}
                >
                  <span>{tx(c.name, lang)}</span>
                  <span className="pill">{cnt}</span>
                </button>
              );
            })}
          </div>

          {/* Dishes Table */}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === 'ru' ? 'Код' : 'Код'}</th>
                  <th>{lang === 'ru' ? 'Наименование' : 'Аталышы'}</th>
                  <th>{lang === 'ru' ? 'Печатное имя' : 'Басма аты'}</th>
                  <th>{lang === 'ru' ? 'Станция печати' : 'Принтер цехи'}</th>
                  <th>{lang === 'ru' ? 'Налог' : 'Салык'}</th>
                  <th>{lang === 'ru' ? 'Цена' : 'Баасы'}</th>
                  <th>{tx(UI.common.active, lang)}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id}>
                    <td><span className="pill">{d.code}</span></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{tx(d.name, lang)}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{d.altCode}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: 11.5 }}>{tx(d.printName, lang)}</td>
                    <td><span className="pill">{tx(STATION_NAMES[d.stationId], lang)}</span></td>
                    <td>{d.taxRate}%</td>
                    <td><strong>{formatSom(d.price)}</strong></td>
                    <td>
                      <button type="button" className={`switch-btn ${d.active ? 'on' : ''}`} onClick={() => toggleDishActive(d.id)}>
                        <span className="switch-thumb" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          open={dishModal}
          onClose={() => setDishModal(false)}
          title={lang === 'ru' ? 'Новое блюдо в справочнике' : 'Маалымдамага жаңы тамак'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDishModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="dish-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="dish-form" className="form-grid" onSubmit={handleAddDish}>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Код блюда' : 'Тамак коду'}</label>
                <input className="input" value={dCode} onChange={(e) => setDCode(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Категория' : 'Категория'}</label>
                <select className="select" value={dCatId} onChange={(e) => setDCatId(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{tx(c.name, lang)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Название на экране кассы' : 'Касса экранындагы аталышы'}</label>
              <input className="input" required value={dName} onChange={(e) => setDName(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Печатное имя (для кухни)' : 'Басма аты (ашкана үчүн)'}</label>
              <input className="input" value={dPrint} onChange={(e) => setDPrint(e.target.value)} placeholder="СУП ХАРЧО" />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Цена (сом)' : 'Баасы (сом)'}</label>
                <input className="input" type="number" value={dPrice} onChange={(e) => setDPrice(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Станция сервис-печати' : 'Басып чыгаруу цехи'}</label>
                <select className="select" value={dStation} onChange={(e) => setDStation(e.target.value as PrintStationId)}>
                  {(Object.keys(STATION_NAMES) as PrintStationId[]).map((st) => (
                    <option key={st} value={st}>{tx(STATION_NAMES[st], lang)}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'modifiers') {
    const handleAddMod = (e: React.FormEvent) => {
      e.preventDefault();
      if (!mName.trim()) return;
      addModifierOption(mGroupId, mName.trim(), Number(mPrice) || 0);
      setMName('');
      setModModal(false);
      notify(lang === 'ru' ? 'Модификатор добавлен в схему' : 'Модификатор схемага кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Группы и схемы модификаторов' : 'Модификатор топтору жана схемалары'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setModModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить модификатор' : 'Модификатор кошуу'}
          </button>
        </div>

        <div className="cards-grid">
          {modifierGroups.map((g) => (
            <div key={g.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className={`pill ${g.required ? 'pill-dark' : 'pill-mid'}`}>
                  {g.required ? (lang === 'ru' ? 'Обязательная схема' : 'Милдеттүү') : (lang === 'ru' ? 'Необязательная' : 'Кошумча')}
                </span>
                <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  max: {g.maxSelect}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{tx(g.name, lang)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {g.options.map((o) => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 9px', background: 'var(--bg-surface-soft)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <span>{tx(o.name, lang)}</span>
                    <strong>{o.priceDelta > 0 ? `+${formatSom(o.priceDelta)}` : '0 сом'}</strong>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={modModal}
          onClose={() => setModModal(false)}
          title={lang === 'ru' ? 'Добавить модификатор в группу' : 'Топко модификатор кошуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setModModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="mod-opt-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="mod-opt-form" className="form-grid" onSubmit={handleAddMod}>
            <div className="field">
              <label>{lang === 'ru' ? 'Группа модификаторов' : 'Модификатор тобу'}</label>
              <select className="select" value={mGroupId} onChange={(e) => setMGroupId(e.target.value)}>
                {modifierGroups.map((g) => (
                  <option key={g.id} value={g.id}>{tx(g.name, lang)}</option>
                ))}
              </select>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Название опции' : 'Опция аталышы'}</label>
                <input className="input" required value={mName} onChange={(e) => setMName(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Надбавка к цене (сом)' : 'Баа кошумчасы (сом)'}</label>
                <input className="input" type="number" value={mPrice} onChange={(e) => setMPrice(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'combos') {
    const handleAddCombo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cbName.trim()) return;
      addComboSet(cbName.trim(), ['d1', 'd11'], Number(cbPrice) || 0, cbDesc.trim() || 'Специальный набор');
      setCbName('');
      setCbDesc('');
      setCmbModal(false);
      notify(lang === 'ru' ? 'Комбо-набор создан' : 'Комбо топтом түзүлдү');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Комбо-наборы (комплексные предложения)' : 'Комбо топтомдор'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setCmbModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новый комбо-набор' : 'Жаңы комбо'}
          </button>
        </div>

        <div className="cards-grid">
          {combos.map((c) => (
            <div key={c.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="pill pill-dark">{formatSom(c.price)}</span>
                <span className="pill">{c.dishIds.length} {lang === 'ru' ? 'блюда' : 'тамак'}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tx(c.name, lang)}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)' }}>{tx(c.description, lang)}</div>
            </div>
          ))}
        </div>

        <Modal
          open={cmbModal}
          onClose={() => setCmbModal(false)}
          title={lang === 'ru' ? 'Новый комбо-набор' : 'Жаңы комбо топтом'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setCmbModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="cmb-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="cmb-form" className="form-grid" onSubmit={handleAddCombo}>
            <div className="field">
              <label>{lang === 'ru' ? 'Название комбо' : 'Комбо аталышы'}</label>
              <input className="input" required value={cbName} onChange={(e) => setCbName(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Цена набора (сом)' : 'Топтом баасы (сом)'}</label>
              <input className="input" type="number" value={cbPrice} onChange={(e) => setCbPrice(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Состав' : 'Курамы'}</label>
              <input className="input" value={cbDesc} onChange={(e) => setCbDesc(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Price Schedules
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>{lang === 'ru' ? 'Ценовая схема' : 'Баа схемасы'}</th>
            <th>{lang === 'ru' ? 'Условие применения' : 'Колдонуу шарты'}</th>
            <th>{lang === 'ru' ? 'Время действия' : 'Иштөө убактысы'}</th>
            <th>{lang === 'ru' ? 'Коррекция цены' : 'Баа өзгөртүү'}</th>
            <th>{tx(UI.common.status, lang)}</th>
          </tr>
        </thead>
        <tbody>
          {priceSchedules.map((ps) => (
            <tr key={ps.id}>
              <td style={{ fontWeight: 600 }}>{tx(ps.name, lang)}</td>
              <td style={{ color: 'var(--ink-secondary)' }}>{tx(ps.type, lang)}</td>
              <td>{ps.timeWindow}</td>
              <td><span className="pill pill-mid">{ps.adjustmentLabel}</span></td>
              <td>
                <button type="button" className={`switch-btn ${ps.active ? 'on' : ''}`} onClick={() => togglePriceSchedule(ps.id)}>
                  <span className="switch-thumb" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
