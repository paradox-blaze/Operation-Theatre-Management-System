import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search, X, Phone, MapPin, AlertCircle, Calendar, User, Heart } from 'lucide-react';
import api from '../services/api';

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [emergencyContact, setEmergencyContact] = useState(null);
    const [formData, setFormData] = useState({
        patient_id: '',
        name: '',
        DOB: '',
        contact_number: '',
        allergies: '',
        address: '',
        emergency_contact: {
            contact_id: '',
            patient_id: '', // Added this field
            name: '',
            phone_number: '',
            relationship: ''
        }
    });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    useEffect(() => {
        if (selectedPatient) {
            fetchEmergencyContact(selectedPatient.patient_id);
        }
    }, [selectedPatient]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await api.patients.getAll();
            setPatients(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch patient data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmergencyContact = async (patientId) => {
        try {
            const response = await api.patients.getEmergencyContact(patientId);
            setEmergencyContact(response.data[0]);
        } catch (err) {
            console.error('Failed to fetch emergency contact:', err);
            setEmergencyContact(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                // Update patient
                await api.patients.update(formData.patient_id, {
                    name: formData.name,
                    DOB: formData.DOB,
                    contact_number: formData.contact_number,
                    allergies: formData.allergies,
                    address: formData.address
                });

                // Update emergency contact if it exists and has been modified
                if (formData.emergency_contact.contact_id && formData.emergency_contact.name) {
                    await api.patients.updateEmergencyContact(
                        formData.emergency_contact.contact_id,
                        {
                            name: formData.emergency_contact.name,
                            phone_number: formData.emergency_contact.phone_number,
                            relationship: formData.emergency_contact.relationship
                        }
                    );
                }
                // Create new emergency contact if it doesn't exist
                else if (formData.emergency_contact.name) {
                    await api.patients.addEmergencyContact({
                        contact_id: Date.now().toString(), // Generate a unique ID
                        patient_id: formData.patient_id,
                        name: formData.emergency_contact.name,
                        phone_number: formData.emergency_contact.phone_number,
                        relationship: formData.emergency_contact.relationship
                    });
                }
            } else {
                // Create new patient
                await api.patients.create({
                    patient_id: formData.patient_id,
                    name: formData.name,
                    DOB: formData.DOB,
                    contact_number: formData.contact_number,
                    allergies: formData.allergies,
                    address: formData.address
                });

                // Add emergency contact if details are provided
                if (formData.emergency_contact.name) {
                    await api.patients.addEmergencyContact({
                        contact_id: Date.now().toString(), // Generate a unique ID
                        patient_id: formData.patient_id,
                        name: formData.emergency_contact.name,
                        phone_number: formData.emergency_contact.phone_number,
                        relationship: formData.emergency_contact.relationship
                    });
                }
            }

            setShowForm(false);
            resetForm();
            fetchPatients();
        } catch (err) {
            setError('Failed to save patient');
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            patient_id: '',
            name: '',
            DOB: '',
            contact_number: '',
            allergies: '',
            address: '',
            emergency_contact: {
                contact_id: '',
                patient_id: '',
                name: '',
                phone_number: '',
                relationship: ''
            }
        });
        setEditMode(false);
    };

    const handleEdit = async (patient) => {
        try {
            const emergencyContactResponse = await api.patients.getEmergencyContact(patient.patient_id);
            const emergencyContactData = emergencyContactResponse.data[0] || {
                contact_id: '',
                name: '',
                phone_number: '',
                relationship: ''
            };

            setFormData({
                ...patient,
                emergency_contact: {
                    contact_id: emergencyContactData.contact_id || '',
                    patient_id: patient.patient_id,
                    name: emergencyContactData.name || '',
                    phone_number: emergencyContactData.phone_number || '',
                    relationship: emergencyContactData.relationship || ''
                }
            });
            setEditMode(true);
            setShowForm(true);
        } catch (err) {
            console.error('Failed to fetch emergency contact for edit:', err);
            setError('Failed to load patient data for editing');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                // First, try to fetch and delete emergency contact if it exists
                const emergencyContactResponse = await api.patients.getEmergencyContact(id);
                if (emergencyContactResponse.data[0]) {
                    // Delete emergency contact first
                    await api.patients.updateEmergencyContact(emergencyContactResponse.data[0].contact_id, {
                        // Send a DELETE request or handle according to your API
                    });
                }

                // Then delete the patient
                await api.patients.delete(id);
                await fetchPatients();
            } catch (err) {
                setError('Failed to delete patient');
                console.error(err);
            }
        }
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_id.toString().includes(searchTerm)
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Patient Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} /> Add Patient
                </button>
            </div>

            <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded border">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search patients by name or ID..."
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
                    {filteredPatients.map((patient) => (
                        <div key={patient.patient_id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <User size={18} className="text-blue-500" />
                                        {patient.name}
                                    </h3>
                                    <p className="text-gray-600">ID: {patient.patient_id}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(patient)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(patient.patient_id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} />
                                    DOB: {new Date(patient.DOB).toLocaleDateString()} ({calculateAge(patient.DOB)} years)
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Phone size={16} />
                                    {patient.contact_number}
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={16} />
                                    {patient.address}
                                </p>
                                {patient.allergies && (
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <AlertCircle size={16} className="text-red-500 mt-1" />
                                        <p>
                                            <span className="font-medium">Allergies:</span><br />
                                            {patient.allergies}
                                        </p>
                                    </div>
                                )}
                                <button
                                    onClick={() => setSelectedPatient(patient)}
                                    className="mt-2 text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Heart size={14} /> View Emergency Contact
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Patient Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 max-h-screen pt-20 overflow-scroll flex items-center justify-center p-1">
                    <div className="bg-white rounded-lg p-6 max-w-md mt-4 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                {editMode ? 'Edit Patient' : 'Add New Patient'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditMode(false);
                                    setFormData({
                                        patient_id: '',
                                        name: '',
                                        DOB: '',
                                        contact_number: '',
                                        allergies: '',
                                        address: '',
                                        emergency_contact: {
                                            contact_id: '',
                                            name: '',
                                            phone_number: '',
                                            relationship: ''
                                        }
                                    });
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Patient Details Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                                <input
                                    type="text"
                                    value={formData.patient_id}
                                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                                    className="mt-1 w-full p-0.5 border rounded"
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
                                    className="mt-1 w-full p-0.5 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.DOB}
                                    onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
                                    className="mt-1 w-full p-0.5 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.contact_number}
                                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                                    className="mt-1 w-full p-0.5 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="mt-1 w-full p-0.5 border rounded"
                                    required
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Allergies</label>
                                <textarea
                                    value={formData.allergies}
                                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                    className="mt-1 w-full p-0.5 border rounded"
                                    required
                                    rows={2}
                                />
                            </div>

                            {/* Emergency Contact Section */}
                            <div className="border-t pt-4">
                                <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Contact ID</label>
                                    <input
                                        type="text"
                                        value={formData.emergency_contact.contact_id}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            emergency_contact: {
                                                ...formData.emergency_contact,
                                                contact_id: e.target.value
                                            }
                                        })}
                                        className="mt-1 w-full p-0.5 border rounded"
                                        disabled={editMode} // Disable in edit mode
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={formData.emergency_contact.name}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            emergency_contact: {
                                                ...formData.emergency_contact,
                                                name: e.target.value
                                            }
                                        })}
                                        className="mt-1 w-full p-0.5 border rounded"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.emergency_contact.phone_number}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            emergency_contact: {
                                                ...formData.emergency_contact,
                                                phone_number: e.target.value
                                            }
                                        })}
                                        className="mt-1 w-full p-0.5 border rounded"
                                    />
                                </div>
                                <div className="mt-2">
                                    <label className="block text-sm font-medium text-gray-700">Relationship</label>
                                    <input
                                        type="text"
                                        value={formData.emergency_contact.relationship}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            emergency_contact: {
                                                ...formData.emergency_contact,
                                                relationship: e.target.value
                                            }
                                        })}
                                        className="mt-1 w-full p-0.5 border rounded"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4"
                            >
                                {editMode ? 'Update Patient' : 'Add Patient'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Emergency Contact Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Emergency Contact</h2>
                            <button
                                onClick={() => {
                                    setSelectedPatient(null);
                                    setEmergencyContact(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {emergencyContact ? (
                            <div className="space-y-3">
                                <p className="flex items-center gap-2">
                                    <User size={16} />
                                    <span className="font-medium">Name:</span> {emergencyContact.name}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone size={16} />
                                    <span className="font-medium">Contact:</span> {emergencyContact.phone_number}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Heart size={16} />
                                    <span className="font-medium">Relationship:</span> {emergencyContact.relationship}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-600">No emergency contact information available.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patient;