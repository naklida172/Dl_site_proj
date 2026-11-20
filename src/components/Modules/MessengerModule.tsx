import React, { useState } from 'react';
import {
  CheckCheck,
  MessageCircle,
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Plus,
  Send,
  Users,
} from 'lucide-react';
import { UI, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { CallRecord } from '../../types';
import { Modal } from '../Layout/Modal';

export const MessengerModule: React.FC = () => {
  const {
    lang,
    activeTab,
    searchQuery,
    chats,
    addChatMessage,
    addNewChat,
    channels,
    addChannelPost,
    collabs,
    addCollabMessage,
    calls,
    addCallLog,
    openLines,
    replyOpenLine,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    notify,
  } = useAppData();

  const [selectedChatId, setSelectedChatId] = useState<string>(chats[0]?.id ?? '');
  const [chatDraft, setChatDraft] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [newChatRole, setNewChatRole] = useState('');

  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id ?? '');
  const [postOpen, setPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');

  const [selectedCollabId, setSelectedCollabId] = useState<string>(collabs[0]?.id ?? '');
  const [collabDraft, setCollabDraft] = useState('');

  const [callOpen, setCallOpen] = useState(false);
  const [callContact, setCallContact] = useState('');
  const [callDir, setCallDir] = useState<CallRecord['direction']>('outgoing');
  const [callNote, setCallNote] = useState('');

  const [selectedOpenLineId, setSelectedOpenLineId] = useState<string>(openLines[0]?.id ?? '');
  const [openLineDraft, setOpenLineDraft] = useState('');

  const q = searchQuery.trim().toLowerCase();

  if (activeTab === 'chats') {
    const filteredChats = chats.filter(
      (c) => !q || tx(c.name, lang).toLowerCase().includes(q) || tx(c.role, lang).toLowerCase().includes(q)
    );
    const activeChat = chats.find((c) => c.id === selectedChatId) ?? filteredChats[0] ?? chats[0];

    const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatDraft.trim() || !activeChat) return;
      addChatMessage(activeChat.id, chatDraft.trim());
      setChatDraft('');
    };

    const handleCreateChat = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newChatName.trim()) return;
      const createdId = addNewChat(newChatName.trim(), newChatRole.trim());
      setSelectedChatId(createdId);
      setNewChatName('');
      setNewChatRole('');
      setNewChatOpen(false);
      notify(lang === 'ru' ? 'Новый чат создан' : 'Жаңы чат түзүлдү');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Корпоративные чаты' : 'Корпоративдик чаттар'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Личные и групповые диалоги команды' : 'Команданын жеке жана топтук баарлашуулары'}
            </p>
          </div>
          <div className="page-actions">
            <button type="button" className="btn btn-primary" onClick={() => setNewChatOpen(true)}>
              <Plus size={15} />
              {lang === 'ru' ? 'Новый чат' : 'Жаңы чат'}
            </button>
          </div>
        </div>

        <div className="split-2">
          <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
              {lang === 'ru' ? 'Диалоги' : 'Диалогдор'} ({filteredChats.length})
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredChats.map((c) => {
                const isSel = activeChat?.id === c.id;
                const lastMsg = c.messages[c.messages.length - 1];
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedChatId(c.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      gap: 10,
                      padding: '11px 12px',
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      background: isSel ? 'var(--bg-well)' : 'transparent',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="avatar-pill" style={{ flexShrink: 0 }}>{c.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {tx(c.name, lang)}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.lastTime}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lastMsg ? tx(lastMsg.text, lang) : tx(c.role, lang)}
                      </div>
                    </div>
                    {c.unread > 0 && <span className="badge badge-dark">{c.unread}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {activeChat ? (
              <>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{tx(activeChat.name, lang)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx(activeChat.role, lang)}</div>
                  </div>
                  <span className="badge">
                    {activeChat.online ? (lang === 'ru' ? 'В сети' : 'Тармакта') : (lang === 'ru' ? 'Не в сети' : 'Оффлайн')}
                  </span>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-surface-alt)' }}>
                  {activeChat.messages.length === 0 ? (
                    <div className="empty-state">{lang === 'ru' ? 'Начните переписку' : 'Жазышууну баштаңыз'}</div>
                  ) : (
                    activeChat.messages.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          alignSelf: m.isMine ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          background: m.isMine ? 'var(--accent)' : 'var(--bg-surface)',
                          color: m.isMine ? 'var(--accent-fg)' : 'var(--text-primary)',
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
                    ))
                  )}
                </div>

                <form onSubmit={handleSend} style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                  <input
                    className="input"
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    placeholder={lang === 'ru' ? 'Написать сообщение...' : 'Билдирүү жазуу...'}
                  />
                  <button type="submit" className="btn btn-primary">
                    <Send size={14} />
                    {tx(UI.common.send, lang)}
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </div>

        <Modal
          open={newChatOpen}
          onClose={() => setNewChatOpen(false)}
          title={lang === 'ru' ? 'Создать новый чат' : 'Жаңы чат түзүү'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setNewChatOpen(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="new-chat-form" className="btn btn-primary">{tx(UI.common.create, lang)}</button>
            </>
          }
        >
          <form id="new-chat-form" className="form-grid" onSubmit={handleCreateChat}>
            <div className="field">
              <label>{lang === 'ru' ? 'Имя собеседника или название чата' : 'Маектештин аты же чат аталышы'}</label>
              <input className="input" required value={newChatName} onChange={(e) => setNewChatName(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Должность / описание' : 'Кызматы / сүрөттөмөсү'}</label>
              <input className="input" value={newChatRole} onChange={(e) => setNewChatRole(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'channels') {
    const activeChannel = channels.find((c) => c.id === selectedChannelId) ?? channels[0];

    const handlePublish = (e: React.FormEvent) => {
      e.preventDefault();
      if (!postTitle.trim() || !postBody.trim() || !activeChannel) return;
      addChannelPost(activeChannel.id, postTitle.trim(), postBody.trim());
      setPostTitle('');
      setPostBody('');
      setPostOpen(false);
      notify(lang === 'ru' ? 'Публикация добавлена в канал' : 'Жарыя каналга кошулду');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Информационные каналы' : 'Маалымат каналдары'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Лента корпоративных объявлений и регламентов' : 'Корпоративдик жарыялар жана эрежелер тизмеги'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setPostOpen(true)}>
            <Plus size={15} />
            {lang === 'ru' ? 'Новая публикация' : 'Жаңы жарыя'}
          </button>
        </div>

        <div className="split-2">
          <div className="card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {channels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setSelectedChannelId(ch.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: ch.id === activeChannel.id ? '1px solid var(--border-strong)' : '1px solid transparent',
                  background: ch.id === activeChannel.id ? 'var(--bg-well)' : 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontWeight: 600 }}>{tx(ch.name, lang)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{tx(ch.description, lang)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  {ch.subscribers} {lang === 'ru' ? 'подписчиков' : 'катталуучу'}
                </div>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeChannel.posts.map((p) => (
              <div key={p.id} className="card card-pad">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{p.author}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.time}</span>
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: 15 }}>{tx(p.title, lang)}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{tx(p.body, lang)}</p>
              </div>
            ))}
          </div>
        </div>

        <Modal
          open={postOpen}
          onClose={() => setPostOpen(false)}
          title={lang === 'ru' ? 'Опубликовать в канал' : 'Каналга жарыялоо'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setPostOpen(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="channel-post-form" className="btn btn-primary">{tx(UI.common.send, lang)}</button>
            </>
          }
        >
          <form id="channel-post-form" className="form-grid" onSubmit={handlePublish}>
            <div className="field">
              <label>{lang === 'ru' ? 'Заголовок' : 'Аталышы'}</label>
              <input className="input" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Текст объявления' : 'Жарыя тексти'}</label>
              <textarea className="textarea" required value={postBody} onChange={(e) => setPostBody(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'collabs') {
    const activeCollab = collabs.find((c) => c.id === selectedCollabId) ?? collabs[0];
    const handleSendCollab = (e: React.FormEvent) => {
      e.preventDefault();
      if (!collabDraft.trim() || !activeCollab) return;
      addCollabMessage(activeCollab.id, collabDraft.trim());
      setCollabDraft('');
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Коллабы с партнёрами' : 'Өнөктөштөр менен коллабдар'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Совместные пространства для работы с внешними компаниями' : 'Тышкы компаниялар менен биргелешип иштөө мейкиндиктери'}
            </p>
          </div>
        </div>

        <div className="split-2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {collabs.map((col) => (
              <button
                key={col.id}
                type="button"
                className="card card-pad"
                onClick={() => setSelectedCollabId(col.id)}
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: col.id === activeCollab.id ? 'var(--accent)' : 'var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span className="badge">{tx(col.status, lang)}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Users size={13} /> {col.membersCount}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{tx(col.name, lang)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{tx(col.partner, lang)}</div>
              </button>
            ))}
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{tx(activeCollab.name, lang)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tx(activeCollab.partner, lang)}</div>
              </div>
              <span className="badge badge-mid">{tx(activeCollab.status, lang)}</span>
            </div>
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-surface-alt)' }}>
              {activeCollab.messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                    background: m.isMine ? 'var(--accent)' : 'var(--bg-surface)',
                    color: m.isMine ? 'var(--accent-fg)' : 'var(--text-primary)',
                    border: m.isMine ? 'none' : '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '9px 12px',
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 3 }}>{m.sender} · {m.time}</div>
                  <div>{tx(m.text, lang)}</div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendCollab} style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input
                className="input"
                value={collabDraft}
                onChange={(e) => setCollabDraft(e.target.value)}
                placeholder={lang === 'ru' ? 'Сообщение участникам коллаба...' : 'Коллаб катышуучуларына билдирүү...'}
              />
              <button type="submit" className="btn btn-primary">{tx(UI.common.send, lang)}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'calls') {
    const filteredCalls = calls.filter(
      (c) => !q || c.contact.toLowerCase().includes(q) || tx(c.note, lang).toLowerCase().includes(q)
    );
    const handleAddCall = (e: React.FormEvent) => {
      e.preventDefault();
      if (!callContact.trim()) return;
      addCallLog(callContact.trim(), callDir, callNote.trim() || (lang === 'ru' ? 'Звонок из CRM' : 'CRM аркылуу чалуу'));
      setCallContact('');
      setCallNote('');
      setCallOpen(false);
      notify(lang === 'ru' ? 'Звонок зафиксирован в журнале' : 'Чалуу журналга жазылды');
    };

    const dirLabel = (d: CallRecord['direction']) => {
      if (d === 'incoming') return lang === 'ru' ? 'Входящий' : 'Кирүүчү';
      if (d === 'outgoing') return lang === 'ru' ? 'Исходящий' : 'Чыгуучу';
      return lang === 'ru' ? 'Пропущенный' : 'Кабыл алынбаган';
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Журнал звонков' : 'Чалуулар журналы'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'История IP-телефонии и видеозвонков' : 'IP-телефония жана видео чалуулар тарыхы'}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setCallOpen(true)}>
            <Phone size={15} />
            {lang === 'ru' ? 'Начать звонок' : 'Чалуу баштоо'}
          </button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{lang === 'ru' ? 'Контакт / Номер' : 'Байланыш / Номер'}</th>
                <th>{lang === 'ru' ? 'Тип' : 'Түрү'}</th>
                <th>{lang === 'ru' ? 'Длительность' : 'Узактыгы'}</th>
                <th>{lang === 'ru' ? 'Время' : 'Убактысы'}</th>
                <th>{tx(UI.common.comment, lang)}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.contact}</td>
                  <td>
                    <span className={`badge ${c.direction === 'missed' ? 'badge-dark' : ''}`}>
                      {c.direction === 'incoming' && <PhoneIncoming size={12} />}
                      {c.direction === 'outgoing' && <PhoneOutgoing size={12} />}
                      {c.direction === 'missed' && <PhoneMissed size={12} />}
                      {dirLabel(c.direction)}
                    </span>
                  </td>
                  <td>{c.duration}</td>
                  <td>{c.time}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{tx(c.note, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          open={callOpen}
          onClose={() => setCallOpen(false)}
          title={lang === 'ru' ? 'Новый звонок' : 'Жаңы чалуу'}
          footer={
            <>
              <button type="button" className="btn" onClick={() => setCallOpen(false)}>{tx(UI.common.cancel, lang)}</button>
              <button type="submit" form="call-form" className="btn btn-primary">{lang === 'ru' ? 'Записать звонок' : 'Чалууну сактоо'}</button>
            </>
          }
        >
          <form id="call-form" className="form-grid" onSubmit={handleAddCall}>
            <div className="field">
              <label>{lang === 'ru' ? 'Контакт или телефон' : 'Байланыш же телефон'}</label>
              <input className="input" required value={callContact} onChange={(e) => setCallContact(e.target.value)} placeholder="+996 555 ..." />
            </div>
            <div className="field">
              <label>{lang === 'ru' ? 'Направление' : 'Багыты'}</label>
              <select className="select" value={callDir} onChange={(e) => setCallDir(e.target.value as CallRecord['direction'])}>
                <option value="outgoing">{lang === 'ru' ? 'Исходящий' : 'Чыгуучу'}</option>
                <option value="incoming">{lang === 'ru' ? 'Входящий' : 'Кирүүчү'}</option>
                <option value="missed">{lang === 'ru' ? 'Пропущенный' : 'Кабыл алынбаган'}</option>
              </select>
            </div>
            <div className="field">
              <label>{tx(UI.common.comment, lang)}</label>
              <input className="input" value={callNote} onChange={(e) => setCallNote(e.target.value)} />
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  if (activeTab === 'openlines') {
    const activeThread = openLines.find((o) => o.id === selectedOpenLineId) ?? openLines[0];
    const handleReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!openLineDraft.trim() || !activeThread) return;
      replyOpenLine(activeThread.id, openLineDraft.trim());
      setOpenLineDraft('');
      notify(lang === 'ru' ? `Ответ отправлен в ${activeThread.channel}` : `Жооп ${activeThread.channel} аркылуу жөнөтүлдү`);
    };

    return (
      <div>
        <div className="page-header">
          <div className="page-title-wrap">
            <h1 className="page-title">{lang === 'ru' ? 'Открытые линии (Омниканальность)' : 'Ачык линиялар'}</h1>
            <p className="page-subtitle">
              {lang === 'ru' ? 'Единая очередь обращений из WhatsApp, Telegram и Instagram' : 'WhatsApp, Telegram жана Instagram кайрылууларынын бирдиктүү кезеги'}
            </p>
          </div>
        </div>

        <div className="split-2">
          <div className="card" style={{ overflow: 'hidden' }}>
            {openLines.map((ol) => (
              <button
                key={ol.id}
                type="button"
                onClick={() => setSelectedOpenLineId(ol.id)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: 'none',
                  borderBottom: '1px solid var(--border)',
                  background: ol.id === activeThread.id ? 'var(--bg-well)' : 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{ol.client}</span>
                  <span className="badge">{ol.channel}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {tx(ol.messages[ol.messages.length - 1].text, lang)}
                </div>
              </button>
            ))}
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{activeThread.client}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <MessageCircle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {activeThread.channel} · {lang === 'ru' ? 'Ожидание' : 'Күтүү'}: {activeThread.waitTime}
                </div>
              </div>
              <span className="badge badge-dark">{activeThread.status === 'new' ? (lang === 'ru' ? 'Новый' : 'Жаңы') : (lang === 'ru' ? 'В работе' : 'Иштелүүдө')}</span>
            </div>

            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--bg-surface-alt)' }}>
              {activeThread.messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    alignSelf: m.isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '75%',
                    background: m.isMine ? 'var(--accent)' : 'var(--bg-surface)',
                    color: m.isMine ? 'var(--accent-fg)' : 'var(--text-primary)',
                    border: m.isMine ? 'none' : '1px solid var(--border)',
                    borderRadius: 8,
                    padding: '9px 12px',
                  }}
                >
                  <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 3 }}>{m.sender} · {m.time}</div>
                  <div>{tx(m.text, lang)}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleReply} style={{ padding: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input
                className="input"
                value={openLineDraft}
                onChange={(e) => setOpenLineDraft(e.target.value)}
                placeholder={lang === 'ru' ? `Ответить клиенту в ${activeThread.channel}...` : `Кардарга ${activeThread.channel} аркылуу жооп берүү...`}
              />
              <button type="submit" className="btn btn-primary">{tx(UI.common.send, lang)}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Notifications tab
  return (
    <div>
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">{lang === 'ru' ? 'Центр уведомлений' : 'Билдирмелер борбору'}</h1>
          <p className="page-subtitle">
            {lang === 'ru' ? 'Системные события по сделкам, задачам и роботам' : 'Бүтүмдөр, тапшырмалар жана роботтор боюнча билдирмелер'}
          </p>
        </div>
        <button type="button" className="btn" onClick={markAllNotificationsRead}>
          <CheckCheck size={15} />
          {lang === 'ru' ? 'Прочитать все' : 'Баарын окуу'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.map((n) => (
          <div
            key={n.id}
            className="card card-pad"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              background: n.read ? 'var(--bg-surface)' : 'var(--bg-surface-alt)',
              borderColor: n.read ? 'var(--border)' : 'var(--border-strong)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className={`badge ${n.read ? '' : 'badge-dark'}`}>{tx(n.module, lang)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              <div style={{ fontWeight: n.read ? 400 : 600 }}>{tx(n.title, lang)}</div>
            </div>
            {!n.read && (
              <button type="button" className="btn btn-sm" onClick={() => markNotificationRead(n.id)}>
                {lang === 'ru' ? 'Отметить прочитанным' : 'Окулду деп белгилөө'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
