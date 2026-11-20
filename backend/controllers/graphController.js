const KnowledgeGraph = require('../models/KnowledgeGraph');
const { sampleGraph } = require('../seed/seedData');
const mongoose = require('mongoose');

// GET full knowledge graph structure
const getGraphData = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          name: sampleGraph.name,
          version: sampleGraph.version,
          nodes: sampleGraph.nodes,
          edges: sampleGraph.edges,
        },
      });
    }

    let graph = await KnowledgeGraph.findOne().lean();
    if (!graph) {
      graph = await KnowledgeGraph.create(sampleGraph);
    }
    return res.status(200).json({
      success: true,
      data: {
        name: graph.name,
        version: graph.version,
        nodes: graph.nodes || [],
        edges: graph.edges || [],
      },
    });
  } catch (error) {
    console.error('[Get Graph Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST add node
const addNode = async (req, res) => {
  try {
    const { label, type, category, description } = req.body;
    if (!label || !type) {
      return res.status(400).json({ success: false, error: 'Label and Type are required.' });
    }

    let graph = await KnowledgeGraph.findOne();
    if (!graph) {
      graph = await KnowledgeGraph.create(sampleGraph);
    }

    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      label: label.trim(),
      type: type.trim(),
      category: category || 'General',
      description: description || '',
      x: Math.floor(Math.random() * 500) + 100,
      y: Math.floor(Math.random() * 400) + 100,
    };

    graph.nodes.push(newNode);
    await graph.save();

    return res.status(201).json({ success: true, data: newNode });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST add edge
const addEdge = async (req, res) => {
  try {
    const { source, target, relation, label } = req.body;
    if (!source || !target || !relation || !label) {
      return res.status(400).json({ success: false, error: 'Source, target, relation, and label are required.' });
    }

    let graph = await KnowledgeGraph.findOne();
    if (!graph) {
      graph = await KnowledgeGraph.create(sampleGraph);
    }

    const id = `edge_${Date.now()}`;
    const newEdge = {
      id,
      source,
      target,
      relation,
      label,
      confidence: 1.0,
      provenance: 'User Configured Ontological Link',
    };

    graph.edges.push(newEdge);
    await graph.save();

    return res.status(201).json({ success: true, data: newEdge });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// POST reset graph
const resetGraph = async (req, res) => {
  try {
    await KnowledgeGraph.deleteMany({});
    const newGraph = await KnowledgeGraph.create(sampleGraph);
    return res.status(200).json({
      success: true,
      message: 'Knowledge Graph reset to institutional baseline.',
      data: newGraph,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getGraphData,
  addNode,
  addEdge,
  resetGraph,
};
