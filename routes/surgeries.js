import db from '../db.js'
import express from 'express'

const router = express.Router()


router.get('/AvailableTheatres', async (req, res) => {
    const { surgery_date, start_time, end_time } = req.query;

    if (!surgery_date || !start_time || !end_time) {
        return res.status(400).json({ message: "Missing required parameters" })
    }
    const availableTheatres = 'call GetAvailableTheatres(?,?,?)'

    try {
        const [result] = await db.execute(availableTheatres, [surgery_date, start_time, end_time]);
        res.status(200).json({ data: result[0] })
    } catch (error) {
        console.error("error ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})

router.get('/upcoming', async (req, res) => {
    const getUpcomingSurgeries = 'select s.*,sch.surgery_date from surgery s join schedule sch on s.schedule_id = sch.schedule_id where sch.surgery_date > NOW();'
    try {
        const [result] = await db.execute(getUpcomingSurgeries);
        if (result.length === 0) {
            return res.status(404).json({ message: "No upcoming surgeries found." });
        }
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching upcoming surgeries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.get('/:id', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getSurgeryID =
        `select * from surgery where surgery_id =?`
    try {
        const [result] = await db.execute(getSurgeryID, [id])
        if (result.length === 0) {
            return res.status(404).json({ message: "404 Not Found" })
        }
        res.status(200).json({ message: result })

    } catch (error) {
        res.status(500).json({ message: error })
    }

})

router.get('/by-surgeon/:surgeon_id', async (req, res) => {
    const { surgeon_id } = req.params
    if (!surgeon_id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getSurgeryBySurgeons = 'select s.*,su.name from surgery s join surgeon su on s.surgeon_id = su.surgeon_id where su.surgeon_id=?'
    try {
        const [result] = await db.execute(getSurgeryBySurgeons, [surgeon_id])
        if (result.length === 0) {
            return res.status(404).json({ message: "404 Not Found" })
        }
        res.status(200).json({ data: result })
    } catch (error) {
        console.error("ERROR: ", error)
        res.status(500).json({ message: error })
    }
})

router.get('/by-patient/:patient_id', async (req, res) => {
    const { patient_id } = req.params
    if (!patient_id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getSurgeryByPatient = 'select s.*,p.name from surgery s join patient p on s.patient_id = p.patient_id where p.patient_id=?'
    try {
        const [result] = await db.execute(getSurgeryByPatient, [patient_id])
        if (result.length === 0) {
            return res.status(404).json({ message: "404 Not Found" })
        }
        res.status(200).json({ data: result })
    } catch (error) {
        console.error("ERROR: ", error)
        res.status(500).json({ message: error })
    }
})


router.get('/', async (req, res) => {
    const getAllSurgeries =
        'select * from surgery'
    try {
        const [result] = await db.execute(getAllSurgeries)
        res.status(200).json({ data: result })
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const cancelSurgery = 'delete from surgery where surgery_id=?'

    try {
        const [result] = await db.execute(cancelSurgery, [id])
        res.status(200).json({ message: "Successfully deleted", data: result })

    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

router.post('/', async (req, res) => {
    const { surgery_id, patient_id, surgeon_id, theatre_id, schedule_id, surgery_type, status, outcome } = req.body
    if (!surgery_id || !patient_id || !surgeon_id || !theatre_id || !schedule_id || !surgery_type || !status) {
        return res.status(400).json({ message: "Must enter all fields" });
    }
    const addSurgery = 'INSERT INTO surgery (surgery_id, patient_id, surgeon_id, theatre_id, schedule_id, surgery_type, status, outcome) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result] = await db.execute(addSurgery, [surgery_id, patient_id, surgeon_id, theatre_id, schedule_id, surgery_type, status, outcome])
        res.status(200).json({ message: "Successfully added", data: result })
    } catch (error) {
        console.error("error inserting", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})


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

    const updateQuery = `UPDATE surgery SET ${fields.join(', ')} WHERE surgery_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Surgery not found" });
        }
        res.status(200).json({ message: "Surgery updated successfully" });
    } catch (error) {
        console.error("Error updating surgery:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/:id/equipment', async (req, res) => {
    const { id: surgery_id } = req.params;
    const { equipment_id, quantity } = req.body;
    const addEquipmentQuery = `
        INSERT INTO surgery_equipment (surgery_id, equipment_id,quantity) VALUES (?, ?, ?)
    `;
    try {
        await db.execute(addEquipmentQuery, [surgery_id, equipment_id, quantity]);
        res.status(201).json({ message: "Equipment added to surgery." });
    } catch (error) {
        console.error("Error adding equipment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/:id/staff', async (req, res) => {
    const { id: surgery_id } = req.params;
    const { staff_id } = req.body;
    const addStaffQuery = `
        INSERT INTO surgery_staff (surgery_id, staff_id) VALUES (?, ?)
    `;
    try {
        await db.execute(addStaffQuery, [surgery_id, staff_id]);
        res.status(201).json({ message: "staff added to surgery." });
    } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/:id/equipment', async (req, res) => {
    const { id: surgery_id } = req.params;
    const listEquipmentQuery = `
        SELECT e.*
        FROM surgery_equipment se
        JOIN equipment e ON se.equipment_id = e.equipment_id
        WHERE se.surgery_id = ?;
    `;
    try {
        const [result] = await db.execute(listEquipmentQuery, [surgery_id]);
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching equipment for surgery:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/:id/staff', async (req, res) => {
    const { id: surgery_id } = req.params;
    const liststaffQuery = `
        SELECT s.*
        FROM surgery_staff ss
        JOIN staff s ON ss.staff_id = s.staff_id
        WHERE ss.surgery_id = ?;
    `;
    try {
        const [result] = await db.execute(liststaffQuery, [surgery_id]);
        res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error fetching staff for surgery:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




export default router















