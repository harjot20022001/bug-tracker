import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
          <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
