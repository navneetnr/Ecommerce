import React, { useState } from 'react';
import { Network, Award, GitBranch, Info, Filter, Zap, Share2 } from 'lucide-react';
import { GraphMetrics } from '../types';

interface GraphViewProps {
  metrics: GraphMetrics;
}

export const CustomerProductGraphView: React.FC<GraphViewProps> = ({ metrics }) => {
  const [selectedNode, setSelectedNode] = useState<any | null>(metrics.nodes[0] || null);
  const [filterType, setFilterType] = useState<'all' | 'customer' | 'product'>('all');

  const filteredNodes = metrics.nodes.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  // Layout node coordinates in a circular / bipartite arrangement for SVG visualization
  const width = 640;
  const height = 360;
  const customers = metrics.nodes.filter((n) => n.type === 'customer');
  const products = metrics.nodes.filter((n) => n.type === 'product');

  const customerYSpacing = height / (customers.length + 1);
  const productYSpacing = height / (products.length + 1);

  const nodePositions: Record<string, { x: number; y: number }> = {};
  customers.forEach((c, idx) => {
    nodePositions[c.id] = { x: 120, y: (idx + 1) * customerYSpacing };
  });
  products.forEach((p, idx) => {
    nodePositions[p.id] = { x: 520, y: (idx + 1) * productYSpacing };
  });

  return (
    <div className="space-y-6">
      {/* Graph Metrics Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Total Graph Vertices</span>
            <Network className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-xl font-bold font-mono text-content-primary">
            {metrics.totalVertices.toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            {metrics.customerVertices.toLocaleString()} Users + {metrics.productVertices.toLocaleString()} Items
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Total Graph Edges</span>
            <GitBranch className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-xl font-bold font-mono text-brand-600">
            {metrics.totalEdges.toLocaleString()}
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            PURCHASED directed relations
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>Graph Structure</span>
            <Share2 className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-xl font-bold text-content-primary">
            Bipartite Graph
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Customer Vertices ↔ Product Vertices
          </div>
        </div>

        <div className="bg-surface-card border border-border-subtle rounded-lg p-4 shadow-card">
          <div className="text-xs text-content-secondary mb-1 flex items-center justify-between">
            <span>GraphX Algorithm</span>
            <Award className="w-4 h-4 text-status-warning" />
          </div>
          <div className="text-xl font-bold text-status-warning font-mono">
            PageRank (tol=0.001)
          </div>
          <div className="text-[11px] text-content-secondary mt-1">
            Iterative Pregel message passing
          </div>
        </div>
      </div>

      {/* Main Interactive Graph Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Interactive Bipartite Canvas */}
        <div className="lg:col-span-2 bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-content-primary">
                Interactive Bipartite Topology (GraphX Subgraph)
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                Customers (left, blue) ➔ Products (right, emerald). Click any vertex to inspect degrees.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-muted p-1 rounded border border-border-subtle text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded ${
                  filterType === 'all' ? 'bg-white font-medium shadow-subtle text-content-primary' : 'text-content-secondary'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('customer')}
                className={`px-2 py-0.5 rounded ${
                  filterType === 'customer' ? 'bg-white font-medium shadow-subtle text-brand-600' : 'text-content-secondary'
                }`}
              >
                Customers
              </button>
              <button
                onClick={() => setFilterType('product')}
                className={`px-2 py-0.5 rounded ${
                  filterType === 'product' ? 'bg-white font-medium shadow-subtle text-status-success' : 'text-content-secondary'
                }`}
              >
                Products
              </button>
            </div>
          </div>

          <div className="w-full h-80 bg-surface-muted/40 rounded-lg border border-border-subtle relative flex items-center justify-center overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full select-none">
              {/* Edges */}
              {metrics.edges.map((e, idx) => {
                const src = nodePositions[e.source];
                const dst = nodePositions[e.target];
                if (!src || !dst) return null;
                const isConnected = selectedNode && (selectedNode.id === e.source || selectedNode.id === e.target);

                return (
                  <line
                    key={idx}
                    x1={src.x}
                    y1={src.y}
                    x2={dst.x}
                    y2={dst.y}
                    stroke={isConnected ? '#315CBB' : '#E5E7EB'}
                    strokeWidth={isConnected ? 2.5 : 1}
                    strokeOpacity={isConnected ? 0.9 : 0.6}
                    strokeDasharray={isConnected ? 'none' : '2,2'}
                  />
                );
              })}

              {/* Customer Nodes (Left column) */}
              {customers.map((c) => {
                const pos = nodePositions[c.id];
                const isSelected = selectedNode?.id === c.id;
                return (
                  <g
                    key={c.id}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedNode(c)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 16 : 12}
                      fill={isSelected ? '#315CBB' : '#EEF4FF'}
                      stroke="#315CBB"
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text
                      x={pos.x - 20}
                      y={pos.y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fontWeight={isSelected ? '600' : '400'}
                      fill="#171717"
                    >
                      {c.label}
                    </text>
                  </g>
                );
              })}

              {/* Product Nodes (Right column) */}
              {products.map((p) => {
                const pos = nodePositions[p.id];
                const isSelected = selectedNode?.id === p.id;
                return (
                  <g
                    key={p.id}
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedNode(p)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isSelected ? 16 : 12}
                      fill={isSelected ? '#15803D' : '#F0FDF4'}
                      stroke="#15803D"
                      strokeWidth={isSelected ? 3 : 1.5}
                    />
                    <text
                      x={pos.x + 20}
                      y={pos.y + 4}
                      textAnchor="start"
                      fontSize="10"
                      fontWeight={isSelected ? '600' : '400'}
                      fill="#171717"
                    >
                      {p.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-content-secondary mt-3">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                Customer Vertices (ID Space 0x00)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-status-success" />
                Product Vertices (ID Space 0x80)
              </span>
            </div>
            <span>Click any node to inspect PageRank</span>
          </div>
        </div>

        {/* Selected Vertex Inspector Card */}
        <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-4">
              <h3 className="text-sm font-semibold text-content-primary">Vertex Inspector</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-muted text-content-secondary border border-border-subtle">
                GraphX Property
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] text-content-secondary uppercase font-semibold">
                    Vertex Identifier
                  </span>
                  <div className="text-base font-bold font-mono text-content-primary mt-0.5">
                    {selectedNode.id}
                  </div>
                  <div className="text-xs text-content-secondary mt-0.5">
                    {selectedNode.label}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle">
                  <div className="p-3 bg-surface-muted rounded-md border border-border-subtle">
                    <span className="text-[10px] font-semibold text-content-secondary uppercase">
                      Degree Centrality
                    </span>
                    <div className="text-lg font-bold font-mono text-content-primary mt-1">
                      {selectedNode.degree}
                    </div>
                    <span className="text-[10px] text-content-tertiary">Direct relationships</span>
                  </div>

                  <div className="p-3 bg-surface-muted rounded-md border border-border-subtle">
                    <span className="text-[10px] font-semibold text-content-secondary uppercase">
                      PageRank Score
                    </span>
                    <div className="text-lg font-bold font-mono text-brand-600 mt-1">
                      {selectedNode.pageRank.toFixed(3)}
                    </div>
                    <span className="text-[10px] text-content-tertiary">Influence index</span>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-brand-50/60 border border-brand-100 text-xs text-content-secondary">
                  <div className="font-semibold text-brand-700 mb-0.5">Cluster Significance</div>
                  {selectedNode.type === 'customer'
                    ? 'High-degree customer serving as an essential connector in collaborative filtering clusters.'
                    : 'High PageRank product with substantial inbound purchase flow across heterogeneous customer cohorts.'}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-xs text-content-secondary">
                Select a vertex in the graph to view attributes
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border-subtle text-[11px] text-content-tertiary font-mono">
            GraphX Pregel: tol=0.001, resetProb=0.15
          </div>
        </div>
      </div>

      {/* Degree & PageRank Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Degree Products */}
        <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-content-primary">
                Top Products by Degree Centrality
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                val productDegree = graph.degrees.join(graph.vertices)
              </p>
            </div>
            <span className="text-xs font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 font-medium">
              graph.degrees
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-content-secondary font-sans font-medium">
                  <th className="pb-2">StockCode</th>
                  <th className="pb-2 font-sans">Description</th>
                  <th className="pb-2 text-right">Degree</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-[11px]">
                {metrics.topDegreeProducts.map((p) => (
                  <tr key={p.stockCode} className="hover:bg-surface-hover/50">
                    <td className="py-2.5 font-bold text-brand-600">{p.stockCode}</td>
                    <td className="py-2.5 font-sans text-content-primary truncate max-w-xs">{p.description}</td>
                    <td className="py-2.5 text-right font-bold text-content-primary">
                      {p.degree.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top PageRank Products */}
        <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-content-primary">
                Top Products by PageRank Score
              </h3>
              <p className="text-xs text-content-secondary mt-0.5">
                val ranks = graph.pageRank(0.001).vertices
              </p>
            </div>
            <span className="text-xs font-mono text-status-warning bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-medium">
              graph.pageRank(0.001)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-content-secondary font-sans font-medium">
                  <th className="pb-2">StockCode</th>
                  <th className="pb-2 font-sans">Description</th>
                  <th className="pb-2 text-right">PageRank Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-[11px]">
                {metrics.topPageRankProducts.map((p) => (
                  <tr key={p.stockCode} className="hover:bg-surface-hover/50">
                    <td className="py-2.5 font-bold text-status-warning">{p.stockCode}</td>
                    <td className="py-2.5 font-sans text-content-primary truncate max-w-xs">{p.description}</td>
                    <td className="py-2.5 text-right font-bold text-status-success">
                      {p.score.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
