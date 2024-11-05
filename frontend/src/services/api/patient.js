const BASE_URL = 'http://localhost:3000/api/patient';

export const getpatient = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};


export const getPatientByID = async (id)=>{
    const res = await fetch(`${BASE_URL}/${id}`)
    return res.json()
}




export const addPatient = async (data) =>{
    const res = await fetch (`${BASE_URL}/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)

    });
    return res.json()
}


export const updatePatient = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}

export const removePatient = async (id) => {
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'DELETE'

    })
    return res.json()
}


export const getEmergencyContact = async (id)=>{
    const res = await fetch(`${BASE_URL}/${id}/emergency_contact`)
    return res.json()
}

