import db from '../db.js'
import express from 'express'

const router = express.Router()


router.get('/', async (req, res) => {
    const getAllStaff = 'select * from staff'
    try {
        const [result] = await db.execute(getAllStaff)
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
    const getStaffByID = 'select * from staff where staff_id=?'
    try {
        const [result] = await db.execute(getStaffByID, [id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})

router.post('/', async (req, res) => {
    const { staff_id, name, role, shift, contact_number, availability } = req.body
    if (!staff_id || !name || !role || !shift || !contact_number || !availability) {
        return res.status(400).json({ message: "Fill all fields" })
    }
    const addNewStaff = 'insert into staff (staff_id,name,role,shift,contact_number,availability) values (?,?,?,?,?,?)'

    try {
        const [result] = await db.execute(addNewStaff, [staff_id, name, role, shift, contact_number, availability])
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

    const updateQuery = `UPDATE staff SET ${fields.join(', ')} WHERE staff_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Staff not found" });
        }
        res.status(200).json({ message: "Staff updated successfully" });
    } catch (error) {
        console.error("Error updating Staff:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const removeStaff = 'delete from staff where staff_id=?'

    try {
        const [result] = await db.execute(removeStaff, [id])
        res.status(200).json({ message: "Successfully removed", data: result })

    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

router.get('/:id/availability', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const checkAvailability = 'select availability from staff where staff_id = ?'
    try {
        const [result] = await db.execute(checkAvailability, [id])
        res.status(200).json({ data: result })

    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})
export default router
