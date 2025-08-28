import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthContext } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContext.Provider value={null}>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </AuthContext.Provider>
  </React.StrictMode>,
)
