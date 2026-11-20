import React, { useState } from 'react';
import { Play, Plus } from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { DealStage } from '../../types';
import { Modal } from '../Layout/Modal';

const STAGES: DealStage[] = ['new', 'prep', 'invoice', 'progress', 'won'];

export const AutomationModule: React.FC = () => {
  const {
    lang,
    activeTab,
    robots,
    addRobot,
    toggleRobot,
    workflows,
    runWorkflow,
    triggers,
    toggleTrigger,
    automationLogs,
    integrations,
    toggleIntegration,
    notify,
  } = useAppData();

  const [robotModal, setRobotModal] = useState(false);
  const [rStage, setRStage] = useState<DealStage>('new');
  const [rTitle, setRTitle] = useState('');
  const [rDesc, setRDesc] = useState('');

  if (activeTab === 'robots') {
    const handleAddRobot = (e: React.FormEvent) => {
      e.preventDefault();
      if (!rTitle.trim()) return;
      addRobot({
        stage: rStage,
        title: rTitle.trim(),
        actionDesc: rDesc.trim() || { ru: 'Автоматическое действие CRM', ky: 'CRM автоматтык аракети' },
        enabled: true,
      });
      setRTitle('');
      setRDesc('');
      setRobotModal(false);
      notify(lang === 'ru' ? 'Робот добавлен на стадию' : 'Робот баскычка кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Роботы CRM (по этапам сделок)' : 'CRM роботтору (бүтүм баскычтары)'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Автоматические сценарии при переходе сделки на этап' : 'Бүтүм баскычка өткөндө иштөөчү автоматтык сценарийлер'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setRobotModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить робота' : 'Робот кошуу'}
          </button>
        </div>

        <div className="kanban-board">
          {STAGES.map((st) => {
            const stRobots = robots.filter((r) => r.stage === st);
            return (
              <div key={st} className="kanban-col">
                <div className="kanban-col-head">
                  <div className="kanban-col-title-row">
                    <span>{tx(UI.dealStages[st], lang)}</span>
                    <span className="badge badge-mid">{stRobots.length}</span>
                  </div>
                </div>
                {stRobots.map((rb) => (
                  <div key={rb.id} className="kanban-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge">{rb.enabled ? (lang === 'ru' ? 'Вкл' : 'Күйүк') : (lang === 'ru' ? 'Выкл' : 'Өчүк')}</span>
                      <button type="button" className={`switch-btn ${rb.enabled ? 'on' : ''}`} onClick={() => toggleRobot(rb.id)}>
                        <span className="switch-thumb" />
                      </button>
                    </div>
                    <div className="kanban-card-title">{tx(rb.title, lang)}</div>
                    <div className="kanban-card-meta">{tx(rb.actionDesc, lang)}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <Modal
          open={robotModal}
          onClose={() => setRobotModal(false)}
          title={lang === 'ru' ? 'Новый робот' : 'Жаңы робот'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setRobotModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="robot-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="robot-form" className="form-grid" onSubmit={handleAddRobot}>
            <div className="field">
              <label>{lang === 'ru' ? 'Этап сделки' : 'Бүтүм баскычы'}</label>
              <select className="select" value={rStage} onChange={(e) => setRStage(e.target.value as DealStage)}>
                {STAGES.map((st) => (
                  <option key={st} value={st}>{tx(UI.dealStages[st], lang)}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={rTitle} onChange={(e) => setRTitle(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Действие робота' : 'Роботтун аракети'}</label>
              <input className="input" value={rDesc} onChange={(e) => setRDesc(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'workflows') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Бизнес-процессы' : 'Бизнес-процесстер'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Пошаговые процессы согласования — запуск записывается в журнал' : 'Макулдашуу процесстери — иштетүү журналга жазылат'}
            </p>
          </div>
        </div>

        <div className="cards-grid">
          {workflows.map((wf) => (
            <div key={wf.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="badge">{tx(wf.entity, lang)}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    {wf.runsCount} {lang === 'ru' ? 'зап.' : 'жолу'}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{tx(wf.name, lang)}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{tx(wf.description, lang)}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{wf.lastRun}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    runWorkflow(wf.id);
                    notify(lang === 'ru' ? 'Бизнес-процесс запущен' : 'Бизнес-процесс иштетилди');
                  }}
                >
                  <Play size={12} />
                  {tx(UI.common.run, lang)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'triggers') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Триггеры' : 'Триггерлер'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Отслеживание внешних событий для автоматической смены этапа' : 'Баскычты автоматтык которуу үчүн тышкы окуяларды көзөмөлдөө'}
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Событие-триггер' : 'Триггер окуясы'}</th>
                <th>{lang === 'ru' ? 'Целевой этап' : 'Максаттуу баскыч'}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((tr) => (
                <tr key={tr.id}>
                  <td style={{ fontWeight: 600 }}>{tx(tr.event, lang)}</td>
                  <td><span className="badge badge-mid">{tx(tr.targetStage, lang)}</span></td>
                  <td>
                    <button type="button" className={`switch-btn ${tr.enabled ? 'on' : ''}`} onClick={() => toggleTrigger(tr.id)}>
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

  if (activeTab === 'logs') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Журнал запусков автоматизации' : 'Автоматташтыруу иштөө журналы'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Хронология срабатываний роботов, триггеров и процессов' : 'Роботтордун, триггерлердин жана процесстердин иштөө тарыхы'}
            </p>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Время' : 'Убактысы'}</th>
                <th>{lang === 'ru' ? 'Источник' : 'Булак'}</th>
                <th>{lang === 'ru' ? 'Объект CRM' : 'CRM объектиси'}</th>
                <th>{lang === 'ru' ? 'Результат' : 'Натыйжасы'}</th>
              </tr>
            </thead>
            <tbody>
              {automationLogs.map((l) => (
                <tr key={l.id}>
                  <td><span className="badge">{l.time}</span></td>
                  <td style={{ fontWeight: 600 }}>{tx(l.source, lang)}</td>
                  <td>{tx(l.entity, lang)}</td>
                  <td><span className="badge badge-dark">{tx(l.result, lang)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Integrations tab
  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Интеграции и коннекторы' : 'Интеграциялар'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Подключение внешних мессенджеров, платежей и 1С' : 'Тышкы мессенджерлерди, төлөмдөрдү жана 1С туташтыруу'}
          </p>
        </div>
      </div>

      <div className="cards-grid">
        {integrations.map((intg) => (
          <div key={intg.id} className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="badge">{tx(intg.category, lang)}</span>
              <button
                type="button"
                className={`switch-btn ${intg.connected ? 'on' : ''}`}
                onClick={() => {
                  toggleIntegration(intg.id);
                  notify(intg.name);
                }}
              >
                <span className="switch-thumb" />
              </button>
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{intg.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10 }}>{tx(intg.description, lang)}</div>
            <span className={`badge ${intg.connected ? 'badge-dark' : ''}`}>
              {intg.connected ? tx(UI.common.connected, lang) : tx(UI.common.disconnected, lang)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
