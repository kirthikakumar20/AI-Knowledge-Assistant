const Knowledge = require('../models/Knowledge');
const Question = require('../models/Question');
const AnswerHistory = require('../models/AnswerHistory');
const KnowledgeGraph = require('../models/KnowledgeGraph');
const { sampleKnowledge, sampleGraph } = require('../seed/seedData');
const mongoose = require('mongoose');

// GET dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          totalKnowledge: sampleKnowledge.length,
          totalQuestions: 4,
          verifiedCount: 3,
          unsupportedCount: 1,
          verificationRate: 75,
          preventionRate: 25,
          categories: [
            { name: 'Administration', count: 1 },
            { name: 'Library', count: 1 },
            { name: 'Examination', count: 1 },
            { name: 'HR & Policies', count: 2 },
            { name: 'Academic', count: 2 },
          ],
          graphStats: { nodesCount: sampleGraph.nodes.length, edgesCount: sampleGraph.edges.length },
          recentActivity: [],
        },
      });
    }

    const [totalKnowledge, totalQuestions, verifiedCount, unsupportedCount, categoriesAgg, graphDoc, recentActivity] =
      await Promise.all([
        Knowledge.countDocuments(),
        Question.countDocuments(),
        Question.countDocuments({ status: 'VERIFIED' }),
        Question.countDocuments({ status: 'UNSUPPORTED' }),
        Knowledge.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
        KnowledgeGraph.findOne().lean(),
        AnswerHistory.find().sort({ createdAt: -1 }).limit(5).lean(),
      ]);

    const verificationRate = totalQuestions > 0 ? Math.round((verifiedCount / totalQuestions) * 100) : 100;
    const preventionRate = totalQuestions > 0 ? Math.round((unsupportedCount / totalQuestions) * 100) : 0;

    const graphStats = {
      nodesCount: graphDoc?.nodes?.length || 0,
      edgesCount: graphDoc?.edges?.length || 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        totalKnowledge,
        totalQuestions,
        verifiedCount,
        unsupportedCount,
        verificationRate,
        preventionRate,
        categories: categoriesAgg.map(c => ({ name: c._id || 'Uncategorized', count: c.count })),
        graphStats,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('[Get Stats Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
