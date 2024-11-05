const BASE_URL = 'http://localhost:3000/api/surgeries';

export const getSurgeries = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};

export const getUpcomingSurgeries = async () =>{
    const res = await fetch(`${BASE_URL}/upcoming`);
    return res.json();
}

export const getSurgeriesByID = async (id)=>{
    const res = await fetch(`${BASE_URL}/${id}`)
    return res.json()
}

export const getSurgeriesBySurgeon = async (surgeon_id)=>{
    const res = await fetch (`${BASE_URL}/by-surgeon/${surgeon_id}`)
    return res.json()
}

export const getSurgeriesByPatient = async (patient_id)=>{
    const res = await fetch (`${BASE_URL}/by-patient/${patient_id}`)
    return res.json()
} 

export const cancelSurgery = async (id) => {
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'DELETE'

    })
    return res.json()
}

export const createSurgery = async (data) =>{
    const res = await fetch (`${BASE_URL}/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)

    });
    return res.json()
}


export const updateSurgery = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}

export const addSurgeryEquipment = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}/equipment`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}

export const addSurgeryStaff = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}/staff`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}


export const getSurgeryEquipment = async (id) =>{
    const res  = await fetch (`${BASE_URL}/${id}/equipment`)
    return res.json() 
}
export const getSurgeryStaff = async (id) =>{
    const res  = await fetch (`${BASE_URL}/${id}/staff`)
    return res.json() 
}
