const BASE_URL = 'http://localhost:3000/api';



export const getStaff = async () => {
    const res = await fetch(`${BASE_URL}/staff`);
    return res.json();
};