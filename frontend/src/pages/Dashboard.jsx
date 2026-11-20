import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  HelpCircle, 
  TrendingUp, 
  Layers, 
  Network, 
  Cpu, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Dashboard({ stats, setActiveTab }) {
  const totalQ = stats?.totalQuestions || 0;
  const verifiedQ = stats?.verifiedCount || 0;
  const unsupportedQ = stats?.unsupportedCount || 0;
  const totalK = stats?.totalKnowledge || 0;
  const categories = stats?.categories || [];

  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <div className="hero-banner glass-card">
        <div className="hero-content">
          <div className="badge badge-info mb-2">
            <Sparkles size={12} /> College Academic Project
          </div>
          <h2>AI Knowledge Assistant</h2>
          <h3 className="hero-subtitle">
            Reducing Unsupported Responses in Generative AI via Tri-Layer Knowledge Grounding
          </h3>
          <p className="hero-description">
            Standard Generative AI models predict tokens probabilistically, which causes them to produce 
            unsupported answers (AI hallucinations) when queries exceed their training parameters. 
            This system enforces a <strong>Strict Closed-World Architecture</strong> integrating 
            <strong> MongoDB Knowledge Retrieval</strong>, <strong>Ontological Knowledge Graphs</strong>, 
            and a <strong>Formal Rule-Based Inference Engine</strong> to guarantee 100% factual fidelity.
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => setActiveTab('chat')}>
              Launch AI Chat Assistant <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab('graph')}>
              Explore Knowledge Graph <Network size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Questions Processed"
          value={totalQ}
          subtitle="Lifetime user inquiries evaluated"
          icon={HelpCircle}
          color="blue"
          trend="MongoDB Logged"
        />
        <StatCard
          title="Verified Answers"
          value={verifiedQ}
          subtitle="Grounded in institutional records"
          icon={ShieldCheck}
          color="emerald"
          trend={`${stats?.verificationRate || 100}% Verification Rate`}
        />
        <StatCard
          title="Unsupported Blocked"
          value={unsupportedQ}
          subtitle="Hallucinations actively prevented"
          icon={ShieldAlert}
          color="rose"
          trend="Safe Refusal Enforced"
        />
        <StatCard
          title="Knowledge Base Records"
          value={totalK}
          subtitle="Authoritative policy facts in MongoDB"
          icon={Database}
          color="purple"
          trend="Compass Verified"
        />
      </div>

      {/* Core Architectural Pillars */}
      <div className="section-title-wrap mt-6">
        <h3>Tri-Layer Hallucination Mitigation Pipeline</h3>
        <p>How our system ensures zero ungrounded responses</p>
      </div>

      <div className="pipeline-grid">
        <div className="pipeline-step-card glass-card">
          <div className="step-num">01</div>
          <div className="step-icon-wrap icon-purple">
            <Database size={24} />
          </div>
          <h4>Knowledge Retrieval</h4>
          <p>
            Executes token extraction and relevance scoring against MongoDB authoritative records. 
            Queries without matching premises fail the confidence threshold and bypass speculative generation.
          </p>
        </div>

        <div className="pipeline-step-card glass-card">
          <div className="step-num">02</div>
          <div className="step-icon-wrap icon-blue">
            <Network size={24} />
          </div>
          <h4>Knowledge Graph</h4>
          <p>
            Traverses entity relationships (e.g. <code>College &rarr; Library &rarr; 5 PM</code>) to confirm 
            ontological validity. Prevents cross-domain entity confusion.
          </p>
        </div>

        <div className="pipeline-step-card glass-card">
          <div className="step-num">03</div>
          <div className="step-icon-wrap icon-emerald">
            <Cpu size={24} />
          </div>
          <h4>Rule-Based Inference</h4>
          <p>
            Applies deductive logic rules. If premises are missing, the <em>Absence-of-Proof Axiom</em> 
            strictly commands refusal: <em>"Sorry, the requested information is not available..."</em>
          </p>
        </div>
      </div>

      {/* Hallucination Explanation & Categories */}
      <div className="dash-two-column mt-6">
        <div className="glass-card">
          <div className="card-header-flex">
            <h4>The Science of AI Hallucinations</h4>
            <span className="badge badge-unsupported">Problem Statement</span>
          </div>
          <div className="hallucination-breakdown">
            <div className="breakdown-item">
              <strong>1. Probabilistic Hallucination:</strong>
              <p>
                Large Language Models lack truth semantics; they optimize statistical next-token likelihood 
                P(w_t | w_1...w_t-1). Under incomplete knowledge, they produce fluent yet fabricated claims.
              </p>
            </div>
            <div className="breakdown-item">
              <strong>2. Our Deterministic Solution:</strong>
              <p>
                By binding the generative agent to external MongoDB records and a closed-world inference engine, 
                the model cannot speculate. If evidence is absent, the system rejects rather than hallucinates.
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header-flex">
            <h4>Knowledge Base Categories</h4>
            <span className="badge badge-info">MongoDB Distribution</span>
          </div>
          <div className="categories-list">
            {categories.length > 0 ? (
              categories.map((cat, idx) => (
                <div key={idx} className="category-row">
                  <span className="cat-name">{cat.name}</span>
                  <div className="cat-bar-wrap">
                    <div 
                      className="cat-bar" 
                      style={{ width: `${Math.min(100, (cat.count / Math.max(totalK, 1)) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="cat-count">{cat.count} facts</span>
                </div>
              ))
            ) : (
              <p className="text-muted">Loading categories from MongoDB...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
