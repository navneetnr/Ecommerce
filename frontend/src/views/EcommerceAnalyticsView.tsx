import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, Users, Package, Globe, Terminal } from 'lucide-react';
import { TopProduct, TopCustomer, CountrySale } from '../types';

interface AnalyticsViewProps {
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  countrySales: CountrySale[];
}

const COLORS = ['#315CBB', '#254898', '#1C3775', '#4F46E5', '#6366F1', '#818CF8', '#A5B4FC', '#C7D2FE'];

export const EcommerceAnalyticsView: React.FC<AnalyticsViewProps> = ({
  topProducts,
  topCustomers,
  countrySales,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'customers' | 'geography'>('products');

  const topProductChartData = topProducts.slice(0, 8).map((p) => ({
    name: p.stockCode,
    quantity: p.totalQuantity,
    revenue: p.totalRevenue,
    description: p.description,
  }));

  const countryChartData = countrySales.slice(0, 6).map((c) => ({
    name: c.country,
    value: c.revenue,
  }));

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex border-b border-border-subtle gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'border-brand-500 text-brand-600 font-semibold'
              : 'border-transparent text-content-secondary hover:text-content-primary'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Top Selling Products (sum(Quantity))</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'customers'
              ? 'border-brand-500 text-brand-600 font-semibold'
              : 'border-transparent text-content-secondary hover:text-content-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>High-Value Customers (sum(TotalAmount))</span>
        </button>

        <button
          onClick={() => setActiveTab('geography')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'geography'
              ? 'border-brand-500 text-brand-600 font-semibold'
              : 'border-transparent text-content-secondary hover:text-content-primary'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Geographic Distribution (Country-wise Sales)</span>
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-content-primary">
                  Top 8 Products by Units Sold (Quantity)
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Spark SQL: transactionDF.groupBy("StockCode").agg(sum("Quantity").alias("TotalQuantity")).orderBy(desc("TotalQuantity"))
                </p>
              </div>
              <span className="text-[11px] font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                Agg: sum("Quantity")
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#737373' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#737373' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [Number(val).toLocaleString(), 'Units Sold']}
                    labelFormatter={(label) => `StockCode: ${label}`}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="quantity" fill="#315CBB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Full Top 10 Table */}
          <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-semibold text-content-primary mb-3">
              Top 10 Selling Products Full Data Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-subtle text-content-secondary font-medium">
                    <th className="pb-2.5">Rank</th>
                    <th className="pb-2.5">Stock Code</th>
                    <th className="pb-2.5">Description</th>
                    <th className="pb-2.5 text-right">Units Sold</th>
                    <th className="pb-2.5 text-right">Unit Price</th>
                    <th className="pb-2.5 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                  {topProducts.map((p, idx) => (
                    <tr key={p.stockCode} className="hover:bg-surface-hover/50">
                      <td className="py-2.5 text-content-tertiary">#{idx + 1}</td>
                      <td className="py-2.5 font-bold text-brand-600">{p.stockCode}</td>
                      <td className="py-2.5 font-sans font-medium text-content-primary max-w-sm truncate">
                        {p.description}
                      </td>
                      <td className="py-2.5 text-right">{p.totalQuantity.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-content-secondary">£{p.unitPrice.toFixed(2)}</td>
                      <td className="py-2.5 text-right font-medium text-content-primary">
                        £{p.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Customers */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-content-primary">
                  Top 10 High-Value Customers (Total Spend)
                </h3>
                <p className="text-xs text-content-secondary mt-0.5">
                  Spark SQL: transactionDF.groupBy("CustomerID").agg(sum("TotalAmount").alias("TotalSpent")).orderBy(desc("TotalSpent"))
                </p>
              </div>
              <span className="text-[11px] font-mono text-status-success bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-medium">
                Agg: sum("TotalAmount")
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-subtle text-content-secondary font-medium">
                    <th className="pb-2.5">Rank</th>
                    <th className="pb-2.5">Customer ID</th>
                    <th className="pb-2.5">Country</th>
                    <th className="pb-2.5 text-right">Transactions</th>
                    <th className="pb-2.5 text-right">Unique Products</th>
                    <th className="pb-2.5 text-right">Total Spent</th>
                    <th className="pb-2.5 text-right">Graph Vertex</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
                  {topCustomers.map((c, idx) => (
                    <tr key={c.customerId} className="hover:bg-surface-hover/50">
                      <td className="py-2.5 text-content-tertiary">#{idx + 1}</td>
                      <td className="py-2.5 font-bold text-content-primary">C_{c.customerId}</td>
                      <td className="py-2.5 font-sans text-content-secondary">{c.country}</td>
                      <td className="py-2.5 text-right">{c.totalTransactions.toLocaleString()}</td>
                      <td className="py-2.5 text-right text-brand-600">{c.uniqueProducts}</td>
                      <td className="py-2.5 text-right font-bold text-status-success">
                        £{c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="bg-gray-100 text-content-secondary px-1.5 py-0.5 rounded text-[10px]">
                          v_{c.customerId.slice(-4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Geography */}
      {activeTab === 'geography' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
            <h3 className="text-sm font-semibold text-content-primary mb-1">
              Top Revenue Generating Countries
            </h3>
            <p className="text-xs text-content-secondary mb-4">
              Spark SQL: transactionDF.groupBy("Country").agg(sum("TotalAmount"))
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countrySales.slice(0, 8)} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="country" tick={{ fontSize: 11, fill: '#737373' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#737373' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: any) => [`£${Number(val).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '6px',
                      border: '1px solid #E5E7EB',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#315CBB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-content-primary mb-1">
                Regional Share
              </h3>
              <p className="text-xs text-content-secondary mb-3">
                UK represents &gt;82% of total transaction volume
              </p>
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {countryChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: any) => `£${Number(v).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-2 space-y-1.5 text-xs">
              {countrySales.slice(0, 4).map((c, i) => (
                <div key={c.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-content-secondary">{c.country}</span>
                  </div>
                  <span className="font-mono font-medium text-content-primary">
                    £{(c.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Spark SQL Execution Trace Box */}
      <div className="p-4 rounded-lg bg-surface-muted border border-border-subtle text-xs">
        <div className="flex items-center gap-2 font-medium text-content-primary mb-1">
          <Terminal className="w-4 h-4 text-brand-500" />
          <span>Distributed Spark SQL Catalyst Execution</span>
        </div>
        <p className="text-content-secondary">
          Queries are compiled into optimized Logical Plans and physical DAG stages with whole-stage code generation (Tungsten engine). Aggregations leverage hash-based map-side partial aggregates followed by partition shuffling to minimize network transfer.
        </p>
      </div>
    </div>
  );
};
