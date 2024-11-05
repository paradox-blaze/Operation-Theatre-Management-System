const BASE_URL = 'http://localhost:3000/apischedule';


export const getSchedule = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};

export const createSchedule = async (data) =>{
    const res = await fetch(`${BASE_URL}`,{
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}

export const getScheduleBySurgeryID = async (surgery_id) =>{
    const res = await fetch(`${BASE_URL}/${surgery_id}`)
    return res.json()

}

export const updateSchedule = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}