# Intelligent E-Commerce Analytics & Recommendation System
### Academic Capstone Project for INT315: Cluster Computing (B.Tech CSE)

A distributed, enterprise-grade e-commerce analytics and machine learning platform built with **Apache Spark 3.5.1**, **Scala 2.12**, **Spark SQL**, **Spark GraphX**, **Spark MLlib (ALS)**, and a modern **React 18 + Vite + TypeScript + Tailwind CSS** SaaS dashboard.

---

## 1. Project Overview & Architecture

This system demonstrates the end-to-end distributed big-data lifecycle on real-world e-commerce transaction data (**UCI Online Retail dataset**, 541,909 transactions).

```
E-Commerce CSV Dataset (541k records)
        ↓
Data Ingestion (Spark Schema Inference)
        ↓
Apache Spark DataFrame Preprocessing (Null & Duplicate Filtering)
        ↓
Feature Engineering (TotalAmount = Quantity × UnitPrice)
        ↓
Distributed Analytics (Spark SQL Catalyst Optimizer)
        ↓
    ┌───────────────────────────────┬───────────────────────────────┐
    ↓                               ↓                               ↓
 Spark GraphX                  Spark MLlib                    Scalability
Customer-Product              Alternating Least               Performance
 Bipartite Graph                   Squares                     Benchmark
(Degree & PageRank)           (Latent Factors)             (10k ➔ 541k slices)
    ↓                               ↓                               ↓
    └───────────────────────────────┼───────────────────────────────┘
                                    ↓
                         JVM REST API Controller
                                    ↓
                 React 18 + TypeScript SaaS Dashboard
```

---

## 2. Directory Structure

```
d:\Ecommerce/
├── frontend/                               # Premium SaaS Analytics Dashboard
│   ├── index.html
│   ├── package.json                        # React 18, Vite, Tailwind CSS, Recharts, Lucide React
│   ├── tailwind.config.js                  # Linear / Stripe inspired calm neutral palette
│   └── src/
│       ├── types/                          # TypeScript DTO models
│       ├── api/apiClient.ts                # REST API client & actual Spark results fallback
│       ├── components/                     # Sidebar, Header, MetricCard, Navigation
│       └── views/                          # 11 Modular Analytics Views:
│           ├── OverviewDashboard.tsx       # KPI cards, revenue trends, cluster state
│           ├── DataManagement.tsx          # CSV preview, schema inspector, null audit
│           ├── DataPreprocessingView.tsx   # Before/after cleaning stats, feature formula
│           ├── EcommerceAnalyticsView.tsx  # Top products, customer spend, country sales
│           ├── ProductInsightsView.tsx     # Pareto 80/20, SKU velocity tiers
│           ├── CustomerInsightsView.tsx    # Customer lifetime spend & basket diversity
│           ├── CustomerProductGraphView.tsx# GraphX bipartite topology, Degree & PageRank
│           ├── RecommendationsView.tsx     # ALS customer selector, predicted scores
│           ├── ModelEvaluationView.tsx     # RMSE evaluation, hyperparameters, formulas
│           ├── PerformanceMonitorView.tsx  # Scalability latency curves (10k-541k)
│           └── SettingsView.tsx            # JVM, SparkContext, INT315 syllabus checklist
│
├── spark-engine/                           # Pure Apache Spark 3.5.1 + Scala 2.12 Engine
│   ├── pom.xml                             # Maven build with scala-maven-plugin
│   └── src/main/scala/com/ecommerce/analytics/
│       ├── SparkApp.scala                  # Main CLI pipeline matching syllabus PDF
│       ├── config/SparkConfig.scala        # SparkSession factory & Windows NativeIO bypass
│       ├── ingestion/
│       │   └── DataCleaner.scala           # Ingestion, null filter, deduplication, Parquet
│       ├── sql/
│       │   └── AnalyticsQueries.scala      # Top products, customers, country revenue
│       ├── graph/
│       │   └── GraphXEngine.scala          # Bipartite Customer-Product graph & PageRank
│       ├── ml/
│       │   └── ALSEngine.scala             # StringIndexer, 80/20 split, ALS model, RMSE
│       ├── benchmark/
│       │   └── ScalabilityBenchmark.scala  # Execution time profiler using System.nanoTime()
│       └── server/
│           └── RestApiServer.scala         # High-speed JVM REST API server (Port 8080)
│
├── data/
│   ├── raw/online_retail.csv               # Genuine UCI Online Retail dataset (45 MB)
│   ├── sample/online_retail_sample.csv     # 500-record test sample
│   └── processed/clean_transactions.parquet# Optimized columnar storage output
│
├── run-all.bat                             # One-click launcher (API + Dashboard)
├── run-spark-cli.bat                       # CLI execution script (Spark batch output)
├── run-spark-server.bat                    # Standalone REST API launcher
└── run-frontend.bat                        # Standalone React frontend launcher
```

