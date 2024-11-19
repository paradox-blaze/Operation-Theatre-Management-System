import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEquipment, setCurrentEquipment] = useState(null);
    const [formData, setFormData] = useState({
        equipment_id: '',
        name: '',
        type: '',
        last_maintenance: '',
        status: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await api.equipment.getAll();
            setEquipment(response.data);
        } catch (err) {
            setError('Failed to fetch equipment');
            console.error(err);
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
            await api.equipment.create(formData);
            setIsAddModalOpen(false);
            setFormData({
                equipment_id: '',
                name: '',
                type: '',
                last_maintenance: '',
                status: ''
            });
            fetchEquipment();
        } catch (err) {
            setError('Failed to add equipment');
            console.error(err);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await api.equipment.update(currentEquipment.equipment_id, formData);
            setIsEditModalOpen(false);
            setCurrentEquipment(null);
            fetchEquipment();
        } catch (err) {
            setError('Failed to update equipment');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            try {
                await api.equipment.delete(id);
                fetchEquipment();
            } catch (err) {
                setError('Failed to delete equipment');
                console.error(err);
            }
        }
    };

    const openEditModal = (equipment) => {
        setCurrentEquipment(equipment);
        setFormData(equipment);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Equipment Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} />
                    Add Equipment
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipment.map((item) => (
                    <div key={item.equipment_id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(item)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.equipment_id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>ID: {item.equipment_id}</p>
                            <p>Type: {item.type}</p>
                            <p>Last Maintenance: {new Date(item.last_maintenance).toLocaleDateString()}</p>
                            <p>Status: <span className={`font-medium ${item.status === 'Available' ? 'text-green-500' :
                                    item.status === 'In Use' ? 'text-blue-500' :
                                        'text-red-500'
                                }`}>{item.status}</span></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Equipment Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add New Equipment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Equipment ID</label>
                                <input
                                    type="text"
                                    name="equipment_id"
                                    value={formData.equipment_id}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
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
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Maintenance</label>
                                <input
                                    type="date"
                                    name="last_maintenance"
                                    value={formData.last_maintenance}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Available">Available</option>
                                    <option value="In Use">In Use</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Add Equipment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Equipment Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Equipment</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Maintenance</label>
                                <input
                                    type="date"
                                    name="last_maintenance"
                                    value={formData.last_maintenance}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Available">Available</option>
                                    <option value="In Use">In Use</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Update Equipment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Equipment;