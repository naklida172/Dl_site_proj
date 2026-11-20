import React from 'react';
import {
  BarChart3,
  Bell,
  Bike,
  BookOpen,
  Boxes,
  ChefHat,
  HeartHandshake,
  LayoutGrid,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Receipt,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { RESTAURANT_MODULES, UI, tx } from '../../i18n/translations';
import { useRestaurant } from '../../store/RestaurantContext';
import { RestaurantModuleId } from '../../types';
import { ToastStack } from './Toast';

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutGrid: <LayoutGrid size={17} strokeWidth={1.8} />,
  Receipt: <Receipt size={17} strokeWidth={1.8} />,
  ChefHat: <ChefHat size={17} strokeWidth={1.8} />,
  Bike: <Bike size={17} strokeWidth={1.8} />,
  MessageSquare: <MessageSquare size={17} strokeWidth={1.8} />,
  BookOpen: <BookOpen size={17} strokeWidth={1.8} />,
  Boxes: <Boxes size={17} strokeWidth={1.8} />,
  HeartHandshake: <HeartHandshake size={17} strokeWidth={1.8} />,
  SlidersHorizontal: <SlidersHorizontal size={17} strokeWidth={1.8} />,
  BarChart3: <BarChart3 size={17} strokeWidth={1.8} />,
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    lang,
    setLang,
    activeModule,
    setActiveModule,
    activeTab,
    setActiveTab,
    railCollapsed,
    setRailCollapsed,
    searchQuery,
    setSearchQuery,
    tables,
    orders,
    kitchenTickets,
    deliveryOrders,
    shiftChats,
    guestInbox,
    alerts,
    dishes,
    ingredients,
    guests,
    checklists,
    cashShift,
    createFastOrder,
  } = useRestaurant();

  const currentMod = RESTAURANT_MODULES.find((m) => m.id === activeModule) ?? RESTAURANT_MODULES[0];
  const frontMods = RESTAURANT_MODULES.filter((m) => m.group === 'front');
  const backMods = RESTAURANT_MODULES.filter((m) => m.group === 'back');
  const unreadAlerts = alerts.filter((a) => !a.read).length;

  const getModuleCount = (id: RestaurantModuleId): number | undefined => {
    switch (id) {
      case 'floor':
        return tables.filter((t) => t.status === 'occupied' || t.status === 'precheck').length;
      case 'pos':
        return orders.length;
      case 'kitchen':
        return kitchenTickets.filter((k) => k.status !== 'served').length;
      case 'delivery':
        return deliveryOrders.filter((d) => d.status !== 'delivered').length;
      case 'comms':
        return (
          shiftChats.reduce((s, c) => s + c.unread, 0) +
          guestInbox.filter((g) => g.status === 'new').length
        );
      case 'menu':
        return dishes.length;
      case 'inventory':
        return ingredients.filter((i) => i.inStock < i.minStock).length || undefined;
      case 'guests':
        return guests.length;
      case 'operations':
        return checklists.filter((c) => !c.done).length || undefined;
      case 'reports':
        return undefined;
    }
  };

  return (
    <div className="rcrm-shell">
      <aside className={`rcrm-rail ${railCollapsed ? 'collapsed' : ''}`}>
        <div className="rail-brand">
          {!railCollapsed && (
            <div className="brand-mark-wrap">
              <span className="brand-emblem">R</span>
              <div className="brand-titles">
                <span className="brand-title">Restaurant CRM</span>
                <span className="brand-sub">{tx(UI.common.brandSub, lang)}</span>
              </div>
            </div>
          )}
          <button
            type="button"
            className="rail-toggle-btn"
            onClick={() => setRailCollapsed((p) => !p)}
            title={railCollapsed ? 'Развернуть панель' : 'Свернуть панель'}
            aria-label="Toggle navigation rail"
          >
            {railCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        <div className="rail-scroll">
          <div>
            {!railCollapsed && <div className="rail-group-label">{tx(UI.groups.front, lang)}</div>}
            <div className="rail-nav-list">
              {frontMods.map((mod) => {
                const count = getModuleCount(mod.id);
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    className={`rail-item ${isActive ? 'active' : ''}`}
                    title={tx(mod.label, lang)}
                    onClick={() => setActiveModule(mod.id)}
                  >
                    <span className="rail-item-left">
                      {ICON_MAP[mod.icon]}
                      {!railCollapsed && <span>{tx(mod.label, lang)}</span>}
                    </span>
                    {!railCollapsed && count !== undefined && <span className="rail-item-badge">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            {!railCollapsed && <div className="rail-group-label">{tx(UI.groups.back, lang)}</div>}
            <div className="rail-nav-list">
              {backMods.map((mod) => {
                const count = getModuleCount(mod.id);
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    className={`rail-item ${isActive ? 'active' : ''}`}
                    title={tx(mod.label, lang)}
                    onClick={() => setActiveModule(mod.id)}
                  >
                    <span className="rail-item-left">
                      {ICON_MAP[mod.icon]}
                      {!railCollapsed && <span>{tx(mod.label, lang)}</span>}
                    </span>
                    {!railCollapsed && count !== undefined && <span className="rail-item-badge">{count}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rail-footer">
          {railCollapsed ? (
            <button
              type="button"
              className="rail-toggle-btn"
              style={{ width: '100%' }}
              onClick={() => setActiveModule('reports', 'shift')}
              title={`${tx(UI.common.shift, lang)} #${cashShift.shiftNumber}`}
            >
              <span className={`shift-dot ${cashShift.status === 'closed' ? 'closed' : ''}`} />
            </button>
          ) : (
            <button type="button" className="shift-chip" onClick={() => setActiveModule('reports', 'shift')}>
              <span className="shift-dot-row">
                <span className={`shift-dot ${cashShift.status === 'closed' ? 'closed' : ''}`} />
                <span>
                  {tx(UI.common.shift, lang)} #{cashShift.shiftNumber} ·{' '}
                  {cashShift.status === 'open' ? tx(UI.common.shiftOpen, lang) : tx(UI.common.shiftClosed, lang)}
                </span>
              </span>
              <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{tx(UI.common.prototype, lang)}</span>
            </button>
          )}
        </div>
      </aside>

      <div className="rcrm-main-col">
        <header className="rcrm-cmdbar">
          <div className="cmd-left">
            <h1 className="cmd-module-title">{tx(currentMod.label, lang)}</h1>
            <div className="smart-search">
              <Search size={14} className="smart-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tx(currentMod.searchPlaceholder, lang)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="smart-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="cmd-right">
            <button type="button" className="btn btn-primary btn-sm" onClick={createFastOrder}>
              <Plus size={14} />
              {tx(UI.common.quickOrder, lang)}
            </button>

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
              title={lang === 'ru' ? 'Оповещения' : 'Билдирмелер'}
              onClick={() => setActiveModule('comms', 'alerts')}
            >
              <Bell size={15} />
              {unreadAlerts > 0 && <span className="notif-dot">{unreadAlerts}</span>}
            </button>

            <div className="staff-chip">
              <span className="avatar-circle">АС</span>
              <span style={{ fontSize: 12, fontWeight: 600 }}>Айжан С.</span>
            </div>
          </div>
        </header>

        <div className="subnav-bar">
          <div className="subnav-pills">
            {currentMod.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`subnav-pill ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tx(tab.label, lang)}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 11.5, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
            20.11.2026 · {cashShift.checksCount} {lang === 'ru' ? 'чеков' : 'чек'}
          </span>
        </div>

        <main className="rcrm-workspace">{children}</main>
      </div>

      <ToastStack />
    </div>
  );
};
