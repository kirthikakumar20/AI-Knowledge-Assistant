import React from 'react';
import { 
  FileText, 
  Target, 
  ShieldCheck, 
  Database, 
  Network, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function AboutProject() {
  return (
    <div className="about-page">
      {/* Title Header */}
      <div className="glass-card mb-6 project-meta-banner">
        <div className="badge badge-info mb-2">
          <Sparkles size={12} /> College Academic Capstone Project
        </div>
        <h2>AI Knowledge Assistant</h2>
        <h3 className="project-subheading">
          Reducing Unsupported Responses in Generative AI via Knowledge Retrieval, Knowledge Graphs, and Rule-Based Inference
        </h3>
        <div className="academic-meta-tags mt-4">
          <span className="meta-tag"><strong>Domain:</strong> Natural Language Processing & Knowledge Engineering</span>
          <span className="meta-tag"><strong>Backend:</strong> Node.js, Express.js, MongoDB Compass, Mongoose</span>
          <span className="meta-tag"><strong>Frontend:</strong> React.js, Vite, SVG Ontological Visualizer</span>
          <span className="meta-tag"><strong>Methodology:</strong> Closed-World Grounding & Graph Triangulation</span>
        </div>
      </div>

      {/* 1. Problem Statement */}
      <div className="glass-card mb-6">
        <div className="section-header-row">
          <div className="section-icon icon-rose">
            <Target size={22} />
          </div>
          <h4>1. Problem Statement</h4>
        </div>
        <p className="mt-2 text-secondary leading-relaxed">
          Contemporary Large Language Models (LLMs) operate fundamentally as statistical auto-regressive token predictors. 
          When queried about specialized domain facts—such as university operating hours, departmental policies, or examination bylaws—LLMs 
          frequently produce <strong>AI Hallucinations</strong>: responses that appear stylistically authoritative and syntactically flawless 
          yet are factually unsupported or fabricated.
        </p>
        <p className="mt-2 text-secondary leading-relaxed">
          In organizational, academic, and legal contexts, probabilistic generation without verified provenance introduces 
          severe operational liabilities. Hence, an architectural paradigm shift from <em>stochastic token generation</em> to 
          <em>deterministic knowledge-grounded inference</em> is urgently needed.
        </p>
      </div>

      {/* 2. Project Objectives */}
      <div className="glass-card mb-6">
        <div className="section-header-row">
          <div className="section-icon icon-blue">
            <Award size={22} />
          </div>
          <h4>2. Project Objectives</h4>
        </div>
        <ul className="objective-list mt-3">
          <li>
            <CheckCircle2 size={16} className="text-accent" />
            <span><strong>Zero-Tolerance for Hallucinations:</strong> Eliminate unsupported answers by enforcing a strict closed-world assumption over institutional records.</span>
          </li>
          <li>
            <CheckCircle2 size={16} className="text-accent" />
            <span><strong>Multi-Modal Knowledge Grounding:</strong> Integrate document retrieval with structured knowledge graphs to validate entity-attribute associations before response generation.</span>
          </li>
          <li>
            <CheckCircle2 size={16} className="text-accent" />
            <span><strong>Deductive Inference & Provenance:</strong> Implement a transparent rule-based inference engine that logs formal proof steps and exact citations for every answer.</span>
          </li>
          <li>
            <CheckCircle2 size={16} className="text-accent" />
            <span><strong>Safe Non-Hallucinatory Refusal:</strong> Strictly refuse to extrapolate when premises are incomplete or absent, issuing the standard verified refusal message.</span>
          </li>
        </ul>
      </div>

      {/* 3. The Tri-Layer Solution Architecture */}
      <div className="glass-card mb-6">
        <div className="section-header-row">
          <div className="section-icon icon-emerald">
            <Layers size={22} />
          </div>
          <h4>3. Core Methodology: Tri-Layer Grounding</h4>
        </div>

        <div className="methodology-grid mt-4">
          <div className="methodology-card">
            <div className="method-icon-wrap">
              <Database size={24} className="text-accent" />
            </div>
            <h5>Layer 1: Knowledge Retrieval</h5>
            <p>
              Employs text tokenization, domain stop-word filtration, and BM25-based relevance scoring across MongoDB collections. 
              Only documents surpassing an empirical relevance threshold (&tau; &ge; 0.35) are admitted into the inference pipeline.
            </p>
          </div>

          <div className="methodology-card">
            <div className="method-icon-wrap">
              <Network size={24} className="text-blue" />
            </div>
            <h5>Layer 2: Knowledge Graph (Ontology)</h5>
            <p>
              Maintains an explicit network of institutional nodes and typed relationships. Traverses relational paths 
              (e.g., <code>Central Library → CLOSES_AT → 5 PM</code>) to confirm that the queried predicate is ontologically sound.
            </p>
          </div>

          <div className="methodology-card">
            <div className="method-icon-wrap">
              <Cpu size={24} className="text-emerald" />
            </div>
            <h5>Layer 3: Rule-Based Inference</h5>
            <p>
              Executes Modus Ponens and constraint satisfaction over retrieved premises. Enforces the <em>Absence-of-Proof Axiom</em>: 
              if the required evidence cannot be proven from verified records, the engine explicitly rejects rather than hallucinating.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Advantages & Impact */}
      <div className="glass-card mb-6">
        <div className="section-header-row">
          <div className="section-icon icon-purple">
            <ShieldCheck size={22} />
          </div>
          <h4>4. Advantages Over Standard Generative AI</h4>
        </div>
        <div className="comparison-table-wrap mt-3">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Evaluation Parameter</th>
                <th>Standard Generative AI</th>
                <th>Our AI Knowledge Assistant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Factual Accuracy</strong></td>
                <td>Probabilistic; susceptible to hallucinations</td>
                <td className="highlight-cell">100% Deterministically Grounded</td>
              </tr>
              <tr>
                <td><strong>Response to Unknowns</strong></td>
                <td>Plausibly fabricates unsupported facts</td>
                <td className="highlight-cell">Safe refusal ("Information not available")</td>
              </tr>
              <tr>
                <td><strong>Auditability & Provenance</strong></td>
                <td>Opaque black-box generation</td>
                <td className="highlight-cell">Complete proof tree & source document citations</td>
              </tr>
              <tr>
                <td><strong>Database Synchronization</strong></td>
                <td>Requires costly re-training / fine-tuning</td>
                <td className="highlight-cell">Instant updates via MongoDB Compass CRUD</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Conclusion */}
      <div className="glass-card conclusion-card">
        <div className="section-header-row">
          <div className="section-icon icon-emerald">
            <FileText size={22} />
          </div>
          <h4>5. Conclusion</h4>
        </div>
        <p className="mt-2 text-secondary leading-relaxed">
          The <strong>AI Knowledge Assistant</strong> proves that generative AI reliability is achievable by bounding statistical models 
          within formal knowledge structures. By combining high-speed document retrieval in MongoDB, ontological relationship verification 
          through Knowledge Graphs, and classical rule-based inference, the system completely prevents unsupported responses.
        </p>
        <p className="mt-2 text-secondary leading-relaxed">
          This project provides a robust, production-ready blueprint for colleges, hospitals, and enterprises seeking to deploy 
          AI assistants without the catastrophic liability of AI hallucinations.
        </p>
      </div>
    </div>
  );
}
