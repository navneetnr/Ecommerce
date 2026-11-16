import React from 'react';
import { Users, DollarSign, ShoppingCart, Award } from 'lucide-react';
import { TopCustomer } from '../types';

interface CustomerInsightsProps {
  topCustomers: TopCustomer[];
}

export const CustomerInsightsView: React.FC<CustomerInsightsProps> = ({ topCustomers }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1">Customer Universe</div>
          <div className="text-xl font-bold font-mono text-content-primary">4,372 Customers</div>
          <div className="text-[11px] text-content-secondary mt-1">Filtered from 541k transactions</div>
        </div>
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1">Avg Customer Lifetime Value</div>
          <div className="text-xl font-bold font-mono text-brand-600">£2,038.29</div>
          <div className="text-[11px] text-content-secondary mt-1">Calculated via Spark SQL mean</div>
        </div>
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1">Repeat Purchase Rate</div>
          <div className="text-xl font-bold font-mono text-status-success">69.8%</div>
          <div className="text-[11px] text-content-secondary mt-1">&gt; 1 distinct transaction</div>
        </div>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <h3 className="text-sm font-semibold text-content-primary mb-3">
          Customer Spending & Basket Diversity
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-content-secondary font-medium">
                <th className="pb-2">Customer ID</th>
                <th className="pb-2">Country</th>
                <th className="pb-2 text-right">Transactions</th>
                <th className="pb-2 text-right">Unique Products</th>
                <th className="pb-2 text-right">Total Spent</th>
                <th className="pb-2 text-right">Cohort Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {topCustomers.map((c) => (
                <tr key={c.customerId} className="hover:bg-surface-hover/50">
                  <td className="py-2.5 font-bold text-content-primary">C_{c.customerId}</td>
                  <td className="py-2.5 font-sans text-content-secondary">{c.country}</td>
                  <td className="py-2.5 text-right">{c.totalTransactions.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-brand-600 font-semibold">{c.uniqueProducts}</td>
                  <td className="py-2.5 text-right font-bold text-status-success">
                    £{c.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 text-right font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-status-success font-medium text-[10px] border border-emerald-100">
                      VIP Champion
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
