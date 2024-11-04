const BASE_URL = 'http://localhost:3000/api';

export const getBilling = async () => {
    const res = await fetch(`${BASE_URL}/billing`);
    return res.json();
};