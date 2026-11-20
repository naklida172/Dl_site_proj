import React, { useState } from 'react';
import { Bike, CalendarPlus, CheckCheck, Send } from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';

export const CommsModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    shiftChats,
    guestInbox,
    alerts,
    sendShiftChatMessage,
    replyGuestInbox,
    convertInboxToReservation,
    convertInboxToDelivery,
    markAlertRead,
    markAllAlertsRead,
    notify,
  } = useRestaurant();

  const [selectedChannelId, setSelectedChannelId] = useState(shiftChats[0]?.id ?? '');
  const [chatDraft, setChatDraft] = useState('');

  const [selectedInboxId, setSelectedInboxId] = useState(guestInbox[0]?.id ?? '');
  const [inboxDraft, setInboxDraft] = useState('');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'shift_chat') {
    const activeChannel = shiftChats.find((c) => c.id === selectedChannelId) ?? shiftChats[0];
    const quickPhrases =
      lang === 'ru'
        ? ['Нужен менеджер в зал', 'Пречек готов', 'Блюдо поставлено на стоп']
        : ['Залга менеджер керек', 'Пречек даяр', 'Тамак стоп-листке коюлду'];

    const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatDraft.trim() || !activeChannel) return;
      sendShiftChatMessage(activeChannel.id, chatDraft.trim());
      setChatDraft('');
    };

    return (
      <div className="split-2">
        <div className="card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {shiftChats
            .filter((c) => !q || tx(c.name, lang).toLowerCase().includes(q))
            .map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`rail-item ${ch.id === activeChannel.id ? 'active' : ''}`}
                onClick={() => setSelectedChannelId(ch.id)}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{tx(ch.name, lang)}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tx(ch.description, lang)}
                  </div>
                </div>
                {ch.unread > 0 && <span className="pill pill-dark">{ch.unread}</span>}
              </button>
            ))}
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 500, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{tx(activeChannel.name, lang)}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>{tx(activeChannel.description, lang)}</div>
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-surface-soft)' }}>
            {activeChannel.messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.isMine ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  background: m.isMine ? 'var(--accent)' : 'var(--bg-surface)',
                  color: m.isMine ? 'var(--accent-fg)' : 'var(--ink-primary)',
                  border: m.isMine ? 'none' : '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '9px 12px',
                }}
              >
                <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 3 }}>
                  {m.sender} · {m.time}
                </div>
                <div>{tx(m.text, lang)}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '8px 12px 0', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {quickPhrases.map((phrase) => (
              <button
                key={phrase}
                type="button"
                className="btn btn-sm"
                onClick={() => sendShiftChatMessage(activeChannel.id, phrase)}
              >
                + {phrase}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ padding: 12, display: 'flex', gap: 8 }}>
            <input
              className="input"
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              placeholder={lang === 'ru' ? 'Сообщение смене...' : 'Нөөмөткө билдирүү...'}
            />
            <button type="submit" className="btn btn-primary">
              <Send size={14} />
              {lang === 'ru' ? 'Отправить' : 'Жөнөтүү'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'inbox') {
    const filteredInbox = guestInbox.filter(
      (th) => !q || th.guestName.toLowerCase().includes(q) || th.channel.toLowerCase().includes(q)
    );
    const activeThread = guestInbox.find((th) => th.id === selectedInboxId) ?? filteredInbox[0] ?? guestInbox[0];

    const handleReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inboxDraft.trim() || !activeThread) return;
      replyGuestInbox(activeThread.id, inboxDraft.trim());
      setInboxDraft('');
      notify(lang === 'ru' ? `Ответ отправлен в ${activeThread.channel}` : `Жооп ${activeThread.channel}ка жөнөтүлдү`);
    };

    return (
      <div className="split-2">
        <div className="card" style={{ overflow: 'hidden' }}>
          {filteredInbox.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => setSelectedInboxId(th.id)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                background: activeThread?.id === th.id ? 'var(--bg-well)' : 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <strong>{th.guestName}</strong>
                <span className="pill">{th.channel}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tx(th.messages[th.messages.length - 1].text, lang)}
              </div>
            </button>
          ))}
        </div>

        {activeThread ? (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 500, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{activeThread.guestName}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-secondary)' }}>
                  {activeThread.channel} · {activeThread.phone}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    convertInboxToReservation(activeThread.id);
                    notify(lang === 'ru' ? 'Обращение переведено в бронь стола' : 'Кайрылуу стол бронго өткөрүлдү');
                  }}
                >
                  <CalendarPlus size={13} />
                  {lang === 'ru' ? '→ В бронь' : '→ Бронго'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    convertInboxToDelivery(activeThread.id);
                    notify(lang === 'ru' ? 'Обращение оформлено как заказ доставки' : 'Жеткирүү буйрутмасы түзүлдү');
                  }}
                >
                  <Bike size={13} />
                  {lang === 'ru' ? '→ В доставку' : '→ Жеткирүүгө'}
                </button>
              </div>
            </div>

            <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-surface-soft)' }}>
              {activeThread.messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                    background: m.isMine ? 'var(--accent)' : 'var(--bg-surface)',
                    color: m.isMine ? 'var(--accent-fg)' : 'var(--ink-primary)',
                    border: m.isMine ? 'none' : '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '9px 12px',
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 3 }}>
                    {m.sender} · {m.time}
                  </div>
                  <div>{tx(m.text, lang)}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleReply} style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input
                className="input"
                value={inboxDraft}
                onChange={(e) => setInboxDraft(e.target.value)}
                placeholder={lang === 'ru' ? `Ответить в ${activeThread.channel}...` : `${activeThread.channel} аркылуу жооп берүү...`}
              />
              <button type="submit" className="btn btn-primary">{lang === 'ru' ? 'Отправить' : 'Жөнөтүү'}</button>
            </form>
          </div>
        ) : null}
      </div>
    );
  }

  // Alerts tab
  return (
    <div>
      <div className="toolbar-row">
        <strong style={{ fontSize: 15 }}>
          {lang === 'ru' ? 'Операционные оповещения ресторана' : 'Ресторандын ыкчам билдирмелери'}
        </strong>
        <button type="button" className="btn" onClick={markAllAlertsRead}>
          <CheckCheck size={14} />
          {lang === 'ru' ? 'Прочитать все' : 'Баарын окуу'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts
          .filter((a) => !q || tx(a.title, lang).toLowerCase().includes(q))
          .map((al) => (
            <div
              key={al.id}
              className="card card-pad"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                background: al.read ? 'var(--bg-surface)' : 'var(--bg-surface-soft)',
                borderColor: al.read ? 'var(--border)' : 'var(--border-strong)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className={`pill ${al.read ? '' : 'pill-dark'}`}>{tx(al.source, lang)}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--ink-muted)' }}>{al.time}</span>
                </div>
                <div style={{ fontWeight: al.read ? 400 : 600 }}>{tx(al.title, lang)}</div>
              </div>
              {!al.read && (
                <button type="button" className="btn btn-sm" onClick={() => markAlertRead(al.id)}>
                  {tx(UI.common.close, lang)}
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
