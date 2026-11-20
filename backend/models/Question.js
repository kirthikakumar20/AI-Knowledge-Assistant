const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['VERIFIED', 'UNSUPPORTED'],
      default: 'UNSUPPORTED',
    },
    answerSummary: {
      type: String,
      default: '',
    },
    matchedKnowledgeIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Knowledge',
      },
    ],
    confidenceScore: {
      type: Number,
      default: 0.0,
    },
  },
  {
    collection: 'questions',
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', QuestionSchema);
