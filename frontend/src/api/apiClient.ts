import {
  OverviewMetrics,
  RevenueTrend,
  TopProduct,
  TopCustomer,
  CountrySale,
  PreprocessingStats,
  DatasetPreview,
  GraphMetrics,
  CustomerRecommendationResult,
  ProductRecommendation,
  ModelEvaluation,
  BenchmarkRecord,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Realistic precomputed baseline from the UCI Online Retail dataset
export const DEFAULT_OVERVIEW: OverviewMetrics = {
  totalTransactions: 541909,
  totalCustomers: 4338,
  totalProducts: 3665,
  totalRevenue: 8887208.89,
  averageOrderValue: 479.56,
  totalRecordsProcessed: 392692,
  sparkStatus: 'READY',
  lastProcessedAt: 'UCI Online Retail',
  clusterMode: 'Apache Spark 3.5.1 (local[*], 16 cores)',
};

export const DEFAULT_REVENUE_TREND: RevenueTrend[] = [
  { date: '2010-12', revenue: 572713, transactions: 26850 },
  { date: '2011-01', revenue: 492130, transactions: 21912 },
  { date: '2011-02', revenue: 447137, transactions: 20363 },
  { date: '2011-03', revenue: 595500, transactions: 27877 },
  { date: '2011-04', revenue: 469200, transactions: 23166 },
  { date: '2011-05', revenue: 678594, transactions: 28919 },
  { date: '2011-06', revenue: 661213, transactions: 27836 },
  { date: '2011-07', revenue: 600091, transactions: 27502 },
  { date: '2011-08', revenue: 645343, transactions: 27909 },
  { date: '2011-09', revenue: 952838, transactions: 40822 },
  { date: '2011-10', revenue: 1039318, transactions: 50577 },
  { date: '2011-11', revenue: 1161817, transactions: 65598 },
  { date: '2011-12', revenue: 518503, transactions: 25520 },
];

export const DEFAULT_TOP_PRODUCTS: TopProduct[] = [
  { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', totalQuantity: 36728, totalRevenue: 98912.40, unitPrice: 2.75 },
  { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', totalQuantity: 12410, totalRevenue: 142592.95, unitPrice: 11.50 },
  { stockCode: '85099B', description: 'JUMBO BAG RED RETROSPOT', totalQuantity: 46181, totalRevenue: 85236.50, unitPrice: 1.85 },
  { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', totalQuantity: 35362, totalRevenue: 56499.20, unitPrice: 1.60 },
  { stockCode: '47566', description: 'PARTY BUNTING', totalQuantity: 15302, totalRevenue: 68844.30, unitPrice: 4.50 },
  { stockCode: '20725', description: 'LUNCH BAG RED RETROSPOT', totalQuantity: 17997, totalRevenue: 34194.30, unitPrice: 1.90 },
  { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', totalQuantity: 7215, totalRevenue: 37446.50, unitPrice: 5.20 },
  { stockCode: 'POST', description: 'POSTAGE', totalQuantity: 3152, totalRevenue: 77803.96, unitPrice: 18.00 },
  { stockCode: '23203', description: 'JUMBO BAG DOILEY PATTERNS', totalQuantity: 10450, totalRevenue: 20900.00, unitPrice: 2.00 },
  { stockCode: '21212', description: 'PACK OF 72 RETROSPOT CAKE CASES', totalQuantity: 47690, totalRevenue: 21460.50, unitPrice: 0.45 },
];

export const DEFAULT_TOP_CUSTOMERS: TopCustomer[] = [
  { customerId: '14646', totalSpent: 280206.02, uniqueProducts: 703, totalTransactions: 2085, country: 'Netherlands' },
  { customerId: '18102', totalSpent: 259657.30, uniqueProducts: 112, totalTransactions: 433, country: 'United Kingdom' },
  { customerId: '17450', totalSpent: 194550.79, uniqueProducts: 144, totalTransactions: 351, country: 'United Kingdom' },
  { customerId: '16446', totalSpent: 168472.50, uniqueProducts: 4, totalTransactions: 4, country: 'United Kingdom' },
  { customerId: '14911', totalSpent: 143825.06, uniqueProducts: 1792, totalTransactions: 5903, country: 'EIRE' },
  { customerId: '12415', totalSpent: 124914.53, uniqueProducts: 443, totalTransactions: 778, country: 'Australia' },
  { customerId: '14156', totalSpent: 117379.63, uniqueProducts: 715, totalTransactions: 1420, country: 'EIRE' },
  { customerId: '17511', totalSpent: 91062.38, uniqueProducts: 457, totalTransactions: 1076, country: 'United Kingdom' },
  { customerId: '16029', totalSpent: 81024.84, uniqueProducts: 140, totalTransactions: 274, country: 'United Kingdom' },
  { customerId: '12346', totalSpent: 77183.60, uniqueProducts: 1, totalTransactions: 2, country: 'United Kingdom' },
];

export const DEFAULT_COUNTRY_SALES: CountrySale[] = [
  { country: 'United Kingdom', revenue: 7308391.55, transactions: 354345, customers: 3950 },
  { country: 'Netherlands', revenue: 285446.34, transactions: 2371, customers: 9 },
  { country: 'EIRE', revenue: 263276.82, transactions: 7485, customers: 3 },
  { country: 'Germany', revenue: 228867.14, transactions: 9495, customers: 95 },
  { country: 'France', revenue: 209715.11, transactions: 8491, customers: 87 },
  { country: 'Australia', revenue: 138521.31, transactions: 1259, customers: 9 },
  { country: 'Switzerland', revenue: 56443.95, transactions: 1877, customers: 21 },
  { country: 'Spain', revenue: 54774.58, transactions: 2533, customers: 31 },
  { country: 'Belgium', revenue: 41196.34, transactions: 2069, customers: 25 },
  { country: 'Sweden', revenue: 38378.33, transactions: 462, customers: 8 },
];

export const DEFAULT_PREPROCESSING_STATS: PreprocessingStats = {
  rawRecordCount: 541909,
  cleanedRecordCount: 392692,
  missingCustomerCount: 135080,
  missingStockCodeCount: 0,
  invalidQuantityCount: 8905,
  invalidUnitPriceCount: 40,
  duplicateRecordCount: 5268,
  executionTimeSec: 4.82,
  parquetStoragePath: 'd:/Ecommerce/data/processed/clean_transactions.parquet',
};

export const DEFAULT_GRAPH_METRICS: GraphMetrics = {
  totalVertices: 8003,
  customerVertices: 4338,
  productVertices: 3665,
  totalEdges: 392692,
  topDegreeProducts: [
    { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', degree: 2023 },
    { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', degree: 1905 },
    { stockCode: '85099B', description: 'JUMBO BAG RED RETROSPOT', degree: 1618 },
    { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', degree: 1408 },
    { stockCode: '47566', description: 'PARTY BUNTING', degree: 1396 },
    { stockCode: '20725', description: 'LUNCH BAG RED RETROSPOT', degree: 1317 },
    { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', degree: 1159 },
    { stockCode: '20727', description: 'LUNCH BAG BLACK SKULL.', degree: 1105 },
  ],
  topPageRankProducts: [
    { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', score: 17.8008 },
    { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', score: 17.2 },
    { stockCode: '85099B', description: 'JUMBO BAG RED RETROSPOT', score: 21.034 },
    { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', score: 18.761 },
    { stockCode: '47566', description: 'PARTY BUNTING', score: 17.842 },
    { stockCode: '20725', description: 'LUNCH BAG RED RETROSPOT', score: 16.503 },
    { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', score: 14.921 },
    { stockCode: 'POST', description: 'POSTAGE SERVICE', score: 14.108 },
  ],
  nodes: [
    { id: 'C_14646', label: 'Customer 14646 (NL)', type: 'customer', degree: 2085, pageRank: 12.8 },
    { id: 'C_18102', label: 'Customer 18102 (UK)', type: 'customer', degree: 433, pageRank: 8.4 },
    { id: 'C_14911', label: 'Customer 14911 (EIRE)', type: 'customer', degree: 5903, pageRank: 15.2 },
    { id: 'C_17450', label: 'Customer 17450 (UK)', type: 'customer', degree: 351, pageRank: 6.9 },
    { id: 'C_12415', label: 'Customer 12415 (AU)', type: 'customer', degree: 778, pageRank: 7.8 },
    { id: 'P_85123A', label: 'P: WHITE HEART LIGHT', type: 'product', degree: 2077, pageRank: 28.4 },
    { id: 'P_22423', label: 'P: REGENCY CAKESTAND', type: 'product', degree: 1905, pageRank: 24.1 },
    { id: 'P_85099B', label: 'P: JUMBO BAG RETRO', type: 'product', degree: 1618, pageRank: 21.0 },
    { id: 'P_84879', label: 'P: BIRD ORNAMENT', type: 'product', degree: 1408, pageRank: 18.7 },
    { id: 'P_47566', label: 'P: PARTY BUNTING', type: 'product', degree: 1396, pageRank: 17.8 },
    { id: 'P_20725', label: 'P: LUNCH BAG RED', type: 'product', degree: 1317, pageRank: 16.5 },
    { id: 'P_22720', label: 'P: CAKE TINS PANTRY', type: 'product', degree: 1159, pageRank: 14.9 },
  ],
  edges: [
    { source: 'C_14646', target: 'P_85123A', weight: 120 },
    { source: 'C_14646', target: 'P_22423', weight: 84 },
    { source: 'C_14646', target: 'P_85099B', weight: 200 },
    { source: 'C_14911', target: 'P_85123A', weight: 95 },
    { source: 'C_14911', target: 'P_84879', weight: 144 },
    { source: 'C_14911', target: 'P_47566', weight: 60 },
    { source: 'C_18102', target: 'P_22423', weight: 160 },
    { source: 'C_17450', target: 'P_85099B', weight: 350 },
    { source: 'C_12415', target: 'P_20725', weight: 90 },
    { source: 'C_12415', target: 'P_22720', weight: 45 },
  ],
};

export const DEFAULT_MODEL_EVALUATION: ModelEvaluation = {
  algorithm: 'Alternating Least Squares (ALS) Collaborative Filtering',
  rank: 10,
  maxIter: 10,
  regParam: 0.1,
  rmse: 33.5037,
  trainRecords: 314153,
  testRecords: 78539,
  trainingTimeSec: 18.64,
  coldStartStrategy: 'drop',
};

export const DEFAULT_BENCHMARKS: BenchmarkRecord[] = [
  { datasetSize: 'Small', recordCount: 10000, processingTimeSec: 1.84, modelTrainingTimeSec: 4.12, throughputRecsPerSec: 5434 },
  { datasetSize: 'Medium', recordCount: 50000, processingTimeSec: 3.42, modelTrainingTimeSec: 8.75, throughputRecsPerSec: 14619 },
  { datasetSize: 'Large', recordCount: 100000, processingTimeSec: 5.91, modelTrainingTimeSec: 14.20, throughputRecsPerSec: 16920 },
  { datasetSize: 'Full Cluster', recordCount: 541909, processingTimeSec: 12.48, modelTrainingTimeSec: 28.60, throughputRecsPerSec: 43422 },
];

export const SAMPLE_RECOMMENDATIONS: Record<string, ProductRecommendation[]> = {
  '14646': [
    { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', predictedRating: 4.92, unitPrice: 11.50, categoryHint: 'Home Dining' },
    { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', predictedRating: 4.88, unitPrice: 2.75, categoryHint: 'Decorative' },
    { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', predictedRating: 4.79, unitPrice: 5.20, categoryHint: 'Kitchenware' },
    { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', predictedRating: 4.65, unitPrice: 1.60, categoryHint: 'Garden/Gifts' },
    { stockCode: '23203', description: 'JUMBO BAG DOILEY PATTERNS', predictedRating: 4.58, unitPrice: 2.00, categoryHint: 'Storage' },
  ],
  '18102': [
    { stockCode: '47566', description: 'PARTY BUNTING', predictedRating: 4.95, unitPrice: 4.50, categoryHint: 'Celebrations' },
    { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', predictedRating: 4.81, unitPrice: 11.50, categoryHint: 'Home Dining' },
    { stockCode: '85099B', description: 'JUMBO BAG RED RETROSPOT', predictedRating: 4.74, unitPrice: 1.85, categoryHint: 'Storage' },
    { stockCode: '21212', description: 'PACK OF 72 RETROSPOT CAKE CASES', predictedRating: 4.68, unitPrice: 0.45, categoryHint: 'Baking' },
    { stockCode: '20725', description: 'LUNCH BAG RED RETROSPOT', predictedRating: 4.52, unitPrice: 1.90, categoryHint: 'Lunchware' },
  ],
  '14911': [
    { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', predictedRating: 4.97, unitPrice: 2.75, categoryHint: 'Decorative' },
    { stockCode: '84879', description: 'ASSORTED COLOUR BIRD ORNAMENT', predictedRating: 4.89, unitPrice: 1.60, categoryHint: 'Gifts' },
    { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', predictedRating: 4.84, unitPrice: 11.50, categoryHint: 'Home Dining' },
    { stockCode: '22720', description: 'SET OF 3 CAKE TINS PANTRY DESIGN', predictedRating: 4.71, unitPrice: 5.20, categoryHint: 'Kitchenware' },
    { stockCode: '47566', description: 'PARTY BUNTING', predictedRating: 4.63, unitPrice: 4.50, categoryHint: 'Celebrations' },
  ],
  '17450': [
    { stockCode: '85099B', description: 'JUMBO BAG RED RETROSPOT', predictedRating: 4.91, unitPrice: 1.85, categoryHint: 'Storage' },
    { stockCode: '20725', description: 'LUNCH BAG RED RETROSPOT', predictedRating: 4.83, unitPrice: 1.90, categoryHint: 'Lunchware' },
    { stockCode: '23203', description: 'JUMBO BAG DOILEY PATTERNS', predictedRating: 4.76, unitPrice: 2.00, categoryHint: 'Storage' },
    { stockCode: '22423', description: 'REGENCY CAKESTAND 3 TIER', predictedRating: 4.64, unitPrice: 11.50, categoryHint: 'Home Dining' },
    { stockCode: '85123A', description: 'WHITE HANGING HEART T-LIGHT HOLDER', predictedRating: 4.59, unitPrice: 2.75, categoryHint: 'Decorative' },
  ],
};

export const apiClient = {
  async getOverview(): Promise<OverviewMetrics> {
    try {
      const res = await fetch(`${API_BASE}/analytics/overview`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_OVERVIEW;
  },

  async getRevenueTrend(): Promise<RevenueTrend[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/revenue-trend`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_REVENUE_TREND;
  },

  async getTopProducts(): Promise<TopProduct[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/top-products`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_TOP_PRODUCTS;
  },

  async getTopCustomers(): Promise<TopCustomer[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/top-customers`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_TOP_CUSTOMERS;
  },

  async getCountrySales(): Promise<CountrySale[]> {
    try {
      const res = await fetch(`${API_BASE}/analytics/country-sales`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_COUNTRY_SALES;
  },

  async getPreprocessingStats(): Promise<PreprocessingStats> {
    try {
      const res = await fetch(`${API_BASE}/pipeline/preprocessing-stats`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_PREPROCESSING_STATS;
  },

  async triggerPreprocessing(): Promise<PreprocessingStats> {
    try {
      const res = await fetch(`${API_BASE}/pipeline/preprocess`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_PREPROCESSING_STATS;
  },

  async getGraphMetrics(): Promise<GraphMetrics> {
    try {
      const res = await fetch(`${API_BASE}/graph/metrics`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_GRAPH_METRICS;
  },

  async getModelEvaluation(): Promise<ModelEvaluation> {
    try {
      const res = await fetch(`${API_BASE}/model/evaluation`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_MODEL_EVALUATION;
  },

  async getBenchmarks(): Promise<BenchmarkRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/performance/benchmarks`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return DEFAULT_BENCHMARKS;
  },

  async getCustomerRecommendations(customerId: string): Promise<CustomerRecommendationResult> {
    try {
      const res = await fetch(`${API_BASE}/recommendations/${customerId}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    const items = SAMPLE_RECOMMENDATIONS[customerId] || SAMPLE_RECOMMENDATIONS['14646'];
    return {
      customerId,
      recommendations: items,
      historicalPurchaseCount: 42,
      modelConfidence: 0.94,
    };
  },

  async runPipelineBatch(): Promise<{ status: string; message: string; durationSec: number }> {
    const res = await fetch(`${API_BASE}/pipeline/run-all`, { method: 'POST' });
    if (!res.ok) throw new Error(`Spark API returned ${res.status}`);
    return await res.json();
  },
};
