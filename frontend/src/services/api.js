// src/services/api.js
const BASE_URL = 'http://localhost:3000/api';

// Utility function to get the token from localStorage
const getToken = () => localStorage.getItem('token');

// Create headers with authentication token
const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
    };
};

// Generic API call function with authentication
const apiCall = async (endpoint, method = 'GET', data = null) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: getHeaders(),
            credentials: 'include',
            body: data ? JSON.stringify(data) : null,
        });

        // Handle authentication errors
        if (response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }

        const result = await response.json();

        // If the response is not ok, throw an error with the server message
        if (!response.ok) {
            throw {
                status: response.status,
                response: result,
                message: result.message || `HTTP error! status: ${response.status}`
            };
        }

        return result;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// API methods for different endpoints
const api = {
    // Surgery related endpoints
    surgeries: {
        getUpcoming: () => apiCall('/surgeries/upcoming'),
        getAvailableTheatres: (surgeryDate, startTime, endTime) =>
            apiCall(`/surgeries/AvailableTheatres?surgery_date=${surgeryDate}&start_time=${startTime}&end_time=${endTime}`),
        getAll: () => apiCall('/surgeries'),
        getById: (id) => apiCall(`/surgeries/${id}`),
        getBySurgeonId: (surgeon_id) => (`/surgeries/by-surgeon/${surgeon_id}`),
        getByPatientId: (patient_id) => (`/surgeries/by-patient/${patient_id}`),
        create: (data) => apiCall('/surgeries', 'POST', data),
        createSurgeryEquipment: (id, data) => apiCall(`/surgeries/${id}/equipment`, 'POST', data),
        createSurgeryStaff: (id, data) => apiCall(`/surgeries/${id}/staff`, 'POST', data),
        getSurgeryEquipment: (id) => apiCall(`/surgeries/${id}/equipment`),
        getSurgeryStaff: (id) => apiCall(`/surgeries/${id}/staff`),
        update: (id, data) => apiCall(`/surgeries/${id}`, 'PUT', data),
        delete: (id) => apiCall(`/surgeries/${id}`, 'DELETE'),
    },

    // Theatre related endpoints
    theatre: {
        getAll: () => apiCall('/theatre'),
        checkAvailability: (theatreId, surgeryDate, startTime, endTime) =>
            apiCall(`/theatre/${theatreId}/availability?surgery_date=${surgeryDate}&start_time=${startTime}&end_time=${endTime}`),
        getById: (id) => apiCall(`/theatre/${id}`),
        getTheatreSchedule: (id) => apiCall(`/theatre/${id}/schedule`),
        getTheatreEquipment: (id) => apiCall(`/theatre/${id}/equipment`),
        create: (data) => apiCall('/theatre', 'POST', data),
        createTheatreEquipment: (id, data) => apiCall(`/theatre/${id}/equipment`, 'POST', data),
        update: (id, data) => apiCall(`/theatre/${id}`, 'PUT', data),
    },

    // Patient related endpoints
    patients: {
        getAll: () => apiCall('/patient'),
        getById: (id) => apiCall(`/patient/${id}`),
        create: (data) => apiCall('/patient', 'POST', data),
        update: (id, data) => apiCall(`/patient/${id}`, 'PUT', data),
        delete: (id) => apiCall(`/patient/${id}`, 'DELETE'),
        getEmergencyContact: (id) => apiCall(`/patient/${id}/emergency_contact`),
        addEmergencyContact: (data) => apiCall(`/patient/emergency-contact`, 'POST', data),
        updateEmergencyContact: (id, data) => apiCall(`/patient/emergency-contact/${id}`, 'PUT', data),
        deleteEmergencyContact: (patient_id) => apiCall(`/patient/emergency-contact/${patient_id}`, 'DELETE'),
    },

    // Equipment related endpoints
    equipment: {
        getAll: () => apiCall('/equipments'),
        getById: (id) => apiCall(`/equipments/${id}`),
        create: (data) => apiCall('/equipments', 'POST', data),
        update: (id, data) => apiCall(`/equipments/${id}`, 'PUT', data),
        delete: (id) => apiCall(`/equipments/${id}`, 'DELETE'),
    },

    // Billing related endpoints
    billing: {
        getAll: () => apiCall('/billing'),
        getById: (id) => apiCall(`/billing/${id}`),
        getByPatientId: (patient_id) => apiCall(`/billing/by-patient/${patient_id}`),
        getPending: () => apiCall(`/billing/pending`),
        create: (data) => apiCall('/billing', 'POST', data),
        update: (id, data) => apiCall(`/billing/${id}`, 'PUT', data),
    },

    // Operation Records related endpoints
    opRecords: {
        getAll: () => apiCall('/op_records'),
        getById: (id) => apiCall(`/op_records/${id}`),
        getFollowUp: (patient_id) => apiCall(`/op_records/follow-up/${patient_id}`),
        create: (data) => apiCall('/op_records', 'POST', data),
        update: (id, data) => apiCall(`/op_records/${id}`, 'PUT', data),

    },

    // Schedule related endpoints
    schedule: {
        getAll: () => apiCall('/schedule'),
        getAvailableTheatres: (surgeryDate, startTime, endTime) =>
            apiCall(`/schedule/available-theatres?surgery_date=${surgeryDate}&start_time=${startTime}&end_time=${endTime}`),
        getBySurgeryId: (surgery_id) => apiCall(`/schedule/${surgery_id}`),
        getById: (id) => apiCall(`/schedule/${id}`),

        create: (data) => apiCall('/schedule', 'POST', data),
        update: (id, data) => apiCall(`/schedule/${id}`, 'PUT', data),
        delete: (id) => apiCall(`/schedule/${id}`, 'DELETE'),
    },

    surgeon: {
        getAll: () => apiCall('/surgeon'),
        getById: (id) => apiCall(`/surgeon/${id}`),
        create: (data) => apiCall('/surgeon', 'POST', data),
        update: (id, data) => apiCall(`/surgeon/${id}`, 'PUT', data),
        delete: (id) => apiCall(`/surgeon/${id}`, 'DELETE'),
    },

    staff: {
        getAll: () => apiCall('/staff'),
        getById: (id) => apiCall(`/staff/${id}`),
        create: (data) => apiCall('/staff', 'POST', data),
        update: (id, data) => apiCall(`/staff/${id}`, 'PUT', data),
        delete: (id) => apiCall(`/staff/${id}`, 'DELETE'),
    },
};

export default api;