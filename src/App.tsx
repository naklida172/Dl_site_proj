import React, { useEffect } from 'react';
import { AppShell } from './components/Layout/AppShell';
import { AutomationModule } from './components/Modules/AutomationModule';
import { BookingModule } from './components/Modules/BookingModule';
import { CalendarModule } from './components/Modules/CalendarModule';
import { CrmModule } from './components/Modules/CrmModule';
import { EmployeesModule } from './components/Modules/EmployeesModule';
import { MarketingModule } from './components/Modules/MarketingModule';
import { MessengerModule } from './components/Modules/MessengerModule';
import { TasksModule } from './components/Modules/TasksModule';
import { WarehouseModule } from './components/Modules/WarehouseModule';
import { AppDataProvider, useAppData } from './store/AppDataContext';

const ActiveModuleView: React.FC = () => {
  const { activeModule, lang } = useAppData();

  useEffect(() => {
    document.title = lang === 'ru' ? 'CRM24 — Прототип' : 'CRM24 — Прототип (КЫР)';
    document.documentElement.lang = lang;
  }, [lang]);

  switch (activeModule) {
    case 'crm':
      return <CrmModule />;
    case 'messenger':
      return <MessengerModule />;
    case 'calendar':
      return <CalendarModule />;
    case 'tasks':
      return <TasksModule />;
    case 'booking':
      return <BookingModule />;
    case 'warehouse':
      return <WarehouseModule />;
    case 'marketing':
      return <MarketingModule />;
    case 'automation':
      return <AutomationModule />;
    case 'employees':
      return <EmployeesModule />;
  }
};

export const App: React.FC = () => {
  return (
    <AppDataProvider>
      <AppShell>
        <ActiveModuleView />
      </AppShell>
    </AppDataProvider>
  );
};

export default App;
