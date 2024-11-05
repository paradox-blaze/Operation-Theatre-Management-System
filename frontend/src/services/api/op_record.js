const BASE_URL = 'http://localhost:3000/api/op_records';


export const getOpRecordsByID = async (id) => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};

export const createOpRecord= async (data) =>{
    const res = await fetch (`${BASE_URL}/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)

    });
    return res.json()
}

export const updateOpRecord = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}

export const getFollowUpPatient = async (patient_id) => {
    const res = await fetch(`${BASE_URL}/follow-up/${patient_id}`);
    return res.json();
};
