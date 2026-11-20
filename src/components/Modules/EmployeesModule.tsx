import React, { useState } from 'react';
import { BookOpen, Clock, Play, Plus, Square } from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { AbsenceRecord, KnowledgeArticle } from '../../types';
import { Modal } from '../Layout/Modal';

export const EmployeesModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    employees,
    addEmployee,
    departments,
    workdayActive,
    workdayStart,
    toggleWorkday,
    absences,
    addAbsence,
    kbArticles,
    notify,
  } = useAppData();

  const [depFilter, setDepFilter] = useState<string>('all');
  const [empModal, setEmpModal] = useState(false);
  const [eName, setEName] = useState('');
  const [eRole, setERole] = useState('');
  const [eDepId, setEDepId] = useState(departments[1]?.id ?? 'dep_sales');
  const [eEmail, setEEmail] = useState('');
  const [ePhone, setEPhone] = useState('+996 555 ');

  const [selectedOrgDep, setSelectedOrgDep] = useState<string>(departments[1]?.id ?? 'dep_sales');

  const [absModal, setAbsModal] = useState(false);
  const [aEmp, setAEmp] = useState(employees[0]?.name ?? 'Азамат Беков');
  const [aType, setAType] = useState<AbsenceRecord['type']>('vacation');
  const [aFrom, setAFrom] = useState('25.11.2026');
  const [aTo, setATo] = useState('29.11.2026');
  const [aComment, setAComment] = useState('');

  const [selectedKb, setSelectedKb] = useState<KnowledgeArticle | null>(null);

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'directory') {
    const filtered = employees.filter(
      (e) =>
        (depFilter === 'all' || e.departmentId === depFilter) &&
        (!q || e.name.toLowerCase().includes(q) || tx(e.role, lang).toLowerCase().includes(q))
    );

    const handleInvite = (e: React.FormEvent) => {
      e.preventDefault();
      if (!eName.trim()) return;
      const dep = departments.find((d) => d.id === eDepId) ?? departments[0];
      const initials = eName
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((x) => x[0].toUpperCase())
        .join('');
      addEmployee({
        name: eName.trim(),
        initials: initials || 'НС',
        role: eRole.trim() || { ru: 'Специалист', ky: 'Адис' },
        departmentId: dep.id,
        department: dep.name,
        email: eEmail.trim() || 'staff@crm24.kg',
        phone: ePhone.trim(),
        status: 'online',
        hoursWeek: 0,
      });
      setEName('');
      setERole('');
      setEEmail('');
      setEmpModal(false);
      notify(lang === 'ru' ? 'Сотрудник добавлен в штат' : 'Кызматкер тизмеге кошулду');
    };

    const statusLabel = (s: 'online' | 'vacation' | 'offline') => {
      if (s === 'online') return lang === 'ru' ? 'На рабочем месте' : 'Иш ордунда';
      if (s === 'vacation') return lang === 'ru' ? 'В отпуске' : 'Өргүүдө';
      return lang === 'ru' ? 'Оффлайн' : 'Оффлайн';
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Сотрудники компании' : 'Компания кызматкерлери'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Штат, отделы и текущая доступность коллег' : 'Штат, бөлүмдөр жана кызматкерлердин жеткиликтүүлүгү'}
            </p>
          </div>
          <div className="page-actions">
            <select className="select" style={{ width: 210 }} value={depFilter} onChange={(e) => setDepFilter(e.target.value)}>
              <option value="all">{tx(UI.common.all, lang)}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{tx(d.name, lang)}</option>
              ))}
            </select>
            <button type="button" className="btn btn-primary" onClick={() => setEmpModal(true)}>
              <Plus size={15} />
              {lang === 'ru' ? 'Пригласить сотрудника' : 'Кызматкер кошуу'}
            </button>
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
                <th>{lang === 'ru' ? 'Должность' : 'Кызматы'}</th>
                <th>{lang === 'ru' ? 'Отдел' : 'Бөлүм'}</th>
                <th>{tx(UI.common.phone, lang)}</th>
                <th>Email</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="avatar-pill" style={{ width: 28, height: 28, fontSize: 11 }}>{emp.initials}</span>
                      <strong>{emp.name}</strong>
                    </div>
                  </td>
                  <td>{tx(emp.role, lang)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx(emp.department, lang)}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.email}</td>
                  <td>
                    <span className={`badge ${emp.status === 'online' ? 'badge-dark' : 'badge-mid'}`}>
                      {statusLabel(emp.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={empModal}
          onClose={() => setEmpModal(false)}
          title={lang === 'ru' ? 'Пригласить сотрудника' : 'Кызматкер кошуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setEmpModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="emp-form" className="btn btn-primary">{tx(UI.common.add, lang)}</button>
            </>
          }
        >
          <form id="emp-form" className="form-grid" onSubmit={handleInvite}>
            <div className="field">
              <label>{lang === 'ru' ? 'ФИО' : 'Аты-жөнү'}</label>
              <input className="input" required value={eName} onChange={(e) => setEName(e.target.value)} />
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Должность' : 'Кызматы'}</label>
                <input className="input" value={eRole} onChange={(e) => setERole(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Отдел' : 'Бөлүм'}</label>
                <select className="select" value={eDepId} onChange={(e) => setEDepId(e.target.value)}>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{tx(d.name, lang)}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>Email</label>
                <input className="input" value={eEmail} onChange={(e) => setEEmail(e.target.value)} />
              </div>
              <div className="field">
                <label>{tx(UI.common.phone, lang)}</label>
                <input className="input" value={ePhone} onChange={(e) => setEPhone(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'structure') {
    const rootDep = departments[0];
    const childDeps = departments.slice(1);
    const activeDepStaff = employees.filter((e) => e.departmentId === selectedOrgDep);

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Структура компании' : 'Компаниянын түзүмү'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Нажмите на подразделение, чтобы увидеть его состав' : 'Курамын көрүү үчүн бөлүмдү басыңыз'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <button
            type="button"
            className="card card-pad"
            onClick={() => setSelectedOrgDep(rootDep.id)}
            style={{
              minWidth: 280,
              textAlign: 'center',
              cursor: 'pointer',
              borderColor: selectedOrgDep === rootDep.id ? 'var(--accent)' : 'var(--border)',
              background: selectedOrgDep === rootDep.id ? 'var(--bg-well)' : 'var(--bg-surface)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>{tx(rootDep.name, lang)}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>{rootDep.head}</div>
          </button>

          <div style={{ width: 2, height: 18, background: 'var(--border-strong)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, width: '100%' }}>
            {childDeps.map((dep) => {
              const count = employees.filter((e) => e.departmentId === dep.id).length;
              const isSel = selectedOrgDep === dep.id;
              return (
                <button
                  key={dep.id}
                  type="button"
                  className="card card-pad"
                  onClick={() => setSelectedOrgDep(dep.id)}
                  style={{
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderColor: isSel ? 'var(--accent)' : 'var(--border)',
                    background: isSel ? 'var(--bg-well)' : 'var(--bg-surface)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span className="badge">{count} {lang === 'ru' ? 'чел.' : 'адам'}</span>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{tx(dep.name, lang)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {lang === 'ru' ? 'Рук.' : 'Жет.'}: {dep.head}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ margin: '0 0 10px', fontSize: 14 }}>
            {tx(departments.find((d) => d.id === selectedOrgDep)?.name ?? '', lang)}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {activeDepStaff.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 6 }}>
                <span className="avatar-pill" style={{ width: 28, height: 28 }}>{s.initials}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{tx(s.role, lang)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'timetrack') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Учёт рабочего времени' : 'Иш убактысын эсепке алуу'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Контроль начала рабочего дня и недельных часов' : 'Жумуш күнүнүн башталышын жана жумалык сааттарды көзөмөлдөө'}
            </p>
          </div>
        </div>

        <div className="card card-pad" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="anchor-logo-box" style={{ width: 38, height: 38 }}>
              <Clock size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {workdayActive
                  ? lang === 'ru'
                    ? `Рабочий день начат в ${workdayStart}`
                    : `Жумуш күнү ${workdayStart} башталды`
                  : lang === 'ru'
                  ? 'Рабочий день завершён'
                  : 'Жумуш күнү аяктады'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                Азамат Беков · {lang === 'ru' ? 'Норма 40 ч/нед' : 'Норма жумасына 40 саат'}
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`btn ${workdayActive ? '' : 'btn-primary'}`}
            onClick={() => {
              toggleWorkday();
              notify(
                workdayActive
                  ? lang === 'ru'
                    ? 'Рабочий день завершён'
                    : 'Жумуш күнү аяктады'
                  : lang === 'ru'
                  ? 'Рабочий день начат'
                  : 'Жумуш күнү башталды'
              );
            }}
          >
            {workdayActive ? <Square size={14} /> : <Play size={14} />}
            {workdayActive
              ? lang === 'ru'
                ? 'Завершить рабочий день'
                : 'Жумуш күнүн аяктоо'
              : lang === 'ru'
              ? 'Начать рабочий день'
              : 'Жумуш күнүн баштоо'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
                <th>{lang === 'ru' ? 'Отдел' : 'Бөлүм'}</th>
                <th>{lang === 'ru' ? 'Отработано за неделю' : 'Апталык сааттар'}</th>
                <th>{tx(UI.common.status, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600 }}>{e.name}</td>
                  <td>{tx(e.department, lang)}</td>
                  <td><strong>{e.hoursWeek} {lang === 'ru' ? 'ч.' : 'с.'}</strong></td>
                  <td>
                    <span className={`badge ${e.hoursWeek >= 40 ? 'badge-dark' : 'badge-mid'}`}>
                      {e.hoursWeek >= 40 ? (lang === 'ru' ? 'Норма выполнена' : 'Норма аткарылды') : (lang === 'ru' ? 'В процессе' : 'Аткарылууда')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'absences') {
    const handleAddAbsence = (e: React.FormEvent) => {
      e.preventDefault();
      addAbsence({
        employee: aEmp,
        type: aType,
        from: aFrom,
        to: aTo,
        comment: aComment.trim() || { ru: 'Согласовано с руководителем', ky: 'Жетекчи менен макулдашылды' },
      });
      setAComment('');
      setAbsModal(false);
      notify(lang === 'ru' ? 'Отсутствие добавлено в график' : 'Жок болуу графигине кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'График отсутствий' : 'Жок болуу графиги'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Отпуска, больничные и командировки сотрудников' : 'Кызматкерлердин өргүүлөрү, ооруп калуулары жана иш сапарлары'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setAbsModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Добавить отсутствие' : 'Жок болуу кошуу'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</th>
                <th>{lang === 'ru' ? 'Причина' : 'Себеби'}</th>
                <th>{lang === 'ru' ? 'Период' : 'Мезгили'}</th>
                <th>{tx(UI.common.comment, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.employee}</td>
                  <td><span className="badge badge-mid">{tx(UI.absenceTypes[a.type], lang)}</span></td>
                  <td>{a.from} — {a.to}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx(a.comment, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={absModal}
          onClose={() => setAbsModal(false)}
          title={lang === 'ru' ? 'Добавить отсутствие' : 'Жок болуу кошуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setAbsModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="abs-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="abs-form" className="form-grid" onSubmit={handleAddAbsence}>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'Сотрудник' : 'Кызматкер'}</label>
                <select className="select" value={aEmp} onChange={(e) => setAEmp(e.target.value)}>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Тип' : 'Түрү'}</label>
                <select className="select" value={aType} onChange={(e) => setAType(e.target.value as AbsenceRecord['type'])}>
                  <option value="vacation">{tx(UI.absenceTypes.vacation, lang)}</option>
                  <option value="sick">{tx(UI.absenceTypes.sick, lang)}</option>
                  <option value="trip">{tx(UI.absenceTypes.trip, lang)}</option>
                </select>
              </div>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{lang === 'ru' ? 'С' : 'Башталышы'}</label>
                <input className="input" value={aFrom} onChange={(e) => setAFrom(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'По' : 'Аякташы'}</label>
                <input className="input" value={aTo} onChange={(e) => setATo(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{tx(UI.common.comment, lang)}</label>
              <input className="input" value={aComment} onChange={(e) => setAComment(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Knowledge Base tab
  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'База знаний компании' : 'Компаниянын билим базасы'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Корпоративные регламенты и инструкции для новых сотрудников' : 'Корпоративдик эрежелер жана нускамалар'}
          </p>
        </div>
      </div>

      <div className="cards-grid">
        {kbArticles.map((art) => (
          <div key={art.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="badge">{tx(art.category, lang)}</span>
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{art.updatedAt}</span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{tx(art.title, lang)}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                {tx(art.content, lang).slice(0, 110)}...
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{art.author}</span>
              <button type="button" className="btn btn-sm" onClick={() => setSelectedKb(art)}>
                <BookOpen size={13} />
                {tx(UI.common.open, lang)}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={Boolean(selectedKb)}
        onClose={() => setSelectedKb(null)}
        title={selectedKb ? tx(selectedKb.title, lang) : ''}
        footer={<button type="button" className="btn btn-primary" onClick={() => setSelectedKb(null)}>{tx(UI.common.close, lang)}</button>}
      >
        {selectedKb && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {tx(selectedKb.category, lang)} · {selectedKb.author} · {selectedKb.updatedAt}
            </div>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{tx(selectedKb.content, lang)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};
