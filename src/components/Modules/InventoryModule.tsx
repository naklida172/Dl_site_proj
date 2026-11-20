import React, { useState } from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { StockDocType } from '../../types';
import { Modal } from '../Layout/Modal';

export const InventoryModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    ingredients,
    techCards,
    stockDocs,
    suppliers,
    addTechCardIngredient,
    addStockDocument,
    toggleStockDocStatus,
    addSupplier,
    orderFromSupplier,
    notify,
  } = useRestaurant();

  const [selectedTcId, setSelectedTcId] = useState(techCards[0]?.id ?? '');
  const [ingModal, setIngModal] = useState(false);
  const [addIngId, setAddIngId] = useState(ingredients[0]?.id ?? '');
  const [addQty, setAddQty] = useState('0.05');

  const [docModal, setDocModal] = useState(false);
  const [docType, setDocType] = useState<StockDocType>('receipt');
  const [docWh, setDocWh] = useState('Основная кухня');
  const [docCount, setDocCount] = useState('6');
  const [docSum, setDocSum] = useState('24000');

  const [supModal, setSupModal] = useState(false);
  const [spName, setSpName] = useState('');
  const [spCat, setSpCat] = useState('');
  const [spContact, setSpContact] = useState('');
  const [spPhone, setSpPhone] = useState('+996 555 ');
  const [spDays, setSpDays] = useState('Пн, Чт');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'techcards') {
    const activeTc = techCards.find((t) => t.id === selectedTcId) ?? techCards[0];
    const foodCost = activeTc.ingredients.reduce((sum, i) => sum + i.grossQty * i.costPerUnit, 0);
    const margin = activeTc.sellingPrice - foodCost;
    const fcPct = activeTc.sellingPrice > 0 ? Math.round((foodCost / activeTc.sellingPrice) * 100) : 0;

    const handleAddIngredient = (e: React.FormEvent) => {
      e.preventDefault();
      addTechCardIngredient(activeTc.id, addIngId, Number(addQty) || 0.05);
      setIngModal(false);
      notify(lang === 'ru' ? 'Ингредиент добавлен в техкарту' : 'Азык техкартага кошулду');
    };

    return (
      <div>
        <div className="split-2">
          <div className="card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {techCards
              .filter((t) => !q || tx(t.dishName, lang).toLowerCase().includes(q))
              .map((tc) => (
                <button
                  key={tc.id}
                  type="button"
                  className={`rail-item ${tc.id === activeTc.id ? 'active' : ''}`}
                  onClick={() => setSelectedTcId(tc.id)}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx(tc.dishName, lang)}</span>
                  <span className="pill">{tc.outputWeight}</span>
                </button>
              ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="kpi-grid" style={{ marginBottom: 0 }}>
              <div className="kpi-card">
                <div className="kpi-label">{lang === 'ru' ? 'Себестоимость (Food Cost)' : 'Өздүк наркы'}</div>
                <div className="kpi-value">{formatSom(foodCost)}</div>
                <div className="kpi-sub">Food Cost: {fcPct}%</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">{lang === 'ru' ? 'Цена в меню' : 'Меню баасы'}</div>
                <div className="kpi-value">{formatSom(activeTc.sellingPrice)}</div>
                <div className="kpi-sub">{lang === 'ru' ? 'Выход' : 'Чыгышы'}: {activeTc.outputWeight}</div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">{lang === 'ru' ? 'Валовая маржа' : 'Маржа'}</div>
                <div className="kpi-value">{formatSom(margin)}</div>
              </div>
            </div>

            <div className="card card-pad">
              <div className="toolbar-row">
                <strong style={{ fontSize: 14 }}>
                  {lang === 'ru' ? 'Калькуляция ингредиентов (StoreHouse)' : 'Ингредиенттер калькуляциясы'}
                </strong>
                <button type="button" className="btn btn-sm btn-primary" onClick={() => setIngModal(true)}>
                  <Plus size={14} />
                  {lang === 'ru' ? 'Добавить ингредиент' : 'Азык кошуу'}
                </button>
              </div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{lang === 'ru' ? 'Сырьё / Продукт' : 'Азык'}</th>
                      <th>{lang === 'ru' ? 'Брутто' : 'Брутто'}</th>
                      <th>{lang === 'ru' ? 'Нетто' : 'Нетто'}</th>
                      <th>{lang === 'ru' ? 'Цена за ед.' : 'Бирдик баасы'}</th>
                      <th>{tx(UI.common.sum, lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTc.ingredients.map((ing, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{tx(ing.name, lang)}</td>
                        <td>{ing.grossQty} {tx(ing.unit, lang)}</td>
                        <td>{ing.netQty} {tx(ing.unit, lang)}</td>
                        <td>{formatSom(ing.costPerUnit)}</td>
                        <td><strong>{formatSom(ing.grossQty * ing.costPerUnit)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Modal
          open={ingModal}
          onClose={() => setIngModal(false)}
          title={lang === 'ru' ? 'Добавить продукт в ТТК' : 'ТТКга азык кошуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setIngModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="tc-ing-form" className="btn btn-primary">{tx(UI.common.add, lang)}</button>
            </>
          }
        >
          <form id="tc-ing-form" className="form-grid" onSubmit={handleAddIngredient}>
            <div className="field">
              <label>{lang === 'ru' ? 'Продукт со склада' : 'Кампадагы азык'}</label>
              <select className="select" value={addIngId} onChange={(e) => setAddIngId(e.target.value)}>
                {ingredients.map((i) => (
                  <option key={i.id} value={i.id}>{tx(i.name, lang)} ({formatSom(i.costPerUnit)}/{tx(i.unit, lang)})</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Закладка брутто' : 'Брутто саны'}</label>
              <input className="input" type="number" step="0.01" value={addQty} onChange={(e) => setAddQty(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'stocks') {
    const filtered = ingredients.filter(
      (i) => !q || tx(i.name, lang).toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
    );
    return (
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ru' ? 'Код' : 'Код'}</th>
              <th>{lang === 'ru' ? 'Продукт' : 'Азык'}</th>
              <th>{lang === 'ru' ? 'Склад' : 'Кампа'}</th>
              <th>{lang === 'ru' ? 'Остаток' : 'Калдык'}</th>
              <th>{lang === 'ru' ? 'Мин. запас' : 'Мин. чек'}</th>
              <th>{lang === 'ru' ? 'Учётная цена' : 'Баасы'}</th>
              <th>{tx(UI.common.status, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => {
              const low = i.inStock < i.minStock;
              return (
                <tr key={i.id}>
                  <td><span className="pill">{i.code}</span></td>
                  <td style={{ fontWeight: 600 }}>{tx(i.name, lang)}</td>
                  <td>{tx(i.warehouse, lang)}</td>
                  <td><strong>{i.inStock} {tx(i.unit, lang)}</strong></td>
                  <td>{i.minStock} {tx(i.unit, lang)}</td>
                  <td>{formatSom(i.costPerUnit)}</td>
                  <td>
                    <span className={`pill ${low ? 'pill-dark' : ''}`}>
                      {low ? (lang === 'ru' ? 'Требует закупа' : 'Сатып алуу керек') : (lang === 'ru' ? 'В норме' : 'Жетиштүү')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'suppliers') {
    const filteredSup = suppliers.filter(
      (s) => !q || s.name.toLowerCase().includes(q) || tx(s.category, lang).toLowerCase().includes(q)
    );
    const handleAddSup = (e: React.FormEvent) => {
      e.preventDefault();
      if (!spName.trim()) return;
      addSupplier({
        name: spName.trim(),
        category: spCat.trim() || { ru: 'Продукты питания', ky: 'Азык-түлүк' },
        contact: spContact.trim() || 'Менеджер',
        phone: spPhone.trim(),
        deliveryDays: spDays.trim(),
        leadTime: { ru: '24 часа', ky: '24 саат' },
      });
      setSpName('');
      setSpCat('');
      setSpContact('');
      setSupModal(false);
      notify(lang === 'ru' ? 'Поставщик добавлен' : 'Жеткирүүчү кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Поставщики продуктов и заявки на закупку' : 'Азык жеткирүүчүлөр жана буйрутмалар'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setSupModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить поставщика' : 'Жеткирүүчү кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Поставщик' : 'Жеткирүүчү'}</th>
                <th>{lang === 'ru' ? 'Категория' : 'Категория'}</th>
                <th>{lang === 'ru' ? 'Контакт' : 'Байланыш'}</th>
                <th>{tx(UI.common.phone, lang)}</th>
                <th>{lang === 'ru' ? 'Дни доставки' : 'Жеткирүү күндөрү'}</th>
                <th>{lang === 'ru' ? 'Срок' : 'Мөөнөт'}</th>
                <th>{tx(UI.common.actions, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSup.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td><span className="pill">{tx(s.category, lang)}</span></td>
                  <td>{s.contact}</td>
                  <td>{s.phone}</td>
                  <td>{tx(s.deliveryDays, lang)}</td>
                  <td style={{ color: 'var(--ink-secondary)' }}>{tx(s.leadTime, lang)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        orderFromSupplier(s.id);
                        notify(lang === 'ru' ? `Черновик прихода создан (${s.name})` : `Кирим долбоору түзүлдү (${s.name})`);
                      }}
                    >
                      <ShoppingCart size={12} />
                      {lang === 'ru' ? 'Заказать поставку' : 'Буйрутма берүү'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={supModal}
          onClose={() => setSupModal(false)}
          title={lang === 'ru' ? 'Новый поставщик' : 'Жаңы жеткирүүчү'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setSupModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="sup-add-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="sup-add-form" className="form-grid" onSubmit={handleAddSup}>
            <div className="field">
              <label>{lang === 'ru' ? 'Компания' : 'Компания'}</label>
              <input className="input" required value={spName} onChange={(e) => setSpName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Категория товаров' : 'Товар түрү'}</label>
                <input className="input" value={spCat} onChange={(e) => setSpCat(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Дни доставки' : 'Жеткирүү күндөрү'}</label>
                <input className="input" value={spDays} onChange={(e) => setSpDays(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Контактное лицо' : 'Байланыш адамы'}</label>
                <input className="input" value={spContact} onChange={(e) => setSpContact(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={spPhone} onChange={(e) => setSpPhone(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Stock Documents
  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const pref: Record<StockDocType, string> = { receipt: 'ПН', writeoff: 'СП', transfer: 'ПР', inventory: 'ИН' };
    addStockDocument({
      number: `${pref[docType]}-${String(85 + stockDocs.length).padStart(4, '0')}`,
      type: docType,
      warehouse: docWh,
      date: '20.11.2026',
      itemsCount: Number(docCount) || 1,
      totalAmount: Number(docSum) || 0,
      status: 'draft',
      responsible: 'Марат Э.',
    });
    setDocModal(false);
    notify(lang === 'ru' ? 'Складская накладная создана' : 'Кампа кагазы түзүлдү');
  };

  return (
    <div>
      <div className="toolbar-row">
        <strong style={{ fontSize: 15 }}>
          {lang === 'ru' ? 'Приход, списание и инвентаризация' : 'Кирим, эсептен чыгаруу жана инвентаризация'}
        </strong>
        <button type="button" className="btn btn-primary" onClick={() => setDocModal(true)}>
          <Plus size={15} />
          {lang === 'ru' ? 'Создать накладную' : 'Кагаз түзүү'}
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>№</th>
              <th>{lang === 'ru' ? 'Операция' : 'Операция'}</th>
              <th>{lang === 'ru' ? 'Склад' : 'Кампа'}</th>
              <th>{lang === 'ru' ? 'Дата' : 'Күнү'}</th>
              <th>{lang === 'ru' ? 'Позиций' : 'Позиция'}</th>
              <th>{tx(UI.common.sum, lang)}</th>
              <th>{tx(UI.common.status, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {stockDocs.map((d) => (
              <tr key={d.id}>
                <td><strong>{d.number}</strong></td>
                <td><span className="pill">{tx(UI.docTypes[d.type], lang)}</span></td>
                <td>{tx(d.warehouse, lang)}</td>
                <td>{d.date}</td>
                <td>{d.itemsCount}</td>
                <td><strong>{formatSom(d.totalAmount)}</strong></td>
                <td>
                  <button
                    type="button"
                    className={`pill ${d.status === 'conducted' ? 'pill-dark' : 'pill-mid'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                    onClick={() => toggleStockDocStatus(d.id)}
                  >
                    {tx(UI.docStatus[d.status], lang)}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={docModal}
        onClose={() => setDocModal(false)}
        title={lang === 'ru' ? 'Новая накладная' : 'Жаңы коштомо кагаз'}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setDocModal(false)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="st-doc-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
          </>
        }
      >
        <form id="st-doc-form" className="form-grid" onSubmit={handleAddDoc}>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Тип документа' : 'Документ түрү'}</label>
              <select className="select" value={docType} onChange={(e) => setDocType(e.target.value as StockDocType)}>
                <option value="receipt">{tx(UI.docTypes.receipt, lang)}</option>
                <option value="writeoff">{tx(UI.docTypes.writeoff, lang)}</option>
                <option value="transfer">{tx(UI.docTypes.transfer, lang)}</option>
                <option value="inventory">{tx(UI.docTypes.inventory, lang)}</option>
              </select>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Склад' : 'Кампа'}</label>
              <input className="input" value={docWh} onChange={(e) => setDocWh(e.target.value)} />
            </div>
          </div>
          <div className="form-row-2">
            <div className="field">
              <label>{lang === 'ru' ? 'Позиций' : 'Саны'}</label>
              <input className="input" type="number" value={docCount} onChange={(e) => setDocCount(e.target.value)} />
            </div>
            <div className="field">
              <label>{tx(UI.common.sum, lang)} (сом)</label>
              <input className="input" type="number" value={docSum} onChange={(e) => setDocSum(e.target.value)} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
