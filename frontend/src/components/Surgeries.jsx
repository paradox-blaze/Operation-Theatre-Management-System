import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Users, Box } from 'lucide-react';
import api from '../services/api';

const Surgeries = () => {
    const [surgeries, setSurgeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSurgery, setSelectedSurgery] = useState(null);
    const [errorString, setErrorString] = useState('')
    const [formData, setFormData] = useState({
        surgery_id: '',
        patient_id: '',
        surgeon_id: '',
        theatre_id: '',
        schedule_id: '',
        surgery_type: '',
        status: 'SCHEDULED',
        outcome: ''
    });

    useEffect(() => {
        fetchSurgeries();
    }, []);

    const fetchSurgeries = async () => {
        try {
            setLoading(true);
            const response = await api.surgeries.getAll();
            setSurgeries(response.data);
        } catch (error) {
            console.error('Error fetching surgeries:', error);
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
            if (selectedSurgery) {
                await api.surgeries.update(selectedSurgery.surgery_id, formData);
            } else {
                await api.surgeries.create(formData);
            }
            setShowAddModal(false);
            setSelectedSurgery(null);
            setFormData({
                surgery_id: '',
                patient_id: '',
                surgeon_id: '',
                theatre_id: '',
                schedule_id: '',
                surgery_type: '',
                status: 'SCHEDULED',
                outcome: ''
            });
            fetchSurgeries();
        } catch (error) {
            console.error('Error saving surgery:', error);
            setErrorString('Could not create or update surgery');
            setTimeout(() => {
                setErrorString('')
            }, 5000)
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this surgery?')) {
            try {
                await api.surgeries.delete(id);
                fetchSurgeries();
            } catch (error) {
                console.error('Error deleting surgery:', error);
            }
        }
    };

    const handleEdit = (surgery) => {
        setSelectedSurgery(surgery);
        setFormData(surgery);
        setShowAddModal(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Surgery Management</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} />
                    Add Surgery
                </button>
            </div>

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surgeries.map((surgery) => (
                        <div
                            key={surgery.surgery_id}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{surgery.surgery_type}</h3>
                                    <p className="text-gray-600">ID: {surgery.surgery_id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(surgery)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(surgery.surgery_id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} />
                                    <span>Schedule ID: {surgery.schedule_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users size={16} />
                                    <span>Surgeon ID: {surgery.surgeon_id}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Box size={16} />
                                    <span>Theatre: {surgery.theatre_id}</span>
                                </div>
                                <div className="mt-2">
                                    <span className={`px-2 py-1 rounded text-sm ${surgery.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                        surgery.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {surgery.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedSurgery ? 'Edit Surgery' : 'Add New Surgery'}
                        </h2>
                        {errorString && (<span className='text-red-600'>{errorString}</span>)}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Surgery ID</label>
                                <input
                                    type="text"
                                    name="surgery_id"
                                    value={formData.surgery_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Patient ID</label>
                                <input
                                    type="text"
                                    name="patient_id"
                                    value={formData.patient_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
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
                                <label className="block text-sm font-medium mb-1">Theatre ID</label>
                                <input
                                    type="text"
                                    name="theatre_id"
                                    value={formData.theatre_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Schedule ID</label>
                                <input
                                    type="text"
                                    name="schedule_id"
                                    value={formData.schedule_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Surgery Type</label>
                                <input
                                    type="text"
                                    name="surgery_type"
                                    value={formData.surgery_type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="SCHEDULED">Scheduled</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Outcome</label>
                                <textarea
                                    name="outcome"
                                    value={formData.outcome}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedSurgery(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {selectedSurgery ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Surgeries;