import { FormEvent, useEffect, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { apiClient, DEFAULT_BENCHMARKS, DEFAULT_COUNTRY_SALES, DEFAULT_GRAPH_METRICS, DEFAULT_MODEL_EVALUATION, DEFAULT_OVERVIEW, DEFAULT_PREPROCESSING_STATS, DEFAULT_REVENUE_TREND, DEFAULT_TOP_CUSTOMERS, DEFAULT_TOP_PRODUCTS } from './api/apiClient';
import type { BenchmarkRecord, CountrySale, CustomerRecommendationResult, GraphMetrics, ModelEvaluation, OverviewMetrics, PreprocessingStats, RevenueTrend, TopCustomer, TopProduct } from './types';

type Page = 'Overview' | 'Data' | 'Sales' | 'GraphX' | 'Recommendations' | 'Evaluation' | 'Performance' | 'Environment';
const pages: Page[] = ['Overview', 'Data', 'Sales', 'GraphX', 'Recommendations', 'Evaluation', 'Performance', 'Environment'];
const money = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 2 }).format(n);
const number = (n: number) => n.toLocaleString('en-GB');
const sampleRows = [
  ['536365', '85123A', 'WHITE HANGING HEART T-LIGHT HOLDER', 6, '01/12/2010 08:26', 2.55, '17850', 'United Kingdom'],
  ['536365', '71053', 'WHITE METAL LANTERN', 6, '01/12/2010 08:26', 3.39, '17850', 'United Kingdom'],
  ['536365', '84406B', 'CREAM CUPID HEARTS COAT HANGER', 8, '01/12/2010 08:26', 2.75, '17850', 'United Kingdom'],
];
const schema = [
  ['InvoiceNo', 'String', 'Invoice reference'], ['StockCode', 'String', 'Product identifier'],
  ['Description', 'String', 'Product name'], ['Quantity', 'Integer', 'Units in line item'],
  ['InvoiceDate', 'Timestamp', 'Date and time of purchase'], ['UnitPrice', 'Double', 'Price per unit (GBP)'],
  ['CustomerID', 'String', 'Customer identifier'], ['Country', 'String', 'Customer country'],
];

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <section className="metric"><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></section>;
}

function DataTable({ headers, rows, right = [] }: { headers: string[]; rows: (string | number)[][]; right?: number[] }) {
  return <div className="table-scroll"><table><thead><tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td className={right.includes(j) ? 'numeric' : ''} key={j}>{v}</td>)}</tr>)}</tbody></table></div>;
}