---

## 3. How to Run the Project

### Option A: Complete Full-Stack SaaS Application (Recommended)
Double-click `run-all.bat` or run from terminal:
```cmd
d:\Ecommerce\run-all.bat
```
This automatically launches:
1. **Spark REST API Service:** `http://localhost:8080/api/status`
2. **React SaaS Dashboard:** `http://localhost:5173`

### Option B: Standalone Apache Spark Batch CLI (Lab Viva / Academic Evaluation)
To run the full Spark batch execution pipeline and output the academic report to console:
```cmd
d:\Ecommerce\run-spark-cli.bat
```

---

## 4. Live Empirical Results (UCI Online Retail Dataset)

Below are the actual numbers produced by Apache Spark 3.5.1 running on the dataset:

```
==========================================================
             E-COMMERCE ANALYTICS FINAL REPORT            
==========================================================
Total Transactions         : 541,909
Total Cleaned Records      : 392,692
Total Customers (Vertices) : 4,338
Total Products  (Vertices) : 3,665
Total Revenue Generated    : $8,887,208.89
Average Order Value        : $479.56
----------------------------------------------------------
GraphX Analysis:
Most Connected Product     : 85123A (WHITE HANGING HEART T-LIGHT HOLDER, Degree: 2,023)
Highest PageRank Product   : 22423 (REGENCY CAKESTAND 3 TIER, PageRank: 17.8008)
----------------------------------------------------------
Machine Learning (Spark MLlib):
Algorithm                  : Alternating Least Squares (ALS)
Training Data Ratio        : 80%
Testing Data Ratio         : 20%
Model Evaluation RMSE      : 33.5037
----------------------------------------------------------
Total Execution Time       : 40.94 seconds
==========================================================
```

---

## 5. INT315: Cluster Computing Concepts Demonstrated

1. **Lazy Evaluation & Directed Acyclic Graph (DAG):**
   Transformations (`filter`, `select`, `withColumn`) build the Logical Plan. Spark's Catalyst Optimizer produces whole-stage Java bytecode (Tungsten engine). Physical actions (`count`, `show`, `collect`) trigger DAG execution across stages.
2. **Partitioning & Shuffling:**
   Distributed `groupBy("CustomerID")` and joins trigger HashPartitioner shuffles across executor threads, demonstrating network/memory trade-offs.
3. **Graph-Parallel Computation (Pregel / GraphX):**
   Models transactions as a bipartite graph: Customers (Vertices) $\leftrightarrow$ Products (Vertices) connected by `PURCHASED` edges. Executes iterative message passing to compute Degree centrality and PageRank scores.
4. **Distributed Collaborative Filtering (ALS):**
   Decomposes the sparse interaction matrix $R \approx U \times V^T$ into low-rank latent user factors ($U$) and item factors ($V$) in parallel across partitions, avoiding single-machine memory saturation.
5. **Scalability Profiling:**
   Empirically benchmarks execution times across dataset sizes (10k, 50k, 100k, 541k records) using `System.nanoTime()`.
