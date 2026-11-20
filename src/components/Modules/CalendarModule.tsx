import React, { useState } from 'react';
import { Clock, Copy, MapPin, Plus, Users } from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { CalendarEvent } from '../../types';
import { Modal } from '../Layout/Modal';

export const CalendarModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    events,
    addCalendarEvent,
    openSlotDays,
    toggleOpenSlot,
    rooms,
    addRoomBooking,
    notify,
  } = useAppData();

  const [selectedDay, setSelectedDay] = useState<number>(20);
  const [eventModal, setEventModal] = useState(false);
  const [evTitle, setEvTitle] = useState('');
  const [evDay, setEvDay] = useState(20);
  const [evTime, setEvTime] = useState('11:00');
  const [evCat, setEvCat] = useState<CalendarEvent['category']>('meeting');
  const [evLoc, setEvLoc] = useState('');

  const [roomModal, setRoomModal] = useState(false);
  const [roomTargetId, setRoomTargetId] = useState(rooms[0]?.id ?? '');
  const [roomDay, setRoomDay] = useState('20.11');
  const [roomTime, setRoomTime] = useState('16:00 - 17:00');
  const [roomTitle, setRoomTitle] = useState('');

  const [scheduleFilter, setScheduleFilter] = useState<'all' | CalendarEvent['category']>('all');

  const q = searchQuery.trim().toLowerCase();

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim()) return;
    addCalendarEvent({
      day: Number(evDay),
      time: evTime,
      title: evTitle.trim(),
      organizer: 'Азамат Беков',
      scope: activeTab === 'company' ? 'company' : 'personal',
      category: evCat,
      location: evLoc.trim() || (lang === 'ru' ? 'Онлайн' : 'Онлайн'),
    });
    setEvTitle('');
    setEvLoc('');
    setEventModal(false);
    notify(lang === 'ru' ? 'Событие добавлено в календарь' : 'Окуя календарга кошулду');
  };

  if (activeTab === 'my' || activeTab === 'company') {
    const scopeEvents = events.filter(
      (ev) =>
        (activeTab === 'company' ? true : ev.scope === 'personal' || ev.organizer === 'Азамат Беков' || ev.day === 20) &&
        (!q || tx(ev.title, lang).toLowerCase().includes(q))
    );
    const weekdays =
      lang === 'ru'
        ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        : ['Дш', 'Шш', 'Шр', 'Бш', 'Жм', 'Иш', 'Жк'];

    // Nov 1, 2026 is Sunday -> 6 leading empty cells in Mon-Sun grid
    const leadingEmpty = 6;
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    const selectedDayEvents = scopeEvents.filter((e) => e.day === selectedDay);

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">
              {activeTab === 'company'
                ? lang === 'ru'
                  ? 'Календарь компании · Ноябрь 2026'
                  : 'Компаниянын календары · Ноябрь 2026'
                : lang === 'ru'
                ? 'Мой календарь · Ноябрь 2026'
                : 'Менин календарым · Ноябрь 2026'}
            </h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Планирование встреч, звонков и контрольных дат' : 'Жолугушууларды, чалууларды жана мөөнөттөрдү пландаштыруу'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => { setEvDay(selectedDay); setEventModal(true); }}>
            <Plus size={15} />
            {lang === 'ru' ? 'Создать событие' : 'Окуя түзүү'}
          </button>
        </div>

        <div className="cal-split">
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border)' }}>
              {weekdays.map((wd) => (
                <div key={wd} style={{ padding: '9px 10px', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
                  {wd}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {Array.from({ length: leadingEmpty }).map((_, idx) => (
                <div key={`empty-${idx}`} style={{ minHeight: 86, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-alt)' }} />
              ))}
              {daysInMonth.map((day) => {
                const dayEvs = scopeEvents.filter((e) => e.day === day);
                const isSel = selectedDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minHeight: 86,
                      padding: 6,
                      border: 'none',
                      borderRight: '1px solid var(--border)',
                      borderBottom: '1px solid var(--border)',
                      background: isSel ? 'var(--bg-well)' : 'var(--bg-surface)',
                      textAlign: 'left',
                      verticalAlign: 'top',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span
                        style={{
                          fontWeight: day === 20 || isSel ? 700 : 500,
                          width: 22,
                          height: 22,
                          borderRadius: 99,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: day === 20 ? 'var(--accent)' : 'transparent',
                          color: day === 20 ? 'var(--accent-fg)' : 'var(--text-primary)',
                          fontSize: 12,
                        }}
                      >
                        {day}
                      </span>
                    </div>
                    {dayEvs.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        style={{
                          fontSize: 11,
                          padding: '2px 5px',
                          borderRadius: 4,
                          background: 'var(--badge-bg)',
                          color: 'var(--text-primary)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {ev.time} {tx(ev.title, lang)}
                      </div>
                    ))}
                    {dayEvs.length > 2 && (
                      <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>+{dayEvs.length - 2}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card card-pad">
            <h3 style={{ margin: '0 0 12px', fontSize: 14.5 }}>
              {selectedDay}.11.2026 — {lang === 'ru' ? 'События дня' : 'Күндүн окуялары'}
            </h3>
            {selectedDayEvents.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '18px 0' }}>
                {lang === 'ru' ? 'На этот день событий нет' : 'Бул күнгө окуялар жок'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedDayEvents.map((ev) => (
                  <div key={ev.id} style={{ padding: 10, borderRadius: 6, background: 'var(--bg-surface-alt)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span className="badge badge-dark">{ev.time}</span>
                      <span className="badge">{ev.scope === 'company' ? (lang === 'ru' ? 'Компания' : 'Компания') : (lang === 'ru' ? 'Личное' : 'Жеке')}</span>
                    </div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{tx(ev.title, lang)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {tx(ev.location, lang)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Modal
          open={eventModal}
          onClose={() => setEventModal(false)}
          title={lang === 'ru' ? 'Новое событие календаря' : 'Жаңы календарь окуясы'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setEventModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="cal-event-form" className="btn btn-primary">{tx(UI.common.save, lang)}</button>
            </>
          }
        >
          <form id="cal-event-form" className="form-grid" onSubmit={handleAddEvent}>
            <div className="field">
              <label>{tx(UI.common.name, lang)}</label>
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
                <label>{lang === 'ru' ? 'Категория' : 'Категория'}</label>
                <select className="select" value={evCat} onChange={(e) => setEvCat(e.target.value as CalendarEvent['category'])}>
                  <option value="meeting">{lang === 'ru' ? 'Встреча' : 'Жолугушуу'}</option>
                  <option value="call">{lang === 'ru' ? 'Звонок' : 'Чалуу'}</option>
                  <option value="deadline">{lang === 'ru' ? 'Дедлайн' : 'Мөөнөт'}</option>
                </select>
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Место / ссылка' : 'Орду / шилтеме'}</label>
                <input className="input" value={evLoc} onChange={(e) => setEvLoc(e.target.value)} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'slots') {
    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Свободные слоты для записи' : 'Жазылуу үчүн бош убакыттар'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Нажмите на временной интервал, чтобы открыть или закрыть его для клиентов' : 'Кардарлар үчүн ачуу же жабуу үчүн убакыт интервалын басыңыз'}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => notify(lang === 'ru' ? 'Публичная ссылка на слоты скопирована' : 'Бош убакыт шилтемеси көчүрүлдү')}
          >
            <Copy size={14} />
            {lang === 'ru' ? 'Скопировать ссылку' : 'Шилтемени көчүрүү'}
          </button>
        </div>

        <div className="cards-grid">
          {openSlotDays.map((d) => (
            <div key={d.id} className="card card-pad">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>{tx(d.weekday, lang)}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {d.slots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    className={`btn btn-sm ${s.enabled ? 'btn-primary' : ''}`}
                    onClick={() => toggleOpenSlot(d.id, s.time)}
                  >
                    <Clock size={12} />
                    {s.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'rooms') {
    const handleBookRoom = (e: React.FormEvent) => {
      e.preventDefault();
      if (!roomTitle.trim()) return;
      addRoomBooking(roomTargetId, roomDay, roomTime, roomTitle.trim(), 'Азамат Б.');
      setRoomTitle('');
      setRoomModal(false);
      notify(lang === 'ru' ? 'Переговорная забронирована' : 'Жыйын бөлмөсү брондолду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Занятость переговорных' : 'Жыйын залдарынын боштугу'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Бронирование переговорных комнат офиса' : 'Кеңседеги жыйын бөлмөлөрүн брондоо'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setRoomModal(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Забронировать' : 'Брондоо'}
          </button>
        </div>

        <div className="cards-grid">
          {rooms.map((r) => (
            <div key={r.id} className="card card-pad">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{tx(r.name, lang)}</div>
                <span className="badge">
                  <Users size={12} /> {r.capacity}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{tx(r.floor, lang)}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {r.bookings.length === 0 ? (
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', padding: '10px 0' }}>
                    {lang === 'ru' ? 'Свободна весь день' : 'Күнү бою бош'}
                  </div>
                ) : (
                  r.bookings.map((b) => (
                    <div key={b.id} style={{ padding: 9, borderRadius: 6, background: 'var(--bg-surface-alt)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600 }}>{b.day} · {b.time}</div>
                      <div style={{ fontWeight: 500, marginTop: 2 }}>{tx(b.title, lang)}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{b.owner}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={roomModal}
          onClose={() => setRoomModal(false)}
          title={lang === 'ru' ? 'Бронирование переговорной' : 'Жыйын бөлмөсүн брондоо'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setRoomModal(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="room-book-form" className="btn btn-primary">{lang === 'ru' ? 'Забронировать' : 'Брондоо'}</button>
            </>
          }
        >
          <form id="room-book-form" className="form-grid" onSubmit={handleBookRoom}>
            <div className="field">
              <label>{lang === 'ru' ? 'Переговорная' : 'Бөлмө'}</label>
              <select className="select" value={roomTargetId} onChange={(e) => setRoomTargetId(e.target.value)}>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{tx(r.name, lang)}</option>
                ))}
              </select>
            </div>
            <div className="form-row-2">
              <div className="field">
                <label>{tx(UI.common.date, lang)}</label>
                <input className="input" value={roomDay} onChange={(e) => setRoomDay(e.target.value)} />
              </div>
              <div className="field">
                <label>{lang === 'ru' ? 'Интервал' : 'Убактысы'}</label>
                <input className="input" value={roomTime} onChange={(e) => setRoomTime(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Тема встречи' : 'Жолугушуу темасы'}</label>
              <input className="input" required value={roomTitle} onChange={(e) => setRoomTitle(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // Schedule tab
  const filteredSchedule = [...events]
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
    .filter((e) => (scheduleFilter === 'all' || e.category === scheduleFilter) && (!q || tx(e.title, lang).toLowerCase().includes(q)));

  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Расписание событий' : 'Окуялар жүгүртмөсү'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Хронологический список ближайших встреч и дедлайнов' : 'Алдыдагы жолугушуулар жана мөөнөттөрдүн тизмеси'}
          </p>
        </div>
        <div className="seg-control">
          {(['all', 'meeting', 'call', 'deadline'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              className={`seg-btn ${scheduleFilter === cat ? 'active' : ''}`}
              onClick={() => setScheduleFilter(cat)}
            >
              {cat === 'all' && tx(UI.common.all, lang)}
              {cat === 'meeting' && (lang === 'ru' ? 'Встречи' : 'Жолугушуулар')}
              {cat === 'call' && (lang === 'ru' ? 'Звонки' : 'Чалуулар')}
              {cat === 'deadline' && (lang === 'ru' ? 'Дедлайны' : 'Мөөнөттөр')}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{tx(UI.common.date, lang)}</th>
              <th>{lang === 'ru' ? 'Время' : 'Убактысы'}</th>
              <th>{lang === 'ru' ? 'Событие' : 'Окуя'}</th>
              <th>{lang === 'ru' ? 'Организатор' : 'Уюштуруучу'}</th>
              <th>{lang === 'ru' ? 'Место' : 'Орду'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((ev) => (
              <tr key={ev.id}>
                <td style={{ fontWeight: 600 }}>{String(ev.day).padStart(2, '0')}.11.2026</td>
                <td><span className="badge badge-mid">{ev.time}</span></td>
                <td style={{ fontWeight: 500 }}>{tx(ev.title, lang)}</td>
                <td>{ev.organizer}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{tx(ev.location, lang)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
