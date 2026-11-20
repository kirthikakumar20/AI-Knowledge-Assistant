const Knowledge = require('../models/Knowledge');

// Common English stopwords to filter out
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
  'it', 'its', 'itself', 'let', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
  'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'were', 'weren\'t',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'tell',
  'please', 'give', 'know', 'want', 'find', 'much', 'many'
]);

/**
 * Tokenize and normalize text
 */
function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Knowledge retrieval service
 * Queries MongoDB knowledge collection and calculates relevance
 */
async function retrieveKnowledge(queryText) {
  const queryTokens = tokenize(queryText);

  // If no meaningful tokens found
  if (queryTokens.length === 0) {
    return {
      tokens: [],
      matchedFacts: [],
      hasSufficientEvidence: false,
      topRelevanceScore: 0,
      reason: 'Query does not contain searchable domain entities or keywords.',
    };
  }

  // Fetch all verified knowledge entries from MongoDB
  const allKnowledge = await Knowledge.find({ verified: true }).lean();

  const scoredFacts = [];

  for (const item of allKnowledge) {
    const itemTokens = new Set([
      ...tokenize(item.title),
      ...tokenize(item.fact),
      ...tokenize(item.entity || ''),
      ...tokenize(item.attribute || ''),
      ...(item.keywords || []).map(k => k.toLowerCase())
    ]);

    // Calculate token matches
    const matchedKeywords = queryTokens.filter(token => {
      // direct match
      if (itemTokens.has(token)) return true;
      // partial substring match for longer words
      for (const it of itemTokens) {
        if (it.length > 3 && (it.includes(token) || token.includes(it))) return true;
      }
      return false;
    });

    // Score calculation
    const matchRatio = matchedKeywords.length / Math.max(queryTokens.length, 1);
    
    // Keyword density bonus
    let bonus = 0;
    if (queryTokens.some(t => item.title.toLowerCase().includes(t))) bonus += 0.25;
    if (item.entity && queryTokens.some(t => item.entity.toLowerCase().includes(t))) bonus += 0.25;
    if (item.attribute && queryTokens.some(t => item.attribute.toLowerCase().includes(t))) bonus += 0.2;

    const relevanceScore = Math.min(1.0, Number((matchRatio * 0.6 + bonus).toFixed(3)));

    if (relevanceScore >= 0.25 && matchedKeywords.length > 0) {
      scoredFacts.push({
        knowledgeId: item._id,
        code: item.code,
        title: item.title,
        category: item.category,
        fact: item.fact,
        value: item.value,
        entity: item.entity,
        attribute: item.attribute,
        source: item.source,
        confidence: item.confidence,
        rulesApplicable: item.rulesApplicable,
        relevanceScore,
        matchedKeywords,
        matchExplanation: `Matched ${matchedKeywords.length} query token(s) [${matchedKeywords.join(', ')}] with ${Math.round(relevanceScore * 100)}% relevance to institutional record '${item.title}'.`,
      });
    }
  }

  // Sort descending by relevanceScore
  scoredFacts.sort((a, b) => b.relevanceScore - a.relevanceScore);

  const topScore = scoredFacts.length > 0 ? scoredFacts[0].relevanceScore : 0;
  // Rigorous verification threshold: 0.35 minimum relevance
  const hasSufficientEvidence = topScore >= 0.35;

  return {
    tokens: queryTokens,
    matchedFacts: scoredFacts,
    hasSufficientEvidence,
    topRelevanceScore: topScore,
    reason: hasSufficientEvidence
      ? `Retrieved ${scoredFacts.length} relevant grounded fact(s) meeting verification threshold.`
      : `No fact in MongoDB knowledge base satisfied minimum relevance threshold (Top score: ${topScore}).`,
  };
}

module.exports = {
  retrieveKnowledge,
  tokenize,
};
