import React from 'react';
import { Filter, CheckCircle2, ArrowRight, Code, Database, Sparkles } from 'lucide-react';
import { PreprocessingStats } from '../types';

interface PreprocessingViewProps {
  stats: PreprocessingStats;
  onNavigateToAnalytics: () => void;
}

export const DataPreprocessingView: React.FC<PreprocessingViewProps> = ({
  stats,
  onNavigateToAnalytics,
}) => {
  const steps = [
    {
      step: '1',
      title: 'Remove Missing CustomerID & StockCode',
      description: 'Filters out non-registered guest checkouts and unreferenced items.',
      code: 'df.filter(col("CustomerID").isNotNull).filter(col("StockCode").isNotNull)',
      dropped: stats.missingCustomerCount,
      impact: 'Eliminates orphan vertices in GraphX & ALS matrix sparsity.',
    },
    {
      step: '2',
      title: 'Filter Invalid Quantities',
      description: 'Discards cancellation lines (InvoiceNo starting with "C") and negative return items.',
      code: 'cleanDF.filter(col("Quantity") > 0)',
      dropped: stats.invalidQuantityCount,
      impact: 'Guarantees positive transaction weights for collaborative filtering.',
    },
    {
      step: '3',
      title: 'Filter Invalid Unit Prices',
      description: 'Removes accounting adjustments, postage waivers, and zero-price test entries.',
      code: 'cleanDF.filter(col("UnitPrice") > 0)',
      dropped: stats.invalidUnitPriceCount,
      impact: 'Ensures accurate monetary aggregation in distributed Spark SQL queries.',
    },
    {
      step: '4',
      title: 'Deduplication across Partitions',
      description: 'Runs distributed hash-based deduplication across all cluster partitions.',
      code: 'cleanedData.dropDuplicates()',
      dropped: stats.duplicateRecordCount,
      impact: 'Removes duplicate network requests and re-transmitted cart submissions.',
    },
    {
      step: '5',
      title: 'Feature Engineering: TotalAmount',
      description: 'Derives the monetary transaction feature using native catalyst expression.',
      code: 'finalDF.withColumn("TotalAmount", col("Quantity") * col("UnitPrice"))',
      dropped: 0,
      impact: 'Created TotalAmount column: fundamental feature for customer spending & graph weights.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Before vs After Summary */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-content-primary">
              Before & After Data Preprocessing Metrics
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Apache Spark transformation pipeline completed in {stats.executionTimeSec}s
            </p>
          </div>
          <span className="text-xs font-mono text-status-success bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 font-medium">
            392,692 Clean Rows Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Raw State */}
          <div className="p-4 rounded-lg bg-surface-muted border border-border-subtle">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-content-secondary">
              Raw Ingested Dataset
            </span>
            <div className="text-2xl font-bold font-mono text-content-primary mt-1">
              {stats.rawRecordCount.toLocaleString()}
            </div>
            <div className="text-xs text-status-warning mt-2 space-y-1">
              <div>• {stats.missingCustomerCount.toLocaleString()} Null Customer IDs</div>
              <div>• {stats.invalidQuantityCount.toLocaleString()} Negative/Zero Quantities</div>
              <div>• {stats.duplicateRecordCount.toLocaleString()} Duplicate Records</div>
            </div>
          </div>

          {/* Transformation Arrow */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-2">
              <Filter className="w-5 h-5" />
            </div>
            <div className="text-xs font-medium text-brand-600">Spark Transformations</div>
            <div className="text-[11px] text-content-tertiary">Lazy execution evaluated via DAG</div>
          </div>

          {/* Cleaned State */}
          <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-status-success">
              Cleaned Parquet Store
            </span>
            <div className="text-2xl font-bold font-mono text-status-success mt-1">
              {stats.cleanedRecordCount.toLocaleString()}
            </div>
            <div className="text-xs text-content-secondary mt-2 space-y-1">
              <div>✓ 100% Valid CustomerIDs & StockCodes</div>
              <div>✓ Quantity &gt; 0, UnitPrice &gt; 0 enforced</div>
              <div>✓ TotalAmount feature engineered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Steps Breakdown */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <h3 className="text-sm font-semibold text-content-primary mb-3">
          Detailed Spark Transformation Steps
        </h3>

        <div className="space-y-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-md border border-border-subtle hover:border-border-strong transition-all bg-surface-muted/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-content-primary">{s.title}</h4>
                    <p className="text-[11px] text-content-secondary mt-0.5">{s.description}</p>
                  </div>
                </div>

                {s.dropped > 0 && (
                  <span className="text-[11px] font-mono font-medium text-status-warning bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                    -{s.dropped.toLocaleString()} rows
                  </span>
                )}
                {s.dropped === 0 && (
                  <span className="text-[11px] font-mono font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    +1 Column Added
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pt-2.5 border-t border-border-subtle">
                <div className="font-mono text-[11px] text-content-primary bg-white px-2.5 py-1 rounded border border-border-subtle overflow-x-auto max-w-full">
                  <code>val cleanDF = {s.code}</code>
                </div>
                <div className="text-[11px] text-content-secondary italic">
                  {s.impact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Spark Code Snippet Box */}
      <div className="bg-[#1E1E1E] text-white rounded-lg p-5 shadow-card font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-700 mb-3">
          <div className="flex items-center gap-2 text-gray-300">
            <Code className="w-4 h-4 text-brand-500" />
            <span>Spark Scala Preprocessing Implementation (DataCleaner.scala)</span>
          </div>
          <span className="text-[11px] text-gray-400">Spark 3.5.1 API</span>
        </div>
        <pre className="text-gray-300 overflow-x-auto leading-relaxed">
{`// 1. Ingest raw CSV with schema inference
val rawDF = spark.read
  .option("header", "true")
  .option("inferSchema", "true")
  .csv(inputCsvPath)

// 2. Filter missing CustomerID and StockCode
val cleanDF = rawDF
  .filter(col("CustomerID").isNotNull && col("CustomerID") =!= "")
  .filter(col("StockCode").isNotNull && col("StockCode") =!= "")

// 3. Filter valid Quantity and UnitPrice (> 0)
val cleanedData = cleanDF
  .filter(col("Quantity") > 0)
  .filter(col("UnitPrice") > 0)

// 4. Drop duplicate transactions
val finalDF = cleanedData.dropDuplicates()

// 5. Feature Engineering: Derive TotalAmount
val transactionDF = finalDF.withColumn(
  "TotalAmount",
  round(col("Quantity") * col("UnitPrice"), 2)
)

// 6. Cache to Parquet for low-latency downstream queries
transactionDF.write
  .mode("overwrite")
  .parquet("data/processed/clean_transactions.parquet")`}
        </pre>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onNavigateToAnalytics}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium shadow-subtle transition-all cursor-pointer"
        >
          <span>Proceed to Spark SQL Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
