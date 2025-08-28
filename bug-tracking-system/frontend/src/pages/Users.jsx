import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const Users = () => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'employee' });

  const fetchUsers = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/users`, config);
      setUsers(response.data.data);
      setLoading(false);
    } catch {
      setError('Failed to fetch users');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit._id);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role,
    });
  };

  const handleUpdate = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/users/${userId}`,
        formData,
        config
      );

      setUsers(users.map(u => u._id === userId ? response.data.data : u));
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'employee' });
    } catch {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${import.meta.env.VITE_API_URL}/auth/users/${userId}`, config);
      setUsers(users.filter(u => u._id !== userId));
    } catch {
      setError('Failed to delete user');
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'employee' });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage users and their roles in the system.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === userItem._id ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {userItem.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === userItem._id ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{userItem.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUser === userItem._id ? (
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userItem.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {userItem.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingUser === userItem._id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(userItem._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(userItem)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                          >
                            Edit
                          </button>
                          {userItem._id !== user.id && (
                            <button
                              onClick={() => handleDelete(userItem._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No users found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
