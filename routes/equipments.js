import db from '../db.js'
import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
    const getAllequipment = 'select * from equipment'
    try {
        const [result] = await db.execute(getAllequipment)
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
    const getequipmentByID = 'select * from equipment where equipment_id=?'
    try {
        const [result] = await db.execute(getequipmentByID, [id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})

router.post('/', async (req, res) => {
    const { equipment_id, name, type, last_maintenance, status } = req.body
    if (!equipment_id || !name || !type || !last_maintenance || !status) {
        return res.status(400).json({ message: "Fill all fields" })
    }
    const addNewequipment = 'insert into equipment  ( equipment_id, name, type, last_maintenance, status )  values (?,?,?,?,?)'

    try {
        const [result] = await db.execute(addNewequipment, [ equipment_id, name, type, last_maintenance, status ])
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

    const updateQuery = `UPDATE equipment SET ${fields.join(', ')} WHERE equipment_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "equipment not found" });
        }
        res.status(200).json({ message: "equipment updated successfully" });
    } catch (error) {
        console.error("Error updating equipment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(404).json({ message: "404 Not Found" })
    }
    const removeequipment = 'delete from equipment where equipment_id=?'

    try {
        const [result] = await db.execute(removeequipment, [id])
        res.status(200).json({ message: "Successfully removed", data: result })

    } catch (error) {
        console.error("Error", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

export default router;