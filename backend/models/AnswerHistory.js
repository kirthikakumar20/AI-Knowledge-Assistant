const mongoose = require('mongoose');

const AnswerHistorySchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'UNSUPPORTED'],
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
      default: 0.0,
    },
    retrievedFacts: [
      {
        knowledgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Knowledge' },
        title: String,
        fact: String,
        source: String,
        category: String,
        relevanceScore: Number,
        matchExplanation: String,
      },
    ],
    reasoningSteps: [
      {
        stepNumber: Number,
        phase: String,
        description: String,
        outcome: String,
      },
    ],
    inferenceRules: [
      {
        ruleId: String,
        ruleName: String,
        description: String,
        applied: Boolean,
        detail: String,
      },
    ],
    graphPath: [
      {
        from: String,
        relation: String,
        to: String,
      },
    ],
    executionTimeMs: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'answerhistories',
    timestamps: true,
  }
);

module.exports = mongoose.model('AnswerHistory', AnswerHistorySchema);
