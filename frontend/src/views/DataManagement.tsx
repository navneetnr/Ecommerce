import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Copy,
  Play,
  RotateCw,
  HardDrive,
  Info,
} from 'lucide-react';
import { PreprocessingStats } from '../types';

interface DataManagementProps {
  onStartPreprocessing: () => void;
  isProcessing: boolean;
  stats?: PreprocessingStats;
  onNavigateToPreprocessing: () => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({
  onStartPreprocessing,
  isProcessing,
  stats,
  onNavigateToPreprocessing,
}) => {
  const schemaInfo = [
    { name: 'InvoiceNo', type: 'StringType', sample: '536365', nullCount: 0, description: 'Unique 6-digit transaction identifier; "C" indicates cancellation.' },
    { name: 'StockCode', type: 'StringType', sample: '85123A', nullCount: 0, description: 'Unique 5/6 character product identifier.' },
    { name: 'Description', type: 'StringType', sample: 'WHITE HANGING HEART T-LIGHT HOLDER', nullCount: 1454, description: 'Product title / catalog description name.' },
    { name: 'Quantity', type: 'IntegerType', sample: '6', nullCount: 0, description: 'Quantities per transaction. Negative values indicate returns/damages.' },
    { name: 'InvoiceDate', type: 'StringType', sample: '12/1/2010 8:26', nullCount: 0, description: 'Timestamp when transaction occurred.' },
    { name: 'UnitPrice', type: 'DoubleType', sample: '2.55', nullCount: 0, description: 'Unit price of the product in GBP (£).' },
    { name: 'CustomerID', type: 'StringType', sample: '17850', nullCount: 135080, description: 'Unique 5-digit customer identifier (crucial for GraphX and ALS).' },
    { name: 'Country', type: 'StringType', sample: 'United Kingdom', nullCount: 0, description: 'Country of customer residence.' },
  ];

  const sampleRows = [
    { InvoiceNo: '536365', StockCode: '85123A', Description: 'WHITE HANGING HEART T-LIGHT HOLDER', Quantity: 6, InvoiceDate: '12/1/2010 8:26', UnitPrice: 2.55, CustomerID: '17850', Country: 'United Kingdom' },
    { InvoiceNo: '536365', StockCode: '71053', Description: 'WHITE METAL LANTERN', Quantity: 6, InvoiceDate: '12/1/2010 8:26', UnitPrice: 3.39, CustomerID: '17850', Country: 'United Kingdom' },
    { InvoiceNo: '536365', StockCode: '84406B', Description: 'CREAM CUPID HEARTS COAT HANGER', Quantity: 8, InvoiceDate: '12/1/2010 8:26', UnitPrice: 2.75, CustomerID: '17850', Country: 'United Kingdom' },
    { InvoiceNo: '536365', StockCode: '84029G', Description: 'KNITTED UNION FLAG HOT WATER BOTTLE', Quantity: 6, InvoiceDate: '12/1/2010 8:26', UnitPrice: 3.39, CustomerID: '17850', Country: 'United Kingdom' },
    { InvoiceNo: '536365', StockCode: '84029E', Description: 'RED WOOLLY HOTTIE WHITE HEART.', Quantity: 6, InvoiceDate: '12/1/2010 8:26', UnitPrice: 3.39, CustomerID: '17850', Country: 'United Kingdom' },
    { InvoiceNo: '536365', StockCode: '22752', Description: 'SET 7 BABUSHKA NESTING BOXES', Quantity: 2, InvoiceDate: '12/1/2010 8:26', UnitPrice: 7.65, CustomerID: '17850', Country: 'United Kingdom' },
    { InvoiceNo: '536365', StockCode: '21730', Description: 'GLASS STAR FROSTED T-LIGHT HOLDER', Quantity: 6, InvoiceDate: '12/1/2010 8:26', UnitPrice: 4.25, CustomerID: '17850', Country: 'United Kingdom' },
  ];

  return (
    <div className="space-y-6">
      {/* Dataset Selection & Action Banner */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-content-primary">
                Dataset: UCI Machine Learning Online Retail
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-status-success border border-emerald-100 font-medium">
                45 MB CSV · 541,909 rows
              </span>
            </div>
            <p className="text-xs text-content-secondary mt-0.5">
              Source: Databricks Spark Repo / UCI ML Repository (Trans: Dec 2010 – Dec 2011)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onStartPreprocessing}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/70 text-white text-xs font-medium shadow-subtle transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Spark Cleaning...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Spark Preprocessing</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dataset Health & Quality Checks */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-content-secondary mb-1">
            <span>Total Ingested Records</span>
            <FileText className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-xl font-bold text-content-primary font-mono">
            {(stats?.rawRecordCount ?? 541909).toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">Raw CSV row count</div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-status-warning mb-1">
            <span>Missing Customer IDs</span>
            <AlertTriangle className="w-4 h-4 text-status-warning" />
          </div>
          <div className="text-xl font-bold text-status-warning font-mono">
            {(stats?.missingCustomerCount ?? 135080).toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            24.9% null (filtered in cleaning)
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-status-warning mb-1">
            <span>Duplicate Records</span>
            <Copy className="w-4 h-4 text-status-warning" />
          </div>
          <div className="text-xl font-bold text-status-warning font-mono">
            {(stats?.duplicateRecordCount ?? 5268).toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Removed via dropDuplicates()
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="flex items-center justify-between text-xs text-status-success mb-1">
            <span>Expected Cleaned Records</span>
            <CheckCircle className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-xl font-bold text-status-success font-mono">
            {(stats?.cleanedRecordCount ?? 392692).toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Passed to GraphX & MLlib
          </div>
        </div>
      </div>

      {/* Schema & Column Data Types Table */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-content-primary">
              Schema Definition & Spark Data Types
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Inferred dynamically via spark.read.option("inferSchema", "true")
            </p>
          </div>
          <span className="text-[11px] text-content-secondary bg-surface-muted px-2 py-1 rounded border border-border-subtle">
            8 Attributes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-content-secondary">
                <th className="pb-2 font-medium">Column Name</th>
                <th className="pb-2 font-medium">Spark SQL Type</th>
                <th className="pb-2 font-medium">Sample Value</th>
                <th className="pb-2 font-medium text-right">Missing / Nulls</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {schemaInfo.map((col) => (
                <tr key={col.name} className="hover:bg-surface-hover/50">
                  <td className="py-2.5 font-mono font-medium text-content-primary">
                    {col.name}
                  </td>
                  <td className="py-2.5 font-mono text-brand-600">
                    <span className="bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100 text-[11px]">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-content-secondary">{col.sample}</td>
                  <td className="py-2.5 text-right font-mono">
                    {col.nullCount > 0 ? (
                      <span className="text-status-warning font-medium">
                        {col.nullCount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-content-tertiary">0</span>
                    )}
                  </td>
                  <td className="py-2.5 text-content-secondary max-w-sm truncate">
                    {col.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Data Preview */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-content-primary">
              Raw Transaction Data Preview (First 7 Records)
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Matches raw CSV format before DataFrame cleaning
            </p>
          </div>
          <span className="text-[11px] font-mono text-content-tertiary">
            ecommerce.csv
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle text-content-secondary">
                <th className="pb-2 font-medium">InvoiceNo</th>
                <th className="pb-2 font-medium">StockCode</th>
                <th className="pb-2 font-medium">Description</th>
                <th className="pb-2 font-medium text-right">Quantity</th>
                <th className="pb-2 font-medium">InvoiceDate</th>
                <th className="pb-2 font-medium text-right">UnitPrice</th>
                <th className="pb-2 font-medium">CustomerID</th>
                <th className="pb-2 font-medium">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle font-mono text-[11px]">
              {sampleRows.map((r, i) => (
                <tr key={i} className="hover:bg-surface-hover/50">
                  <td className="py-2 text-content-primary">{r.InvoiceNo}</td>
                  <td className="py-2 text-brand-600 font-medium">{r.StockCode}</td>
                  <td className="py-2 font-sans text-content-primary max-w-xs truncate">{r.Description}</td>
                  <td className="py-2 text-right">{r.Quantity}</td>
                  <td className="py-2 text-content-secondary">{r.InvoiceDate}</td>
                  <td className="py-2 text-right">£{r.UnitPrice.toFixed(2)}</td>
                  <td className="py-2 text-content-primary">{r.CustomerID}</td>
                  <td className="py-2 text-content-secondary font-sans">{r.Country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {stats && (
        <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-status-success shrink-0" />
            <div>
              <p className="text-xs font-semibold text-status-success">
                Preprocessing completed in {stats.executionTimeSec}s
              </p>
              <p className="text-[11px] text-content-secondary">
                Output serialized to Apache Parquet columnar storage with Snappy compression.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToPreprocessing}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-white px-3 py-1.5 rounded border border-border-subtle shadow-subtle"
          >
            View Preprocessing Report →
          </button>
        </div>
      )}
    </div>
  );
};
