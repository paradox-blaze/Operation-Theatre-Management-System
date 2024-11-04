const BASE_URL = 'http://localhost:3000/api';

export const getEquipment = async () => {
    const res = await fetch(`${BASE_URL}/equipment`);
    return res.json();
};