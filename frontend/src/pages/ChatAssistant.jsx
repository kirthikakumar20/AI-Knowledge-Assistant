import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ShieldCheck, 
  ShieldAlert, 
  BookOpen, 
  Cpu, 
  Network, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

export default function ChatAssistant({ onInteractionComplete }) {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      type: 'assistant',
      text: "Hello! I am your AI Knowledge Assistant. I answer questions strictly grounded in our verified college knowledge base. Ask me about college working hours, library timings, examination duration, or leave regulations.",
      verificationStatus: 'VERIFIED',
      confidenceScore: 1.0,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    'What are the college working hours?',
    'When does the library close?',
    'What is the casual leave allowance?',
    'What is the internal examination duration?',
    'What is the hostel food menu?', // Test case for unsupported query
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const query = (queryText || inputQuery).trim();
    if (!query || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await api.askQuestion(query);
      if (response.success) {
        const data = response.data;
        const assistantMessage = {
          id: data.id || `bot-${Date.now()}`,
          type: 'assistant',
          text: data.answer,
          verificationStatus: data.verificationStatus,
          confidenceScore: data.confidenceScore,
          retrievedFacts: data.retrievedFacts || [],
          reasoningSteps: data.reasoningSteps || [],
          inferenceRules: data.inferenceRules || [],
          graphPath: data.graphPath || [],
          provenance: data.provenance,
          executionTimeMs: data.executionTimeMs,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        if (onInteractionComplete) onInteractionComplete();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            type: 'assistant',
            text: 'An error occurred while querying the knowledge base.',
            verificationStatus: 'UNSUPPORTED',
            confidenceScore: 0,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          type: 'assistant',
          text: 'Unable to connect to backend inference server.',
          verificationStatus: 'UNSUPPORTED',
          confidenceScore: 0,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (msgId) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div className="chat-container">
      {/* Sample Quick Questions Pill Bar */}
      <div className="sample-pills-bar">
        <span className="pills-label">Quick Test Prompts:</span>
        <div className="pills-scroll">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              className={`sample-pill ${q.includes('hostel') ? 'sample-pill-unsupported' : ''}`}
              onClick={() => handleSend(q)}
              disabled={loading}
            >
              {q}
              {q.includes('hostel') && <span className="pill-tag">Refusal Test</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="messages-stream">
        {messages.map((msg) => {
          const isUser = msg.type === 'user';
          const isVerified = msg.verificationStatus === 'VERIFIED';
          const isExpanded = !!expandedSteps[msg.id];

          return (
            <div
              key={msg.id}
              className={`message-wrapper ${isUser ? 'msg-user-wrapper' : 'msg-bot-wrapper'}`}
            >
              {!isUser && (
                <div className={`avatar-bot ${isVerified ? 'avatar-verified' : 'avatar-unsupported'}`}>
                  {isVerified ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                </div>
              )}

              <div className="message-content-box">
                {/* Status Bar for Assistant Messages */}
                {!isUser && msg.verificationStatus && (
                  <div className="msg-status-strip">
                    <span className={`badge ${isVerified ? 'badge-verified' : 'badge-unsupported'}`}>
                      {isVerified ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                      {msg.verificationStatus}
                    </span>
                    <span className="confidence-tag">
                      Confidence: {Math.round(msg.confidenceScore * 100)}%
                    </span>
                    {msg.executionTimeMs && (
                      <span className="exec-time-tag">
                        <Clock size={11} /> {msg.executionTimeMs}ms
                      </span>
                    )}
                  </div>
                )}

                {/* Main Message Text */}
                <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'} ${!isUser && !isVerified ? 'bubble-rejected' : ''}`}>
                  <p>{msg.text}</p>
                </div>

                {/* Source & Provenance */}
                {!isUser && msg.provenance && msg.provenance !== 'N/A' && (
                  <div className="provenance-strip">
                    <BookOpen size={13} className="text-accent" />
                    <span><strong>Source:</strong> {msg.provenance}</span>
                  </div>
                )}

                {/* Reasoning & Evidence Details Accordion */}
                {!isUser && (msg.reasoningSteps?.length > 0 || msg.retrievedFacts?.length > 0) && (
                  <div className="accordion-wrapper">
                    <button
                      className="accordion-toggle"
                      onClick={() => toggleExpand(msg.id)}
                    >
                      <span className="accordion-label">
                        <Cpu size={14} /> Inference & Knowledge Audit Trace
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isExpanded && (
                      <div className="accordion-panel glass-card">
                        {/* Retrieved Facts */}
                        {msg.retrievedFacts?.length > 0 && (
                          <div className="trace-section">
                            <h5>Retrieved MongoDB Records:</h5>
                            <div className="trace-facts-list">
                              {msg.retrievedFacts.map((f, i) => (
                                <div key={i} className="fact-item">
                                  <div className="fact-item-title">
                                    <code>{f.code}</code> — {f.title}
                                    <span className="badge badge-info">{Math.round((f.relevanceScore || 1) * 100)}% Match</span>
                                  </div>
                                  <p className="fact-item-text">"{f.fact}"</p>
                                  <div className="fact-item-source">Official Source: {f.source}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Reasoning Steps */}
                        {msg.reasoningSteps?.length > 0 && (
                          <div className="trace-section mt-3">
                            <h5>Deductive Reasoning Steps:</h5>
                            <ol className="reasoning-step-list">
                              {msg.reasoningSteps.map((step, i) => (
                                <li key={i} className="step-item">
                                  <strong>[{step.phase}]:</strong> {step.description}
                                  <span className={`step-outcome-pill outcome-${step.outcome}`}>
                                    {step.outcome}
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Graph Path */}
                        {msg.graphPath?.length > 0 && (
                          <div className="trace-section mt-3">
                            <h5>Validated Knowledge Graph Path:</h5>
                            <div className="graph-path-trace">
                              {msg.graphPath.map((p, i) => (
                                <span key={i} className="path-node-pair">
                                  <code>{p.from}</code> → <em>[{p.relationLabel || p.relation}]</em> → <code>{p.to}</code>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <span className="msg-time">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="message-wrapper msg-bot-wrapper">
            <div className="avatar-bot avatar-loading">
              <Sparkles size={18} className="spin" />
            </div>
            <div className="bot-bubble loading-bubble">
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span className="loading-caption">Retrieving MongoDB facts & validating graph relations...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          type="text"
          className="chat-text-input"
          placeholder="Ask a question (e.g. 'What are the college working hours?')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-primary chat-submit-btn"
          disabled={!inputQuery.trim() || loading}
        >
          <span>Send</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
