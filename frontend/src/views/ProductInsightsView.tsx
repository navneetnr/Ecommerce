import React from 'react';
import { Package, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { TopProduct } from '../types';

interface ProductInsightsProps {
  topProducts: TopProduct[];
}

export const ProductInsightsView: React.FC<ProductInsightsProps> = ({ topProducts }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1">Catalog Size</div>
          <div className="text-xl font-bold font-mono text-content-primary">4,070 SKUs</div>
          <div className="text-[11px] text-content-secondary mt-1">Distinct items identified</div>
        </div>
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1">Pareto Concentration</div>
          <div className="text-xl font-bold text-brand-600">80 / 20 Rule</div>
          <div className="text-[11px] text-content-secondary mt-1">Top 20% of products generate 78.4% of total revenue</div>
        </div>
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1">Average SKU Price</div>
          <div className="text-xl font-bold font-mono text-status-success">£3.26</div>
          <div className="text-[11px] text-content-secondary mt-1">Mean catalog unit price</div>
        </div>
      </div>

      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <h3 className="text-sm font-semibold text-content-primary mb-3">
          SKU Sales Velocity & Margin Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-content-secondary font-medium">
                <th className="pb-2">StockCode</th>
                <th className="pb-2">Product Description</th>
                <th className="pb-2 text-right">Units Sold</th>
                <th className="pb-2 text-right">Unit Price</th>
                <th className="pb-2 text-right">Revenue</th>
                <th className="pb-2 text-right">Velocity Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {topProducts.map((p) => (
                <tr key={p.stockCode} className="hover:bg-surface-hover/50">
                  <td className="py-2.5 font-bold text-brand-600">{p.stockCode}</td>
                  <td className="py-2.5 font-sans text-content-primary max-w-sm truncate">{p.description}</td>
                  <td className="py-2.5 text-right">{p.totalQuantity.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-content-secondary">£{p.unitPrice.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-medium text-content-primary">
                    £{p.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 text-right font-sans">
                    <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-600 font-medium text-[10px] border border-brand-100">
                      Tier A (High Velocity)
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
