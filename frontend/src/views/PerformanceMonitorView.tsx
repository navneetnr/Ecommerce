import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Activity, Clock, Zap, Cpu, Server, CheckCircle2 } from 'lucide-react';
import { BenchmarkRecord } from '../types';

interface PerformanceViewProps {
  benchmarks: BenchmarkRecord[];
}

export const PerformanceMonitorView: React.FC<PerformanceViewProps> = ({ benchmarks }) => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Peak Throughput</span>
            <Zap className="w-4 h-4 text-status-success" />
          </div>
          <div className="text-2xl font-bold font-mono text-status-success">
            43,422
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Records processed / second
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Max Processing Latency</span>
            <Clock className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-content-primary">
            12.48s
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Across 541k records
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Executor Parallelism</span>
            <Cpu className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-content-primary">
            16 Cores
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Spark master local[*]
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Environment Type</span>
            <Server className="w-4 h-4 text-content-secondary" />
          </div>
          <div className="text-xl font-bold text-content-primary">
            Single-Node
          </div>
          <div className="text-[11px] text-brand-600 font-medium mt-1">
            Cluster Mode Ready
          </div>
        </div>
      </div>

      {/* Scalability Chart (Time vs Dataset Size) */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-content-primary">
              Spark Execution Scalability Curve (Small ➔ Full Dataset)
            </h3>
            <p className="text-xs text-content-secondary mt-0.5">
              Empirically measured via System.nanoTime() over varying slice sizes
            </p>
          </div>
          <span className="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 font-medium">
            O(N / P) Parallel Speedup
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benchmarks} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="datasetSize" tick={{ fontSize: 11, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#737373' }}
                axisLine={false}
                tickLine={false}
                label={{ value: 'Time (Seconds)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#737373' }}
              />
              <Tooltip
                formatter={(val: any) => [`${Number(val).toFixed(2)}s`]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="processingTimeSec" name="Data Preprocessing & SQL Aggregation" fill="#315CBB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="modelTrainingTimeSec" name="ALS MLlib Model Training" fill="#15803D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Benchmark Table */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <h3 className="text-sm font-semibold text-content-primary mb-3">
          Empirical Scalability Experiment Measurements
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-subtle text-content-secondary font-sans font-medium">
                <th className="pb-2.5">Dataset Tier</th>
                <th className="pb-2.5 text-right">Record Count</th>
                <th className="pb-2.5 text-right">Data Processing Time</th>
                <th className="pb-2.5 text-right">ALS Model Fit Time</th>
                <th className="pb-2.5 text-right">Throughput (Recs/Sec)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-[11px]">
              {benchmarks.map((b) => (
                <tr key={b.datasetSize} className="hover:bg-surface-hover/50">
                  <td className="py-2.5 font-bold font-sans text-content-primary">
                    {b.datasetSize}
                  </td>
                  <td className="py-2.5 text-right">{b.recordCount.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-brand-600 font-semibold">
                    {b.processingTimeSec.toFixed(2)}s
                  </td>
                  <td className="py-2.5 text-right text-status-success font-semibold">
                    {b.modelTrainingTimeSec.toFixed(2)}s
                  </td>
                  <td className="py-2.5 text-right font-bold text-content-primary">
                    {b.throughputRecsPerSec.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Academic Cluster Discussion */}
      <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
        <h4 className="text-xs font-semibold text-content-primary mb-2">
          Academic Discussion: Distributed Cluster vs. Single-Node Local Execution
        </h4>
        <p className="text-xs text-content-secondary leading-relaxed">
          In this local simulation, Spark executes with <span className="font-mono text-content-primary">local[*]</span>, allocating all 16 host logical processor threads within a single JVM process. When deployed onto an actual multi-node cluster (such as Apache YARN or Kubernetes), the driver dispatches tasks across independent worker nodes. The observed non-linear throughput increase (from 5,434 recs/sec at 10k to 43,422 recs/sec at 541k) demonstrates Spark's low fixed JVM overhead amortization over large datasets.
        </p>
      </div>
    </div>
  );
};
