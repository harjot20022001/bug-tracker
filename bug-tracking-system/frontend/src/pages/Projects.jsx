import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import { FiBox, FiPlus, FiAlertTriangle, FiLoader, FiEdit, FiTrash2 } from 'react-icons/fi';
import CreateProjectModal from '../components/CreateProjectModal';
import ConfirmationModal from '../components/ConfirmationModal';
import axios from 'axios';

const Projects = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { projects, loading, error, createProject, createLoading, createError, fetchProjects } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCreateProject = async (projectData) => {
    const success = await createProject(projectData);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleEditProject = async (projectData) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/projects/${editingProject._id}`,
        projectData,
        config
      );

      await fetchProjects();
      setEditingProject(null);
      setIsModalOpen(false);
    } catch {
      // Silent fail for production
    }
  };

  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      setDeleteLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`/projects/${projectToDelete._id}`, config);
      fetchProjects(); 
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch {
      // Silent fail for production
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
          <FiLoader className="animate-spin text-4xl mb-4" />
          <p>Loading projects...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-500 bg-red-50 p-8 rounded-lg">
          <FiAlertTriangle className="text-4xl mb-4" />
          <h2 className="text-xl font-semibold">An Error Occurred</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (projects.length === 0) {
      return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FiBox className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {user?.role === 'admin' 
              ? 'Get started by creating a new project.' 
              : 'Contact an admin to create projects.'}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div 
            key={project._id} 
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-500 transition-all duration-300 transform hover:-translate-y-1 relative group"
          >
            <div 
              onClick={() => navigate(`/projects/${project._id}`)}
              className="cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-3">{project.description}</p>
              {project.owner && (
                <p className="mt-3 text-xs text-gray-500">
                  Owner: {project.owner.name}
                </p>
              )}
            </div>
            
            {user?.role === 'admin' && (
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(project);
                  }}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Edit Project"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project);
                  }}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Delete Project"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
            <p className="mt-2 text-lg text-gray-500">Manage your projects and track their progress.</p>
          </div>
          {user?.role === 'admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Create Project
            </button>
          )}
        </div>

        {createError && <p className="text-red-500 bg-red-50 p-4 rounded-lg mb-6">{createError}</p>}
        
        {renderContent()}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleEditProject : handleCreateProject}
        loading={createLoading}
        initialData={editingProject}
        isEditing={!!editingProject}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.name}"? This action cannot be undone and will also delete all tickets associated with this project.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />
    </>
  );
};

export default Projects;
