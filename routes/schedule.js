import db from '../db.js'
import express from 'express'

const router = express.Router()

router.post('/', async (req, res) => {
    const { schedule_id, surgery_id, start_time, end_time } = req.body;
    if (!schedule_id || !surgery_id || !start_time || !end_time) {
        return res.status(400).json("Fill all fields")
    }
    const addNewSchedule = 'insert into schedule (schedule_id,surgery_id,start_time,end_time) values (?,?,?,?)'
    try {
        const [result] = await db.execute(addNewSchedule, [schedule_id, surgery_id, start_time, end_time])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})

router.get('/', async (req, res) => {
    const getAllschedule = 'select * from schedule'
    try {
        const [result] = await db.execute(getAllschedule)
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})


router.get('/:surgery_id', async (req, res) => {
    const { surgery_id } = req.params
    if (!surgery_id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getScheduleBySurgeryID = 'select s.surgery_id,sch.* from surgery s join schedule sch on s.schedule_id=sch.schedule_id where s.surgery_id=?'
    try {
        const [result] = await db.execute(getScheduleBySurgeryID, [surgery_id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
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

    const updateQuery = `UPDATE schedule SET ${fields.join(', ')} WHERE schedule_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "schedule not found" });
        }
        res.status(200).json({ message: "schedule updated successfully" });
    } catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



export default router;