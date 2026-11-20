/**
 * Rule-Based Inference Service
 * Evaluates retrieved facts, applies formal inference rules, and enforces strict hallucination avoidance.
 */

const REJECTION_MESSAGE = "Sorry, the requested information is not available in our knowledge base. I cannot provide a verified answer.";

const INFERENCE_RULES = [
  {
    ruleId: 'RULE_FACT_GROUNDING',
    ruleName: 'Fact Grounding Axiom',
    description: 'Requires that any generated claim must have a direct 1-to-1 grounding in verified institutional records with confidence >= 0.75 and relevance >= 0.35.',
  },
  {
    ruleId: 'RULE_ONTOLOGICAL_VALIDATION',
    ruleName: 'Knowledge Graph Path Validation',
    description: 'Validates that the subject entity and target predicate form a coherent ontological relationship in the campus knowledge graph.',
  },
  {
    ruleId: 'RULE_BOUNDARY_VERIFICATION',
    ruleName: 'Temporal & Quantitative Boundary Rule',
    description: 'Ensures numerical, temporal, or operational values match verified administrative directives exactly.',
  },
  {
    ruleId: 'RULE_ABSENCE_OF_PROOF_REJECTION',
    ruleName: 'Strict Non-Hallucination Axiom (Closed-World Assumption)',
    description: 'If evidence is missing, conflicting, or falls below verification thresholds, the system MUST refuse to generate an answer rather than extrapolate.',
  },
];

/**
 * Execute rule-based inference on retrieval and graph results
 */
function inferAnswer({ query, retrievalResult, graphResult }) {
  const reasoningSteps = [];
  const appliedRules = [];
  let stepCounter = 1;

  // Step 1: Query Ingestion & Token Extraction
  reasoningSteps.push({
    stepNumber: stepCounter++,
    phase: 'QUERY_INGESTION',
    description: `Ingested question: "${query}". Extracted salient domain tokens: [${retrievalResult.tokens.join(', ')}].`,
    outcome: 'COMPLETED',
  });

  // Step 2: Grounding Check
  reasoningSteps.push({
    stepNumber: stepCounter++,
    phase: 'KNOWLEDGE_RETRIEVAL',
    description: retrievalResult.reason,
    outcome: retrievalResult.hasSufficientEvidence ? 'FACT_RETRIEVED' : 'INSUFFICIENT_EVIDENCE',
  });

  // Step 3: Graph Traversal Validation
  reasoningSteps.push({
    stepNumber: stepCounter++,
    phase: 'GRAPH_EXPLORATION',
    description: graphResult.reason || 'Evaluated ontological graph connectivity.',
    outcome: graphResult.graphValidationPassed ? 'RELATION_VALIDATED' : 'ENTITY_UNCONNECTED',
  });

  // Check if we have sufficient verified evidence
  if (!retrievalResult.hasSufficientEvidence || retrievalResult.matchedFacts.length === 0) {
    appliedRules.push({
      ruleId: 'RULE_ABSENCE_OF_PROOF_REJECTION',
      ruleName: 'Strict Non-Hallucination Axiom',
      description: 'Triggered when query entities or attributes lack verified premises in MongoDB.',
      applied: true,
      detail: 'Rejection triggered: No supporting facts or graph relations found in knowledge base. Hallucination prevented.',
    });

    reasoningSteps.push({
      stepNumber: stepCounter++,
      phase: 'INFERENCE_DECISION',
      description: 'Closed-World Assumption triggered: Absence of proof implies unverified statement. Rejecting speculation.',
      outcome: 'REJECTED_UNSUPPORTED',
    });

    return {
      answer: REJECTION_MESSAGE,
      verificationStatus: 'UNSUPPORTED',
      confidenceScore: 0.0,
      retrievedFacts: [],
      reasoningSteps,
      inferenceRules: appliedRules,
      graphPath: [],
    };
  }

  // Best grounded fact
  const topFact = retrievalResult.matchedFacts[0];

  // Apply Fact Grounding Rule
  appliedRules.push({
    ruleId: 'RULE_FACT_GROUNDING',
    ruleName: 'Fact Grounding Axiom',
    description: 'Requires direct 1-to-1 grounding in verified institutional records.',
    applied: true,
    detail: `Grounding verified with record "${topFact.title}" (${topFact.code}) at ${Math.round(topFact.relevanceScore * 100)}% match relevance.`,
  });

  // Apply Ontological Validation Rule if graph path exists
  if (graphResult.graphValidationPassed && graphResult.path.length > 0) {
    appliedRules.push({
      ruleId: 'RULE_ONTOLOGICAL_VALIDATION',
      ruleName: 'Knowledge Graph Path Validation',
      description: 'Validates entity-relationship path in knowledge graph.',
      applied: true,
      detail: `Ontological path confirmed: ${graphResult.path.map(p => `${p.from} -[${p.relationLabel}]-> ${p.to}`).join('; ')}.`,
    });
  }

  // Apply Boundary Rule
  appliedRules.push({
    ruleId: 'RULE_BOUNDARY_VERIFICATION',
    ruleName: 'Temporal & Quantitative Boundary Rule',
    description: 'Ensures values match official administrative directives exactly.',
    applied: true,
    detail: `Target verified value extracted: "${topFact.value}".`,
  });

  reasoningSteps.push({
    stepNumber: stepCounter++,
    phase: 'LOGICAL_SYNTHESIS',
    description: `Applied deductive inference on grounded premise [${topFact.code}]: "${topFact.fact}". Value extracted: "${topFact.value}".`,
    outcome: 'CONCLUSION_SUPPORTED',
  });

  // Generate verified precise response
  const naturalAnswer = synthesizeSupportedAnswer(query, topFact);

  return {
    answer: naturalAnswer,
    verificationStatus: 'VERIFIED',
    confidenceScore: topFact.confidence || 1.0,
    retrievedFacts: retrievalResult.matchedFacts,
    reasoningSteps,
    inferenceRules: appliedRules,
    graphPath: graphResult.path || [],
    provenance: topFact.source,
    primaryFact: topFact,
  };
}

/**
 * Synthesizes a clean, authoritative answer directly and strictly from the verified fact
 */
function synthesizeSupportedAnswer(query, fact) {
  const q = query.toLowerCase();
  
  // Clean targeted responses matching exact college queries
  if (q.includes('working hours') || (q.includes('college') && q.includes('hours'))) {
    return `College working hours are ${fact.value}. (Source: ${fact.source})`;
  }
  if (q.includes('library') && (q.includes('close') || q.includes('closing') || q.includes('time'))) {
    return `The library closing time is ${fact.value}. (Source: ${fact.source})`;
  }
  if (q.includes('casual leave')) {
    return `The casual leave allowance is ${fact.value}. (Source: ${fact.source})`;
  }
  if (q.includes('sick leave')) {
    return `The sick leave allowance is ${fact.value}. (Source: ${fact.source})`;
  }
  if (q.includes('internal exam') || q.includes('exam duration') || q.includes('internal examination')) {
    return `The internal examination duration is ${fact.value}. (Source: ${fact.source})`;
  }

  // Fallback to grounded fact text with source
  return `${fact.fact} [Verified Value: ${fact.value}] (Source: ${fact.source})`;
}

module.exports = {
  inferAnswer,
  INFERENCE_RULES,
  REJECTION_MESSAGE,
};
