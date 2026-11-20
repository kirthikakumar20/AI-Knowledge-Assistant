const express = require('express');
const router = express.Router();

const { askQuestion } = require('../controllers/chatController');
const {
  getKnowledgeList,
  getKnowledgeById,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  searchKnowledgeDocuments,
} = require('../controllers/knowledgeController');
const { getGraphData, addNode, addEdge, resetGraph } = require('../controllers/graphController');
const { getActivityHistory, clearActivityHistory, deleteHistoryItem } = require('../controllers/historyController');
const { getDashboardStats } = require('../controllers/statsController');

// Chat & Inference
router.post('/chat/ask', askQuestion);

// Knowledge Base Management
router.get('/knowledge', getKnowledgeList);
router.get('/knowledge/search', searchKnowledgeDocuments);
router.get('/knowledge/:id', getKnowledgeById);
router.post('/knowledge', createKnowledge);
router.put('/knowledge/:id', updateKnowledge);
router.delete('/knowledge/:id', deleteKnowledge);

// Knowledge Graph
router.get('/graph', getGraphData);
router.post('/graph/nodes', addNode);
router.post('/graph/edges', addEdge);
router.post('/graph/reset', resetGraph);

// Activity History
router.get('/history', getActivityHistory);
router.delete('/history', clearActivityHistory);
router.delete('/history/:id', deleteHistoryItem);

// Dashboard Statistics
router.get('/stats', getDashboardStats);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'AI Knowledge Assistant Backend API',
    database: 'AIKnowledgeAssistant',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
