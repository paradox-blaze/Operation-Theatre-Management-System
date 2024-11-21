import db from '../db.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
    const getAllTheatres = 'select * from operation_theatre'
    try {
        const [result] = await db.execute(getAllTheatres)
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})

router.get('/:id/availability', async (req, res) => {
    const { id: theatre_id } = req.params
    const { surgery_date, start_time, end_time } = req.query

    if (!theatre_id || !surgery_date || !start_time || !end_time) {
        return res.status(400).json({ message: "Missing required parameters" })
    }

    const checkAvailability = 'call checkAvailablityOfTheatres(?,?,?,?,@is_available)'
    const is_Available = 'select @is_available as Availability'

    try {
        await db.execute(checkAvailability, [theatre_id, surgery_date, start_time, end_time])
        const [result] = await db.execute(is_Available)

        res.status(200).json({ data: result[0] })
    } catch (error) {
        console.error("error ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get('/:id/schedule', async (req, res) => {
    const { id: theatre_id } = req.params
    if (!theatre_id) {
        return res.status(404).json({ message: "404 Not Found" })
    }

    const checkTheatreSchedule = `SELECT 
    ot.theatre_id,
    ot.name AS theatre_name,
    ot.capacity,
    sch.surgery_date,
    sch.start_time,
    sch.end_time,
    s.surgery_id,
    s.status
FROM 
    operation_theatre ot
JOIN 
    surgery s ON ot.theatre_id = s.theatre_id
JOIN 
    schedule sch ON s.schedule_id = sch.schedule_id
WHERE
    ot.theatre_id = ?
ORDER BY 
    ot.theatre_id, sch.surgery_date, sch.start_time;
`
    try {
        const [result] = await db.execute(checkTheatreSchedule, [theatre_id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error("error ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get('/:id/equipment', async (req, res) => {
    const { id: theatre_id } = req.params;
    if (!theatre_id) {
        return res.status(404).json({ message: "404 Not Found" });
    }

    const getEquipmentForTheatre = `
        SELECT 
            ot.theatre_id,
            ot.name AS theatre_name,
            e.equipment_id,
            e.name AS equipment_name,
            e.type ,
            e.status
          
        FROM 
            operation_theatre ot
        JOIN 
            surgery s ON ot.theatre_id = s.theatre_id
        JOIN 
            surgery_equipment se ON s.surgery_id = se.surgery_id
        JOIN 
            equipment e ON se.equipment_id = e.equipment_id
        WHERE 
            ot.theatre_id = ?
        ORDER BY 
            e.name;
    `;

    try {
        const [result] = await db.execute(getEquipmentForTheatre, [theatre_id]);
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching equipment for theatre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post('/', async (req, res) => {
    const { theatre_id, name, capacity } = req.body
    if (!theatre_id || !name || !capacity) {
        return res.status(400).json({ message: "Fill all fields" })
    }
    const addNewTheatre = 'insert into operation_theatre (theatre_id,name,capacity) values (?,?,?)'

    try {
        const [result] = await db.execute(addNewTheatre, [theatre_id, name, capacity])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error("Error fetching equipment for theatre:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/:id/equipment', async (req, res) => {
    const { id: theatre_id } = req.params;
    const { equipment_id } = req.body;
    const addEquipmentQuery = `
        INSERT INTO theatre_equipment (theatre_id, equipment_id) VALUES (?, ?)
    `;
    try {
        await db.execute(addEquipmentQuery, [theatre_id, equipment_id]);
        res.status(201).json({ message: "equipment added to theatre." });
    } catch (error) {
        console.error("Error adding equipment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No fields provided for update" });
    }

    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
    }
    values.push(id);

    const updateQuery = `UPDATE operation_theatre SET ${fields.join(', ')} WHERE theatre_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "theatre not found" });
        }
        res.status(200).json({ message: "Theatre updated successfully" });
    } catch (error) {
        console.error("Error updating theatre:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
export default router