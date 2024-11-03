import db from '../db.js'
import express from 'express'

const router = express.Router()


router.get('/', async (req, res) => {
    const getAllpatient = 'select * from patient'
    try {
        const [result] = await db.execute(getAllpatient)
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
    const getpatientByID = 'select * from patient where patient_id=?'
    try {
        const [result] = await db.execute(getpatientByID, [id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})

router.post('/', async (req, res) => {
    const { patient_id, name, DOB, contact_number, allergies, address } = req.body
    if (!patient_id || !name || !DOB || !contact_number || !allergies || !address) {
        return res.status(400).json({ message: "Fill all fields" })
    }
    const addNewpatient = 'insert into patient  ( patient_id, name, DOB, contact_number, allergies, address )  values (?,?,?,?,?,?)'

    try {
        const [result] = await db.execute(addNewpatient, [patient_id, name, DOB, contact_number, allergies, address])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
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

    const updateQuery = `UPDATE patient SET ${fields.join(', ')} WHERE patient_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "patient not found" });
        }
        res.status(200).json({ message: "patient updated successfully" });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const removepatient = 'delete from patient where patient_id=?'

    try {
        const [result] = await db.execute(removepatient, [id])
        res.status(200).json({ message: "Successfully removed", data: result })

    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})


router.get('/:id/emergency_contact', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const getEmergency_contact = 'select * from emergency_contact where patient_id =?'
    try {
        const [result] = await db.execute(getEmergency_contact, [id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})






export default router
