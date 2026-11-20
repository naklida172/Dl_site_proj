import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckSquare, Plus, Square } from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { TaskPriority, TaskStage } from '../../types';
import { Modal } from '../Layout/Modal';

const TASK_STAGES: TaskStage[] = ['new', 'in_progress', 'review', 'done'];

export const TasksModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    tasks,
    addTask,
    toggleTaskDone,
    moveTaskStage,
    projects,
    addProject,
    flows,
    toggleFlowActive,
    employees,
    notify,
  } = useAppData();

  const [listFilter, setListFilter] = useState<'all' | 'in_progress' | 'review' | 'overdue' | 'done'>('all');
  const [taskModal, setTaskModal] = useState(false);
  const [tTitle, setTTitle] = useState('');
  const [tAssignee, setTAssignee] = useState(employees[0]?.name ?? 'Азамат Беков');
  const [tProject, setTProject] = useState(tx(projects[0]?.name ?? 'B2B Продажи Q4', 'ru'));
  const [tDeadline, setTDeadline] = useState('25.11.2026');
  const [tPriority, setTPriority] = useState<TaskPriority>('medium');

  const [projModal, setProjModal] = useState(false);
  const [pName, setPName] = useState('');
  const [pLead, setPLead] = useState(employees[1]?.name ?? 'Айгерим Токтогулова');
  const [pDeadline, setPDeadline] = useState('30.12.2026');

  const q = searchQuery.trim().toLowerCase();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tTitle.trim()) return;
    addTask({
      title: tTitle.trim(),
      assignee: tAssignee,
      creator: 'Азамат Беков',
      project: tProject,
      deadline: tDeadline,
      priority: tPriority,
      stage: 'new',
      storyPoints: 3,
      inSprint: true,
    });
    setTTitle('');
    setTaskModal(false);
    notify(lang === 'ru' ? 'Задача создана' : 'Тапшырма түзүлдү');
  };

  if (activeTab === 'list') {
    const filtered = tasks.filter((t) => {
      const matchQ = !q || tx(t.title, lang).toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);
      if (!matchQ) return false;
      if (listFilter === 'overdue') return Boolean(t.overdue && t.stage !== 'done');
      if (listFilter === 'all') return true;
      return t.stage === listFilter;
    });

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Задачи' : 'Тапшырмалар'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Контроль сроков, исполнителей и приоритетов' : 'Мөөнөттөрдү, аткаруучуларды жана артыкчылыктарды көзөмөлдөө'}
            </p>
          </div>
          <div className="page-actions">
            <div className="seg-control">
              {(['all', 'in_progress', 'review', 'overdue', 'done'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`seg-btn ${listFilter === f ? 'active' : ''}`}
                  onClick={() => setListFilter(f)}
                >
                  {f === 'all' && tx(UI.common.all, lang)}
                  {f === 'in_progress' && tx(UI.taskStages.in_progress, lang)}
                  {f === 'review' && tx(UI.taskStages.review, lang)}
                  {f === 'overdue' && (lang === 'ru' ? 'Просрочены' : 'Мөөнөтү өттү')}
                  {f === 'done' && tx(UI.taskStages.done, lang)}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary" onClick={() => setTaskModal(true)}>
              <Plus size={15} />
              {lang === 'ru' ? 'Создать задачу' : 'Тапшырма түзүү'}
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 38 }} />
                <th>{lang === 'ru' ? 'Задача' : 'Тапшырма'}</th>
                <th>{lang === 'ru' ? 'Исполнитель' : 'Аткаруучу'}</th>
                <th>{lang === 'ru' ? 'Проект' : 'Долбоор'}</th>
                <th>{lang === 'ru' ? 'Приоритет' : 'Артыкчылыгы'}</th>
                <th>{lang === 'ru' ? 'Крайний срок' : 'Акыркы мөөнөт'}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const isDone = t.stage === 'done';
                return (
                  <tr key={t.id}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-icon"
                        style={{ border: 'none', background: 'transparent' }}
                        onClick={() => toggleTaskDone(t.id)}
                      >
                        {isDone ? <CheckSquare size={17} /> : <Square size={17} />}
                      </button>
                    </td>
                    <td style={{ fontWeight: 500, textDecoration: isDone ? 'line-through' : 'none', color: isDone ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                      {tx(t.title, lang)}
                    </td>
                    <td>{t.assignee}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{tx(t.project, lang)}</td>
                    <td>
                      <span className={`badge ${t.priority === 'high' ? 'badge-dark' : ''}`}>
                        {tx(UI.priorities[t.priority], lang)}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${t.overdue && !isDone ? 'badge-dark' : ''}`}>
                        {t.deadline}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-mid">{tx(UI.taskStages[t.stage], lang)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Modal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          title={lang === 'ru' ? 'Новая задача' : 'Жаңы тапшырма'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setTaskModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="task-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="task-form" className="form-grid" onSubmit={handleAddTask}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={tTitle} onChange={(e) => setTTitle(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Исполнитель' : 'Аткаруучу'}</label>
                <select className="select" value={tAssignee} onChange={(e) => setTAssignee(e.target.value)}>
                  {employees.map((em) => (
                    <option key={em.id} value={em.name}>{em.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Проект' : 'Долбоор'}</label>
                <input className="input" value={tProject} onChange={(e) => setTProject(e.target.value)} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Приоритет' : 'Артыкчылыгы'}</label>
                <select className="select" value={tPriority} onChange={(e) => setTPriority(e.target.value as TaskPriority)}>
                  <option value="high">{tx(UI.priorities.high, lang)}</option>
                  <option value="medium">{tx(UI.priorities.medium, lang)}</option>
                  <option value="low">{tx(UI.priorities.low, lang)}</option>
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Крайний срок' : 'Акыркы мөөнөт'}</label>
                <input className="input" value={tDeadline} onChange={(e) => setTDeadline(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'kanban') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Канбан задач' : 'Тапшырмалар канбаны'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Перемещайте карточки между стадиями с помощью стрелок' : 'Жебелер аркылуу карточкаларды баскычтар ортосунда жылдырыңыз'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setTaskModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить задачу' : 'Тапшырма кошуу'}
          </button>
        </div>

        <div className="kanban-board">
          {TASK_STAGES.map((stage, idx) => {
            const colTasks = tasks.filter(
              (t) => t.stage === stage && (!q || tx(t.title, lang).toLowerCase().includes(q))
            );
            return (
              <div key={stage} className="kanban-col">
                <div className="kanban-col-head">
                  <div className="kanban-col-title-row">
                    <span>{tx(UI.taskStages[stage], lang)}</span>
                    <span className="badge badge-mid">{colTasks.length}</span>
                  </div>
                </div>
                {colTasks.map((t) => (
                  <div key={t.id} className="kanban-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${t.priority === 'high' ? 'badge-dark' : ''}`}>{tx(UI.priorities[t.priority], lang)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.deadline}</span>
                    </div>
                    <div className="kanban-card-title">{tx(t.title, lang)}</div>
                    <div className="kanban-card-meta">{t.assignee} · {tx(t.project, lang)}</div>
                    <div className="kanban-card-foot">
                      <button
                        type="button"
                        className="btn btn-sm btn-icon"
                        disabled={idx === 0}
                        onClick={() => moveTaskStage(t.id, TASK_STAGES[idx - 1])}
                      >
                        <ArrowLeft size={13} />
                      </button>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.storyPoints} SP</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-icon"
                        disabled={idx === TASK_STAGES.length - 1}
                        onClick={() => moveTaskStage(t.id, TASK_STAGES[idx + 1])}
                      >
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        <Modal
          open={taskModal}
          onClose={() => setTaskModal(false)}
          title={lang === 'ru' ? 'Новая задача' : 'Жаңы тапшырма'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setTaskModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="task-form-k" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="task-form-k" className="form-grid" onSubmit={handleAddTask}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={tTitle} onChange={(e) => setTTitle(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Исполнитель' : 'Аткаруучу'}</label>
              <select className="select" value={tAssignee} onChange={(e) => setTAssignee(e.target.value)}>
                {employees.map((em) => (
                  <option key={em.id} value={em.name}>{em.name}</option>
                ))}
              </select>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'projects') {
    const handleAddProject = (e: React.FormEvent) => {
      e.preventDefault();
      if (!pName.trim()) return;
      addProject(pName.trim(), pLead, pDeadline);
      setPName('');
      setProjModal(false);
      notify(lang === 'ru' ? 'Проект создан' : 'Долбоор түзүлдү');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Проекты компании' : 'Компания долбоорлору'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Рабочие группы, участники и прогресс выполнения' : 'Иш топтору, катышуучулар жана аткарылуу деңгээли'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setProjModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новый проект' : 'Жаңы долбоор'}
          </button>
        </div>

        <div className="cards-grid">
          {projects.map((p) => {
            const total = p.openTasks + p.completedTasks;
            const pct = total > 0 ? Math.round((p.completedTasks / total) * 100) : 0;
            return (
              <div key={p.id} className="card card-pad">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="badge badge-mid">{tx(p.status, lang)}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.deadline}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{tx(p.name, lang)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  {lang === 'ru' ? 'Руководитель' : 'Жетекчи'}: {p.lead} · {p.membersCount} {lang === 'ru' ? 'уч.' : 'катыш.'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span>{lang === 'ru' ? 'Прогресс' : 'Жүрүшү'}</span>
                  <strong>{pct}% ({p.completedTasks}/{total})</strong>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <Modal
          open={projModal}
          onClose={() => setProjModal(false)}
          title={lang === 'ru' ? 'Создать проект' : 'Долбоор түзүү'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setProjModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="proj-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="proj-form" className="form-grid" onSubmit={handleAddProject}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
              <input className="input" required value={pName} onChange={(e) => setPName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Руководитель' : 'Жетекчи'}</label>
                <select className="select" value={pLead} onChange={(e) => setPLead(e.target.value)}>
                  {employees.map((em) => (
                    <option key={em.id} value={em.name}>{em.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Срок сдачи' : 'Тапшыруу мөөнөтү'}</label>
                <input className="input" value={pDeadline} onChange={(e) => setPDeadline(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'scrum') {
    const sprintTasks = tasks.filter((t) => t.inSprint);
    const backlogTasks = tasks.filter((t) => !t.inSprint);
    const totalSP = sprintTasks.reduce((a, b) => a + b.storyPoints, 0);
    const doneSP = sprintTasks.filter((t) => t.stage === 'done').reduce((a, b) => a + b.storyPoints, 0);

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Скрам · Спринт #14' : 'Скрам · Спринт #14'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Цель: Автоматизация воронки и запуск филиала Ош (16.11 – 29.11)' : 'Максат: Воронканы автоматташтыруу жана Ош филиалын ишке киргизүү'}
            </p>
          </div>
          <span className="badge badge-dark">{doneSP} / {totalSP} Story Points</span>
        </div>

        <div className="card card-pad" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>{lang === 'ru' ? 'Сгорание спринта (прогресс)' : 'Спринттин аткарылышы'}</span>
            <span>{totalSP > 0 ? Math.round((doneSP / totalSP) * 100) : 0}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${totalSP > 0 ? Math.round((doneSP / totalSP) * 100) : 0}%` }} />
          </div>
        </div>

        <div className="form-row-2" style={{ alignItems: 'start' }}>
          <div className="card card-pad">
            <h3 style={{ margin: '0 0 10px', fontSize: 14 }}>{lang === 'ru' ? 'Текущий спринт' : 'Учурдагы спринт'} ({sprintTasks.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sprintTasks.map((t) => (
                <div key={t.id} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-surface-alt)' }}>
                  <div style={{ fontWeight: 600 }}>{tx(t.title, lang)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>{t.assignee}</span>
                    <span className="badge">{t.storyPoints} SP · {tx(UI.taskStages[t.stage], lang)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 10px', fontSize: 14 }}>{lang === 'ru' ? 'Бэклог продукта' : 'Продукт бэклогу'} ({backlogTasks.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {backlogTasks.map((t) => (
                <div key={t.id} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 600 }}>{tx(t.title, lang)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span>{t.assignee}</span>
                    <span className="badge">{t.storyPoints} SP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'flows') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Потоки задач' : 'Тапшырма агымдары'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Потоковое распределение типовых заявок по отделам' : 'Бөлүмдөр боюнча типтүү өтүнмөлөрдү агымдык бөлүштүрүү'}
            </p>
          </div>
        </div>

        <div className="cards-grid">
          {flows.map((fl) => (
            <div key={fl.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span className="badge badge-mid">{tx(fl.avgTime, lang)}</span>
                <button type="button" className={`switch-btn ${fl.active ? 'on' : ''}`} onClick={() => toggleFlowActive(fl.id)}>
                  <span className="switch-thumb" />
                </button>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{tx(fl.name, lang)}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                {lang === 'ru' ? 'Куратор' : 'Куратор'}: {fl.owner}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'ru' ? 'В очереди' : 'Кезекте'}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{fl.queueCount}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lang === 'ru' ? 'Эффективность' : 'Натыйжалуулук'}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{fl.efficiency}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Efficiency tab
  const stats = employees.map((emp) => {
    const empTasks = tasks.filter((t) => t.assignee === emp.name);
    const done = empTasks.filter((t) => t.stage === 'done').length;
    const eff = empTasks.length > 0 ? Math.max(78, Math.round(((done + 2) / (empTasks.length + 2)) * 100)) : 91;
    return { emp, count: empTasks.length, done, eff };
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Эффективность по задачам' : 'Тапшырмалар боюнча натыйжалуулук'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Сводка закрытия задач в срок без просрочек' : 'Мөөнөтүнөн кечикпей аткарылган тапшырмалардын жыйынтыгы'}
          </p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">{lang === 'ru' ? 'Общая эффективность' : 'Жалпы натыйжалуулук'}</div>
          <div className="kpi-value">91%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{lang === 'ru' ? 'Задач в работе' : 'Иштелүүдөгү тапшырмалар'}</div>
          <div className="kpi-value">{tasks.filter((t) => t.stage !== 'done').length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">{lang === 'ru' ? 'Завершено' : 'Аяктаган'}</div>
          <div className="kpi-value">{tasks.filter((t) => t.stage === 'done').length}</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
              <th>{lang === 'ru' ? 'Отдел' : 'Бөлүм'}</th>
              <th>{lang === 'ru' ? 'Назначено' : 'Дайындалды'}</th>
              <th>{lang === 'ru' ? 'Эффективность' : 'Натыйжалуулук'}</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(({ emp, count, eff }) => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 600 }}>{emp.name}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{tx(emp.department, lang)}</td>
                <td>{count}</td>
                <td style={{ width: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="bar-track" style={{ flex: 1 }}>
                      <div className="bar-fill" style={{ width: `${eff}%` }} />
                    </div>
                    <strong style={{ width: 38 }}>{eff}%</strong>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
