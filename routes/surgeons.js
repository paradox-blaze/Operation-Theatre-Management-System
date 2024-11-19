import db from '../db.js'
import express from 'express'

const router = express.Router()


router.get('/', async (req, res) => {
    const getAllsurgeon = 'select * from surgeon'
    try {
        const [result] = await db.execute(getAllsurgeon)
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
    const getsurgeonByID = 'select * from surgeon where surgeon_id=?'
    try {
        const [result] = await db.execute(getsurgeonByID, [id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})

router.post('/', async (req, res) => {
    const { surgeon_id, name, specializations, contact_number, availability, supervisor_id } = req.body
    if (!surgeon_id || !name || !specializations || !contact_number || !availability || !supervisor_id) {
        return res.status(400).json({ message: "Fill all fields" })
    }
    const addNewsurgeon = 'insert into surgeon  (surgeon_id, name,specializations,contact_number, availability,supervisor_id)  values (?,?,?,?,?,?)'

    try {
        const [result] = await db.execute(addNewsurgeon, [surgeon_id, name, specializations, contact_number, availability, supervisor_id])
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

    const updateQuery = `UPDATE surgeon SET ${fields.join(', ')} WHERE surgeon_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "surgeon not found" });
        }
        res.status(200).json({ message: "surgeon updated successfully" });
    } catch (error) {
        console.error("Error updating surgeon:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" });
    }

    try {
        // First check if surgeon has any ongoing surgeries
        const checkSurgeries = `
            SELECT COUNT(*) as count 
            FROM surgery 
            WHERE surgeon_id = ? 
            AND status IN ('SCHEDULED', 'IN_PROGRESS')`;
        const [surgeryResult] = await db.execute(checkSurgeries, [id]);

        if (surgeryResult[0].count > 0) {
            return res.status(400).json({
                message: "Cannot delete surgeon with ongoing or scheduled surgeries. Please reassign or complete their surgeries first."
            });
        }

        // Check if surgeon is a supervisor to other surgeons
        const checkSupervisor = `
            SELECT COUNT(*) as count 
            FROM surgeon 
            WHERE supervisor_id = ?`;
        const [supervisorResult] = await db.execute(checkSupervisor, [id]);

        if (supervisorResult[0].count > 0) {
            return res.status(400).json({
                message: "Cannot delete surgeon who is supervising other surgeons. Please reassign their supervisees first."
            });
        }

        // If all checks pass, proceed with deletion
        // First, update any completed surgeries to set surgeon_id to NULL
        const updateCompletedSurgeries = `
            UPDATE surgery 
            SET surgeon_id = NULL 
            WHERE surgeon_id = ? 
            AND status = 'COMPLETED'`;
        await db.execute(updateCompletedSurgeries, [id]);

        // Then delete the surgeon
        const removeSurgeon = 'DELETE FROM surgeon WHERE surgeon_id = ?';
        const [result] = await db.execute(removeSurgeon, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Surgeon not found"
            });
        }

        res.status(200).json({
            message: "Successfully removed surgeon",
            data: result
        });

    } catch (error) {
        console.error("Error deleting surgeon:", error);
        return res.status(500).json({
            message: "Failed to delete surgeon. " + (error.message || "Please try again later."),
            error: error.message
        });
    }
});



export default router
