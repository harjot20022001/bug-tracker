import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { FiArrowLeft, FiPlus, FiUser, FiCalendar, FiAlertCircle, FiCheckCircle, FiClock, FiEdit, FiTrash2, FiLoader, FiUsers } from 'react-icons/fi';
import CreateTicketModal from '../components/CreateTicketModal';
import ConfirmationModal from '../components/ConfirmationModal';
import TicketFilters from '../components/TicketFilters';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, token, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [createTicketLoading, setCreateTicketLoading] = useState(false);
  const [createTicketError, setCreateTicketError] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (authLoading || !isAuthenticated || !token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const [projectRes, ticketsRes, usersRes] = await Promise.all([
          axios.get(`/projects/${id}`, config),
          axios.get(`/projects/${id}/tickets`, config),
          axios.get(`/users`, config)
        ]);
        
        setProject(projectRes.data.data);
        setTickets(ticketsRes.data.data || []);
        setUsers(usersRes.data.data || []);
      } catch {
        setError('Failed to fetch project details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id, isAuthenticated, authLoading, token]);

  const fetchTicketsWithFilters = useCallback(async (filterParams = {}) => {
    if (!token || !id) return;
    
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const queryParams = new URLSearchParams();
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value !== 'all') {
          queryParams.append(key, value);
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/projects/${id}/tickets${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url, config);
      setTickets(response.data.data || []);
    } catch {
      // Silent fail for production
    }
  }, [token, id]);

  const handleFiltersChange = useCallback((newFilters) => {
    fetchTicketsWithFilters(newFilters);
  }, [fetchTicketsWithFilters]);

  const handleCreateTicket = async (ticketData) => {
    try {
      setCreateTicketLoading(true);
      setCreateTicketError(null);
      const res = await axios.post(`/projects/${id}/tickets`, ticketData);
      setTickets((prevTickets) => [...prevTickets, res.data.data]);
      setIsTicketModalOpen(false);
      return true;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to create ticket.';
      setCreateTicketError(errorMessage);
      return false;
    } finally {
      setCreateTicketLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setIsEditModalOpen(true);
  };

  const handleUpdateTicket = async (ticketData) => {
    try {
      setCreateTicketLoading(true);
      setCreateTicketError(null);
      
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/tickets/${editingTicket._id}`, ticketData, config);
      setTickets((prevTickets) => 
        prevTickets.map(ticket => 
          ticket._id === editingTicket._id ? res.data.data : ticket
        )
      );
      setIsEditModalOpen(false);
      setEditingTicket(null);
      return true;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to update ticket.';
      setCreateTicketError(errorMessage);
      return false;
    } finally {
      setCreateTicketLoading(false);
    }
  };

  const handleDeleteTicket = (ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;

    try {
      setDeleteLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      await axios.delete(`/tickets/${ticketToDelete._id}`, config);
      setTickets(tickets.filter(ticket => ticket._id !== ticketToDelete._id));
      setIsDeleteModalOpen(false);
      setTicketToDelete(null);
    } catch {
      // Silent fail for production
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col items-center justify-center text-center text-gray-500 py-12">
          <FiLoader className="animate-spin text-4xl mb-4" />
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col items-center justify-center text-center text-red-500 bg-red-50 p-8 rounded-lg">
          <FiAlertTriangle className="text-4xl mb-4" />
          <h2 className="text-xl font-semibold">Project Not Found</h2>
          <p>{error || 'The requested project could not be found.'}</p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{project.name}</h1>
            <p className="mt-2 text-lg text-gray-500">{project.description}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsTicketModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">{tickets.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiCalendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Open Tickets</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(ticket => ticket.status?.toLowerCase() === 'open').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiCalendar className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tickets.filter(ticket => ticket.status?.toLowerCase() === 'in progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <TicketFilters onFiltersChange={handleFiltersChange} users={users} />

      <div className="bg-white shadow-md rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tickets</h3>
        </div>
        
        <div className="p-6">
          {tickets.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new ticket for this project.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{ticket.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status || 'Open'}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority || 'Medium'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{ticket.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          {ticket.submitter && (
                            <span>By {ticket.submitter.name}</span>
                          )}
                          {ticket.assignedTo ? (
                            <span className="text-indigo-600 font-medium">
                              Assigned to {ticket.assignedTo.name}
                            </span>
                          ) : (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEditTicket(ticket)}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            <FiEdit className="w-4 h-4" />
                            Edit
                          </button>
                          {user?.role === 'admin' && (
                            <button 
                              onClick={() => handleDeleteTicket(ticket)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {createTicketError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{createTicketError}</p>
        </div>
      )}

      <CreateTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
        loading={createTicketLoading}
      />

      {editingTicket && (
        <CreateTicketModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTicket(null);
          }}
          onSubmit={handleUpdateTicket}
          loading={createTicketLoading}
          initialData={{
            title: editingTicket.title,
            description: editingTicket.description,
            priority: editingTicket.priority,
            status: editingTicket.status,
            assignedTo: editingTicket.assignedTo?._id || ''
          }}
          isEdit={true}
        />
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={confirmDeleteTicket}
        title="Delete Ticket"
        message={`Are you sure you want to delete "${ticketToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Ticket"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
};

export default ProjectDetails;
