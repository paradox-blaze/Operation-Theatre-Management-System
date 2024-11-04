const BASE_URL = 'http://localhost:3000/api';


export const getSurgeries = async () => {
    const res = await fetch(`${BASE_URL}/surgeries`);
    return res.json();
};