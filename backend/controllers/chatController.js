const { retrieveKnowledge } = require('../services/retrievalService');
const { exploreGraphForQuery } = require('../services/graphService');
const { inferAnswer } = require('../services/inferenceService');
const Question = require('../models/Question');
const AnswerHistory = require('../models/AnswerHistory');

/**
 * Handle incoming user question
 * Full 9-step pipeline
 */
const askQuestion = async (req, res) => {
  const startTime = Date.now();
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Question query string is required.',
      });
    }

    const trimmedQuery = query.trim();

    // Step 2 & 3: Knowledge Base Search & Retrieval
    const retrievalResult = await retrieveKnowledge(trimmedQuery);

    // Step 4: Knowledge Graph Exploration
    const graphResult = await exploreGraphForQuery(retrievalResult.tokens, retrievalResult.matchedFacts);

    // Step 5 & 6: Rule-Based Logical Inference
    const inferenceResult = inferAnswer({
      query: trimmedQuery,
      retrievalResult,
      graphResult,
    });

    const executionTimeMs = Date.now() - startTime;

    // Step 9: Store Question and Result in MongoDB Collections
    let savedQuestion = null;
    let savedHistory = null;

    try {
      savedQuestion = await Question.create({
        query: trimmedQuery,
        status: inferenceResult.verificationStatus,
        answerSummary: inferenceResult.answer,
        matchedKnowledgeIds: (inferenceResult.retrievedFacts || []).map(f => f.knowledgeId).filter(Boolean),
        confidenceScore: inferenceResult.confidenceScore,
      });

      savedHistory = await AnswerHistory.create({
        question: trimmedQuery,
        answer: inferenceResult.answer,
        verificationStatus: inferenceResult.verificationStatus,
        confidenceScore: inferenceResult.confidenceScore,
        retrievedFacts: inferenceResult.retrievedFacts || [],
        reasoningSteps: inferenceResult.reasoningSteps || [],
        inferenceRules: inferenceResult.inferenceRules || [],
        graphPath: inferenceResult.graphPath || [],
        executionTimeMs,
      });
    } catch (dbSaveErr) {
      console.warn('[MongoDB Save Warning]', dbSaveErr.message);
    }

    return res.status(200).json({
      success: true,
      data: {
        id: savedHistory ? savedHistory._id : null,
        question: trimmedQuery,
        answer: inferenceResult.answer,
        verificationStatus: inferenceResult.verificationStatus,
        confidenceScore: inferenceResult.confidenceScore,
        retrievedFacts: inferenceResult.retrievedFacts,
        reasoningSteps: inferenceResult.reasoningSteps,
        inferenceRules: inferenceResult.inferenceRules,
        graphPath: inferenceResult.graphPath,
        connectedEntities: graphResult.connectedEntities || [],
        provenance: inferenceResult.provenance || 'N/A',
        executionTimeMs,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[Chat Controller Error]', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during knowledge inference processing.',
      details: error.message,
    });
  }
};

module.exports = {
  askQuestion,
};
