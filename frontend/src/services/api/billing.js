const BASE_URL = 'http://localhost:3000/api/billing';

export const getBilling = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};

export const createBill = async (data) => {
    const res = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)

    });
    return res.json()
}


export const getBillByID = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`)
    return res.json()
}

export const updateBilling = async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json()
}


export const getPendingBills = async () => {
    const res = await fetch(`${BASE_URL}/pending`);
    return res.json();
};

export const getBillByPatient = async (patinet_id) => {
    const res = await fetch(`${BASE_URL}/by-patient/${patinet_id}`)
    return res.json()
}


