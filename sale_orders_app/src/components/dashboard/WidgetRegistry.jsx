import React from 'react';
import DeliveryWidget from './widgets/DeliveryWidget';
import ShortcutsWidget from './widgets/ShortcutsWidget';
import TodoListWidget from './widgets/TodoListWidget';
import CalendarWidget from './widgets/CalendarWidget';
import ProductionTargetWidget from './ProductionTargetWidget';
import ProductionItemsWidget from './ProductionItemsWidget';
import WorkingDaysWidget from './WorkingDaysWidget';
import AppIconWidget from './widgets/AppIconWidget';

import { useApp } from '../../context/AppContext';

// A placeholder for widgets we haven't built yet but are in the catalog
const PlaceholderWidget = ({ name }) => {
  const { state } = useApp();
  return (
    <div className={`w-full h-full flex items-center justify-center rounded-xl border border-dashed ${
      state.dashboardBackground 
        ? 'bg-transparent border-outline-variant/30' 
        : 'bg-surface-container-low border-outline-variant/30'
    }`}>
      <p className="text-xs font-bold text-on-surface-variant">{name}</p>
    </div>
  );
};

export const WidgetRegistry = {
  'production_target': {
    name: 'Total Target Production',
    component: ProductionTargetWidget,
    defaultWidth: 6,
    defaultHeight: 4,
  },
  'production_items': {
    name: 'Total Completed Items',
    component: ProductionItemsWidget,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  'working_days': {
    name: 'Working Days',
    component: WorkingDaysWidget,
    defaultWidth: 3,
    defaultHeight: 4,
  },
  'delivery_kpi': {
    name: 'Delivery KPI',
    component: DeliveryWidget,
    defaultWidth: 12,
    defaultHeight: 4,
  },
  'shortcuts': {
    name: 'Quick Shortcuts',
    component: ShortcutsWidget,
    defaultWidth: 4,
    defaultHeight: 4,
  },
  'todo_list': {
    name: 'Task Board',
    component: TodoListWidget,
    defaultWidth: 4,
    defaultHeight: 6,
  },
  'calendar': {
    name: 'Calendar',
    component: CalendarWidget,
    defaultWidth: 4,
    defaultHeight: 6,
  },
  'sales_stats': {
    name: 'Sales Overview',
    component: () => <PlaceholderWidget name="Sales Stats Widget" />,
    defaultWidth: 6,
    defaultHeight: 4,
  },
  'production_flow': {
    name: 'Production Flow',
    component: () => <PlaceholderWidget name="Production Flow Widget" />,
    defaultWidth: 8,
    defaultHeight: 6,
  },
  'notifications': {
    name: 'Recent Activity',
    component: () => <PlaceholderWidget name="Notifications List" />,
    defaultWidth: 4,
    defaultHeight: 6,
  },
  'bom_calculator': {
    name: 'BOM Calculator',
    component: AppIconWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    appConfig: {
      title: 'BOM Calculator',
      icon: 'calculate',
      path: '/production?tab=bom-calculator'
    }
  },
  'document_warehouse': {
    name: 'E-Files',
    component: AppIconWidget,
    defaultWidth: 2,
    defaultHeight: 2,
    appConfig: {
      title: 'E-Files',
      icon: 'shelves',
      path: '/dashboard?tab=e-files'
    }
  },
  'app_icon': {
    name: 'App Icon Shortcut',
    component: AppIconWidget,
    defaultWidth: 2,
    defaultHeight: 2,
  }
};

export const getWidgetComponent = (type) => {
  const widget = WidgetRegistry[type];
  return widget ? widget.component : () => <PlaceholderWidget name={`Unknown: ${type}`} />;
};
