import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ticketSchema } from '../utils/schemas';

const CreateTicketModal = ({ isOpen, onClose, onSubmit, loading, initialData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'Medium',
          status: 'Open',
          assignedTo: ''
        });
      }
    } else {
      setFormErrors({});
    }
  }, [isOpen, initialData]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get('/auth/users');
      setUsers(res.data.data);
    } catch {
      // Silent fail for production
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    const result = ticketSchema.safeParse(formData);

    if (!result.success) {
      const errors = {};
      if (result.error && result.error.issues) {
        result.error.issues.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
      }
      setFormErrors(errors);
      return;
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEdit ? 'Edit Ticket' : 'Create New Ticket'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Login button not working"
              className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.title ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
            />
            {formErrors.title && <p className="mt-1 text-xs text-red-600">{formErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue or feature request in detail..."
              className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.description ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
            ></textarea>
            {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.priority ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${formErrors.priority ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {formErrors.priority && <p className="mt-1 text-xs text-red-600">{formErrors.priority}</p>}
            </div>

            <div>
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${formErrors.status ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              {formErrors.status && <p className="mt-1 text-xs text-red-600">{formErrors.status}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="assignedTo" className="text-sm font-medium text-gray-700">
              Assign To
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={loadingUsers}
              className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.assignedTo ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${formErrors.assignedTo ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {formErrors.assignedTo && <p className="mt-1 text-xs text-red-600">{formErrors.assignedTo}</p>}
            {loadingUsers && <p className="mt-1 text-xs text-gray-500">Loading users...</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300"
            >
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Ticket' : 'Create Ticket')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
