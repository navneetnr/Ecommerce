import React from 'react';
import { ArrowUpRight, Database, GitBranch, Network, Sparkles } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MetricCard } from '../components/MetricCard';
import { OverviewMetrics, RevenueTrend, TopProduct } from '../types';
import { ViewTab } from '../components/Sidebar';

interface OverviewDashboardProps {
  metrics: OverviewMetrics;
  revenueTrend: RevenueTrend[];
  topProducts: TopProduct[];
  onNavigate: (tab: ViewTab) => void;
}

const gbp = (value: number) => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'GBP', maximumFractionDigits: 0,
}).format(value);

const stages = [
  { n: '01', title: 'Ingest & clean', sub: 'CSV → validated rows', icon: Database, tab: 'data-management' as ViewTab },
  { n: '02', title: 'Aggregate', sub: 'Spark SQL analysis', icon: GitBranch, tab: 'analytics' as ViewTab },
  { n: '03', title: 'Find relationships', sub: 'GraphX · degree · PageRank', icon: Network, tab: 'graph' as ViewTab },
  { n: '04', title: 'Recommend', sub: 'ALS · holdout evaluation', icon: Sparkles, tab: 'recommendations' as ViewTab },
];

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ metrics, revenueTrend, topProducts, onNavigate }) => (
  <div className="space-y-6">
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-3">
      <div>
        <div className="text-[10px] uppercase tracking-[.18em] font-semibold text-brand-600 mb-2">Capstone project · INT315</div>
        <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-content-primary">E-commerce transaction study</h1>
        <p className="text-sm text-content-secondary mt-2 max-w-2xl">A reproducible Spark workflow for transaction cleaning, purchasing patterns, product relationships and recommendations.</p>
      </div>
      <div className="text-xs text-content-secondary border-l-2 border-brand-500 pl-3 py-1">Dataset<br/><strong className="text-content-primary font-medium">UCI Online Retail · 2010–2011</strong></div>
    </section>

    <section aria-label="Dataset summary" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <MetricCard title="Transactions" value={metrics.totalTransactions.toLocaleString()} subtitle="Raw dataset rows" />
      <MetricCard title="Customers" value={metrics.totalCustomers.toLocaleString()} subtitle="Distinct customer IDs" />
      <MetricCard title="Products" value={metrics.totalProducts.toLocaleString()} subtitle="Distinct stock codes" />
      <MetricCard title="Sales value" value={gbp(metrics.totalRevenue)} subtitle="Quantity × unit price · GBP" />
    </section>

    <section className="bg-white border border-border-subtle rounded-lg p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <div className="text-[10px] uppercase tracking-[.15em] text-content-tertiary font-semibold">Method</div>
          <h2 className="text-base font-semibold text-content-primary mt-1">From transaction rows to recommendations</h2>
        </div>
        <p className="text-xs text-content-secondary">Spark SQL · GraphX · MLlib ALS</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {stages.map(({ n, title, sub, icon: Icon, tab }, index) => <button key={n} onClick={() => onNavigate(tab)} className="group flex items-start gap-3 text-left rounded-md border border-border-subtle bg-[#fbfcfa] p-4 hover:border-[#b8ccbe] hover:bg-[#f7faf7] transition-colors">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#e8f1eb] text-brand-600"><Icon size={16}/></span>
          <span className="min-w-0"><span className="block text-[10px] font-mono text-content-tertiary">STEP {n}</span><span className="block mt-1 text-sm font-semibold text-content-primary">{title}</span><span className="block mt-1 text-[11px] text-content-secondary">{sub}</span></span>
          {index < stages.length - 1 && <span className="hidden xl:block absolute" aria-hidden="true"/>}
        </button>)}
      </div>
    </section>

    <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-4">
      <div className="bg-white border border-border-subtle rounded-lg p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div><h2 className="text-sm font-semibold text-content-primary">Monthly sales</h2><p className="text-xs text-content-secondary mt-1">Revenue grouped by invoice month · GBP</p></div>
          <span className="text-[10px] font-mono text-content-tertiary">SPARK SQL</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a8064" stopOpacity={0.18}/><stop offset="95%" stopColor="#4a8064" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="#e9eeea" vertical={false}/>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#77837d' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 10, fill: '#77837d' }} axisLine={false} tickLine={false} tickFormatter={(v) => `£${Math.round(v / 1000)}k`}/>
              <Tooltip formatter={(v) => [gbp(Number(v)), 'Sales']} contentStyle={{ border: '1px solid #dfe5e1', borderRadius: 5, fontSize: 12 }}/>
              <Area type="monotone" dataKey="revenue" stroke="#397357" strokeWidth={2} fill="url(#revenueFill)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-end"><button onClick={() => onNavigate('analytics')} className="text-xs font-medium text-brand-600 flex items-center gap-1">Explore sales analysis <ArrowUpRight size={14}/></button></div>
      </div>

      <div className="bg-white border border-border-subtle rounded-lg p-5">
        <div className="flex items-start justify-between mb-4"><div><h2 className="text-sm font-semibold text-content-primary">Top products by quantity</h2><p className="text-xs text-content-secondary mt-1">Ranked on summed purchase quantity</p></div><span className="text-[10px] font-mono text-content-tertiary">TOP 5</span></div>
        <div className="divide-y divide-border-subtle">
          {topProducts.slice(0, 5).map((product, i) => <div key={product.stockCode} className="flex items-center gap-3 py-3">
            <span className="w-6 text-[11px] font-mono text-content-tertiary">0{i + 1}</span>
            <span className="min-w-0 flex-1"><span className="block text-[11px] font-mono font-semibold text-content-primary">{product.stockCode}</span><span className="block truncate text-xs text-content-secondary mt-0.5">{product.description}</span></span>
            <span className="text-xs font-mono text-content-primary">{product.totalQuantity.toLocaleString()}</span>
          </div>)}
        </div>
        <button onClick={() => onNavigate('product-insights')} className="mt-3 text-xs font-medium text-brand-600 flex items-center gap-1">View product patterns <ArrowUpRight size={14}/></button>
      </div>
    </section>

    <div className="text-[11px] text-content-tertiary">Average order value {gbp(metrics.averageOrderValue)} <span className="mx-2">·</span> Cleaned rows {metrics.totalRecordsProcessed.toLocaleString()} <span className="mx-2">·</span> Runtime mode {metrics.clusterMode}</div>
  </div>
);
