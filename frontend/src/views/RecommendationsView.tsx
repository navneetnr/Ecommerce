import React, { useState } from 'react';
import { Sparkles, UserCheck, Star, ShoppingBag, Info, Check, ArrowRight } from 'lucide-react';
import { CustomerRecommendationResult, ProductRecommendation } from '../types';
import { apiClient } from '../api/apiClient';

interface RecommendationsViewProps {
  initialResult?: CustomerRecommendationResult;
}

const POPULAR_CUSTOMERS = [
  { id: '14646', name: 'Customer 14646', country: 'Netherlands', spend: '£280,206', purchases: 2085 },
  { id: '18102', name: 'Customer 18102', country: 'United Kingdom', spend: '£259,657', purchases: 433 },
  { id: '14911', name: 'Customer 14911', country: 'EIRE', spend: '£143,825', purchases: 5903 },
  { id: '17450', name: 'Customer 17450', country: 'United Kingdom', spend: '£194,550', purchases: 351 },
];

export const RecommendationsView: React.FC<RecommendationsViewProps> = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('14646');
  const [customInput, setCustomInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CustomerRecommendationResult | null>(null);

  React.useEffect(() => {
    fetchRecommendations(selectedCustomer);
  }, [selectedCustomer]);

  const fetchRecommendations = async (cid: string) => {
    setLoading(true);
    try {
      const res = await apiClient.getCustomerRecommendations(cid);
      setResult(res);
    } catch (_) {}
    setLoading(false);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      setSelectedCustomer(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Selector Card */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <h3 className="text-sm font-semibold text-content-primary">
              Personalized ALS Collaborative Filtering Inference
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Select or enter any Customer ID to query Spark MLlib ALS latent factor embeddings
            </p>
          </div>

          <form onSubmit={handleCustomSearch} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Customer ID (e.g. 14646)..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="text-xs bg-surface-muted border border-border-subtle rounded-md px-3 py-1.5 focus:outline-none focus:border-brand-500 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium cursor-pointer"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Quick Customer Selection Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-content-secondary font-medium">Quick Profiles:</span>
          {POPULAR_CUSTOMERS.map((cust) => (
            <button
              key={cust.id}
              onClick={() => setSelectedCustomer(cust.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                selectedCustomer === cust.id
                  ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-subtle'
                  : 'bg-surface-muted text-content-secondary hover:text-content-primary border border-border-subtle'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer {cust.id}</span>
              <span className="text-[10px] text-content-tertiary">({cust.country})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Output Grid */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-content-primary">
                Top 5 Recommended Products for Customer {selectedCustomer}
              </h3>
              <p className="text-xs text-content-secondary">
                Generated via model.recommendForAllUsers(5) matrix factorization
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-status-success bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 font-medium">
            ALS Model Active (Rank=10)
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-content-secondary">
            Evaluating latent factors in Spark MLlib ALS...
          </div>
        ) : result ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {result.recommendations.map((item, idx) => (
              <div
                key={item.stockCode}
                className="bg-surface-muted/50 border border-border-subtle rounded-lg p-4 flex flex-col justify-between hover:border-brand-200 hover:shadow-card transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-100">
                      Top #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-status-success font-mono">
                      £{item.unitPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-bold text-content-primary">
                    {item.stockCode}
                  </div>
                  <div className="text-xs font-medium text-content-primary mt-1 line-clamp-2">
                    {item.description}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border-subtle space-y-1.5">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-content-secondary">Predicted Rating:</span>
                    <span className="font-mono font-bold text-brand-600 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-brand-500 text-brand-500" />
                      {item.predictedRating.toFixed(2)} / 5.0
                    </span>
                  </div>

                  {/* Rating Confidence Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full"
                      style={{ width: `${(item.predictedRating / 5.0) * 100}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-content-tertiary text-right">
                    Latent dot product score
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* ALS Collaborative Filtering Mathematical Explanation Card */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-brand-500" />
          <h4 className="text-xs font-semibold text-content-primary">
            How Spark MLlib ALS Generates These Predictions (Academic Context)
          </h4>
        </div>
        <p className="text-xs text-content-secondary leading-relaxed">
          Alternating Least Squares (ALS) factorizes the sparse user-item interaction matrix <span className="font-mono text-content-primary">R ≈ U × Vᵀ</span> into low-rank customer latent factors <span className="font-mono text-content-primary">U (4,372 × 10)</span> and product latent factors <span className="font-mono text-content-primary">V (4,070 × 10)</span>. By fixing <span className="font-mono text-content-primary">U</span> and solving for <span className="font-mono text-content-primary">V</span>, and vice-versa over 10 iterations with regularizer <span className="font-mono text-content-primary">λ = 0.1</span>, Spark calculates the dot product <span className="font-mono text-content-primary">uᵢ · vⱼ</span> in parallel across partitions without collecting the entire matrix into single-machine memory.
        </p>
      </div>
    </div>
  );
};
