import React, { useState } from 'react';
import { ArrowRight, MapPin, Phone, Plus } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { DeliveryStatus } from '../../types';
import { Modal } from '../Layout/Modal';

export const DeliveryModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    deliveryOrders,
    couriers,
    deliveryZones,
    addDeliveryOrder,
    advanceDeliveryOrder,
    assignCourier,
    toggleCourierAvail,
    toggleDeliveryZone,
    notify,
  } = useRestaurant();

  const [statusFilter, setStatusFilter] = useState<'all' | DeliveryStatus>('all');
  const [dlvModal, setDlvModal] = useState(false);
  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('+996 555 ');
  const [cAddr, setCAddr] = useState('');
  const [cZoneId, setCZoneId] = useState(deliveryZones[0]?.id ?? '');
  const [cItems, setCItems] = useState('');
  const [cAmount, setCAmount] = useState('1500');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'orders') {
    const filtered = deliveryOrders.filter(
      (d) =>
        (statusFilter === 'all' || d.status === statusFilter) &&
        (!q ||
          d.number.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q) ||
          d.address.toLowerCase().includes(q))
    );

    const handleCreateDlv = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cName.trim() || !cAddr.trim()) return;
      const zone = deliveryZones.find((z) => z.id === cZoneId) ?? deliveryZones[0];
      addDeliveryOrder({
        clientName: cName.trim(),
        phone: cPhone.trim(),
        address: cAddr.trim(),
        zoneId: zone.id,
        zoneName: zone.name,
        itemsSummary: cItems.trim() || { ru: 'Сборный заказ с сайта', ky: 'Сайттан түзүлгөн буйрутма' },
        amount: Number(cAmount) || 0,
        deliveryFee: zone.fee,
        paymentType: 'cash',
        eta: '15:50',
      });
      setCName('');
      setCAddr('');
      setCItems('');
      setDlvModal(false);
      notify(lang === 'ru' ? 'Заказ на доставку принят' : 'Жеткирүү буйрутмасы кабыл алынды');
    };

    return (
      <div>
        <div className="toolbar-row">
          <div className="seg-control">
            {(['all', 'accepted', 'cooking', 'on_way', 'delivered'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className={`seg-btn ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all' ? tx(UI.common.all, lang) : tx(UI.deliveryStatus[st], lang)}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setDlvModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новый заказ доставки' : 'Жаңы жеткирүү'}
          </button>
        </div>

        <div className="cards-grid">
          {filtered.map((d) => (
            <div key={d.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{d.number} · {d.eta}</strong>
                <span className={`pill ${d.status === 'delivered' ? 'pill-dark' : 'pill-mid'}`}>
                  {tx(UI.deliveryStatus[d.status], lang)}
                </span>
              </div>

              <div>
                <div style={{ fontWeight: 600 }}>{d.clientName}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <Phone size={12} /> {d.phone}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <MapPin size={12} /> {d.address}
                </div>
              </div>

              <div style={{ padding: 8, borderRadius: 6, background: 'var(--bg-surface-soft)', border: '1px solid var(--border)', fontSize: 12 }}>
                {tx(d.itemsSummary, lang)}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>{tx(d.zoneName, lang)}</span>
                <strong>{formatSom(d.amount + d.deliveryFee)}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <select
                  className="select"
                  style={{ height: 28, fontSize: 12, flex: 1 }}
                  value={d.courierId ?? ''}
                  onChange={(e) => assignCourier(d.id, e.target.value)}
                >
                  <option value="">{lang === 'ru' ? 'Назначить курьера...' : 'Курьер дайындоо...'}</option>
                  {couriers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {d.status !== 'delivered' && (
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => advanceDeliveryOrder(d.id)}>
                    <ArrowRight size={13} />
                    {lang === 'ru' ? 'Далее' : 'Кийинки'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={dlvModal}
          onClose={() => setDlvModal(false)}
          title={lang === 'ru' ? 'Новый заказ доставки' : 'Жаңы жеткирүү буйрутмасы'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setDlvModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="dlv-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="dlv-form" className="form-grid" onSubmit={handleCreateDlv}>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.guest, lang)}</label>
                <input className="input" required value={cName} onChange={(e) => setCName(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={cPhone} onChange={(e) => setCPhone(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Адрес доставки' : 'Жеткирүү дареги'}</label>
              <input className="input" required value={cAddr} onChange={(e) => setCAddr(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Зона' : 'Аймак'}</label>
                <select className="select" value={cZoneId} onChange={(e) => setCZoneId(e.target.value)}>
                  {deliveryZones.map((z) => (
                    <option key={z.id} value={z.id}>{tx(z.name, lang)} ({formatSom(z.fee)})</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{tx(UI.common.sum, lang)} (сом)</label>
                <input className="input" type="number" value={cAmount} onChange={(e) => setCAmount(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Состав заказа' : 'Буйрутма курамы'}</label>
              <input className="input" value={cItems} onChange={(e) => setCItems(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'couriers') {
    return (
      <div className="cards-grid">
        {couriers.map((c) => (
          <div key={c.id} className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span className={`pill ${c.available ? 'pill-dark' : ''}`}>
                {c.available ? (lang === 'ru' ? 'На линии' : 'Линияда') : (lang === 'ru' ? 'Занят / Пауза' : 'Тыныгууда')}
              </span>
              <button type="button" className={`switch-btn ${c.available ? 'on' : ''}`} onClick={() => toggleCourierAvail(c.id)}>
                <span className="switch-thumb" />
              </button>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-secondary)', marginTop: 3 }}>{tx(c.vehicle, lang)}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)', marginTop: 2 }}>{c.phone}</div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 12 }}>
              {lang === 'ru' ? 'Активных доставок' : 'Активдүү жеткирүү'}: <strong>{c.activeOrders}</strong>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Zones tab
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>{lang === 'ru' ? 'Зона доставки' : 'Жеткирүү аймагы'}</th>
            <th>{lang === 'ru' ? 'Мин. сумма заказа' : 'Мин. буйрутма'}</th>
            <th>{lang === 'ru' ? 'Стоимость доставки' : 'Жеткирүү баасы'}</th>
            <th>{lang === 'ru' ? 'Среднее время' : 'Орточо убакыт'}</th>
            <th>{tx(UI.common.status, lang)}</th>
          </tr>
        </thead>
        <tbody>
          {deliveryZones.map((z) => (
            <tr key={z.id}>
              <td style={{ fontWeight: 600 }}>{tx(z.name, lang)}</td>
              <td>{formatSom(z.minOrder)}</td>
              <td><strong>{formatSom(z.fee)}</strong></td>
              <td>{z.avgEta}</td>
              <td>
                <button type="button" className={`switch-btn ${z.active ? 'on' : ''}`} onClick={() => toggleDeliveryZone(z.id)}>
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
