const BASE_URL = 'http://localhost:3000/api';


export const getSurgeon = async () => {
    const res = await fetch(`${BASE_URL}/surgeon`);
    return res.json();
};