import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { ProjectContext } from './ProjectContext.js';

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const { isAuthenticated, loading: authLoading, token } = useAuth();

  const fetchProjects = useCallback(async () => {
    if (authLoading || !isAuthenticated || !token) {
      setProjects([]);
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
      const res = await axios.get('/projects', config);
      setProjects(res.data.data);
    } catch {
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (projectData) => {
    if (!token) return false;
    
    try {
      setCreateLoading(true);
      setCreateError(null);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };
      const res = await axios.post('/projects', projectData, config);
      setProjects((prevProjects) => [...prevProjects, res.data.data]);
      return true;
    } catch {
      setCreateError('Failed to create project.');
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const value = {
    projects,
    loading,
    error,
    createProject,
    createLoading,
    createError,
    fetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
