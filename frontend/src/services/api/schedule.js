const BASE_URL = 'http://localhost:3000/api';


export const getSchedule = async () => {
    const res = await fetch(`${BASE_URL}/schedule`);
    return res.json();
};

