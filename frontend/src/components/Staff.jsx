import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, X } from 'lucide-react';
import api from '../services/api';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        staff_id: '',
        name: '',
        role: '',
        shift: '',
        contact_number: '',
        availability: 'available'
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await api.staff.getAll();
            setStaff(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch staff data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.staff.update(formData.staff_id, formData);
            } else {
                await api.staff.create(formData);
            }
            setShowForm(false);
            setFormData({
                staff_id: '',
                name: '',
                role: '',
                shift: '',
                contact_number: '',
                availability: 'available'
            });
            setEditMode(false);
            fetchStaff();
        } catch (err) {
            setError('Failed to save staff member');
            console.error(err);
        }
    };

    const handleEdit = (staffMember) => {
        setFormData(staffMember);
        setEditMode(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                await api.staff.delete(id);
                fetchStaff();
            } catch (err) {
                setError('Failed to delete staff member');
                console.error(err);
            }
        }
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Staff Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} /> Add Staff
                </button>
            </div>

            <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded border">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full outline-none"
                />
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStaff.map((member) => (
                        <div key={member.staff_id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg">{member.name}</h3>
                                    <p className="text-gray-600">ID: {member.staff_id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.staff_id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-600">Role: {member.role}</p>
                                <p className="text-gray-600">Shift: {member.shift}</p>
                                <p className="text-gray-600">Contact: {member.contact_number}</p>
                                <span className={`inline-block px-2 py-1 rounded text-sm ${member.availability === 'available'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {member.availability}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editMode ? 'Edit Staff Member' : 'Add New Staff Member'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditMode(false);
                                    setFormData({
                                        staff_id: '',
                                        name: '',
                                        role: '',
                                        shift: '',
                                        contact_number: '',
                                        availability: 'available'
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                                <input
                                    type="text"
                                    value={formData.staff_id}
                                    onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                                    className="mt-1 w-full p-2 border rounded"
                                    disabled={editMode}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="mt-1 w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="mt-1 w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Shift</label>
                                <select
                                    value={formData.shift}
                                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                                    className="mt-1 w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Shift</option>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="night">Night</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.contact_number}
                                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                    className="mt-1 w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Availability</label>
                                <select
                                    value={formData.availability}
                                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                    className="mt-1 w-full p-2 border rounded"
                                    required
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                {editMode ? 'Update Staff Member' : 'Add Staff Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;