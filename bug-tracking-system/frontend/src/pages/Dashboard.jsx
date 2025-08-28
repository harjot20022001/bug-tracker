import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import axios from 'axios';
import { FiUsers, FiFolder, FiCheckCircle, FiClock, FiTrendingUp, FiBox, FiAlertTriangle } from 'react-icons/fi';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <div 
    className={`relative p-6 bg-white rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 rounded-full ${color} opacity-20`}></div>
    <div className="relative flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-20`}>{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, token, user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  const [dashboardStats, setDashboardStats] = useState({
    totalProjects: 0,
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    closedTickets: 0,
    assignedTickets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authLoading || !isAuthenticated || projectsLoading || !token) {
        return;
      }

      try {
        setLoading(true);
        
        const totalProjects = projects.length;
        let totalTickets = 0;
        let openTickets = 0;
        let inProgressTickets = 0;
        let closedTickets = 0;
        let allTickets = [];

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const ticketPromises = projects.map(project => 
          axios.get(`/projects/${project._id}/tickets`, config).catch(() => ({ data: { data: [] } }))
        );
        
        const ticketResponses = await Promise.all(ticketPromises);
        
        ticketResponses.forEach(response => {
          const tickets = response.data.data || [];
          allTickets = [...allTickets, ...tickets];
          totalTickets += tickets.length;
          
          tickets.forEach(ticket => {
            const status = ticket.status?.toLowerCase();
            if (status === 'open') openTickets++;
            else if (status === 'in progress') inProgressTickets++;
            else if (status === 'closed') closedTickets++;
            else openTickets++; // default to open
          });
        });

        const assignedTickets = allTickets
          .filter(ticket => ticket.assignedTo && ticket.assignedTo._id === user.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setDashboardStats({
          totalProjects,
          totalTickets,
          openTickets,
          inProgressTickets,
          closedTickets,
          assignedTickets
        });
      } catch {
        // Silent fail for production
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [projects, authLoading, isAuthenticated, projectsLoading, token, user.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name || 'User'}!</h1>
        <p className="mt-2 text-lg text-gray-500">Here's a snapshot of your bug tracking activity.</p>
      </section>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Projects"
          value={dashboardStats.totalProjects}
          color="bg-blue-500"
          icon={<FiBox className="w-6 h-6 text-blue-600" />}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Open Tickets"
          value={dashboardStats.openTickets}
          color="bg-red-500"
          icon={<FiAlertTriangle className="w-6 h-6 text-red-600" />}
        />
        <StatCard
          title="In Progress"
          value={dashboardStats.inProgressTickets}
          color="bg-yellow-500"
          icon={<FiClock className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard
          title="Resolved"
          value={dashboardStats.closedTickets}
          color="bg-green-500"
          icon={<FiCheckCircle className="w-6 h-6 text-green-600" />}
        />
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Assigned Tickets</h2>
        {dashboardStats.assignedTickets.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <FiTrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-400">No tickets assigned to you yet. Check back later for new assignments!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboardStats.assignedTickets.map((ticket) => (
              <div 
                key={ticket._id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${ticket.project}`)}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                  <p className="text-sm text-gray-600 truncate">{ticket.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status?.toLowerCase() === 'open' ? 'bg-red-100 text-red-800' :
                    ticket.status?.toLowerCase() === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status || 'Open'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
