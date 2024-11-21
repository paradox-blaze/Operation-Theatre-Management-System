import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Phone, UserCheck, Clock } from 'lucide-react';
import api from '../services/api';

const Surgeon = () => {
    const [surgeons, setSurgeons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedSurgeon, setSelectedSurgeon] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        surgeon_id: '',
        name: '',
        specializations: '',
        contact_number: '',
        availability: 'AVAILABLE',
        supervisor_id: ''
    });

    useEffect(() => {
        fetchSurgeons();
    }, []);

    const fetchSurgeons = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.surgeon.getAll();
            setSurgeons(response.data);
        } catch (error) {
            console.error('Error fetching surgeons:', error);
            setError('Failed to fetch surgeons. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            if (selectedSurgeon) {
                await api.surgeon.update(selectedSurgeon.surgeon_id, formData);
            } else {
                await api.surgeon.create(formData);
            }
            setShowModal(false);
            setSelectedSurgeon(null);
            setFormData({
                surgeon_id: '',
                name: '',
                specializations: '',
                contact_number: '',
                availability: 'AVAILABLE',
                supervisor_id: ''
            });
            fetchSurgeons();
        } catch (error) {
            console.error('Error saving surgeon:', error);
            setError(error.response?.message || 'Failed to save surgeon. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this surgeon?')) {
            try {
                setError(null);
                await api.surgeon.delete(id);

                // Directly update the surgeons state to remove the deleted surgeon
                setSurgeons(prevSurgeons =>
                    prevSurgeons.filter(surgeon => surgeon.surgeon_id !== id)
                );
            } catch (error) {
                console.error('Error deleting surgeon:', error);

                // More detailed error handling
                const errorMessage = error.response?.message ||
                    error.message ||
                    'Failed to delete surgeon. Please try again.';

                // Check for specific error scenarios
                if (errorMessage.includes('ongoing or scheduled surgeries')) {
                    setError('Cannot delete surgeon with ongoing surgeries. Please reassign or complete their surgeries first.');
                } else if (errorMessage.includes('supervising other surgeons')) {
                    setError('Cannot delete surgeon who is supervising other surgeons. Please reassign their supervisees first.');
                } else {
                    setError(errorMessage);
                }
            }
        }
    };

    const handleEdit = (surgeon) => {
        setSelectedSurgeon(surgeon);
        setFormData(surgeon);
        setShowModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Surgeons Management</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} />
                    Add Surgeon
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surgeons.map((surgeon) => (
                        <div
                            key={surgeon.surgeon_id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{surgeon.name}</h3>
                                    <p className="text-gray-600">ID: {surgeon.surgeon_id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(surgeon)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(surgeon.surgeon_id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <UserCheck size={16} />
                                    <span>Specializations: {surgeon.specializations}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={16} />
                                    <span>Contact: {surgeon.contact_number}</span>
                                </div>
                                <div className="mt-2">
                                    <span className={`px-2 py-1 rounded text-sm ${surgeon.availability === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                        }`}>
                                        {surgeon.availability}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedSurgeon ? 'Edit Surgeon' : 'Add New Surgeon'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Surgeon ID</label>
                                <input
                                    type="text"
                                    name="surgeon_id"
                                    value={formData.surgeon_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Specializations</label>
                                <input
                                    type="text"
                                    name="specializations"
                                    value={formData.specializations}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={formData.contact_number}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Availability</label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="AVAILABLE">Available</option>
                                    <option value="UNAVAILABLE">Unavailable</option>
                                    <option value="ON_CALL">On Call</option>
                                    <option value="ON_LEAVE">On Leave</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Supervisor ID</label>
                                <input
                                    type="text"
                                    name="supervisor_id"
                                    value={formData.supervisor_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedSurgeon(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {selectedSurgeon ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Surgeon;