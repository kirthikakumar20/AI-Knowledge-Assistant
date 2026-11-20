import React, { useState, useEffect } from 'react';
import { 
  History, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Cpu, 
  Search, 
  Eye, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function ActivityHistory() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getHistory(filterStatus);
      if (res.success) {
        setHistoryList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterStatus]);

  const handleClearAll = async () => {
    if (window.confirm('Purge all question audit records from MongoDB?')) {
      const res = await api.clearHistory();
      if (res.success) {
        setHistoryList([]);
        setSelectedItem(null);
      }
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this interaction log from MongoDB?')) {
      const res = await api.deleteHistoryItem(id);
      if (res.success) {
        setHistoryList((prev) => prev.filter((item) => item._id !== id));
        if (selectedItem?._id === id) setSelectedItem(null);
      }
    }
  };

  return (
    <div className="activity-history-page">
      {/* Top Banner */}
      <div className="glass-card mb-6">
        <div className="card-header-flex">
          <div>
            <h3>Activity & Verification Audit History</h3>
            <p className="text-secondary">
              Chronological log of questions evaluated by the Tri-Layer grounding pipeline. Persisted in collection <code>answerhistories</code>.
            </p>
          </div>
          {historyList.length > 0 && (
            <button className="btn btn-danger" onClick={handleClearAll}>
              <Trash2 size={16} /> Clear All History
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="history-filters mt-4">
          <span className="filter-label"><Filter size={14} /> Filter Verification Status:</span>
          {['ALL', 'VERIFIED', 'UNSUPPORTED'].map((status) => (
            <button
              key={status}
              className={`filter-pill ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'ALL' ? 'All Activities' : status}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid */}
      <div className="history-layout">
        <div className="history-list-pane glass-card">
          <div className="pane-header">
            <h4>Inquiry Log ({historyList.length})</h4>
          </div>

          {loading ? (
            <div className="py-6 text-center text-muted">Loading audit records from MongoDB...</div>
          ) : historyList.length > 0 ? (
            <div className="history-items-container">
              {historyList.map((item) => {
                const isVerified = item.verificationStatus === 'VERIFIED';
                const isSelected = selectedItem?._id === item._id;

                return (
                  <div
                    key={item._id}
                    className={`history-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="history-item-top">
                      <span className={`badge ${isVerified ? 'badge-verified' : 'badge-unsupported'}`}>
                        {isVerified ? <CheckCircle size={11} /> : <XCircle size={11} />}
                        {item.verificationStatus}
                      </span>
                      <span className="item-time font-mono">
                        <Clock size={11} /> {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="item-question">
                      <strong>Q:</strong> {item.question}
                    </div>

                    <div className="item-answer-preview">
                      <strong>A:</strong> {item.answer}
                    </div>

                    <div className="item-footer">
                      <span className="text-xs text-muted">
                        Confidence: {Math.round((item.confidenceScore || 0) * 100)}%
                      </span>
                      <button
                        className="delete-item-btn"
                        title="Delete log"
                        onClick={(e) => handleDeleteItem(item._id, e)}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state py-8">
              <AlertCircle size={32} className="text-warning mb-2" />
              <h4>No Activity Logs</h4>
              <p className="text-secondary">Ask questions in the AI Chat Assistant to see real-time audit logs populate here.</p>
            </div>
          )}
        </div>

        {/* Selected Audit Details View */}
        <div className="history-detail-pane glass-card">
          {selectedItem ? (
            <div>
              <div className="pane-header-flex mb-4">
                <h4>Audit Inspection Trace</h4>
                <span className={`badge ${selectedItem.verificationStatus === 'VERIFIED' ? 'badge-verified' : 'badge-unsupported'}`}>
                  {selectedItem.verificationStatus}
                </span>
              </div>

              <div className="audit-section mb-4">
                <label className="audit-label">User Query</label>
                <div className="audit-box question-box">{selectedItem.question}</div>
              </div>

              <div className="audit-section mb-4">
                <label className="audit-label">Synthesized Response</label>
                <div className={`audit-box answer-box ${selectedItem.verificationStatus === 'UNSUPPORTED' ? 'answer-box-unsupported' : ''}`}>
                  {selectedItem.answer}
                </div>
              </div>

              <div className="audit-meta-row mb-4">
                <div>
                  <span className="text-xs text-muted block">Timestamp</span>
                  <span className="font-mono text-sm">{new Date(selectedItem.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Confidence Score</span>
                  <span className="font-mono text-sm">{Math.round((selectedItem.confidenceScore || 0) * 100)}%</span>
                </div>
                <div>
                  <span className="text-xs text-muted block">Latency</span>
                  <span className="font-mono text-sm">{selectedItem.executionTimeMs || 0}ms</span>
                </div>
              </div>

              {/* Retrieved Facts Trace */}
              {selectedItem.retrievedFacts?.length > 0 && (
                <div className="audit-section mb-4">
                  <label className="audit-label">Retrieved Evidence Documents</label>
                  <div className="evidence-trace-list">
                    {selectedItem.retrievedFacts.map((fact, idx) => (
                      <div key={idx} className="evidence-card">
                        <div className="evidence-title">
                          <code>{fact.code}</code> — {fact.title}
                        </div>
                        <p className="evidence-fact">"{fact.fact}"</p>
                        <div className="evidence-source">Official Source: {fact.source}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning Steps */}
              {selectedItem.reasoningSteps?.length > 0 && (
                <div className="audit-section">
                  <label className="audit-label">Formal Reasoning Steps</label>
                  <div className="reasoning-trace-list">
                    {selectedItem.reasoningSteps.map((step, idx) => (
                      <div key={idx} className="reasoning-item">
                        <div className="reasoning-phase">[{step.phase}]</div>
                        <p className="reasoning-desc">{step.description}</p>
                        <span className={`badge ${step.outcome.includes('REJECT') ? 'badge-unsupported' : 'badge-verified'}`}>
                          {step.outcome}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state py-12">
              <Eye size={36} className="text-muted mb-2" />
              <h4>Select an Audit Log</h4>
              <p className="text-secondary">Click on any inquiry from the left pane to inspect its complete proof tree and evidence trace.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
