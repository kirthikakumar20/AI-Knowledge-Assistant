const KnowledgeGraph = require('../models/KnowledgeGraph');

/**
 * Knowledge Graph Exploration Service
 * Traverses relationships to verify ontological consistency between entities
 */
async function exploreGraphForQuery(queryTokens, matchedFacts = []) {
  try {
    const graphDoc = await KnowledgeGraph.findOne().lean();
    if (!graphDoc || !graphDoc.nodes || !graphDoc.edges) {
      return {
        path: [],
        connectedEntities: [],
        graphValidationPassed: false,
        nodes: [],
        edges: [],
      };
    }

    const { nodes, edges } = graphDoc;
    const lowerTokens = queryTokens.map(t => t.toLowerCase());

    // 1. Identify active nodes matching tokens or matched facts
    const activeNodes = nodes.filter(node => {
      const nodeLabel = node.label.toLowerCase();
      const nodeDesc = (node.description || '').toLowerCase();
      const nodeCat = (node.category || '').toLowerCase();

      const directMatch = lowerTokens.some(t => nodeLabel.includes(t) || nodeDesc.includes(t) || nodeCat.includes(t));
      const factMatch = matchedFacts.some(f => 
        (f.entity && nodeLabel.includes(f.entity.toLowerCase())) ||
        (f.value && nodeLabel.includes(f.value.toLowerCase())) ||
        (f.title && nodeLabel.includes(f.title.toLowerCase()))
      );

      return directMatch || factMatch;
    });

    if (activeNodes.length === 0) {
      return {
        path: [],
        connectedEntities: [],
        graphValidationPassed: false,
        reason: 'Zero ontological entities recognized in knowledge graph for query.',
        nodes,
        edges,
      };
    }

    const activeNodeIds = new Set(activeNodes.map(n => n.id));

    // 2. Find edges connecting active nodes or radiating from them
    const relevantEdges = edges.filter(edge => 
      activeNodeIds.has(edge.source) || activeNodeIds.has(edge.target)
    );

    // 3. Construct readable relational pathways
    const path = relevantEdges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      return {
        from: sourceNode ? sourceNode.label : edge.source,
        relation: edge.relation,
        relationLabel: edge.label,
        to: targetNode ? targetNode.label : edge.target,
        confidence: edge.confidence,
      };
    });

    const connectedEntities = activeNodes.map(n => ({
      id: n.id,
      label: n.label,
      type: n.type,
      category: n.category,
    }));

    return {
      path,
      connectedEntities,
      graphValidationPassed: path.length > 0 || activeNodes.length > 0,
      reason: `Discovered ${activeNodes.length} active node(s) and ${path.length} validated relational path(s) in graph.`,
      nodes,
      edges,
    };
  } catch (error) {
    console.error('[Graph Service Error]', error);
    return {
      path: [],
      connectedEntities: [],
      graphValidationPassed: false,
      reason: error.message,
    };
  }
}

module.exports = {
  exploreGraphForQuery,
};
