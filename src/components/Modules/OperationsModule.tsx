import React, { useState } from 'react';
import { BookOpen, CheckSquare, Plus, Square } from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { RestaurantEvent, ShiftTask, SopArticle } from '../../types';
import { Modal } from '../Layout/Modal';

export const OperationsModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    checklists,
    shiftTasks,
    restEvents,
    autoRules,
    restIntegrations,
    sopArticles,
    staff,
    toggleChecklistItem,
    addShiftTask,
    toggleShiftTask,
    addRestaurantEvent,
    toggleAutoRule,
    addAutoRule,
    toggleRestIntegration,
    addSopArticle,
    notify,
  } = useRestaurant();

  const [taskModal, setTaskModal] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tAssignee, setTAssignee] = useState(staff[0]?.name ?? 'Айжан Садыкова');
  const [tPrio, setTPrio] = useState<ShiftTask['priority']>('medium');
  const [tDue, setTDue] = useState('Сегодня, 18:00');

  const [selectedDay, setSelectedDay] = useState<number>(20);
  const [evModal, setEvModal] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evDay, setEvDay] = useState(20);
  const [evTime, setEvTime] = useState('18:00');
  const [evType, setEvType] = useState<RestaurantEvent['type']>('banquet');
  const [evNote, setEvNote] = useState('');

  const [ruleModal, setRuleModal] = useState(false);
  const [rTrigger, setRTrigger] = useState('');
  const [rAction, setRAction] = useState('');

  const [readSop, setReadSop] = useState<SopArticle | null>(null);
  const [sopModal, setSopModal] = useState(false);
  const [spTitle, setSpTitle] = useState('');
  const [spCat, setSpCat] = useState('Сервис зала');
  const [spBody, setSpBody] = useState('');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'checklists') {
    const doneChecks = checklists.filter((c) => c.done).length;
    const pct = checklists.length > 0 ? Math.round((doneChecks / checklists.length) * 100) : 0;
    const zones: { key: 'hall' | 'kitchen' | 'bar'; label: { ru: string; ky: string } }[] = [
      { key: 'hall', label: { ru: 'Зал и касса', ky: 'Зал жана касса' } },
      { key: 'kitchen', label: { ru: 'Кухня · ХАССП', ky: 'Ашкана · ХАССП' } },
      { key: 'bar', label: { ru: 'Бар', ky: 'Бар' } },
    ];

    const handleAddTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!tTitle.trim()) return;
      addShiftTask({ title: tTitle.trim(), assignee: tAssignee, priority: tPrio, due: tDue, done: false });
      setTTitle('');
      setTaskModal(false);
      notify(lang === 'ru' ? 'Поручение на смену добавлено' : 'Нөөмөт тапшырмасы кошулду');
    };

    return (
      <div>
        <div className="card card-pad" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <strong>{lang === 'ru' ? 'Готовность чек-листов смены' : 'Нөөмөттүн текшерүү баракчалары'}</strong>
            <strong>{doneChecks} / {checklists.length} ({pct}%)</strong>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="cards-grid" style={{ marginBottom: 18 }}>
          {zones.map((z) => (
            <div key={z.key} className="card card-pad">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>{tx(z.label, lang)}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {checklists
                  .filter((c) => c.zone === z.key && (!q || tx(c.title, lang).toLowerCase().includes(q)))
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        border: '1px solid var(--border)',
                        background: item.done ? 'var(--bg-surface-soft)' : 'var(--bg-surface)',
                        borderRadius: 6,
                        padding: '8px 10px',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <span style={{ marginTop: 1 }}>{item.done ? <CheckSquare size={15} /> : <Square size={15} />}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--ink-muted)' : 'var(--ink-primary)' }}>
                          {tx(item.title, lang)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2 }}>{item.timeSlot}</div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Поручения и задачи смены' : 'Нөөмөттүн тапшырмалары'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setTaskModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новая задача' : 'Жаңы тапшырма'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 38 }} />
                <th>{lang === 'ru' ? 'Задача' : 'Тапшырма'}</th>
                <th>{lang === 'ru' ? 'Ответственный' : 'Жооптуу'}</th>
                <th>{lang === 'ru' ? 'Приоритет' : 'Артыкчылык'}</th>
                <th>{lang === 'ru' ? 'Срок' : 'Мөөнөт'}</th>
              </tr>
            </thead>
            <tbody>
              {shiftTasks
                .filter((t) => !q || tx(t.title, lang).toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q))
                .map((t) => (
                  <tr key={t.id}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-icon"
                        style={{ border: 'none', background: 'transparent' }}
                        onClick={() => toggleShiftTask(t.id)}
                      >
                        {t.done ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
                    <td style={{ fontWeight: 500, textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--ink-muted)' : 'var(--ink-primary)' }}>
                      {tx(t.title, lang)}
                    </td>
                    <td>{t.assignee}</td>
                    <td>
                      <span className={`pill ${t.priority === 'high' ? 'pill-dark' : ''}`}>
                        {t.priority === 'high' ? (lang === 'ru' ? 'Высокий' : 'Жогорку') : t.priority === 'medium' ? (lang === 'ru' ? 'Средний' : 'Орточо') : (lang === 'ru' ? 'Низкий' : 'Төмөн')}
                      </span>
                    </td>
                    <td>{t.due}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          title={lang === 'ru' ? 'Новое поручение на смену' : 'Жаңы тапшырма'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setTaskModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="shift-task-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="shift-task-form" className="form-grid" onSubmit={handleAddTask}>
            <div className="field">
              <label>{lang === 'ru' ? 'Описание задачи' : 'Тапшырма'}</label>
              <input className="input" required value={tTitle} onChange={(e) => setTTitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</label>
                <select className="select" value={tAssignee} onChange={(e) => setTAssignee(e.target.value)}>
                  {staff.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Приоритет' : 'Артыкчылык'}</label>
                <select className="select" value={tPrio} onChange={(e) => setTPrio(e.target.value as ShiftTask['priority'])}>
                  <option value="high">{lang === 'ru' ? 'Высокий' : 'Жогорку'}</option>
                  <option value="medium">{lang === 'ru' ? 'Средний' : 'Орточо'}</option>
                  <option value="low">{lang === 'ru' ? 'Низкий' : 'Төмөн'}</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Срок' : 'Мөөнөт'}</label>
              <input className="input" value={tDue} onChange={(e) => setTDue(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'calendar') {
    const weekdays = lang === 'ru' ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] : ['Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш', 'Жк'];
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const dayEvs = restEvents.filter((e) => e.day === selectedDay);

    const handleAddEvent = (e: React.FormEvent) => {
      e.preventDefault();
      if (!evTitle.trim()) return;
      addRestaurantEvent({
        day: Number(evDay),
        time: evTime,
        title: evTitle.trim(),
        type: evType,
        note: evNote.trim() || { ru: 'Событие ресторана', ky: 'Ресторан окуясы' },
      });
      setEvTitle('');
      setEvNote('');
      setEvModal(false);
      notify(lang === 'ru' ? 'Событие добавлено в календарь' : 'Окуя календарга кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Календарь зала, банкетов и поставок · Ноябрь 2026' : 'Зал, банкеттер жана жеткирүүлөр календары · Ноябрь 2026'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => { setEvDay(selectedDay); setEvModal(true); }}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить событие' : 'Окуя кошуу'}
          </button>
        </div>

        <div className="cal-split">
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-surface-soft)', borderBottom: '1px solid var(--border)' }}>
              {weekdays.map((wd) => (
                <div key={wd} style={{ padding: '8px', textAlign: 'center', fontWeight: 600, fontSize: 12, color: 'var(--ink-secondary)' }}>
                  {wd}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={`e-${idx}`} style={{ minHeight: 80, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-soft)' }} />
              ))}
              {daysInMonth.map((day) => {
                const evs = restEvents.filter((e) => e.day === day);
                const isSel = selectedDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minHeight: 80,
                      padding: 6,
                      border: 'none',
                      borderRight: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                      background: isSel ? 'var(--bg-well)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 99,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: day === 20 || isSel ? 700 : 500,
                        background: day === 20 ? 'var(--accent)' : 'transparent',
                        color: day === 20 ? 'var(--accent-fg)' : 'var(--ink-primary)',
                      }}
                    >
                      {day}
                    </span>
                    {evs.slice(0, 2).map((ev) => (
                      <div key={ev.id} style={{ fontSize: 11, padding: '2px 5px', borderRadius: 4, background: 'var(--pill-bg)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.time} {tx(ev.title, lang)}
                      </div>
                    ))}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 12px', fontSize: 14.5 }}>
              {selectedDay}.11.2026 — {lang === 'ru' ? 'События дня' : 'Күндүн окуялары'}
            </h3>
            {dayEvs.length === 0 ? (
              <div style={{ color: 'var(--ink-muted)', padding: '16px 0' }}>
                {lang === 'ru' ? 'На этот день событий не запланировано' : 'Бул күнгө окуялар жок'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {dayEvs.map((ev) => (
                  <div key={ev.id} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface-soft)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="pill pill-dark">{ev.time}</span>
                      <span className="pill">{tx(UI.eventTypes[ev.type], lang)}</span>
                    </div>
                    <div style={{ fontWeight: 600 }}>{tx(ev.title, lang)}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-secondary)', marginTop: 2 }}>{tx(ev.note, lang)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Modal
          open={evModal}
          onClose={() => setEvModal(false)}
          title={lang === 'ru' ? 'Новое событие ресторана' : 'Жаңы ресторан окуясы'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setEvModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="re-ev-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="re-ev-form" className="form-grid" onSubmit={handleAddEvent}>
            <div className="field">
              <label>{lang === 'ru' ? 'Название' : 'Аталышы'}</label>
              <input className="input" required value={evTitle} onChange={(e) => setEvTitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'День ноября' : 'Ноябрь күнү'}</label>
                <input className="input" type="number" min={1} max={30} value={evDay} onChange={(e) => setEvDay(Number(e.target.value))} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Время' : 'Убактысы'}</label>
                <input className="input" value={evTime} onChange={(e) => setEvTime(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Тип' : 'Түрү'}</label>
                <select className="select" value={evType} onChange={(e) => setEvType(e.target.value as RestaurantEvent['type'])}>
                  <option value="banquet">{tx(UI.eventTypes.banquet, lang)}</option>
                  <option value="music">{tx(UI.eventTypes.music, lang)}</option>
                  <option value="delivery">{tx(UI.eventTypes.delivery, lang)}</option>
                  <option value="meeting">{tx(UI.eventTypes.meeting, lang)}</option>
                </select>
              </div>
              <div className="field">
                <label>{tx(UI.common.comment, lang)}</label>
                <input className="input" value={evNote} onChange={(e) => setEvNote(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'automation') {
    const handleAddRule = (e: React.FormEvent) => {
      e.preventDefault();
      if (!rTrigger.trim() || !rAction.trim()) return;
      addAutoRule({ trigger: rTrigger.trim(), action: rAction.trim(), enabled: true });
      setRTrigger('');
      setRAction('');
      setRuleModal(false);
      notify(lang === 'ru' ? 'Правило автоматизации добавлено' : 'Автоматташтыруу эрежеси кошулду');
    };

    return (
      <div>
        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Роботы и триггеры ресторана' : 'Ресторан роботтору жана триггерлери'}
          </strong>
          <button type="button" className="btn btn-primary" onClick={() => setRuleModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить правило' : 'Эреже кошуу'}
          </button>
        </div>

        <div className="cards-grid" style={{ marginBottom: 20 }}>
          {autoRules.map((ar) => (
            <div key={ar.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className={`pill ${ar.enabled ? 'pill-dark' : ''}`}>
                  {ar.enabled ? tx(UI.common.active, lang) : tx(UI.common.inactive, lang)}
                </span>
                <button type="button" className={`switch-btn ${ar.enabled ? 'on' : ''}`} onClick={() => toggleAutoRule(ar.id)}>
                  <span className="switch-thumb" />
                </button>
              </div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{tx(ar.trigger, lang)}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)' }}>→ {tx(ar.action, lang)}</div>
            </div>
          ))}
        </div>

        <div className="toolbar-row">
          <strong style={{ fontSize: 15 }}>
            {lang === 'ru' ? 'Внешние интеграции (Агрегаторы, ККМ, StoreHouse)' : 'Тышкы интеграциялар'}
          </strong>
        </div>

        <div className="cards-grid">
          {restIntegrations.map((ri) => (
            <div key={ri.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="pill">{tx(ri.category, lang)}</span>
                <button
                  type="button"
                  className={`switch-btn ${ri.connected ? 'on' : ''}`}
                  onClick={() => {
                    toggleRestIntegration(ri.id);
                    notify(ri.name);
                  }}
                >
                  <span className="switch-thumb" />
                </button>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{ri.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)' }}>{tx(ri.desc, lang)}</div>
            </div>
          ))}
        </div>

        <Modal
          open={ruleModal}
          onClose={() => setRuleModal(false)}
          title={lang === 'ru' ? 'Новое правило автоматизации' : 'Жаңы автоматташтыруу эрежеси'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setRuleModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="auto-rule-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="auto-rule-form" className="form-grid" onSubmit={handleAddRule}>
            <div className="field">
              <label>{lang === 'ru' ? 'Если (Триггер)' : 'Эгерде (Триггер)'}</label>
              <input className="input" required value={rTrigger} onChange={(e) => setRTrigger(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'То выполнить действие' : 'Анда аткаруу'}</label>
              <input className="input" required value={rAction} onChange={(e) => setRAction(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // SOPs / Knowledge Base
  const handleAddSop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spTitle.trim() || !spBody.trim()) return;
    addSopArticle({ title: spTitle.trim(), category: spCat, author: 'Айжан Садыкова', updatedAt: '20.11.2026', content: spBody.trim() });
    setSpTitle('');
    setSpBody('');
    setSopModal(false);
    notify(lang === 'ru' ? 'Стандарт добавлен в базу знаний' : 'Стандарт билим базасына кошулду');
  };

  return (
    <div>
      <div className="toolbar-row">
        <strong style={{ fontSize: 15 }}>
          {lang === 'ru' ? 'Стандарты работы и регламенты (База знаний)' : 'Иштөө стандарттары (Билим базасы)'}
        </strong>
        <button type="button" className="btn btn-primary" onClick={() => setSopModal(true)}>
          <Plus size={15} />
          {lang === 'ru' ? 'Добавить стандарт' : 'Стандарт кошуу'}
        </button>
      </div>

      <div className="cards-grid">
        {sopArticles
          .filter((a) => !q || tx(a.title, lang).toLowerCase().includes(q))
          .map((art) => (
            <div key={art.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="pill">{tx(art.category, lang)}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>{art.updatedAt}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 6 }}>{tx(art.title, lang)}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)' }}>{tx(art.content, lang).slice(0, 110)}...</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{art.author}</span>
                <button type="button" className="btn btn-sm" onClick={() => setReadSop(art)}>
                  <BookOpen size={13} />
                  {lang === 'ru' ? 'Читать' : 'Окуу'}
                </button>
              </div>
            </div>
          ))}
      </div>

      <Modal
        open={Boolean(readSop)}
        onClose={() => setReadSop(null)}
        title={readSop ? tx(readSop.title, lang) : ''}
        footer={<button type="button" className="btn btn-primary" onClick={() => setReadSop(null)}>{tx(UI.common.close, lang)}</button>}
      >
        {readSop && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{tx(readSop.category, lang)} · {readSop.author}</div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{tx(readSop.content, lang)}</p>
          </div>
        )}
      </Modal>

      <Modal
        open={sopModal}
        onClose={() => setSopModal(false)}
        title={lang === 'ru' ? 'Новый стандарт (SOP)' : 'Жаңы стандарт'}
        footer={
          <>
            <button type="button" className="btn" onClick={() => setSopModal(false)}>{tx(UI.common.cancel, lang)}</button>
            <button type="submit" form="sop-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
          </>
        }
      >
        <form id="sop-form" className="form-grid" onSubmit={handleAddSop}>
          <div className="field">
            <label>{lang === 'ru' ? 'Заголовок' : 'Аталышы'}</label>
            <input className="input" required value={spTitle} onChange={(e) => setSpTitle(e.target.value)} />
          </div>
          <div className="field">
            <label>{lang === 'ru' ? 'Раздел' : 'Бөлүм'}</label>
            <input className="input" value={spCat} onChange={(e) => setSpCat(e.target.value)} />
          </div>
          <div className="field">
            <label>{lang === 'ru' ? 'Текст регламента' : 'Эреже тексти'}</label>
            <textarea className="textarea" required value={spBody} onChange={(e) => setSpBody(e.target.value)} />
          </div>
        </form>
      </Modal>
    </div>
  );
};
