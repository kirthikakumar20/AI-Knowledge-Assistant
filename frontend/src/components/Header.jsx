import React from 'react';
import { ShieldAlert, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({ activeTab, onRefresh, isRefreshing }) {
  const titles = {
    dashboard: {
      title: 'System Dashboard & Metrics',
      desc: 'Real-time monitoring of generative responses, knowledge grounding, and hallucination prevention.',
    },
    chat: {
      title: 'AI Chat Assistant',
      desc: 'Ground-truth conversational agent powered by ontology-verified facts and deductive inference.',
    },
    retrieval: {
      title: 'Knowledge Retrieval Explorer',
      desc: 'Search, rank, and inspect authoritative institutional documents stored in MongoDB.',
    },
    graph: {
      title: 'Ontological Knowledge Graph',
      desc: 'Interactive entity-relationship network visualizer verifying factual consistency.',
    },
    inference: {
      title: 'Rule-Based Inference Engine',
      desc: 'Closed-world formal logic engine executing multi-step reasoning with zero speculation.',
    },
    knowledge: {
      title: 'Knowledge Base Management',
      desc: 'Direct CRUD operations for administrative facts and policies stored in MongoDB Compass.',
    },
    history: {
      title: 'Activity & Audit History',
      desc: 'Complete audit trail of user queries, verification statuses, and reasoning traces.',
    },
    about: {
      title: 'Project Overview & Architecture',
      desc: 'College final-year project documentation on reducing unsupported generative AI responses.',
    },
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="app-header">
      <div className="header-text-block">
        <h1>{current.title}</h1>
        <p>{current.desc}</p>
      </div>

      <div className="header-actions">
        <div className="status-pill status-pill-safe">
          <CheckCircle2 size={14} className="text-success" />
          <span>Strict Grounding: ON</span>
        </div>

        <div className="status-pill status-pill-mode">
          <Sparkles size={14} className="text-accent" />
          <span>Closed-World Axiom</span>
        </div>

        {onRefresh && (
          <button 
            className="btn btn-secondary icon-btn" 
            onClick={onRefresh} 
            title="Refresh System Data"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          </button>
        )}
      </div>
    </header>
  );
}
