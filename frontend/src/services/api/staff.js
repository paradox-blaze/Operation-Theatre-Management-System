const BASE_URL = 'http://localhost:3000/api/staff';



export const getStaff = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};



export const getStaffByID = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
};

export const createStaff = async (data) => {
    const res = await fetch(`${BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json();
}


export const updateStaff = async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json()
}

export const cancelStaff = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'

    })
    return res.json()
}



export const getStaffAvailability = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/availability`);
    return res.json();
};
