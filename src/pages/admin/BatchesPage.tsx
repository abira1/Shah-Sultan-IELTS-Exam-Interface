import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Loader,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { batchService } from '../../services/batchService';
import { allTracks } from '../../data/tracks';

interface Batch {
  batchId: string;
  batchName: string;
  startDate: string;
  endDate: string;
  schedule?: string;
  totalStudents: number;
  assignedTracks: string[];
  status: 'active' | 'completed' | 'upcoming';
  createdAt: string;
  createdBy: string;
}

export function BatchesPage() {
  const navigate = useNavigate();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [batchName, setBatchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [schedule, setSchedule] = useState('');
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [status, setStatus] = useState<'active' | 'upcoming' | 'completed'>('active');

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setIsLoading(true);
    try {
      const allBatches = await batchService.getAllBatches();
      setBatches(allBatches);
      
      // Recalculate student counts for all batches on load
      // This ensures counts are up-to-date even if they weren't updated before
      await recalculateAllStudentCounts(allBatches);
    } catch (err) {
      console.error('Error loading batches:', err);
      setError('Failed to load batches');
    } finally {
      setIsLoading(false);
    }
  };

  const recalculateAllStudentCounts = async (batchList: Batch[]) => {
    try {
      // Update student count for each batch
      const updatePromises = batchList.map(batch => 
        batchService.updateStudentCount(batch.batchId)
      );
      await Promise.all(updatePromises);
      
      // Reload batches to get updated counts
      const updatedBatches = await batchService.getAllBatches();
      setBatches(updatedBatches);
    } catch (err) {
      console.error('Error recalculating student counts:', err);
    }
  };

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setBatchName(batch.batchName);
      setStartDate(batch.startDate);
      setEndDate(batch.endDate);
      setSchedule(batch.schedule || '');
      setSelectedTracks(batch.assignedTracks || []);
      setStatus(batch.status);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBatch(null);
    resetForm();
  };

  const resetForm = () => {
    setBatchName('');
    setStartDate('');
    setEndDate('');
    setSchedule('');
    setSelectedTracks([]);
    setStatus('active');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!batchName.trim()) {
      setError('Batch name is required');
      return;
    }

    // Only validate date order if both dates are provided
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      if (editingBatch) {
        // Update existing batch
        const success = await batchService.updateBatch(editingBatch.batchId, {
          batchName,
          startDate,
          endDate,
          schedule,
          assignedTracks: selectedTracks,
          status
        });

        if (success) {
          setSuccess('Batch updated successfully!');
          handleCloseModal();
          await loadBatches();
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError('Failed to update batch');
        }
      } else {
        // Create new batch
        const result = await batchService.createBatch({
          batchName,
          startDate,
          endDate,
          schedule,
          assignedTracks: selectedTracks,
          status,
          totalStudents: 0,
          createdBy: 'admin' // TODO: Get from auth context
        });

        if (result.success) {
          setSuccess(`Batch ${result.batchId} created successfully!`);
          handleCloseModal();
          await loadBatches();
          setTimeout(() => setSuccess(null), 3000);
        } else {
          setError(result.error || 'Failed to create batch');
        }
      }
    } catch (err) {
      console.error('Error saving batch:', err);
      setError('Failed to save batch');
    }
  };

  const handleDelete = async (batchId: string) => {
    if (!confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await batchService.deleteBatch(batchId);
      if (success) {
        setSuccess('Batch deleted successfully!');
        await loadBatches();
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to delete batch');
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
      setError('Failed to delete batch');
    }
  };

  const toggleTrackSelection = (trackId: string) => {
    setSelectedTracks(prev =>
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleSelectAllTracks = () => {
    setSelectedTracks(allTracks.map(track => track.id));
  };

  const handleDeselectAllTracks = () => {
    setSelectedTracks([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
                <p className="text-sm text-gray-600">Create and manage student batches</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              data-testid="create-batch-button"
            >
              <Plus className="w-5 h-5" />
              Create Batch
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-900 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-900 text-sm">{success}</p>
          </div>
        )}

        {/* Batches Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="w-12 h-12 animate-spin mx-auto text-gray-400" />
            <p className="mt-4 text-gray-500">Loading batches...</p>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No batches yet</h3>
            <p className="text-gray-600 mb-4">Create your first batch to get started</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Batch
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <div
                key={batch.batchId}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{batch.batchName}</h3>
                    <p className="text-xs font-mono text-gray-500">{batch.batchId}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                      batch.status
                    )}`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{batch.totalStudents || 0} Students</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{batch.assignedTracks?.length || 0} Tracks</span>
                  </div>

                  {(batch.startDate || batch.endDate) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {batch.startDate ? new Date(batch.startDate).toLocaleDateString() : 'Not set'} -{' '}
                        {batch.endDate ? new Date(batch.endDate).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                  )}

                  {batch.schedule && (
                    <p className="text-xs text-gray-500">{batch.schedule}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenModal(batch)}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(batch.batchId)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Batch Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Morning Batch A"
                  required
                />
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mon-Fri 9AM-12PM"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Assigned Tracks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Assigned Tracks
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllTracks}
                      className="px-3 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                      data-testid="select-all-tracks-button"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllTracks}
                      className="px-3 py-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 rounded transition-colors"
                      data-testid="deselect-all-tracks-button"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                  {allTracks.map((track) => (
                    <label
                      key={track.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTracks.includes(track.id)}
                        onChange={() => toggleTrackSelection(track.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{track.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
