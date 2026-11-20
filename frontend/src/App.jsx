import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import KnowledgeRetrieval from './pages/KnowledgeRetrieval';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import InferenceEngine from './pages/InferenceEngine';
import KnowledgeManager from './pages/KnowledgeManager';
import ActivityHistory from './pages/ActivityHistory';
import AboutProject from './pages/AboutProject';
import { api } from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalKnowledge: 7,
    totalQuestions: 4,
    verifiedCount: 3,
    unsupportedCount: 1,
    verificationRate: 75,
    categories: [],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.warn('Backend stats offline/connecting:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [activeTab]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
      case 'chat':
        return <ChatAssistant onInteractionComplete={fetchStats} />;
      case 'retrieval':
        return <KnowledgeRetrieval />;
      case 'graph':
        return <KnowledgeGraphPage />;
      case 'inference':
        return <InferenceEngine />;
      case 'knowledge':
        return <KnowledgeManager onDataChange={fetchStats} />;
      case 'history':
        return <ActivityHistory />;
      case 'about':
        return <AboutProject />;
      default:
        return <Dashboard stats={stats} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />
      
      <div className="main-content">
        <Header activeTab={activeTab} onRefresh={fetchStats} isRefreshing={isRefreshing} />
        
        <main className="page-wrapper">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}
