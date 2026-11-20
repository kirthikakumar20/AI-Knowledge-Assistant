import React, { useState } from 'react';
import { Cpu, ShieldCheck, ShieldAlert, CheckCircle, XCircle, ArrowRight, Play, BookOpen, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function InferenceEngine() {
  const [testQuery, setTestQuery] = useState('What are the college working hours?');
  const [inferenceTrace, setInferenceTrace] = useState(null);
  const [loading, setLoading] = useState(false);

  const rules = [
    {
      id: 'RULE_FACT_GROUNDING',
      name: 'Fact Grounding Axiom',
      formula: '∀q, ∃f ∈ KB : MatchScore(q, f) ≥ 0.35 ∧ Verified(f) ⇒ Grounded(q, f)',
      description: 'Any generated claim must map directly to an authoritative fact in MongoDB. Unmapped claims fail inference.',
      category: 'Deductive Grounding',
    },
    {
      id: 'RULE_ONTOLOGICAL_VALIDATION',
      name: 'Ontological Path Validation Rule',
      formula: 'Path(E_source, R, E_target) ∈ G_KG ⇒ ValidOntology(E_source, R, E_target)',
      description: 'The entity subject and predicate must form an established path in the Knowledge Graph to prevent cross-attribute contamination.',
      category: 'Knowledge Graph',
    },
    {
      id: 'RULE_BOUNDARY_VERIFICATION',
      name: 'Temporal & Quantitative Boundary Rule',
      formula: 'Extract(f, Attribute) = V ⇒ ConstrainAnswer(V)',
      description: 'Numerical hours, days, percentages or times must be strictly preserved without synthetic interpolation.',
      category: 'Constraint Satisfaction',
    },
    {
      id: 'RULE_ABSENCE_OF_PROOF_REJECTION',
      name: 'Strict Non-Hallucination Axiom (Closed-World)',
      formula: '¬Grounded(q) ∨ IncompleteEvidence(q) ⇒ RejectWithRefusal(q)',
      description: 'When facts or graph edges are missing, the engine strictly rejects the query with the standardized non-hallucinatory message.',
      category: 'Hallucination Mitigation',
    },
  ];

  const runSimulation = async (queryToRun) => {
    const q = queryToRun || testQuery;
    if (!q) return;
    setLoading(true);
    try {
      const res = await api.askQuestion(q);
      if (res.success) {
        setInferenceTrace(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inference-page">
      {/* Overview Card */}
      <div className="glass-card mb-6">
        <div className="card-header-flex">
          <div>
            <h3>Formal Rule-Based Inference Engine</h3>
            <p className="text-secondary">
              Employs classical first-order logic and closed-world assumption (CWA) to eradicate AI hallucinations.
            </p>
          </div>
          <span className="badge badge-info">Deterministic Engine</span>
        </div>
      </div>

      {/* Interactive Simulation Playground */}
      <div className="glass-card mb-6">
        <h4>Inference Simulation Playground</h4>
        <p className="text-secondary mb-4">
          Test any hypothesis against the knowledge base to inspect the deductive reasoning chain in real time.
        </p>

        <div className="preset-buttons mb-4">
          <span className="text-sm font-semibold text-secondary mr-2">Preset Scenarios:</span>
          <button
            className="btn btn-secondary text-xs"
            onClick={() => {
              setTestQuery('What are the college working hours?');
              runSimulation('What are the college working hours?');
            }}
          >
            Scenario 1: College Hours (Grounded)
          </button>
          <button
            className="btn btn-secondary text-xs"
            onClick={() => {
              setTestQuery('When does the library close?');
              runSimulation('When does the library close?');
            }}
          >
            Scenario 2: Library Timing (Grounded)
          </button>
          <button
            className="btn btn-secondary text-xs"
            onClick={() => {
              setTestQuery('What is the casual leave allowance?');
              runSimulation('What is the casual leave allowance?');
            }}
          >
            Scenario 3: Leave Quota (Grounded)
          </button>
          <button
            className="btn btn-danger text-xs"
            onClick={() => {
              setTestQuery('What is the hostel food menu?');
              runSimulation('What is the hostel food menu?');
            }}
          >
            Scenario 4: Hostel Food (Unsupported / Hallucination Test)
          </button>
        </div>

        <div className="sim-input-row">
          <input
            type="text"
            className="sim-input"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Type a premise or question to evaluate..."
          />
          <button
            className="btn btn-primary"
            onClick={() => runSimulation()}
            disabled={loading}
          >
            <Play size={16} /> {loading ? 'Evaluating Logic...' : 'Execute Inference'}
          </button>
        </div>
      </div>

      {/* Inference Trace Results */}
      {inferenceTrace && (
        <div className="glass-card mb-6 trace-result-card">
          <div className="card-header-flex">
            <h4>Live Proof & Inference Trace</h4>
            <span
              className={`badge ${
                inferenceTrace.verificationStatus === 'VERIFIED'
                  ? 'badge-verified'
                  : 'badge-unsupported'
              }`}
            >
              {inferenceTrace.verificationStatus === 'VERIFIED' ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {inferenceTrace.verificationStatus}
            </span>
          </div>

          <div className="trace-summary-box mt-3">
            <div className="trace-answer-text">
              <strong>Engine Output: </strong>
              <span>{inferenceTrace.answer}</span>
            </div>
          </div>

          {/* Reasoning Steps */}
          <div className="mt-4">
            <h5>Formal Reasoning Steps Executed:</h5>
            <div className="steps-container">
              {inferenceTrace.reasoningSteps?.map((step, idx) => (
                <div key={idx} className="step-card">
                  <div className="step-badge">Step 0{step.stepNumber}</div>
                  <div className="step-info">
                    <div className="step-header">
                      <span className="step-phase">{step.phase}</span>
                      <span className={`step-outcome outcome-${step.outcome}`}>
                        {step.outcome}
                      </span>
                    </div>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules Applied */}
          <div className="mt-4">
            <h5>Applied Logical Rules:</h5>
            <div className="rules-applied-grid">
              {inferenceTrace.inferenceRules?.map((rule, idx) => (
                <div key={idx} className="applied-rule-item">
                  <div className="applied-rule-title">
                    <CheckCircle size={14} className="text-success" />
                    <strong>{rule.ruleName}</strong> (<code>{rule.ruleId}</code>)
                  </div>
                  <p className="applied-rule-detail">{rule.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formal Rule Set Catalog */}
      <div className="glass-card">
        <h4>Formal Inference Axiom Catalog</h4>
        <p className="text-secondary mb-4">
          Mathematical and logical definitions programmed into the assistant's inference mechanism.
        </p>

        <div className="rule-catalog-grid">
          {rules.map((rule) => (
            <div key={rule.id} className="rule-spec-card">
              <div className="rule-spec-header">
                <span className="badge badge-info">{rule.category}</span>
                <span className="rule-code font-mono">{rule.id}</span>
              </div>
              <h5 className="rule-spec-name">{rule.name}</h5>
              <div className="rule-spec-formula font-mono">
                {rule.formula}
              </div>
              <p className="rule-spec-desc">{rule.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
