import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Eye, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const BillForm = ({ onSubmit, submitText, initialData, onCancel }) => {
    const [formData, setFormData] = useState(initialData);
    const [modalError, setModalError] = useState('');
    const emptyFormData = {
        surgery_id: '',  // Ensure it's initialized as an empty string
        amount: '',
        status: 'Pending',
        payment_date: ''
    };

    const statusOptions = ['Pending', 'Paid', 'Overdue', 'Cancelled'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'amount') {
            // Only allow numbers and decimals
            const formattedValue = value.replace(/[^\d.]/g, '');
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const validateForm = () => {
        // Convert surgery_id to string if it isn't already and check if it's empty
        if (!String(formData.surgery_id).trim()) {
            setModalError('Surgery ID is required');
            return false;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setModalError('Valid amount is required');
            return false;
        }
        if (!formData.payment_date) {
            setModalError('Payment date is required');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalError('');

        if (!validateForm()) return;
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {modalError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span className="block sm:inline">{modalError}</span>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
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
                <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                        type="text"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="0.00"
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
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Payment Date</label>
                    <input
                        type="date"
                        name="payment_date"
                        value={formData.payment_date}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {submitText}
                </button>
            </div>
        </form>
    );
};

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentBill, setCurrentBill] = useState(null);
    const [error, setError] = useState('');

    const emptyFormData = {
        surgery_id: '',
        amount: '',
        status: 'Pending',
        payment_date: ''
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const response = await api.billing.getAll();
            setBills(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch bills');
            console.error(err);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const handleSubmitAdd = async (formData) => {
        try {
            await api.billing.create(formData);
            setIsAddModalOpen(false);
            fetchBills();
        } catch (err) {
            console.error(err);
            setError('Failed to add bill');
        }
    };

    const handleSubmitEdit = async (formData) => {
        try {
            await api.billing.update(currentBill.bill_id, formData);
            setIsEditModalOpen(false);
            setCurrentBill(null);
            fetchBills();
        } catch (err) {
            console.error(err);
            setError('Failed to update bill');
        }
    };

    const openEditModal = (bill) => {
        setCurrentBill(bill);
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'overdue':
                return 'text-red-600';
            case 'cancelled':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Billing Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <Plus size={20} />
                    Add Bill
                </button>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bills.map((bill) => (
                    <div key={bill.bill_id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-lg">Bill #{bill.bill_id}</h3>
                                <p className="text-sm text-gray-600">Surgery ID: {bill.surgery_id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(bill)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <Edit size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div>
                                <h4 className="font-medium">Amount</h4>
                                <p className="text-sm text-gray-600">{formatAmount(bill.amount)}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Status</h4>
                                <p className={`text-sm ${getStatusColor(bill.status)}`}>{bill.status}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Payment Date</h4>
                                <p className="text-sm text-gray-600">
                                    {new Date(bill.payment_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Bill Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Add New Bill</h2>
                        <BillForm
                            onSubmit={handleSubmitAdd}
                            submitText="Add Bill"
                            initialData={emptyFormData}
                            onCancel={() => setIsAddModalOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Edit Bill Modal */}
            {isEditModalOpen && currentBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Bill</h2>
                        <BillForm
                            onSubmit={handleSubmitEdit}
                            submitText="Update Bill"
                            initialData={currentBill}
                            onCancel={() => setIsEditModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;