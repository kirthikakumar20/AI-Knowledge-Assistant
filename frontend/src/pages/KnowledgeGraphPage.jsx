import React, { useState, useEffect } from 'react';
import { Network, Plus, RotateCcw, Share2, Info, Layers, CheckCircle2 } from 'lucide-react';
import GraphCanvas from '../components/GraphCanvas';
import { api } from '../services/api';

export default function KnowledgeGraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [newNode, setNewNode] = useState({ label: '', type: 'Organization', category: 'General', description: '' });

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await api.getGraph();
      if (res.success) {
        setGraphData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  const handleResetGraph = async () => {
    if (window.confirm('Reset knowledge graph to canonical institutional baseline?')) {
      const res = await api.resetGraph();
      if (res.success) {
        setGraphData(res.data);
      }
    }
  };

  const handleCreateNode = async (e) => {
    e.preventDefault();
    if (!newNode.label) return;
    try {
      const res = await api.addGraphNode(newNode);
      if (res.success) {
        setGraphData((prev) => ({
          ...prev,
          nodes: [...prev.nodes, res.data],
        }));
        setShowAddNodeModal(false);
        setNewNode({ label: '', type: 'Organization', category: 'General', description: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="graph-page">
      {/* Top Banner & Stats */}
      <div className="glass-card mb-6">
        <div className="card-header-flex">
          <div>
            <h3>Ontological Knowledge Graph</h3>
            <p className="text-secondary">
              Graph representation anchoring collegiate entities and relations to guarantee factual consistency.
            </p>
          </div>
          <div className="graph-action-btns">
            <button className="btn btn-secondary" onClick={() => setShowAddNodeModal(true)}>
              <Plus size={16} /> Add Entity Node
            </button>
            <button className="btn btn-secondary" onClick={handleResetGraph} title="Reset Graph">
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        <div className="graph-meta-pills mt-4">
          <div className="meta-pill">
            <Layers size={14} className="text-accent" />
            <span><strong>{graphData.nodes?.length || 0}</strong> Entities (Nodes)</span>
          </div>
          <div className="meta-pill">
            <Share2 size={14} className="text-emerald" />
            <span><strong>{graphData.edges?.length || 0}</strong> Relations (Edges)</span>
          </div>
          <div className="meta-pill">
            <CheckCircle2 size={14} className="text-success" />
            <span>Schema: <strong>College Ontology v1.0</strong></span>
          </div>
        </div>
      </div>

      {/* Main Interactive Visualizer */}
      <div className="glass-card graph-visualizer-card">
        {loading ? (
          <div className="graph-loading">Loading ontological network...</div>
        ) : (
          <GraphCanvas nodes={graphData.nodes} edges={graphData.edges} />
        )}
      </div>

      {/* How Graphs Prevent Hallucination Explanation */}
      <div className="glass-card mt-6">
        <h4>Role of Knowledge Graphs in Hallucination Mitigation</h4>
        <div className="graph-explanation-grid mt-3">
          <div className="exp-box">
            <strong>1. Entity Grounding:</strong>
            <p>Every claim made by the assistant is grounded into an ontological node (e.g., <code>Central Library</code>). If a user queries an entity outside the graph (e.g., "Hostel Food"), the system detects absence of an entity node.</p>
          </div>
          <div className="exp-box">
            <strong>2. Relational Verification:</strong>
            <p>Verifies that the relation between entities exists (e.g., <code>[Central Library] &rarr; CLOSES_AT &rarr; [5 PM]</code>). Probabilistic models often attach attributes of one entity to another; graph paths prevent such cross-attribute hallucinations.</p>
          </div>
        </div>
      </div>

      {/* Add Node Modal */}
      {showAddNodeModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <div className="modal-header">
              <h4>Add Entity Node to Graph</h4>
              <button className="close-btn" onClick={() => setShowAddNodeModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateNode}>
              <div className="form-group mb-3">
                <label>Entity Label / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sports Complex, Placement Cell"
                  value={newNode.label}
                  onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                />
              </div>
              <div className="form-group mb-3">
                <label>Entity Type</label>
                <select
                  value={newNode.type}
                  onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
                >
                  <option value="Organization">Organization</option>
                  <option value="Department">Department</option>
                  <option value="Policy">Policy</option>
                  <option value="TimeValue">TimeValue</option>
                  <option value="Metric">Metric</option>
                  <option value="Regulation">Regulation</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <label>Category</label>
                <select
                  value={newNode.category}
                  onChange={(e) => setNewNode({ ...newNode, category: e.target.value })}
                >
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                  <option value="Examination">Examination</option>
                  <option value="HR & Policies">HR & Policies</option>
                  <option value="Academic">Academic</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="form-group mb-4">
                <label>Description</label>
                <textarea
                  rows="2"
                  placeholder="Operational role or entity detail"
                  value={newNode.description}
                  onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddNodeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Insert into MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
