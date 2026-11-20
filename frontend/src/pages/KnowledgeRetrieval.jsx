import React, { useState, useEffect } from 'react';
import { Search, BookOpen, CheckCircle, AlertCircle, Sparkles, Filter, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeRetrieval() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const executeSearch = async (term) => {
    setLoading(true);
    try {
      const res = await api.searchKnowledge(term);
      if (res.success) {
        setResults(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch('');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(searchTerm);
  };

  const matchedFacts = results?.matchedFacts || [];
  const filteredFacts = activeCategory === 'All'
    ? matchedFacts
    : matchedFacts.filter((f) => f.category === activeCategory);

  return (
    <div className="retrieval-page">
      {/* Search Header */}
      <div className="glass-card mb-6">
        <h3>Knowledge Retrieval Engine</h3>
        <p className="text-secondary mb-4">
          Queries authoritative MongoDB documents and applies BM25-based keyword and token relevance scoring.
        </p>

        <form onSubmit={handleSearchSubmit} className="retrieval-search-box">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            className="retrieval-input"
            placeholder="Search knowledge documents (e.g. 'library closing time', 'working hours', 'casual leave')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Retrieve Facts'}
          </button>
        </form>

        {/* Filter Pills */}
        <div className="category-filters mt-4">
          <span className="filter-label"><Filter size={14} /> Filter Category:</span>
          {['All', 'Administration', 'Library', 'Examination', 'HR & Policies', 'Academic'].map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Retrieval Diagnostics Bar */}
      {results && (
        <div className="retrieval-diag-bar glass-card mb-6">
          <div className="diag-stat">
            <span className="diag-title">Extracted Tokens:</span>
            <div className="token-pills">
              {results.tokens?.length > 0 ? (
                results.tokens.map((t, idx) => (
                  <span key={idx} className="badge badge-info">{t}</span>
                ))
              ) : (
                <span className="text-muted text-sm">All baseline documents listed</span>
              )}
            </div>
          </div>

          <div className="diag-stat">
            <span className="diag-title">Grounding Status:</span>
            <span className={`badge ${results.hasSufficientEvidence ? 'badge-verified' : 'badge-unsupported'}`}>
              {results.hasSufficientEvidence ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {results.hasSufficientEvidence ? 'Sufficient Grounding' : 'Insufficient Evidence'}
            </span>
          </div>

          <div className="diag-stat">
            <span className="diag-title">Top Relevance Score:</span>
            <span className="score-num font-mono">{Math.round((results.topRelevanceScore || 0) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Retrieved Facts Grid */}
      <div className="facts-grid">
        {filteredFacts.length > 0 ? (
          filteredFacts.map((fact, index) => {
            const relScore = Math.round((fact.relevanceScore || 1) * 100);
            return (
              <div key={fact._id || index} className="fact-card glass-card">
                <div className="fact-card-header">
                  <div className="fact-card-title-group">
                    <span className="fact-code badge badge-info">{fact.code || `KB-${index + 1}`}</span>
                    <h4>{fact.title}</h4>
                  </div>
                  <span className="badge badge-verified">
                    {relScore}% Relevant
                  </span>
                </div>

                <div className="fact-card-body">
                  <div className="fact-text-box">
                    <p className="fact-highlight">"{fact.fact}"</p>
                  </div>

                  <div className="fact-meta-grid">
                    <div>
                      <span className="meta-label">Category:</span>
                      <span className="meta-val">{fact.category}</span>
                    </div>
                    <div>
                      <span className="meta-label">Verified Value:</span>
                      <span className="meta-val highlight-val">{fact.value}</span>
                    </div>
                  </div>

                  {/* Why this is relevant */}
                  <div className="relevance-explanation-box">
                    <Sparkles size={14} className="text-accent" />
                    <div>
                      <strong>Why Relevant: </strong>
                      <span>{fact.matchExplanation || 'Direct match with domain knowledge entity.'}</span>
                    </div>
                  </div>

                  {/* Source Document Reference */}
                  <div className="source-citation">
                    <FileText size={14} className="text-muted" />
                    <span><strong>Source Document:</strong> {fact.source}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state glass-card">
            <AlertCircle size={32} className="text-warning mb-2" />
            <h4>No Grounded Facts Found</h4>
            <p className="text-secondary">
              No verified records in MongoDB satisfied this search query. The inference engine will 
              safely reject queries for this topic to prevent hallucinations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
