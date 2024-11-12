

const BASE_URL = 'http://localhost:3000/api/theatre';


export const getTheatre = async () => {
    const res = await fetch(`${BASE_URL}/`);
    return res.json();
};

export const checkTheatreAvailability = async (id,data) => {
    const res = await fetch(`${BASE_URL}/${id}`,{
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
    return res.json();
};


export const getTheatreSchedule = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/schedule`);
    return res.json();
};


export const getTheatreEquipment = async (id) => {
    const res = await fetch(`${BASE_URL}/${id}/equipment`);
    return res.json();
};

export const createTheatre = async (data)=>{
    const res = await fetch(`${BASE_URL}/`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)

    })
    return res.json()
}


export const createTheatreEquipment = async (id,data) =>{
    const res = await fetch(`${BASE_URL}/${id}/equipment`,{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    }) 
    return res.json()
}


export const updateTheatre = async (id,data)=>{
    const res = await fetch (`${BASE_URL}/${id}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    return res.json()
}