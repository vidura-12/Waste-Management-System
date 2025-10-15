import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CreditCard, Calendar, Package, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, Filter, Search } from 'lucide-react';

const AllSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock customer ID - replace with your actual logic
  const cusID = 'customer123'; // localStorage.getItem('cusID');

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Mock data - replace with your actual API call
        setTimeout(() => {
          const mockSchedules = [
            {
              scheduleID: 1,
              scheduleType: 'general',
              wasteType: 'organic',
              date: '2025-10-20',
              remarks: 'Regular pickup',
              paymentMethod: 'cash',
              price: 250,
              status: 'accepted'
            },
            {
              scheduleID: 2,
              scheduleType: 'special',
              wasteType: 'ewaste',
              date: '2025-10-25',
              remarks: 'Old electronics',
              paymentMethod: 'card',
              price: 500,
              status: 'pending'
            },
            {
              scheduleID: 3,
              scheduleType: 'general',
              wasteType: 'recyclable',
              date: '2025-10-18',
              remarks: '',
              paymentMethod: 'cash',
              price: 200,
              status: 'completed'
            },
            {
              scheduleID: 4,
              scheduleType: 'special',
              wasteType: 'organic',
              date: '2025-10-30',
              remarks: 'Large amount',
              paymentMethod: 'card',
              price: 350,
              status: 'rejected'
            }
          ];
          setSchedules(mockSchedules);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.log('Error fetching data');
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
    if (confirmDelete) {
      try {
        // await axios.delete(`URL/${cusID}/${id}`);
        setSchedules(schedules.filter((schedule) => schedule.scheduleID !== id));
      } catch (error) {
        console.log('Error deleting schedule:', error);
      }
    }
  };

  const handleUpdate = (schedule) => {
    setSelectedSchedule({ ...schedule });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      // await axios.put(`URL/${cusID}/${selectedSchedule.scheduleID}`, selectedSchedule);
      setSchedules(schedules.map(s => 
        s.scheduleID === selectedSchedule.scheduleID ? selectedSchedule : s
      ));
      setIsModalOpen(false);
      setSelectedSchedule(null);
    } catch (error) {
      console.log('Error updating schedule:', error);
    }
  };

  const handlePay = (id) => {
    console.log('Processing payment for schedule:', id);
    // Implement your payment logic here
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusConfig = (status) => {
    const configs = {
      accepted: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Accepted'
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Rejected'
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: <Clock className="w-4 h-4" />,
        label: 'Pending'
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completed'
      }
    };
    return configs[status] || configs.pending;
  };

  const getWasteTypeConfig = (type) => {
    const configs = {
      organic: { color: 'text-green-600', bg: 'bg-green-50', label: 'Organic' },
      recyclable: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Recyclable' },
      ewaste: { color: 'text-purple-600', bg: 'bg-purple-50', label: 'E-Waste' }
    };
    return configs[type] || configs.organic;
  };

  const filteredSchedules = schedules
    .filter(s => filterStatus === 'all' || s.status === filterStatus)
    .filter(s => 
      s.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scheduleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.remarks && s.remarks.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const stats = {
    total: schedules.length,
    accepted: schedules.filter(s => s.status === 'accepted').length,
    pending: schedules.filter(s => s.status === 'pending').length,
    rejected: schedules.filter(s => s.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 text-lg">Loading schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-2">
                My Schedules
              </h1>
              <p className="text-gray-600 text-lg">Manage and track all your waste collection schedules</p>
            </div>
            <button
              onClick={() => window.location.href = '/wasteSchedule'}
              className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Schedule
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 text-gray-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Schedules</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold">{stats.accepted}</div>
              <div className="text-sm text-green-100">Accepted</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <div className="text-sm text-yellow-100">Pending</div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="w-8 h-8" />
              </div>
              <div className="text-3xl font-bold">{stats.rejected}</div>
              <div className="text-sm text-red-100">Rejected</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search schedules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all capitalize ${
                    filterStatus === status
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedules Grid */}
        {filteredSchedules.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Schedules Found</h3>
            <p className="text-gray-600">Try adjusting your filters or create a new schedule</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...filteredSchedules].reverse().map((schedule) => {
              const statusConfig = getStatusConfig(schedule.status);
              const wasteConfig = getWasteTypeConfig(schedule.wasteType);
              const canEdit = schedule.status !== 'accepted' && schedule.status !== 'rejected';
              const canPay = schedule.paymentMethod === 'card' && (schedule.status === 'accepted' || schedule.status === 'pending');

              return (
                <div
                  key={schedule.scheduleID}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className={`p-6 ${wasteConfig.bg} border-b border-gray-100`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl bg-white shadow-sm`}>
                          <Package className={`w-6 h-6 ${wasteConfig.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 capitalize">{wasteConfig.label}</h3>
                          <p className="text-sm text-gray-600 capitalize">{schedule.scheduleType} Schedule</p>
                        </div>
                      </div>
                      <div className={`${statusConfig.bg} ${statusConfig.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="font-medium">{formatDate(schedule.date)}</span>
                    </div>

                    {schedule.remarks && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Remarks:</span> {schedule.remarks}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <span className="text-2xl font-bold text-gray-900">{schedule.price}</span>
                        <span className="text-gray-600">LKR</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        schedule.paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {schedule.paymentMethod === 'card' ? 'Card Payment' : 'Cash on Delivery'}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6 flex gap-2">
                    {canEdit ? (
                      <>
                        <button
                          onClick={() => handleUpdate(schedule)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-3 rounded-xl font-semibold transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.scheduleID)}
                          className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 text-center text-gray-400 py-3 text-sm">
                        No actions available
                      </div>
                    )}
                    
                    {canPay && (
                      <button
                        onClick={() => handlePay(schedule.scheduleID)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
                      >
                        <CreditCard className="w-4 h-4" />
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Modal */}
      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 rounded-t-3xl">
              <h2 className="text-3xl font-bold text-gray-900">Update Schedule</h2>
              <p className="text-gray-600 mt-1">Modify your waste collection details</p>
            </div>

            <div className="p-8 space-y-6">
              {/* Schedule Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Schedule Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['general', 'special'].map((type) => (
                    <label
                      key={type}
                      className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedSchedule.scheduleType === type
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="scheduleType"
                        value={type}
                        checked={selectedSchedule.scheduleType === type}
                        onChange={(e) => setSelectedSchedule({ ...selectedSchedule, scheduleType: e.target.value })}
                        className="sr-only"
                      />
                      <span className="font-semibold capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Waste Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Waste Type</label>
                <select
                  value={selectedSchedule.wasteType}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, wasteType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                >
                  <option value="">Select waste type</option>
                  <option value="organic">Organic</option>
                  <option value="recyclable">Recyclable</option>
                  <option value="ewaste">E-waste</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Collection Date</label>
                <input
                  type="date"
                  value={selectedSchedule.date}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Remarks (Optional)</label>
                <textarea
                  placeholder="Add any special instructions..."
                  value={selectedSchedule.remarks || ''}
                  onChange={(e) => setSelectedSchedule({ ...selectedSchedule, remarks: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none resize-none"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'card', label: 'Card Payment', icon: <CreditCard className="w-5 h-5" /> },
                    { value: 'cash', label: 'Cash on Delivery', icon: <DollarSign className="w-5 h-5" /> }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedSchedule.paymentMethod === method.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={selectedSchedule.paymentMethod === method.value}
                        onChange={(e) => setSelectedSchedule({ ...selectedSchedule, paymentMethod: e.target.value })}
                        className="sr-only"
                      />
                      {method.icon}
                      <span className="font-semibold">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-8 py-6 rounded-b-3xl flex gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllSchedules;