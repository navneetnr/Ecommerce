import React from 'react';
import { Cpu, Server, HardDrive, Terminal, CheckCircle2, BookOpen } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Cluster Runtime Specifications */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle mb-4">
          <Server className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-content-primary">
            Cluster Computing Runtime Specifications
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-surface-muted rounded-md border border-border-subtle space-y-2">
            <div className="flex justify-between">
              <span className="text-content-secondary">Spark Engine:</span>
              <span className="font-mono font-bold text-content-primary">Apache Spark 3.5.1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">Language:</span>
              <span className="font-mono font-medium text-content-primary">Scala 2.12.18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">Java Virtual Machine:</span>
              <span className="font-mono font-medium text-content-primary">Java 17 LTS (HotSpot 64-Bit)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">Execution Master:</span>
              <span className="font-mono font-bold text-brand-600">local[*] (16 Worker Threads)</span>
            </div>
          </div>

          <div className="p-3 bg-surface-muted rounded-md border border-border-subtle space-y-2">
            <div className="flex justify-between">
              <span className="text-content-secondary">Windows Hadoop Native:</span>
              <span className="font-mono text-status-success font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                C:\winutils\bin\winutils.exe
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">Data Storage Format:</span>
              <span className="font-mono font-medium text-content-primary">Apache Parquet (Snappy)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">API Service:</span>
              <span className="font-mono font-medium text-content-primary">JVM REST Controller (Port 8080)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-content-secondary">Frontend Build:</span>
              <span className="font-mono font-medium text-content-primary">Vite 6 + React 18 + TypeScript</span>
            </div>
          </div>
        </div>
      </div>

      {/* INT315 Academic Syllabus Checklist */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle mb-4">
          <BookOpen className="w-4 h-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-content-primary">
            INT315: Cluster Computing Learning Objectives Checklist
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5 p-2 rounded bg-surface-muted/50 border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary">1. Distributed Data Ingestion & Schema Inference:</strong>
              <p className="text-content-secondary mt-0.5">
                Ingested the 541,909-record UCI Online Retail dataset via Spark DataFrame API with schema validation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded bg-surface-muted/50 border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary">2. Distributed Data Cleaning & Deduplication:</strong>
              <p className="text-content-secondary mt-0.5">
                Removed null CustomerIDs/StockCodes, eliminated negative values, dropped duplicates, and computed TotalAmount.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded bg-surface-muted/50 border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary">3. Spark SQL Analytics:</strong>
              <p className="text-content-secondary mt-0.5">
                Executed groupBy, aggregate sums, sorting, and windowing over partitions with Catalyst optimization.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded bg-surface-muted/50 border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary">4. Graph-Parallel Computing with GraphX:</strong>
              <p className="text-content-secondary mt-0.5">
                Built bipartite Customer-Product graph, computed In/Out degree metrics, and executed PageRank (tol=0.001).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded bg-surface-muted/50 border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary">5. Distributed Machine Learning (MLlib ALS):</strong>
              <p className="text-content-secondary mt-0.5">
                Trained Alternating Least Squares with StringIndexer ID mapping, evaluated RMSE on holdout test set.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 rounded bg-surface-muted/50 border border-border-subtle">
            <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary">6. Scalability & Execution Profiling:</strong>
              <p className="text-content-secondary mt-0.5">
                Measured empirical runtime using System.nanoTime() across 10k, 50k, 100k, and 541k record tiers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
