import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Plus,
    Edit2,
    Trash2,
    AlertCircle,
    Loader,
    Search,
    CheckCircle,
    XCircle
} from 'lucide-react';
import api from '../services/api';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [availableTheatres, setAvailableTheatres] = useState([]);
    const [newSchedule, setNewSchedule] = useState({
        schedule_id: '',
        surgery_date: '',
        start_time: '',
        end_time: ''
    });
    const [searchCriteria, setSearchCriteria] = useState({
        surgery_date: '',
        start_time: '',
        end_time: ''
    });
    const [isEditing, setIsEditing] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [editSchedule, setEditSchedule] = useState({
        schedule_id: '',
        surgery_date: '',
        start_time: '',
        end_time: ''
    });

    // Clear messages after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setError(null);
            setSuccessMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [error, successMessage]);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await api.schedule.getAll();
            setSchedules(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch schedules');
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e, isEdit = false) => {
        const { name, value } = e.target;
        if (isEdit) {
            setEditSchedule(prev => ({
                ...prev,
                [name]: value
            }));
        } else {
            setNewSchedule(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSearchCriteriaChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGetAvailableTheatres = async () => {
        try {
            setLoading(true);
            const response = await api.schedule.getAvailableTheatres(
                searchCriteria.surgery_date,
                searchCriteria.start_time,
                searchCriteria.end_time
            );
            setAvailableTheatres(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch available theatres');
            console.error('Error fetching available theatres:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.schedule.create(newSchedule);
            setNewSchedule({
                schedule_id: '',
                surgery_date: '',
                start_time: '',
                end_time: ''
            });
            await fetchSchedules();
            setSuccessMessage('Schedule created successfully');
        } catch (err) {
            setError(err.message || 'Failed to create schedule');
            console.error('Error creating schedule:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.schedule.update(editSchedule.schedule_id, editSchedule);
            setIsEditing(null);
            await fetchSchedules();
            setSuccessMessage('Schedule updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update schedule');
            console.error('Error updating schedule:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await api.schedule.delete(id);
            await fetchSchedules();
            setDeleteConfirmation(null);
            setSuccessMessage('Schedule deleted successfully');
        } catch (err) {
            setError(err.message || 'Failed to delete schedule');
            console.error('Error deleting schedule:', err);
            setDeleteConfirmation(null);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (schedule) => {
        setIsEditing(schedule.schedule_id);
        setEditSchedule({
            schedule_id: schedule.schedule_id,
            surgery_date: schedule.surgery_date.split('T')[0],
            start_time: schedule.start_time,
            end_time: schedule.end_time
        });
    };

    const cancelEditing = () => {
        setIsEditing(null);
        setEditSchedule({
            schedule_id: '',
            surgery_date: '',
            start_time: '',
            end_time: ''
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-6">Schedule Management</h1>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                )}

                {/* Add New Schedule Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Schedule</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="schedule_id"
                                value={newSchedule.schedule_id}
                                onChange={handleInputChange}
                                placeholder="Schedule ID"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                name="surgery_date"
                                value={newSchedule.surgery_date}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="time"
                                name="start_time"
                                value={newSchedule.start_time}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="time"
                                name="end_time"
                                value={newSchedule.end_time}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Schedule
                    </button>
                </form>

                {/* Check Available Theatres Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
                    <h2 className="text-xl font-semibold mb-4">Check Available Theatres</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="relative">
                            <input
                                type="date"
                                name="surgery_date"
                                value={searchCriteria.surgery_date}
                                onChange={handleSearchCriteriaChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="time"
                                name="start_time"
                                value={searchCriteria.start_time}
                                onChange={handleSearchCriteriaChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                        <div className="relative">
                            <input
                                type="time"
                                name="end_time"
                                value={searchCriteria.end_time}
                                onChange={handleSearchCriteriaChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <button
                        onClick={handleGetAvailableTheatres}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                    >
                        <Search className="w-4 h-4 mr-2" />
                        Get Available Theatres
                    </button>
                    {availableTheatres.length > 0 && (
                        <ul className="mt-4 border-t pt-4">
                            {availableTheatres.map((theatre, index) => (
                                <li key={index} className="py-2">
                                    {theatre.theatre_id} - {theatre.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Existing Schedules */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left">Schedule ID</th>
                                <th className="px-4 py-3 text-left">Surgery Date</th>
                                <th className="px-4 py-3 text-left">Start Time</th>
                                <th className="px-4 py-3 text-left">End Time</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule) => (
                                <tr key={schedule.schedule_id} className="border-t">
                                    {isEditing === schedule.schedule_id ? (
                                        <td colSpan="5" className="p-4">
                                            <form onSubmit={handleUpdate} className="grid grid-cols-5 gap-4">
                                                <input
                                                    type="text"
                                                    name="schedule_id"
                                                    value={editSchedule.schedule_id}
                                                    onChange={(e) => handleInputChange(e, true)}
                                                    className="p-2 border rounded"
                                                    readOnly
                                                />
                                                <input
                                                    type="date"
                                                    name="surgery_date"
                                                    value={editSchedule.surgery_date}
                                                    onChange={(e) => handleInputChange(e, true)}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <input
                                                    type="time"
                                                    name="start_time"
                                                    value={editSchedule.start_time}
                                                    onChange={(e) => handleInputChange(e, true)}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <input
                                                    type="time"
                                                    name="end_time"
                                                    value={editSchedule.end_time}
                                                    onChange={(e) => handleInputChange(e, true)}
                                                    className="p-2 border rounded"
                                                    required
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        type="submit"
                                                        className="text-green-500 hover:bg-green-50 p-2 rounded"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </form>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3">{schedule.schedule_id}</td>
                                            <td className="px-4 py-3">
                                                {new Date(schedule.surgery_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">{schedule.start_time}</td>
                                            <td className="px-4 py-3">{schedule.end_time}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => startEditing(schedule)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Edit2 className="w-4 h-4 text-blue-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmation(schedule.schedule_id)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                            <h2 className="text-xl font-semibold text-red-600">Confirm Deletion</h2>
                        </div>
                        <p className="mb-4">Are you sure you want to delete this schedule?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmation)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;