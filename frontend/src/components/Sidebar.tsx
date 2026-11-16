import React from 'react';
import {
  LayoutDashboard, Database, Filter, BarChart3, Package, Users, Network,
  Sparkles, Gauge, Activity, Cpu,
} from 'lucide-react';

export type ViewTab =
  | 'overview' | 'data-management' | 'preprocessing' | 'analytics'
  | 'product-insights' | 'customer-insights' | 'graph' | 'recommendations'
  | 'model-eval' | 'performance' | 'settings';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  sparkStatus?: string;
}

const navItems: { id: ViewTab; label: string; icon: React.ElementType; section?: string }[] = [
  { id: 'overview', label: 'Project overview', icon: LayoutDashboard },
  { id: 'data-management', label: 'Dataset & schema', icon: Database, section: 'Data preparation' },
  { id: 'preprocessing', label: 'Cleaning & features', icon: Filter },
  { id: 'analytics', label: 'Sales analytics', icon: BarChart3, section: 'Analysis' },
  { id: 'product-insights', label: 'Product patterns', icon: Package },
  { id: 'customer-insights', label: 'Customer behavior', icon: Users },
  { id: 'graph', label: 'Purchase network', icon: Network, section: 'Algorithms' },
  { id: 'recommendations', label: 'Recommendations', icon: Sparkles },
  { id: 'model-eval', label: 'Model evaluation', icon: Gauge },
  { id: 'performance', label: 'Scalability study', icon: Activity, section: 'Execution' },
  { id: 'settings', label: 'Environment', icon: Cpu },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, sparkStatus = 'READY' }) => (
  <aside className="w-64 bg-surface-sidebar border-r border-border-subtle flex flex-col h-screen select-none shrink-0">
    <div className="p-5 border-b border-border-subtle">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-md bg-brand-500 flex items-center justify-center text-white font-semibold text-xs tracking-tight">EC</div>
        <div>
          <h1 className="font-semibold text-content-primary text-sm tracking-tight leading-none">Retail Analytics</h1>
          <p className="text-[11px] text-content-secondary mt-1.5">INT315 · Cluster Computing</p>
        </div>
      </div>
    </div>
    <nav aria-label="Project sections" className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
      {navItems.map(({ id, label, icon: Icon, section }) => {
        const active = currentTab === id;
        return <React.Fragment key={id}>
          {section && <div className="pt-5 pb-2 px-2.5 text-[10px] font-semibold uppercase tracking-widest text-content-tertiary">{section}</div>}
          <button aria-current={active ? 'page' : undefined} onClick={() => onSelectTab(id)} className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-[12px] font-medium transition-colors text-left ${active ? 'bg-brand-50 text-brand-600' : 'text-content-secondary hover:text-content-primary hover:bg-surface-hover'}`}>
            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-brand-500' : 'text-content-tertiary'}`} />
            <span className="truncate">{label}</span>
          </button>
        </React.Fragment>;
      })}
    </nav>
    <div className="p-3 border-t border-border-subtle bg-surface-muted/50">
      <div className="p-3 rounded-md border border-border-subtle bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-content-secondary flex items-center gap-2"><span className="inline-flex rounded-full h-2 w-2 bg-status-success" />Spark Engine</span>
          <span className="text-[9px] px-1.5 py-1 rounded bg-emerald-50 text-status-success font-semibold tracking-wide">{sparkStatus}</span>
        </div>
        <div className="text-[10px] text-content-secondary">Spark 3.5.1 <span className="px-1">/</span> Scala 2.12</div>
        <div className="text-[10px] text-content-tertiary mt-1">local[*] execution mode</div>
      </div>
    </div>
  </aside>
);
