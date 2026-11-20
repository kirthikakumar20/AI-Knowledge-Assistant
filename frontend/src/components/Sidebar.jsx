import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  Search, 
  Network, 
  Cpu, 
  Database, 
  History, 
  Info, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats }) {
  const navItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat Assistant', icon: MessageSquareText, badge: 'Live' },
    { id: 'retrieval', label: 'Knowledge Retrieval', icon: Search },
    { id: 'graph', label: 'Knowledge Graph', icon: Network },
    { id: 'inference', label: 'Inference Mechanism', icon: Cpu },
    { id: 'knowledge', label: 'Knowledge Base', icon: Database, count: stats?.totalKnowledge },
    { id: 'history', label: 'Activity History', icon: History, count: stats?.totalQuestions },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-wrapper">
          <ShieldCheck className="brand-icon" size={26} />
        </div>
        <div className="brand-text">
          <h2>AI KNOWLEDGE</h2>
          <span className="brand-sub">ASSISTANT</span>
        </div>
      </div>

      <div className="project-tag">
        <Layers size={13} />
        <span>Anti-Hallucination Engine</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={19} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
              {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
              {item.count !== undefined && item.count > 0 && (
                <span className="nav-counter">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="db-indicator">
          <div className="pulse-dot"></div>
          <div>
            <div className="db-status-text">MongoDB Compass</div>
            <div className="db-name-text">AIKnowledgeAssistant</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
