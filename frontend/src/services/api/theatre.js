const BASE_URL = 'http://localhost:3000/api';


export const getTheatre = async () => {
    const res = await fetch(`${BASE_URL}/theatre`);
    return res.json();
};