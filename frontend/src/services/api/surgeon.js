const BASE_URL = 'http://localhost:3000/api/surgeon';


export const getSurgeon = async () => {
    const res = await fetch(`${BASE_URL}/surgeon`);
    return res.json();
};


export const getSurgeonByID = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
};


export const createSurgeon = async (data) => {
    const res = await fetch(`${BASE_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return res.json()
}

export const updateSurgeon = async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return res.json()
}

export const removeSurgeon = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE'
    })
    return res.json()
}

export const checkSurgeonAvailability = async (id) =>{
    const res = await fetch(`${BASE_URL}/${id}/availability`)
    return res.json()
}