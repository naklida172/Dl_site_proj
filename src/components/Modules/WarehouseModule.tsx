import React, { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { WarehouseDocType } from '../../types';
import { Modal } from '../Layout/Modal';

export const WarehouseModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    warehouseDocs,
    addWarehouseDoc,
    toggleDocStatus,
    warehouses,
    addWarehouse,
    balances,
    notify,
  } = useAppData();

  const [docModal, setDocModal] = useState(false);
  const [docType, setDocType] = useState<WarehouseDocType>('receipt');
  const [docWhFrom, setDocWhFrom] = useState(tx(warehouses[0]?.name ?? 'Центральный склад Бишкек', 'ru'));
  const [docWhTo, setDocWhTo] = useState(tx(warehouses[0]?.name ?? 'Центральный склад Бишкек', 'ru'));
  const [docCount, setDocCount] = useState('10');
  const [docSum, setDocSum] = useState('95000');

  const [whModal, setWhModal] = useState(false);
  const [whName, setWhName] = useState('');
  const [whAddr, setWhAddr] = useState('');
  const [whManager, setWhManager] = useState('Дмитрий Соколов');

  const q = searchQuery.trim().toLowerCase();

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const prefixMap: Record<WarehouseDocType, string> = {
      receipt: 'ПХ',
      shipment: 'РЛ',
      transfer: 'ПР',
      writeoff: 'СП',
    };
    addWarehouseDoc({
      number: `${prefixMap[docType]}-${String(410 + warehouseDocs.length).padStart(5, '0')}`,
      type: docType,
      warehouseFrom: docType === 'transfer' ? docWhFrom : undefined,
      warehouseTo: docWhTo,
      itemsCount: Number(docCount) || 1,
      totalAmount: Number(docSum) || 0,
      status: 'draft',
      date: '20.11.2026',
      responsible: 'Дмитрий Соколов',
    });
    setDocModal(false);
    notify(lang === 'ru' ? 'Складской документ создан' : 'Кампа документи түзүлдү');
  };

  // Docs / Receipt / Shipment / Transfer share structured document view filtered by tab
  if (activeTab === 'docs' || activeTab === 'receipt' || activeTab === 'shipment' || activeTab === 'transfer') {
    const typeFilter: WarehouseDocType | 'all' = activeTab === 'docs' ? 'all' : activeTab;
    const filteredDocs = warehouseDocs.filter(
      (d) =>
        (typeFilter === 'all' || d.type === typeFilter) &&
        (!q || d.number.toLowerCase().includes(q) || tx(d.warehouseTo, lang).toLowerCase().includes(q))
    );

    const pageTitles: Record<string, { ru: string; ky: string }> = {
      docs: { ru: 'Складские документы', ky: 'Кампа документтери' },
      receipt: { ru: 'Приход товаров', ky: 'Товарлардын кирими' },
      shipment: { ru: 'Реализация (Отгрузка)', ky: 'Сатуу (Жөнөтүү)' },
      transfer: { ru: 'Перемещение между складами', ky: 'Кампалар ортосунда которуу' },
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{tx(pageTitles[activeTab], lang)}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Нажмите на статус документа, чтобы провести или вернуть в черновик' : 'Өткөрүү же долбоорго кайтаруу үчүн документтин абалын басыңыз'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setDocType(typeFilter === 'all' ? 'receipt' : typeFilter);
              setDocModal(true);
            }}
          >
            <Plus size={15} />
            {lang === 'ru' ? 'Создать документ' : 'Документ түзүү'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>№</th>
                <th>{lang === 'ru' ? 'Тип операции' : 'Операция түрү'}</th>
                <th>{lang === 'ru' ? 'Склад / Направление' : 'Кампа / Багыты'}</th>
                <th>{lang === 'ru' ? 'Позиций' : 'Саны'}</th>
                <th>{tx(UI.common.amount, lang)}</th>
                <th>{tx(UI.common.date, lang)}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.number}</strong></td>
                  <td><span className="badge">{tx(UI.docTypes[d.type], lang)}</span></td>
                  <td>
                    {d.warehouseFrom ? `${tx(d.warehouseFrom, lang)} → ${tx(d.warehouseTo, lang)}` : tx(d.warehouseTo, lang)}
                  </td>
                  <td>{d.itemsCount}</td>
                  <td style={{ fontWeight: 600 }}>{formatSom(d.totalAmount, lang)}</td>
                  <td>{d.date}</td>
                  <td>
                    <button
                      type="button"
                      className={`badge ${d.status === 'conducted' ? 'badge-dark' : 'badge-mid'}`}
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => toggleDocStatus(d.id)}
                    >
                      {tx(UI.docStatuses[d.status], lang)}
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
          title={lang === 'ru' ? 'Новый складской документ' : 'Жаңы кампа документи'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDocModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="wh-doc-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="wh-doc-form" className="form-grid" onSubmit={handleAddDoc}>
            <div className="field">
              <label>{lang === 'ru' ? 'Тип документа' : 'Документ түрү'}</label>
              <select className="select" value={docType} onChange={(e) => setDocType(e.target.value as WarehouseDocType)}>
                <option value="receipt">{tx(UI.docTypes.receipt, lang)}</option>
                <option value="shipment">{tx(UI.docTypes.shipment, lang)}</option>
                <option value="transfer">{tx(UI.docTypes.transfer, lang)}</option>
                <option value="writeoff">{tx(UI.docTypes.writeoff, lang)}</option>
              </select>
            </div>
            {docType === 'transfer' && (
              <div className="field">
                <label>{lang === 'ru' ? 'Со склада' : 'Кайсы кампадан'}</label>
                <select className="select" value={docWhFrom} onChange={(e) => setDocWhFrom(e.target.value)}>
                  {warehouses.map((w) => (
                    <option key={w.id} value={tx(w.name, 'ru')}>{tx(w.name, lang)}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="field">
              <label>{docType === 'transfer' ? (lang === 'ru' ? 'На склад' : 'Кайсы кампага') : (lang === 'ru' ? 'Склад' : 'Кампа')}</label>
              <select className="select" value={docWhTo} onChange={(e) => setDocWhTo(e.target.value)}>
                {warehouses.map((w) => (
                  <option key={w.id} value={tx(w.name, 'ru')}>{tx(w.name, lang)}</option>
                ))}
              </select>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Количество позиций' : 'Позиция саны'}</label>
                <input className="input" type="number" value={docCount} onChange={(e) => setDocCount(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.amount, lang)} (сом)</label>
                <input className="input" type="number" value={docSum} onChange={(e) => setDocSum(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'warehouses') {
    const handleAddWh = (e: React.FormEvent) => {
      e.preventDefault();
      if (!whName.trim()) return;
      addWarehouse({
        name: whName.trim(),
        address: whAddr.trim() || 'г. Бишкек',
        manager: whManager,
        skuCount: 0,
        totalValue: 0,
      });
      setWhName('');
      setWhAddr('');
      setWhModal(false);
      notify(lang === 'ru' ? 'Склад добавлен' : 'Кампа кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Склады хранения' : 'Сактоо кампалары'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Точки хранения, ответственные лица и оценка запасов' : 'Сактоо жайлары, жооптуу адамдар жана запас баасы'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setWhModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить склад' : 'Кампа кошуу'}
          </button>
        </div>

        <div className="cards-grid">
          {warehouses.map((w) => (
            <div key={w.id} className="card card-pad">
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{tx(w.name, lang)}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                <MapPin size={13} /> {tx(w.address, lang)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                {lang === 'ru' ? 'Ответственный' : 'Жооптуу'}: {w.manager}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SKU</div>
                  <div style={{ fontWeight: 700 }}>{w.skuCount}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'ru' ? 'Оценка' : 'Баасы'}</div>
                  <div style={{ fontWeight: 700 }}>{formatSom(w.totalValue, lang)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={whModal}
          onClose={() => setWhModal(false)}
          title={lang === 'ru' ? 'Новый склад' : 'Жаңы кампа'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setWhModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="wh-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="wh-form" className="form-grid" onSubmit={handleAddWh}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={whName} onChange={(e) => setWhName(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Адрес' : 'Дареги'}</label>
              <input className="input" value={whAddr} onChange={(e) => setWhAddr(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Кладовщик' : 'Кампа башчысы'}</label>
              <input className="input" value={whManager} onChange={(e) => setWhManager(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Balances tab
  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Остатки товаров на складах' : 'Кампалардагы товар калдыктары'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Доступное количество, резерв под сделки и минимальный порог' : 'Жеткиликтүү сан, бүтүмдөргө резерв жана минималдуу чек'}
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>{lang === 'ru' ? 'Товар' : 'Товар'}</th>
              <th>{lang === 'ru' ? 'Склад' : 'Кампа'}</th>
              <th>{lang === 'ru' ? 'Доступно' : 'Жеткиликтүү'}</th>
              <th>{lang === 'ru' ? 'В резерве' : 'Резервде'}</th>
              <th>{tx(UI.common.status, lang)}</th>
            </tr>
          </thead>
          <tbody>
            {balances
              .filter((b) => !q || tx(b.productName, lang).toLowerCase().includes(q) || b.sku.toLowerCase().includes(q))
              .map((b) => {
                const isLow = b.available < b.minLimit;
                return (
                  <tr key={b.id}>
                    <td><span className="badge">{b.sku}</span></td>
                    <td style={{ fontWeight: 600 }}>{tx(b.productName, lang)}</td>
                    <td>{tx(b.warehouse, lang)}</td>
                    <td style={{ fontWeight: 700 }}>{b.available} {tx(b.unit, lang)}</td>
                    <td>{b.reserved} {tx(b.unit, lang)}</td>
                    <td>
                      <span className={`badge ${isLow ? 'badge-dark' : ''}`}>
                        {isLow ? (lang === 'ru' ? 'Мало на складе' : 'Аз калды') : (lang === 'ru' ? 'В норме' : 'Жетиштүү')}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
