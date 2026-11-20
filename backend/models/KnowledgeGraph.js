const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, required: true }, // 'Organization', 'Department', 'Policy', 'TimeValue', 'Metric', 'Regulation'
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  { _id: false }
);

const EdgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    relation: { type: String, required: true }, // 'OPERATES_DURING', 'CLOSES_AT', 'HAS_DURATION', 'ALLOWS', 'GOVERNED_BY'
    label: { type: String, required: true },
    confidence: { type: Number, default: 1.0 },
    provenance: { type: String, default: 'Verified Knowledge Base' },
  },
  { _id: false }
);

const KnowledgeGraphSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'College Academic & Administrative Knowledge Graph',
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
  },
  {
    collection: 'knowledgegraphs',
    timestamps: true,
  }
);

module.exports = mongoose.model('KnowledgeGraph', KnowledgeGraphSchema);
