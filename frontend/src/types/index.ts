export interface OverviewMetrics {
  totalTransactions: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalRecordsProcessed: number;
  sparkStatus: 'IDLE' | 'PROCESSING' | 'READY' | 'ERROR';
  lastProcessedAt?: string;
  clusterMode: string;
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  transactions: number;
}

export interface TopProduct {
  stockCode: string;
  description: string;
  totalQuantity: number;
  totalRevenue: number;
  unitPrice: number;
}

export interface TopCustomer {
  customerId: string;
  totalSpent: number;
  uniqueProducts: number;
  totalTransactions: number;
  country: string;
}

export interface CountrySale {
  country: string;
  revenue: number;
  transactions: number;
  customers: number;
}

export interface PreprocessingStats {
  rawRecordCount: number;
  cleanedRecordCount: number;
  missingCustomerCount: number;
  missingStockCodeCount: number;
  invalidQuantityCount: number;
  invalidUnitPriceCount: number;
  duplicateRecordCount: number;
  executionTimeSec: number;
  parquetStoragePath: string;
}

export interface DatasetPreview {
  fileName: string;
  fileSizeBytes: number;
  totalRecords: number;
  columns: Array<{ name: string; type: string; nullCount: number }>;
  sampleRows: Record<string, any>[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'customer' | 'product';
  degree: number;
  pageRank: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface GraphMetrics {
  totalVertices: number;
  customerVertices: number;
  productVertices: number;
  totalEdges: number;
  topDegreeProducts: Array<{ stockCode: string; description: string; degree: number }>;
  topPageRankProducts: Array<{ stockCode: string; description: string; score: number }>;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ProductRecommendation {
  stockCode: string;
  description: string;
  predictedRating: number;
  unitPrice: number;
  categoryHint?: string;
}

export interface CustomerRecommendationResult {
  customerId: string;
  recommendations: ProductRecommendation[];
  historicalPurchaseCount: number;
  modelConfidence: number;
}

export interface ModelEvaluation {
  algorithm: string;
  rank: number;
  maxIter: number;
  regParam: number;
  rmse: number;
  trainRecords: number;
  testRecords: number;
  trainingTimeSec: number;
  coldStartStrategy: string;
}

export interface BenchmarkRecord {
  datasetSize: 'Small' | 'Medium' | 'Large' | 'Full Cluster';
  recordCount: number;
  processingTimeSec: number;
  modelTrainingTimeSec: number;
  throughputRecsPerSec: number;
}
