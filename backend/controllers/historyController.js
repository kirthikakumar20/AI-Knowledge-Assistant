const AnswerHistory = require('../models/AnswerHistory');
const Question = require('../models/Question');

// GET activity history
const getActivityHistory = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== 'ALL') {
      filter.verificationStatus = status;
    }

    const histories = await AnswerHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10))
      .lean();

    return res.status(200).json({
      success: true,
      count: histories.length,
      data: histories,
    });
  } catch (error) {
    console.error('[Get History Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Clear all activity history
const clearActivityHistory = async (req, res) => {
  try {
    await AnswerHistory.deleteMany({});
    await Question.deleteMany({});
    return res.status(200).json({
      success: true,
      message: 'All activity records purged from MongoDB.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete single history item
const deleteHistoryItem = async (req, res) => {
  try {
    await AnswerHistory.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'History item removed.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getActivityHistory,
  clearActivityHistory,
  deleteHistoryItem,
};
