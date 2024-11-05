const BASE_URL = 'http://localhost:3000/api/equipments';

export const getEquipment = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};


export const getEquipmentByID = async (id)=>{
    const res = await fetch(`${BASE_URL}/${id}`)
    return res.json()
}

export const addEquipment = async (data) =>{
    const res = await fetch (`${BASE_URL}/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)

    });
    return res.json()
}

export const updateEquipment = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}


export const removeEquipment = async (id) => {
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'DELETE'

    })
    return res.json()
}


