const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Knowledge = require('../models/Knowledge');
const KnowledgeGraph = require('../models/KnowledgeGraph');
const { sampleKnowledge, sampleGraph } = require('./seedData');

dotenv.config();

const autoSeed = async () => {
  try {
    const count = await Knowledge.countDocuments();
    if (count === 0) {
      console.log('[Seeding] Knowledge collection is empty. Seeding initial facts...');
      await Knowledge.insertMany(sampleKnowledge);
      console.log(`[Seeding] Successfully inserted ${sampleKnowledge.length} knowledge records.`);
    } else {
      console.log(`[Seeding] Knowledge collection already has ${count} records.`);
    }

    const graphCount = await KnowledgeGraph.countDocuments();
    if (graphCount === 0) {
      console.log('[Seeding] KnowledgeGraph collection is empty. Seeding initial graph...');
      await KnowledgeGraph.create(sampleGraph);
      console.log('[Seeding] Successfully seeded Knowledge Graph.');
    } else {
      console.log(`[Seeding] KnowledgeGraph already exists.`);
    }
  } catch (error) {
    console.error('[Seeding Error]', error.message);
  }
};

module.exports = autoSeed;
