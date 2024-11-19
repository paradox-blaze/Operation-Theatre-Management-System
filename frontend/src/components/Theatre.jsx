import React, { useState, useEffect } from 'react';
import { Plus, Edit, Calendar, Box, X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Theatre = () => {
    const [theatres, setTheatres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showEquipment, setShowEquipment] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [equipment, setEquipment] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [availabilityResult, setAvailabilityResult] = useState(null);
    const [errorString, setErrorString] = useState('');

    // Form state for adding/editing theatre
    const [formData, setFormData] = useState({
        theatre_id: '',
        name: '',
        capacity: ''
    });

    // Availability check form state
    const [availabilityForm, setAvailabilityForm] = useState({
        theatre_id: '',
        surgery_date: '',
        start_time: '',
        end_time: ''
    });

    useEffect(() => {
        fetchTheatres();
    }, []);

    const fetchTheatres = async () => {
        try {
            const response = await api.theatre.getAll();
            setTheatres(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch theatres');
            setLoading(false);
        }
    };

    const checkTheatreAvailability = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setAvailabilityResult(null);

        try {
            const response = await api.theatre.checkAvailability(
                availabilityForm.theatre_id,
                availabilityForm.surgery_date,
                availabilityForm.start_time,
                availabilityForm.end_time
            );

            setAvailabilityResult(response.data.Availability);
        } catch (error) {
            console.error('Failed to check theatre availability:', error);
            setAvailabilityResult(null);
        } finally {
            setModalLoading(false);
        }
    };
    const handleAddTheatre = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            await api.theatre.create(formData);
            await fetchTheatres();
            setShowAddModal(false);
            setFormData({ theatre_id: '', name: '', capacity: '' });
        } catch (error) {
            console.error('Failed to add theatre:', error);
            setErrorString('Could not add theatre');
            setTimeout(() => {
                setErrorString('')
            }, 5000)
        } finally {
            setModalLoading(false);
        }
    };

    const handleEditTheatre = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        try {
            await api.theatre.update(selectedTheatre.theatre_id, formData);
            await fetchTheatres();
            setShowEditModal(false);
        } catch (error) {
            console.error('Failed to update theatre:', error);
            setErrorString('Could not update theatre');
            setTimeout(() => {
                setErrorString('')
            }, 5000)
        } finally {
            setModalLoading(false);
        }
    };

    const fetchSchedule = async (theatreId) => {
        setModalLoading(true);
        try {
            const response = await api.theatre.getTheatreSchedule(theatreId);
            setSchedule(response.data);
        } catch (error) {
            console.error('Failed to fetch schedule:', error);
        } finally {
            setModalLoading(false);
        }
    };

    const fetchEquipment = async (theatreId) => {
        setModalLoading(true);
        try {
            const response = await api.theatre.getTheatreEquipment(theatreId);
            setEquipment(response.data);
        } catch (error) {
            console.error('Failed to fetch equipment:', error);
        } finally {
            setModalLoading(false);
        }
    };

    // Main loading state
    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="w-8 h-8 animate-spin" />
        </div>
    );

    // Error state
    if (error) return (
        <div className="text-red-500 p-4 text-center">
            {error}
        </div>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Operation Theatres</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setFormData({ theatre_id: '', name: '', capacity: '' });
                            setShowAddModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <Plus className="w-4 h-4" />
                        Add Theatre
                    </button>
                    <button
                        onClick={() => setShowAvailabilityModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Check Availability
                    </button>
                </div>
            </div>

            {/* Theatre Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {theatres.map((theatre) => (
                    <div key={theatre.theatre_id} className="border rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{theatre.name}</h2>
                            <button
                                onClick={() => {
                                    setSelectedTheatre(theatre);
                                    setFormData(theatre);
                                    setShowEditModal(true);
                                }}
                                className="p-2 text-gray-600 hover:text-blue-500"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">Capacity: {theatre.capacity}</p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedTheatre(theatre);
                                    fetchSchedule(theatre.theatre_id);
                                    setShowSchedule(true);
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                <Calendar className="w-4 h-4" />
                                Schedule
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTheatre(theatre);
                                    fetchEquipment(theatre.theatre_id);
                                    setShowEquipment(true);
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                            >
                                <Box className="w-4 h-4" />
                                Equipment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {showAvailabilityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Check Theatre Availability</h2>
                            <button onClick={() => setShowAvailabilityModal(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={checkTheatreAvailability} className="space-y-4">
                            <div>
                                <label className="block mb-1">Theatre ID</label>
                                <select
                                    value={availabilityForm.theatre_id}
                                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, theatre_id: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Theatre</option>
                                    {theatres.map((theatre) => (
                                        <option key={theatre.theatre_id} value={theatre.theatre_id}>
                                            {theatre.name} (ID: {theatre.theatre_id})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1">Surgery Date</label>
                                <input
                                    type="date"
                                    value={availabilityForm.surgery_date}
                                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, surgery_date: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Start Time</label>
                                <input
                                    type="time"
                                    value={availabilityForm.start_time}
                                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, start_time: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">End Time</label>
                                <input
                                    type="time"
                                    value={availabilityForm.end_time}
                                    onChange={(e) => setAvailabilityForm({ ...availabilityForm, end_time: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                                disabled={modalLoading}
                            >
                                {modalLoading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Check Availability'}
                            </button>

                            {availabilityResult !== null && (
                                <div className={`mt-4 p-3 rounded ${availabilityResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} flex items-center`}>
                                    {availabilityResult ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Theatre is Available
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-5 h-5 mr-2" />
                                            Theatre is Not Available
                                        </>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Add Theatre Modal */}
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Add New Theatre</h2>
                                <button onClick={() => setShowAddModal(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {errorString && (<span className='text-red-600'>{errorString}</span>)}

                            <form onSubmit={handleAddTheatre} className="space-y-4">
                                <div>
                                    <label className="block mb-1">Theatre ID</label>
                                    <input
                                        type="text"
                                        value={formData.theatre_id}
                                        onChange={(e) => setFormData({ ...formData, theatre_id: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                                    disabled={modalLoading}
                                >
                                    {modalLoading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Add Theatre'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Edit Theatre Modal */}
            {
                showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Edit Theatre</h2>
                                <button onClick={() => setShowEditModal(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {errorString && (<span className='text-red-600'>{errorString}</span>)}
                            <form onSubmit={handleEditTheatre} className="space-y-4">
                                <div>
                                    <label className="block mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                                    disabled={modalLoading}
                                >
                                    {modalLoading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : 'Update Theatre'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Schedule Modal */}
            {
                showSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Theatre Schedule - {selectedTheatre.name}</h2>
                                <button onClick={() => setShowSchedule(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {modalLoading ? (
                                <Loader className="w-8 h-8 animate-spin mx-auto" />
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="p-2 text-left">Date</th>
                                                <th className="p-2 text-left">Start Time</th>
                                                <th className="p-2 text-left">End Time</th>
                                                <th className="p-2 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="p-2">{item.surgery_date}</td>
                                                    <td className="p-2">{item.start_time}</td>
                                                    <td className="p-2">{item.end_time}</td>
                                                    <td className="p-2">{item.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Equipment Modal */}
            {
                showEquipment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Theatre Equipment - {selectedTheatre.name}</h2>
                                <button onClick={() => setShowEquipment(false)}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {modalLoading ? (
                                <Loader className="w-8 h-8 animate-spin mx-auto" />
                            ) : (
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="p-2 text-left">Name</th>
                                                <th className="p-2 text-left">Type</th>
                                                <th className="p-2 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {equipment.map((item) => (
                                                <tr key={item.equipment_id} className="border-t">
                                                    <td className="p-2">{item.equipment_name}</td>
                                                    <td className="p-2">{item.type}</td>
                                                    <td className="p-2">{item.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Theatre;