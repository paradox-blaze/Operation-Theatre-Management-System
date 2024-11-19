import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react';
import api from '../services/api';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newSchedule, setNewSchedule] = useState({
        schedule_id: '',
        surgery_date: '',
        start_time: '',
        end_time: ''
    });
    const [editingSchedule, setEditingSchedule] = useState(null);

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
            setError('Failed to fetch schedules');
            console.error('Error fetching schedules:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingSchedule) {
            setEditingSchedule(prev => ({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingSchedule) {
                await api.schedule.update(editingSchedule.schedule_id, editingSchedule);
                setEditingSchedule(null);
            } else {
                await api.schedule.create(newSchedule);
                setNewSchedule({
                    schedule_id: '',
                    surgery_date: '',
                    start_time: '',
                    end_time: ''
                });
            }
            await fetchSchedules();
        } catch (err) {
            setError(editingSchedule ? 'Failed to update schedule' : 'Failed to create schedule');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await api.schedule.delete(id);
            await fetchSchedules();
        } catch (err) {
            setError('Failed to delete schedule');
            console.error('Error deleting schedule:', err);
        } finally {
            setLoading(false);
        }
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

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="schedule_id"
                                value={editingSchedule ? editingSchedule.schedule_id : newSchedule.schedule_id}
                                onChange={handleInputChange}
                                placeholder="Schedule ID"
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                                disabled={editingSchedule}
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="date"
                                name="surgery_date"
                                value={editingSchedule ? editingSchedule.surgery_date : newSchedule.surgery_date}
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
                                value={editingSchedule ? editingSchedule.start_time : newSchedule.start_time}
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
                                value={editingSchedule ? editingSchedule.end_time : newSchedule.end_time}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                required
                            />
                            <Clock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        {editingSchedule && (
                            <button
                                type="button"
                                onClick={() => setEditingSchedule(null)}
                                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                        </button>
                    </div>
                </form>
            </div>

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
                                    <td className="px-4 py-3">{schedule.schedule_id}</td>
                                    <td className="px-4 py-3">{new Date(schedule.surgery_date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{schedule.start_time}</td>
                                    <td className="px-4 py-3">{schedule.end_time}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setEditingSchedule(schedule)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Edit2 className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(schedule.schedule_id)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Schedule;