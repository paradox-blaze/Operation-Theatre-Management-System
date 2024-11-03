import db from '../db.js'
import express from 'express'

const router = express.Router()

router.post('/', async (req, res) => {
    const { op_record_id, patient_id, surgery_id, asssesment, preparations, recovery_progress, follow_up_dates } = req.body;
    if (!op_record_id || !patient_id || !surgery_id || !asssesment || !preparations || !recovery_progress || !follow_up_dates) {
        return res.status(400).json("Fill all fields")
    }
    const addNewOpRecord = 'insert into op_record (op_record_id,patient_id,surgery_id,asssesment,preparations,recovery_progress,follow_up_dates) values (?,?,?,?,?,?,?)'
    try {
        const [result] = await db.execute(addNewOpRecord, [op_record_id, patient_id, surgery_id, asssesment, preparations, recovery_progress, follow_up_dates])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})


router.get('/:id', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getOpRecordByID = 'select * from op_record where op_record_id=?'
    try {
        const [result] = await db.execute(getOpRecordByID, [id])
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

    const updateQuery = `UPDATE op_record SET ${fields.join(', ')} WHERE op_record_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "op_record not found" });
        }
        res.status(200).json({ message: "op_record updated successfully" });
    } catch (error) {
        console.error("Error updating op_record:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/follow-up/:patient_id', async (req, res) => {
    const { patient_id } = req.params;
    if (!patient_id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getFollowUpByPatient = `
        select patient_id,follow_updates
        from op_record
        where patient_id = ?
    
    `
    try {
        const [result] = await db.execute(getFollowUpByPatient, [patient_id])
        res.status(200).json({ data: result })
    } catch (error) {
        
    }

})


export default router;