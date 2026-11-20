import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, Search, Info } from 'lucide-react';

export default function GraphCanvas({ nodes = [], edges = [], onSelectNode }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Category Color Map
  const categoryColors = {
    Administration: { bg: '#3b82f6', border: '#60a5fa', text: '#ffffff' },
    Library: { bg: '#8b5cf6', border: '#a78bfa', text: '#ffffff' },
    Examination: { bg: '#f59e0b', border: '#fbbf24', text: '#ffffff' },
    'HR & Policies': { bg: '#10b981', border: '#34d399', text: '#ffffff' },
    Academic: { bg: '#06b6d4', border: '#22d3ee', text: '#ffffff' },
    General: { bg: '#64748b', border: '#94a3b8', text: '#ffffff' },
  };

  const handleMouseDown = (e) => {
    // If clicking directly on container background
    if (e.target.tagName === 'svg' || e.target.classList.contains('graph-bg')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta) => {
    setScale((prev) => Math.max(0.4, Math.min(2.5, prev + delta)));
  };

  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    if (onSelectNode) onSelectNode(node);
  };

  // Node filtering
  const filteredNodes = nodes.filter((node) => {
    const matchesCat = filterCategory === 'All' || node.category === filterCategory;
    const matchesSearch = !searchQuery || node.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));

  const filteredEdges = edges.filter(
    (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );

  return (
    <div className="graph-container-wrapper">
      <div className="graph-toolbar">
        <div className="graph-filter-group">
          <div className="search-input-wrap">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search graph entities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="graph-search-input"
            />
          </div>

          <div className="category-pills">
            {['All', 'Administration', 'Library', 'Examination', 'HR & Policies', 'Academic'].map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="graph-controls">
          <button className="control-btn" onClick={() => handleZoom(0.15)} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button className="control-btn" onClick={() => handleZoom(-0.15)} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button className="control-btn" onClick={handleReset} title="Reset View">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      <div
        className="graph-canvas-area"
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <svg
          className="graph-svg graph-bg"
          width="100%"
          height="550"
          style={{ overflow: 'hidden' }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="16"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
            </marker>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" className="graph-bg" />

          <g transform={`translate(${pan.x + 80}, ${pan.y + 40}) scale(${scale})`}>
            {/* Edges */}
            {filteredEdges.map((edge) => {
              const srcNode = nodes.find((n) => n.id === edge.source);
              const tgtNode = nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              const isConnected = selectedNode && (selectedNode.id === srcNode.id || selectedNode.id === tgtNode.id);
              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={edge.id} className="graph-edge-group">
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isConnected ? '#6366f1' : 'rgba(148, 163, 184, 0.35)'}
                    strokeWidth={isConnected ? 2.5 : 1.5}
                    strokeDasharray={edge.relation.includes('ALLOWS') ? '4 3' : 'none'}
                    markerEnd={isConnected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                  />
                  <rect
                    x={midX - 45}
                    y={midY - 10}
                    width="90"
                    height="18"
                    rx="4"
                    fill="#111827"
                    stroke={isConnected ? '#6366f1' : '#1f293d'}
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    textAnchor="middle"
                    fill={isConnected ? '#a5b4fc' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    fontWeight="500"
                  >
                    {edge.label || edge.relation}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map((node) => {
              const colors = categoryColors[node.category] || categoryColors.General;
              const isSelected = selectedNode && selectedNode.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleNodeClick(node)}
                  className="graph-node-group"
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glow */}
                  {isSelected && (
                    <circle
                      r="36"
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeOpacity="0.6"
                      className="pulse-ring"
                    />
                  )}
                  <circle
                    r="26"
                    fill={colors.bg}
                    stroke={isSelected ? '#ffffff' : colors.border}
                    strokeWidth={isSelected ? 3 : 2}
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {node.type.substring(0, 3).toUpperCase()}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="42"
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    fontSize="11"
                    fontWeight="600"
                    className="node-label-text"
                  >
                    {node.label}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="55"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                  >
                    {node.category}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {selectedNode && (
          <div className="node-detail-card glass-card">
            <div className="node-detail-header">
              <span className="badge badge-info">{selectedNode.type}</span>
              <button
                className="close-btn"
                onClick={() => setSelectedNode(null)}
              >
                ×
              </button>
            </div>
            <h4>{selectedNode.label}</h4>
            <p className="node-detail-desc">{selectedNode.description || 'Verified ontological entity in campus knowledge domain.'}</p>
            <div className="node-detail-meta">
              <div><strong>Category:</strong> {selectedNode.category}</div>
              <div><strong>Node ID:</strong> <code>{selectedNode.id}</code></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
