const mongoose = require('mongoose');
const connectDB = require('./config/db');
const autoSeed = require('./seed/seedRunner');
const Knowledge = require('./models/Knowledge');
const Question = require('./models/Question');
const AnswerHistory = require('./models/AnswerHistory');
const KnowledgeGraph = require('./models/KnowledgeGraph');
const { retrieveKnowledge } = require('./services/retrievalService');
const { exploreGraphForQuery } = require('./services/graphService');
const { inferAnswer } = require('./services/inferenceService');

async function runTests() {
  console.log('=== STARTING BACKEND & MONGODB VALIDATION TEST ===');
  await connectDB();
  await autoSeed();

  const testQueries = [
    {
      q: 'What are the college working hours?',
      expectedStatus: 'VERIFIED',
      expectedKeyword: '9 AM to 4 PM',
    },
    {
      q: 'When does the library close?',
      expectedStatus: 'VERIFIED',
      expectedKeyword: '5 PM',
    },
    {
      q: 'What is the casual leave allowance?',
      expectedStatus: 'VERIFIED',
      expectedKeyword: '12 days per year',
    },
    {
      q: 'What is the hostel food menu?',
      expectedStatus: 'UNSUPPORTED',
      expectedKeyword: 'not available in our knowledge base',
    },
  ];

  console.log('\n--- TESTING CORE QUERIES ---');
  for (const t of testQueries) {
    console.log(`\nQuery: "${t.q}"`);
    const retrieval = await retrieveKnowledge(t.q);
    const graph = await exploreGraphForQuery(retrieval.tokens, retrieval.matchedFacts);
    const result = inferAnswer({ query: t.q, retrievalResult: retrieval, graphResult: graph });

    console.log(`Status: ${result.verificationStatus} (Expected: ${t.expectedStatus})`);
    console.log(`Answer: ${result.answer}`);
    console.log(`Rules Applied: ${result.inferenceRules.map(r => r.ruleName).join(', ')}`);
    console.log(`Confidence: ${result.confidenceScore}`);

    const statusMatch = result.verificationStatus === t.expectedStatus;
    const contentMatch = result.answer.toLowerCase().includes(t.expectedKeyword.toLowerCase());

    if (statusMatch && contentMatch) {
      console.log('>>> [PASS] Query produced verified expected response.');
    } else {
      console.error('>>> [FAIL] Query failed assertion!');
      process.exit(1);
    }

    // Save to DB to test real Mongoose operations
    await Question.create({
      query: t.q,
      status: result.verificationStatus,
      answerSummary: result.answer,
      confidenceScore: result.confidenceScore,
    });

    await AnswerHistory.create({
      question: t.q,
      answer: result.answer,
      verificationStatus: result.verificationStatus,
      confidenceScore: result.confidenceScore,
      retrievedFacts: result.retrievedFacts || [],
      reasoningSteps: result.reasoningSteps || [],
      inferenceRules: result.inferenceRules || [],
      graphPath: result.graphPath || [],
    });
  }

  console.log('\n--- VERIFYING MONGODB COLLECTIONS ---');
  const kCount = await Knowledge.countDocuments();
  const qCount = await Question.countDocuments();
  const hCount = await AnswerHistory.countDocuments();
  const gCount = await KnowledgeGraph.countDocuments();

  console.log(`Knowledge count: ${kCount}`);
  console.log(`Questions count: ${qCount}`);
  console.log(`AnswerHistories count: ${hCount}`);
  console.log(`KnowledgeGraphs count: ${gCount}`);

  if (kCount > 0 && qCount > 0 && hCount > 0 && gCount > 0) {
    console.log('\n>>> ALL 4 COLLECTIONS SUCCESSFULLY VERIFIED IN MONGODB COMPASS DATABASE!');
  } else {
    console.error('>>> Missing records in one or more collections.');
    process.exit(1);
  }

  await mongoose.disconnect();
  console.log('\n=== ALL BACKEND TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
