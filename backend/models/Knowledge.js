const mongoose = require('mongoose');

const KnowledgeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['Administration', 'Library', 'Examination', 'HR & Policies', 'Academic', 'Facilities', 'General'],
    },
    fact: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    entity: {
      type: String,
      trim: true,
      default: '',
    },
    attribute: {
      type: String,
      trim: true,
      default: '',
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    source: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    confidence: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 1,
    },
    rulesApplicable: [
      {
        type: String,
      },
    ],
  },
  {
    collection: 'knowledge',
    timestamps: true,
  }
);

KnowledgeSchema.index({ title: 'text', fact: 'text', keywords: 'text' });

module.exports = mongoose.model('Knowledge', KnowledgeSchema);
