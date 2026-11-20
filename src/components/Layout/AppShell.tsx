import React from 'react';
import {
  Bell,
  Briefcase,
  CalendarClock,
  CalendarDays,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Menu,
  MessageSquare,
  Package,
  Search,
  Users,
  Workflow,
  X,
} from 'lucide-react';
import { MODULES, UI, tx } from '../../i18n/translations';
import { useAppData } from '../../store/AppDataContext';
import { ModuleId } from '../../types';
import { ToastStack } from './Toast';

const ICON_MAP: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={16} strokeWidth={1.8} />,
  MessageSquare: <MessageSquare size={16} strokeWidth={1.8} />,
  CalendarDays: <CalendarDays size={16} strokeWidth={1.8} />,
  CheckSquare: <CheckSquare size={16} strokeWidth={1.8} />,
  CalendarClock: <CalendarClock size={16} strokeWidth={1.8} />,
  Package: <Package size={16} strokeWidth={1.8} />,
  Megaphone: <Megaphone size={16} strokeWidth={1.8} />,
  Workflow: <Workflow size={16} strokeWidth={1.8} />,
  Users: <Users size={16} strokeWidth={1.8} />,
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    lang,
    setLang,
    activeModule,
    setActiveModule,
    activeTab,
    setActiveTab,
    sidebarOpen,
    setSidebarOpen,
    searchQuery,
    setSearchQuery,
    chats,
    events,
    tasks,
    deals,
    bookings,
    warehouseDocs,
    campaigns,
    robots,
    employees,
    notifications,
  } = useAppData();

  const currentModuleDef = MODULES.find((m) => m.id === activeModule) ?? MODULES[0];
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const getBadgeCount = (id: ModuleId): number => {
    switch (id) {
      case 'messenger':
        return chats.reduce((acc, c) => acc + c.unread, 0);
      case 'calendar':
        return events.length;
      case 'tasks':
        return tasks.filter((t) => t.stage !== 'done').length;
      case 'crm':
        return deals.length;
      case 'booking':
        return bookings.length;
      case 'warehouse':
        return warehouseDocs.length;
      case 'marketing':
        return campaigns.length;
      case 'automation':
        return robots.filter((r) => r.enabled).length;
      case 'employees':
        return employees.length;
    }
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-shell">
      {/* Top Panel matching Ref/0.png */}
      <header className="topbar">
        <div className={`topbar-anchor ${sidebarOpen ? 'open' : 'closed'}`}>
          <button
            type="button"
            className="anchor-burger"
            onClick={toggleSidebar}
            title={sidebarOpen ? (lang === 'ru' ? 'Свернуть меню' : 'Менюну жыйноо') : (lang === 'ru' ? 'Открыть меню' : 'Менюну ачуу')}
            aria-label="Toggle sidebar"
          >
            <Menu size={17} strokeWidth={1.9} />
          </button>

          <span className="anchor-divider" />

          <button type="button" className="anchor-brand" onClick={toggleSidebar}>
            <span className="anchor-brand-text">
              <span className="anchor-logo-box">24</span>
              <span>CRM</span>
            </span>
            <span className="anchor-chevron">
              {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </span>
          </button>
        </div>

        {/* Unique Top-Panel Options for Active Module */}
        <nav className="topbar-tabs-wrap" aria-label="Module options">
          {currentModuleDef.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`topbar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tx(tab.label, lang)}
            </button>
          ))}
        </nav>

        {/* Right Utility Cluster */}
        <div className="topbar-utils">
          <div className="topbar-search">
            <Search size={14} className="topbar-search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tx(UI.common.searchPlaceholder, lang)}
            />
            {searchQuery && (
              <button
                type="button"
                className="topbar-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="lang-switch" role="group" aria-label="Language switcher">
            <button
              type="button"
              className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
              onClick={() => setLang('ru')}
            >
              RU
            </button>
            <button
              type="button"
              className={`lang-btn ${lang === 'ky' ? 'active' : ''}`}
              onClick={() => setLang('ky')}
            >
              КЫР
            </button>
          </div>

          <button
            type="button"
            className="icon-btn"
            title={lang === 'ru' ? 'Уведомления' : 'Билдирмелер'}
            onClick={() => setActiveModule('messenger', 'notifications')}
          >
            <Bell size={15} />
            {unreadNotifs > 0 && <span className="notif-badge">{unreadNotifs}</span>}
          </button>

          <div className="avatar-pill" title="Азамат Беков">
            АБ
          </div>
        </div>
      </header>

      {/* Body: Collapsible Left Side Panel + Main Content */}
      <div className="shell-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav" aria-label="Main modules">
            {MODULES.map((mod) => {
              const count = getBadgeCount(mod.id);
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveModule(mod.id)}
                >
                  <span className="sidebar-item-left">
                    {ICON_MAP[mod.icon]}
                    <span className="sidebar-item-label">{tx(mod.label, lang)}</span>
                  </span>
                  <span className="sidebar-count">{count}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <span>{tx(UI.common.prototypeNote, lang)}</span>
            <span>v1.0</span>
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>

      <ToastStack />
    </div>
  );
};
