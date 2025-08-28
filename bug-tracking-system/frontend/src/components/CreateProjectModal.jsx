import React, { useState, useEffect } from 'react';
import { projectSchema } from '../utils/schemas';

const CreateProjectModal = ({ isOpen, onClose, onSubmit, loading, initialData, isEditing }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    } else if (!isOpen) {
      setFormData({ name: '', description: '' });
      setFormErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    const result = projectSchema.safeParse(formData);

    if (!result.success) {
      const errors = {};
      result.error.issues.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
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

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Project' : 'Create a New Project'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isEditing ? 'Update the project details below.' : 'Fill out the details below to get started.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., E-commerce Platform"
              className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.name ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
            />
            {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
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
              placeholder="A brief description of your project..."
              className={`mt-1 block w-full px-4 py-3 bg-white/80 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 ${formErrors.description ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} sm:text-sm transition duration-300`}
            ></textarea>
            {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
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
              className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-300"
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Project' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