export default function App() {
  const [page, setPage] = useState<Page>('Overview');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [metrics, setMetrics] = useState<OverviewMetrics>(DEFAULT_OVERVIEW);
  const [trend, setTrend] = useState<RevenueTrend[]>(DEFAULT_REVENUE_TREND);
  const [products, setProducts] = useState<TopProduct[]>(DEFAULT_TOP_PRODUCTS);
  const [customers, setCustomers] = useState<TopCustomer[]>(DEFAULT_TOP_CUSTOMERS);
  const [countries, setCountries] = useState<CountrySale[]>(DEFAULT_COUNTRY_SALES);
  const [prep, setPrep] = useState<PreprocessingStats>(DEFAULT_PREPROCESSING_STATS);
  const [graph, setGraph] = useState<GraphMetrics>(DEFAULT_GRAPH_METRICS);
  const [evaluation, setEvaluation] = useState<ModelEvaluation>(DEFAULT_MODEL_EVALUATION);
  const [benchmarks, setBenchmarks] = useState<BenchmarkRecord[]>(DEFAULT_BENCHMARKS);
  const [customerId, setCustomerId] = useState(DEFAULT_TOP_CUSTOMERS[0].customerId);
  const [recommendation, setRecommendation] = useState<CustomerRecommendationResult | null>(null);

  const loadData = async () => {
    const [o, rt, tp, tc, cs, ps, gm, me, bm] = await Promise.all([
      apiClient.getOverview(), apiClient.getRevenueTrend(), apiClient.getTopProducts(),
      apiClient.getTopCustomers(), apiClient.getCountrySales(), apiClient.getPreprocessingStats(),
      apiClient.getGraphMetrics(), apiClient.getModelEvaluation(), apiClient.getBenchmarks(),
    ]);
    setMetrics(o); setTrend(rt); setProducts(tp); setCustomers(tc); setCountries(cs);
    setPrep(ps); setGraph(gm); setEvaluation(me); setBenchmarks(bm);
  };

  useEffect(() => { void loadData(); }, []);
  useEffect(() => {
    if (page !== 'Recommendations') return;
    let active = true;
    apiClient.getCustomerRecommendations(customerId).then((result) => { if (active) setRecommendation(result); });
    return () => { active = false; };
  }, [page, customerId]);

  const runAnalysis = async () => {
    setBusy(true); setNotice('Spark is processing the dataset. This can take a few minutes on the first run.');
    try {
      const result = await apiClient.runPipelineBatch();
      await loadData();
      setNotice(`Spark workflow completed in ${result.durationSec} seconds. See the backend window for the run report.`);
    } catch {
      setNotice('Could not run Spark. Check that the backend is running and that the dataset path is correct.');
    } finally { setBusy(false); }
  };

  const openPage = (name: Page) => { setPage(name); };
  const pageTitle: Record<Page, string> = {
    Overview: 'Project overview', Data: 'Data and preprocessing', Sales: 'Sales analytics',
    GraphX: 'Customer-product graph', Recommendations: 'Product recommendations',
    Evaluation: 'ALS model evaluation', Performance: 'Scalability experiment', Environment: 'Runtime environment',
  };

  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#overview" onClick={(e) => { e.preventDefault(); openPage('Overview'); }}>
        <span className="brand-mark">EC</span><span><strong>E-commerce Analytics</strong><small>INT315 · Cluster Computing</small></span>
      </a>
      <div className="header-meta"><span className="status-dot" />Spark 3.5.1 <span className="header-separator">|</span> local[*]</div>
      <button className="primary-button" onClick={runAnalysis} disabled={busy}>{busy ? 'Running Spark…' : 'Run full analysis'}</button>
    </header>

    <nav className="main-nav" aria-label="Main navigation">
      {pages.map((item) => <button key={item} className={page === item ? 'nav-item selected' : 'nav-item'} onClick={() => openPage(item)}>{item}</button>)}
    </nav>

    <main className="page-content">
      <div className="page-heading"><div><div className="eyebrow">UCI Online Retail · December 2010 – December 2011</div><h1>{pageTitle[page]}</h1></div><div className="heading-note">541,909 raw invoice lines</div></div>
      {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss">×</button></div>}

      {page === 'Overview' && <>
        <div className="metrics-grid">
          <Metric label="Raw records" value={number(metrics.totalTransactions)} note="Rows in source CSV" />
          <Metric label="Clean records" value={number(metrics.totalRecordsProcessed)} note="After filtering and deduplication" />
          <Metric label="Customers" value={number(metrics.totalCustomers)} note="Distinct customer IDs" />
          <Metric label="Products" value={number(metrics.totalProducts)} note="Distinct stock codes" />
          <Metric label="Sales value" value={money(metrics.totalRevenue)} note="Quantity × unit price" />
          <Metric label="Average order value" value={money(metrics.averageOrderValue)} note="Revenue per invoice" />
        </div>
        <section className="panel">
          <div className="panel-heading"><div><h2>Analysis workflow</h2><p>Project stages from the source dataset to model evaluation</p></div></div>
          <ol className="workflow-list">
            <li><b>1</b><span><strong>Ingest and clean</strong><small>Handle missing data, invalid quantities, duplicates and feature creation</small></span></li>
            <li><b>2</b><span><strong>Spark SQL</strong><small>Product sales, customer spending and country summaries</small></span></li>
            <li><b>3</b><span><strong>GraphX</strong><small>Customer-product edges, degree analysis and PageRank</small></span></li>
            <li><b>4</b><span><strong>MLlib ALS</strong><small>Train/test split, recommendations and RMSE evaluation</small></span></li>
            <li><b>5</b><span><strong>Performance</strong><small>Compare processing time at increasing dataset sizes</small></span></li>
          </ol>
        </section>
        <div className="two-column">
          <section className="panel"><div className="panel-heading"><div><h2>Monthly sales</h2><p>Revenue grouped by invoice month (GBP)</p></div></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trend}><CartesianGrid stroke="#e7e9eb" vertical={false}/><XAxis dataKey="date" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `£${Math.round(v / 1000)}k`}/><Tooltip formatter={(v) => [money(Number(v)), 'Revenue']}/><Area dataKey="revenue" type="monotone" stroke="#456c8c" fill="#dce7ee"/></AreaChart></ResponsiveContainer></div></section>
          <section className="panel"><div className="panel-heading"><div><h2>Top products</h2><p>Ranked by total quantity sold</p></div><button className="text-button" onClick={() => setPage('Sales')}>All sales</button></div><DataTable headers={['Stock code', 'Product', 'Units']} rows={products.slice(0, 5).map((p) => [p.stockCode, p.description, number(p.totalQuantity)])} right={[2]}/></section>
        </div>
      </>}

      {page === 'Data' && <>
        <div className="metrics-grid compact"><Metric label="Source rows" value={number(prep.rawRecordCount)} note="Online Retail CSV"/><Metric label="Missing customer IDs" value={number(prep.missingCustomerCount)} note="Excluded before modeling"/><Metric label="Duplicate rows" value={number(prep.duplicateRecordCount)} note="Removed from cleaned data"/><Metric label="Clean rows" value={number(prep.cleanedRecordCount)} note="Saved as Parquet"/></div>
        <section className="panel"><div className="panel-heading"><div><h2>Source schema</h2><p>Fields expected by the Spark ingestion step</p></div></div><DataTable headers={['Column', 'Type', 'Description']} rows={schema}/></section>
        <section className="panel"><div className="panel-heading"><div><h2>Cleaning rules</h2><p>Transformations applied in DataCleaner.scala</p></div></div><ul className="rule-list"><li>Remove rows without CustomerID or StockCode.</li><li>Remove rows with Quantity or UnitPrice less than or equal to zero.</li><li>Drop duplicate rows.</li><li>Add TotalAmount as Quantity multiplied by UnitPrice.</li><li>Write cleaned transactions to Parquet for downstream analysis.</li></ul></section>
        <section className="panel"><div className="panel-heading"><div><h2>Raw row sample</h2><p>First invoice from the included dataset</p></div></div><DataTable headers={['Invoice', 'Stock code', 'Description', 'Qty', 'Date', 'Unit price', 'Customer', 'Country']} rows={sampleRows.map((r) => [r[0], r[1], r[2], r[3], r[4], money(Number(r[5])), r[6], r[7]])}/></section>
      </>}

      {page === 'Sales' && <>
        <section className="panel"><div className="panel-heading"><div><h2>Best-selling products</h2><p>Distributed aggregation by StockCode</p></div></div><DataTable headers={['Stock code', 'Description', 'Quantity', 'Revenue', 'Average unit price']} rows={products.map((p) => [p.stockCode, p.description, number(p.totalQuantity), money(p.totalRevenue), money(p.unitPrice)])} right={[2, 3, 4]}/></section>
        <div className="two-column"><section className="panel"><div className="panel-heading"><div><h2>Highest-spending customers</h2><p>Sum of transaction line amounts per customer</p></div></div><DataTable headers={['Customer', 'Country', 'Orders', 'Products', 'Spend']} rows={customers.slice(0, 8).map((c) => [c.customerId, c.country, number(c.totalTransactions), number(c.uniqueProducts), money(c.totalSpent)])} right={[2, 3, 4]}/></section><section className="panel"><div className="panel-heading"><div><h2>Sales by country</h2><p>Top countries by recorded revenue</p></div></div><DataTable headers={['Country', 'Orders', 'Customers', 'Revenue']} rows={countries.slice(0, 10).map((c) => [c.country, number(c.transactions), number(c.customers), money(c.revenue)])} right={[1, 2, 3]}/></section></div>
      </>}

      {page === 'GraphX' && <>
        <div className="metrics-grid compact"><Metric label="Vertices" value={number(graph.totalVertices)} note={`${number(graph.customerVertices)} customers + ${number(graph.productVertices)} products`}/><Metric label="Purchase edges" value={number(graph.totalEdges)} note="Customer-to-product links"/></div>
        <div className="two-column"><section className="panel"><div className="panel-heading"><div><h2>Products by degree</h2><p>Number of purchase links in the bipartite graph</p></div></div><DataTable headers={['Stock code', 'Product', 'Degree']} rows={graph.topDegreeProducts.map((p) => [p.stockCode, p.description, number(p.degree)])} right={[2]}/></section><section className="panel"><div className="panel-heading"><div><h2>Products by PageRank</h2><p>GraphX PageRank score (tolerance 0.001)</p></div></div><DataTable headers={['Stock code', 'Product', 'Score']} rows={graph.topPageRankProducts.map((p) => [p.stockCode, p.description, p.score.toFixed(4)])} right={[2]}/></section></div>
        <section className="panel"><h2>Graph model</h2><p className="body-copy">Each customer and product is a vertex. Every retained transaction line creates a directed purchase edge from its customer to its product. Degree ranks products by connections; PageRank estimates importance from the surrounding network.</p><code className="code-line">CustomerID → Customer vertex → PURCHASED edge → Product vertex</code></section>
      </>}

      {page === 'Recommendations' && <>
        <section className="panel"><div className="form-row"><div><h2>Choose a customer</h2><p>Request the ALS recommendations for a customer ID</p></div><form onSubmit={(e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const value = new FormData(e.currentTarget).get('customer')?.toString().trim(); if (value) setCustomerId(value); }}><input aria-label="Customer ID" name="customer" defaultValue={customerId}/><button className="secondary-button">Show recommendations</button></form></div></section>
        {recommendation && <><section className="panel"><div className="panel-heading"><div><h2>Recommended products for {recommendation.customerId}</h2><p>Top five model scores returned for this customer</p></div></div><DataTable headers={['Rank', 'Stock code', 'Product', 'Predicted rating', 'Unit price']} rows={recommendation.recommendations.map((p, i) => [i + 1, p.stockCode, p.description, p.predictedRating.toFixed(2), money(p.unitPrice)])} right={[0, 3, 4]}/></section><section className="panel"><h2>ALS method</h2><p className="body-copy">The model uses customer and product identifiers encoded as integer indices. Purchase quantity is the interaction value. Ratings are split into 80% training and 20% test data, then ALS factorizes the user-item matrix to score likely products.</p></section></>}
      </>}

      {page === 'Evaluation' && <>
        <div className="metrics-grid compact"><Metric label="RMSE" value={evaluation.rmse.toFixed(4)} note="Lower is better"/><Metric label="Training records" value={number(evaluation.trainRecords)} note="80% training partition"/><Metric label="Test records" value={number(evaluation.testRecords)} note="20% holdout partition"/><Metric label="Training time" value={`${evaluation.trainingTimeSec.toFixed(2)} s`} note="ALS model fit"/></div>
        <section className="panel"><div className="panel-heading"><div><h2>ALS configuration</h2><p>Alternating Least Squares collaborative filtering</p></div></div><DataTable headers={['Parameter', 'Value']} rows={[["Rank", evaluation.rank], ['Maximum iterations', evaluation.maxIter], ['Regularization', evaluation.regParam], ['Cold start strategy', evaluation.coldStartStrategy], ['Split seed', 42]]}/></section>
        <section className="panel"><h2>Metric definition</h2><p className="body-copy">RMSE is the square root of the average squared difference between observed purchase quantities and model predictions on the held-out test set. The evaluator drops cold-start predictions before calculating the score.</p><code className="code-line">RMSE = sqrt(mean((actual rating − predicted rating)²))</code></section>
      </>}

      {page === 'Performance' && <>
        <section className="panel"><div className="panel-heading"><div><h2>Processing time by data size</h2><p>Pipeline benchmark measurements in seconds</p></div></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={benchmarks}><CartesianGrid stroke="#e7e9eb" vertical={false}/><XAxis dataKey="datasetSize" tick={{ fontSize: 11 }}/><YAxis tick={{ fontSize: 11 }}/><Tooltip/><Legend/><Bar dataKey="processingTimeSec" name="Data processing" fill="#557890"/><Bar dataKey="modelTrainingTimeSec" name="ALS training" fill="#9aaebd"/></BarChart></ResponsiveContainer></div></section>
        <section className="panel"><div className="panel-heading"><div><h2>Benchmark details</h2><p>Record count, elapsed time and throughput</p></div></div><DataTable headers={['Dataset size', 'Records', 'Processing time', 'ALS time', 'Records / second']} rows={benchmarks.map((b) => [b.datasetSize, number(b.recordCount), `${b.processingTimeSec.toFixed(2)} s`, `${b.modelTrainingTimeSec.toFixed(2)} s`, number(b.throughputRecsPerSec)])} right={[1, 2, 3, 4]}/></section>
      </>}

      {page === 'Environment' && <>
        <section className="panel"><div className="panel-heading"><div><h2>Software and execution settings</h2><p>Current local development configuration</p></div></div><DataTable headers={['Component', 'Configuration']} rows={[["Apache Spark", '3.5.1'], ['Scala', '2.12.18'], ['Java', '17'], ['Execution master', 'local[*]'], ['Data storage', 'Parquet'], ['Frontend', 'React + TypeScript + Vite'], ['API', 'JVM HTTP server · port 8080']]}/></section>
        <section className="panel"><h2>Project files</h2><p className="body-copy">Raw CSV: <code>data/raw/online_retail.csv</code><br/>Processed data: <code>data/processed/clean_transactions.parquet</code><br/>Spark source: <code>spark-engine/src/main/scala</code><br/>Dashboard source: <code>frontend/src</code></p></section>
      </>}

      <footer className="page-footer">INT315 Cluster Computing · E-commerce analytics and recommendation system</footer>
    </main>
  </div>;
}
