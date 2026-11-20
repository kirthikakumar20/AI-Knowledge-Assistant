import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Filter, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeManager({ onDataChange }) {
  const [knowledgeList, setKnowledgeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Administration',
    fact: '',
    value: '',
    entity: '',
    attribute: '',
    source: '',
    keywords: '',
  });

  const fetchKnowledge = async () => {
    setLoading(true);
    try {
      const res = await api.getKnowledge(
        selectedCategory === 'All' ? '' : selectedCategory,
        searchTerm
      );
      if (res.success) {
        setKnowledgeList(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, [selectedCategory, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Administration',
      fact: '',
      value: '',
      entity: '',
      attribute: '',
      source: '',
      keywords: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      fact: item.fact,
      value: item.value,
      entity: item.entity || '',
      attribute: item.attribute || '',
      source: item.source,
      keywords: Array.isArray(item.keywords) ? item.keywords.join(', ') : item.keywords || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from MongoDB?`)) {
      try {
        const res = await api.deleteKnowledge(id);
        if (res.success) {
          fetchKnowledge();
          if (onDataChange) onDataChange();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.updateKnowledge(editingItem._id, formData);
      } else {
        await api.createKnowledge(formData);
      }
      setIsModalOpen(false);
      fetchKnowledge();
      if (onDataChange) onDataChange();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="knowledge-manager-page">
      {/* Header Bar */}
      <div className="glass-card mb-6">
        <div className="card-header-flex">
          <div>
            <h3>Knowledge Base Management (MongoDB Compass)</h3>
            <p className="text-secondary">
              Direct CRUD operations for administrative facts. All mutations persist in collection <code>knowledge</code>.
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={16} /> Add Knowledge Record
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="km-filter-bar mt-4">
          <div className="search-input-wrap flex-1">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search facts by keyword, code, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="km-search-input"
            />
          </div>

          <div className="category-select-wrap">
            <Filter size={14} className="select-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="km-category-select"
            >
              <option value="All">All Categories</option>
              <option value="Administration">Administration</option>
              <option value="Library">Library</option>
              <option value="Examination">Examination</option>
              <option value="HR & Policies">HR & Policies</option>
              <option value="Academic">Academic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Knowledge Records */}
      <div className="glass-card table-card">
        {loading ? (
          <div className="table-loading">Loading records from MongoDB...</div>
        ) : knowledgeList.length > 0 ? (
          <div className="table-responsive">
            <table className="knowledge-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Title & Entity</th>
                  <th>Category</th>
                  <th>Verified Fact & Target Value</th>
                  <th>Official Source</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {knowledgeList.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <span className="code-pill font-mono">{item.code}</span>
                    </td>
                    <td>
                      <div className="cell-title-wrap">
                        <strong>{item.title}</strong>
                        {item.entity && <span className="entity-tag font-mono">{item.entity}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">{item.category}</span>
                    </td>
                    <td>
                      <div className="fact-content-cell">
                        <p className="fact-text">"{item.fact}"</p>
                        <span className="fact-val-badge">Value: {item.value}</span>
                      </div>
                    </td>
                    <td className="source-cell">
                      <span className="source-text" title={item.source}>
                        {item.source}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-verified">
                        <CheckCircle size={11} /> Verified
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="action-icon-btn edit-btn"
                          title="Edit Record"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="action-icon-btn delete-btn"
                          title="Delete Record"
                          onClick={() => handleDelete(item._id, item.title)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-8">
            <AlertCircle size={32} className="text-warning mb-2" />
            <h4>No Knowledge Records Found</h4>
            <p className="text-secondary">Click "Add Knowledge Record" to seed a new verified fact into MongoDB.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-card modal-lg">
            <div className="modal-header">
              <h4>{editingItem ? 'Edit Knowledge Record' : 'Add New Grounded Knowledge Record'}</h4>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-grid-2">
                <div className="form-group mb-3">
                  <label>Record Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hostel Gate Closing Timing"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Administration">Administration</option>
                    <option value="Library">Library</option>
                    <option value="Examination">Examination</option>
                    <option value="HR & Policies">HR & Policies</option>
                    <option value="Academic">Academic</option>
                    <option value="Facilities">Facilities</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Verified Fact Sentence *</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. The hostel main gate closes at 9:30 PM for all residential students."
                  value={formData.fact}
                  onChange={(e) => setFormData({ ...formData, fact: e.target.value })}
                ></textarea>
              </div>

              <div className="modal-grid-3">
                <div className="form-group mb-3">
                  <label>Extracted Target Value *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9:30 PM"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Primary Entity</label>
                  <input
                    type="text"
                    placeholder="e.g. Hostel Gate"
                    value={formData.entity}
                    onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Target Attribute</label>
                  <input
                    type="text"
                    placeholder="e.g. Curfew Timing"
                    value={formData.attribute}
                    onChange={(e) => setFormData({ ...formData, attribute: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Official Source Document *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Residential Hostel Code of Conduct 2026, Section 3.2"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>

              <div className="form-group mb-4">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. hostel, gate, closing, curfew, timing, night"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Save Updates to MongoDB' : 'Insert Record into MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
