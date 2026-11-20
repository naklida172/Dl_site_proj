import React, { useEffect } from 'react';
import { AppShell } from './components/Layout/AppShell';
import { CommsModule } from './components/Modules/CommsModule';
import { DeliveryModule } from './components/Modules/DeliveryModule';
import { FloorModule } from './components/Modules/FloorModule';
import { GuestsModule } from './components/Modules/GuestsModule';
import { InventoryModule } from './components/Modules/InventoryModule';
import { KitchenModule } from './components/Modules/KitchenModule';
import { MenuDirectoryModule } from './components/Modules/MenuDirectoryModule';
import { OperationsModule } from './components/Modules/OperationsModule';
import { PosModule } from './components/Modules/PosModule';
import { ReportsModule } from './components/Modules/ReportsModule';
import { RestaurantProvider, useRestaurant } from './store/RestaurantContext';

const ActiveRestaurantView: React.FC = () => {
  const { activeModule, lang } = useRestaurant();

  useEffect(() => {
    document.title = lang === 'ru' ? 'Restaurant CRM — Прототип' : 'Restaurant CRM — Прототип (КЫР)';
    document.documentElement.lang = lang;
  }, [lang]);

  switch (activeModule) {
    case 'floor':
      return <FloorModule />;
    case 'pos':
      return <PosModule />;
    case 'kitchen':
      return <KitchenModule />;
    case 'delivery':
      return <DeliveryModule />;
    case 'comms':
      return <CommsModule />;
    case 'menu':
      return <MenuDirectoryModule />;
    case 'inventory':
      return <InventoryModule />;
    case 'guests':
      return <GuestsModule />;
    case 'operations':
      return <OperationsModule />;
    case 'reports':
      return <ReportsModule />;
  }
};

export const App: React.FC = () => {
  return (
    <RestaurantProvider>
      <AppShell>
        <ActiveRestaurantView />
      </AppShell>
    </RestaurantProvider>
  );
};

export default App;
