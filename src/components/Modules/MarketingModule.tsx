import React, { useState } from 'react';
import { Eye, Plus } from 'lucide-react';
import { UI, formatSom, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { CampaignItem, MarketingTemplate } from '../../types';
import { Modal } from '../Layout/Modal';

export const MarketingModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    campaigns,
    addCampaign,
    segments,
    addSegment,
    ads,
    toggleAdActive,
    templates,
    notify,
  } = useAppData();

  const [cmpModal, setCmpModal] = useState(false);
  const [cName, setCName] = useState('');
  const [cChannel, setCChannel] = useState<CampaignItem['channel']>('WhatsApp');
  const [cSegment, setCSegment] = useState(tx(segments[0]?.name ?? 'B2B-клиенты Бишкек', 'ru'));

  const [segModal, setSegModal] = useState(false);
  const [sgName, setSgName] = useState('');
  const [sgCrit, setSgCrit] = useState('');
  const [sgCount, setSgCount] = useState('120');

  const [previewTpl, setPreviewTpl] = useState<MarketingTemplate | null>(null);

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'campaigns') {
    const handleAddCmp = (e: React.FormEvent) => {
      e.preventDefault();
      if (!cName.trim()) return;
      addCampaign({
        name: cName.trim(),
        channel: cChannel,
        segment: cSegment,
        sentCount: 150,
        openRate: 0,
        clickRate: 0,
        status: 'scheduled',
        date: '21.11.2026',
      });
      setCName('');
      setCmpModal(false);
      notify(lang === 'ru' ? 'Рассылка запланирована' : 'Жөнөтүү пландаштырылды');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Маркетинговые рассылки' : 'Маркетинг жөнөтүүлөрү'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Массовые кампании по Email, WhatsApp, SMS и Telegram' : 'Email, WhatsApp, SMS жана Telegram аркылуу кампаниялар'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setCmpModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Создать рассылку' : 'Жөнөтүү түзүү'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{tx(UI.common.name, lang)}</th>
                <th>{lang === 'ru' ? 'Канал' : 'Канал'}</th>
                <th>{lang === 'ru' ? 'Сегмент' : 'Сегмент'}</th>
                <th>{lang === 'ru' ? 'Получателей' : 'Алуучулар'}</th>
                <th>Open / Click</th>
                <th>{tx(UI.common.date, lang)}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns
                .filter((c) => !q || tx(c.name, lang).toLowerCase().includes(q))
                .map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{tx(c.name, lang)}</td>
                    <td><span className="badge">{c.channel}</span></td>
                    <td>{tx(c.segment, lang)}</td>
                    <td>{c.sentCount}</td>
                    <td>{c.openRate}% / {c.clickRate}%</td>
                    <td>{c.date}</td>
                    <td>
                      <span className={`badge ${c.status === 'sent' ? 'badge-dark' : 'badge-mid'}`}>
                        {c.status === 'sent'
                          ? lang === 'ru' ? 'Отправлена' : 'Жөнөтүлдү'
                          : lang === 'ru' ? 'Запланирована' : 'Пландалды'}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={cmpModal}
          onClose={() => setCmpModal(false)}
          title={lang === 'ru' ? 'Новая рассылка' : 'Жаңы жөнөтүү'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setCmpModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="cmp-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="cmp-form" className="form-grid" onSubmit={handleAddCmp}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={cName} onChange={(e) => setCName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Канал' : 'Канал'}</label>
                <select className="select" value={cChannel} onChange={(e) => setCChannel(e.target.value as CampaignItem['channel'])}>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Telegram">Telegram</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Сегмент' : 'Сегмент'}</label>
                <select className="select" value={cSegment} onChange={(e) => setCSegment(e.target.value)}>
                  {segments.map((s) => (
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

  if (activeTab === 'segments') {
    const handleAddSeg = (e: React.FormEvent) => {
      e.preventDefault();
      if (!sgName.trim()) return;
      addSegment({
        name: sgName.trim(),
        criteria: sgCrit.trim() || { ru: 'Все активные клиенты', ky: 'Бардык активдүү кардарлар' },
        count: Number(sgCount) || 50,
        updatedAt: '20.11.2026',
      });
      setSgName('');
      setSgCrit('');
      setSegModal(false);
      notify(lang === 'ru' ? 'Сегмент создан' : 'Сегмент түзүлдү');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Сегменты аудитории' : 'Аудитория сегменттери'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Динамические выборки клиентов из CRM для таргетированных кампаний' : 'Максаттуу кампаниялар үчүн CRMден кардар тандоолору'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setSegModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Создать сегмент' : 'Сегмент түзүү'}
          </button>
        </div>

        <div className="cards-grid">
          {segments.map((s) => (
            <div key={s.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge badge-dark">{s.count} {lang === 'ru' ? 'контактов' : 'байланыш'}</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{s.updatedAt}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{tx(s.name, lang)}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{tx(s.criteria, lang)}</div>
            </div>
          ))}
        </div>

        <Modal
          open={segModal}
          onClose={() => setSegModal(false)}
          title={lang === 'ru' ? 'Новый сегмент' : 'Жаңы сегмент'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setSegModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="seg-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="seg-form" className="form-grid" onSubmit={handleAddSeg}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={sgName} onChange={(e) => setSgName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Критерии' : 'Критерийлер'}</label>
                <input className="input" value={sgCrit} onChange={(e) => setSgCrit(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Размер базы' : 'База өлчөмү'}</label>
                <input className="input" type="number" value={sgCount} onChange={(e) => setSgCount(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'ads') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Рекламные каналы и сквозная аналитика' : 'Жарнама каналдары'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Расходы, стоимость лида (CPL) и окупаемость каналов' : 'Чыгымдар, лид баасы (CPL) жана каналдардын кайтарымы'}
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Площадка' : 'Аянтча'}</th>
                <th>{lang === 'ru' ? 'Бюджет' : 'Бюджет'}</th>
                <th>{lang === 'ru' ? 'Лиды' : 'Лиддер'}</th>
                <th>CPL</th>
                <th>ROI</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>{formatSom(a.budget, lang)}</td>
                  <td>{a.leads}</td>
                  <td>{formatSom(a.cpl, lang)}</td>
                  <td><strong>{a.roi}%</strong></td>
                  <td>
                    <button type="button" className={`switch-btn ${a.active ? 'on' : ''}`} onClick={() => toggleAdActive(a.id)}>
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
  }

  if (activeTab === 'templates') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Шаблоны сообщений' : 'Билдирүү калыптары'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Готовые макеты писем и автосообщений для рассылок' : 'Жөнөтүүлөр үчүн даяр кат жана билдирүү калыптары'}
            </p>
          </div>
        </div>

        <div className="cards-grid">
          {templates.map((tpl) => (
            <div key={tpl.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <span className="badge" style={{ marginBottom: 8 }}>{tpl.channel}</span>
                <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>{tx(tpl.name, lang)}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{tx(tpl.subject, lang)}</div>
              </div>
              <button type="button" className="btn btn-sm" onClick={() => setPreviewTpl(tpl)}>
                <Eye size={13} />
                {lang === 'ru' ? 'Предпросмотр' : 'Алдын ала көрүү'}
              </button>
            </div>
          ))}
        </div>

        <Modal
          open={Boolean(previewTpl)}
          onClose={() => setPreviewTpl(null)}
          title={previewTpl ? tx(previewTpl.name, lang) : ''}
          footer={<button type="button" className="btn btn-primary" onClick={() => setPreviewTpl(null)}>{tx(UI.common.close, lang)}</button>}
        >
          {previewTpl && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{previewTpl.channel}</div>
              <div style={{ fontWeight: 600 }}>{tx(previewTpl.subject, lang)}</div>
              <div style={{ padding: 12, borderRadius: 6, background: 'var(--bg-surface-alt)', border: '1px solid var(--border)' }}>
                {tx(previewTpl.previewText, lang)}
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // Marketing Analytics
  const totalBudget = ads.reduce((a, b) => a + b.budget, 0);
  const totalLeads = ads.reduce((a, b) => a + b.leads, 0);
  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Аналитика маркетинга' : 'Маркетинг аналитикасы'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Эффективность привлечения и вовлечённости базы' : 'Тартуу жана базанын активдүүлүк натыйжалуулугу'}
          </p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">{lang === 'ru' ? 'Рекламный бюджет' : 'Жарнама бюджети'}</div>
          <div className="kpi-value">{formatSom(totalBudget, lang)}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{lang === 'ru' ? 'Привлечено лидов' : 'Тартылган лиддер'}</div>
          <div className="kpi-value">{totalLeads}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{lang === 'ru' ? 'Средний Open Rate' : 'Орточо Open Rate'}</div>
          <div className="kpi-value">67%</div>
        </div>
      </div>

      <div className="card card-pad">
        <h3 style={{ margin: '0 0 14px', fontSize: 14.5 }}>{lang === 'ru' ? 'Лиды по рекламным каналам' : 'Жарнама каналдары боюнча лиддер'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ads.map((a) => {
            const pct = totalLeads > 0 ? Math.round((a.leads / totalLeads) * 100) : 0;
            return (
              <div key={a.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{a.name}</span>
                  <strong>{a.leads} ({pct}%)</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
