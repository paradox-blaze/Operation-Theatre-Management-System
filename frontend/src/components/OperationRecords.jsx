import React, { useState, useEffect } from 'react';
import { Plus, FileText, Edit2, Search, Calendar, AlertCircle } from 'lucide-react';
import api from '../services/api';

const OpRecords = () => {
    const [records, setRecords] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [error, setError] = useState('');
    const [patientFollowUps, setPatientFollowUps] = useState([]);
    const [searchPatientId, setSearchPatientId] = useState('');
    const [errorString, setErrorString] = useState('')

    const [formData, setFormData] = useState({
        op_record_id: '',
        patient_id: '',
        surgery_id: '',
        assessment: '',
        preparations: '',
        recovery_progress: '',
        follow_up_dates: ''
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const response = await api.opRecords.getAll();
            setRecords(response.data);
        } catch (err) {
            setError('Failed to fetch operation records');
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
            await api.opRecords.create(formData);
            setIsAddModalOpen(false);
            setFormData({
                op_record_id: '',
                patient_id: '',
                surgery_id: '',
                assessment: '',
                preparations: '',
                recovery_progress: '',
                follow_up_dates: ''
            });
            fetchRecords();
        } catch (err) {
            setError('Failed to add operation record');
            console.error(err);
            setErrorString('Could not add operation record')
            setTimeout(() => {
                setErrorString('')
            }, 5000);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await api.opRecords.update(currentRecord.op_record_id, formData);
            setIsEditModalOpen(false);
            setCurrentRecord(null);
            fetchRecords();
        } catch (err) {
            setError('Failed to update operation record');
            console.error(err);
            setErrorString('Could not add operation record')
            setTimeout(() => {
                setErrorString('')
            }, 5000);

        }
    };

    const handleFollowUpSearch = async () => {
        if (!searchPatientId) {
            setError('Please enter a patient ID');
            return;
        }
        try {
            const response = await api.opRecords.getFollowUp(searchPatientId);
            setPatientFollowUps(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch follow-up records');
            console.error(err);
        }
    };

    const openEditModal = (record) => {
        setCurrentRecord(record);
        setFormData(record);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Operation Records Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} />
                    Add Operation Record
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Follow-up Search Section */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Search Patient Follow-ups</h2>
                <div className="flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Enter Patient ID"
                        value={searchPatientId}
                        onChange={(e) => setSearchPatientId(e.target.value)}
                        className="border rounded px-3 py-2 w-64"
                    />
                    <button
                        onClick={handleFollowUpSearch}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        <Search size={20} />
                        Search
                    </button>
                </div>
            </div>

            {/* Follow-up Results */}
            {patientFollowUps.length > 0 && (
                <div className="mb-6 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Follow-up Records</h3>
                    <div className="space-y-4">
                        {patientFollowUps.map((followUp, index) => (
                            <div key={index} className="border-b pb-4">
                                <p className="font-medium">Patient ID: {followUp.patient_id}</p>
                                <p className="text-gray-600">{followUp.follow_up_dates}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Operation Records Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {records.map((record) => (
                    <div key={record.op_record_id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-lg">Record #{record.op_record_id}</h3>
                                <p className="text-sm text-gray-600">Patient ID: {record.patient_id}</p>
                                <p className="text-sm text-gray-600">Surgery ID: {record.surgery_id}</p>
                            </div>
                            <button
                                onClick={() => openEditModal(record)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div>
                                <h4 className="font-medium">Assessment</h4>
                                <p className="text-sm text-gray-600">{record.assessment}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Preparations</h4>
                                <p className="text-sm text-gray-600">{record.preparations}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Recovery Progress</h4>
                                <p className="text-sm text-gray-600">{record.recovery_progress}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Follow-up Dates</h4>
                                <p className="text-sm text-gray-600">{record.follow_up_dates}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Record Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add New Operation Record</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Record ID</label>
                                    <input
                                        type="text"
                                        name="op_record_id"
                                        value={formData.op_record_id}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
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
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Surgery ID</label>
                                    <input
                                        type="text"
                                        name="surgery_id"
                                        value={formData.surgery_id}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Assessment</label>
                                <textarea
                                    name="assessment"
                                    value={formData.assessment}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Preparations</label>
                                <textarea
                                    name="preparations"
                                    value={formData.preparations}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Recovery Progress</label>
                                <textarea
                                    name="recovery_progress"
                                    value={formData.recovery_progress}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Follow-up Dates</label>
                                <input
                                    type="text"
                                    name="follow_up_dates"
                                    value={formData.follow_up_dates}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="e.g., 2024-01-15, 2024-02-01"
                                    required
                                />
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
                                    Add Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Record Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Operation Record</h2>
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Patient ID</label>
                                    <input
                                        type="text"
                                        name="patient_id"
                                        value={formData.patient_id}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Surgery ID</label>
                                    <input
                                        type="text"
                                        name="surgery_id"
                                        value={formData.surgery_id}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Assessment</label>
                                <textarea
                                    name="assessment"
                                    value={formData.assessment}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Preparations</label>
                                <textarea
                                    name="preparations"
                                    value={formData.preparations}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Recovery Progress</label>
                                <textarea
                                    name="recovery_progress"
                                    value={formData.recovery_progress}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2 h-24"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Follow-up Dates</label>
                                <input
                                    type="text"
                                    name="follow_up_dates"
                                    value={formData.follow_up_dates}
                                    onChange={handleInputChange}
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="e.g., 2024-01-15, 2024-02-01"
                                    required
                                />
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
                                    Update Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpRecords;