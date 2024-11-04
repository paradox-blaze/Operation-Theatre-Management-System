const BASE_URL = 'http://localhost:3000/api';


export const getOpRecords = async () => {
    const res = await fetch(`${BASE_URL}/op_record`);
    return res.json();
};