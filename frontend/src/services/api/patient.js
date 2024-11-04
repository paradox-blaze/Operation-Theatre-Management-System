const BASE_URL = 'http://localhost:3000/api';

export const getpatient = async () => {
    const res = await fetch(`${BASE_URL}/patient`);
    return res.json();
};