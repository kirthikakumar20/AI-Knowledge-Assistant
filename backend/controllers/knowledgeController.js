const Knowledge = require('../models/Knowledge');
const { retrieveKnowledge } = require('../services/retrievalService');

// GET all knowledge entries with search and filter
const getKnowledgeList = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { fact: { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q, 'i')] } },
        { code: { $regex: q, $options: 'i' } },
        { entity: { $regex: q, $options: 'i' } },
      ];
    }

    const entries = await Knowledge.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    console.error('[Get Knowledge Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET single knowledge entry
const getKnowledgeById = async (req, res) => {
  try {
    const entry = await Knowledge.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, error: 'Knowledge record not found.' });
    }
    return res.status(200).json({ success: true, data: entry });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST add new knowledge entry
const createKnowledge = async (req, res) => {
  try {
    const { title, category, fact, value, entity, attribute, keywords, source } = req.body;

    if (!title || !fact || !value || !source) {
      return res.status(400).json({
        success: false,
        error: 'Title, Fact, Value, and Source are required fields.',
      });
    }

    // Generate unique code if not provided
    const count = await Knowledge.countDocuments();
    const code = req.body.code || `KB-${String(count + 1).padStart(3, '0')}`;

    const parsedKeywords = Array.isArray(keywords)
      ? keywords
      : (keywords || '')
          .split(',')
          .map(k => k.trim())
          .filter(Boolean);

    const newRecord = await Knowledge.create({
      code,
      title: title.trim(),
      category: category || 'General',
      fact: fact.trim(),
      value: value.trim(),
      entity: (entity || title).trim(),
      attribute: (attribute || 'Standard').trim(),
      keywords: parsedKeywords,
      source: source.trim(),
      verified: true,
      confidence: 1.0,
      rulesApplicable: ['RULE_DIRECT_FACT'],
    });

    return res.status(201).json({
      success: true,
      message: 'Knowledge entry added successfully and stored in MongoDB.',
      data: newRecord,
    });
  } catch (error) {
    console.error('[Create Knowledge Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// PUT update existing knowledge entry
const updateKnowledge = async (req, res) => {
  try {
    const { title, category, fact, value, entity, attribute, keywords, source, verified } = req.body;
    const entry = await Knowledge.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, error: 'Knowledge record not found.' });
    }

    if (title) entry.title = title.trim();
    if (category) entry.category = category;
    if (fact) entry.fact = fact.trim();
    if (value) entry.value = value.trim();
    if (entity !== undefined) entry.entity = entity.trim();
    if (attribute !== undefined) entry.attribute = attribute.trim();
    if (source) entry.source = source.trim();
    if (verified !== undefined) entry.verified = Boolean(verified);

    if (keywords !== undefined) {
      entry.keywords = Array.isArray(keywords)
        ? keywords
        : (keywords || '').split(',').map(k => k.trim()).filter(Boolean);
    }

    await entry.save();

    return res.status(200).json({
      success: true,
      message: 'Knowledge entry updated successfully.',
      data: entry,
    });
  } catch (error) {
    console.error('[Update Knowledge Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE knowledge entry
const deleteKnowledge = async (req, res) => {
  try {
    const entry = await Knowledge.findByIdAndDelete(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, error: 'Knowledge record not found.' });
    }
    return res.status(200).json({
      success: true,
      message: `Knowledge entry "${entry.title}" (${entry.code}) removed from MongoDB.`,
    });
  } catch (error) {
    console.error('[Delete Knowledge Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Search knowledge documents for Page C
const searchKnowledgeDocuments = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      const all = await Knowledge.find({ verified: true }).limit(10);
      return res.status(200).json({
        success: true,
        data: {
          tokens: [],
          matchedFacts: all.map(f => ({
            ...f.toObject(),
            relevanceScore: 1.0,
            matchExplanation: 'Default listing of authoritative knowledge base record.',
          })),
          hasSufficientEvidence: true,
          topRelevanceScore: 1.0,
          reason: 'Displaying top verified institutional documents.',
        },
      });
    }

    const result = await retrieveKnowledge(q.trim());
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getKnowledgeList,
  getKnowledgeById,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  searchKnowledgeDocuments,
};
