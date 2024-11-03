import db from '../db.js'
import express from 'express'

const router = express.Router()

router.post('/', async (req, res) => {
    const { bill_id, surgery_id, amount, status, payment_date } = req.body;
    if (!bill_id || !surgery_id || !amount || !status || !payment_date) {
        return res.status(400).json("Fill all fields")
    }
    const addNewBill = 'insert into bill (bill_id,surgery_id,amount,status,payment_date) values (?,?,?,?,?)'
    try {
        const [result] = await db.execute(addNewBill, [bill_id, surgery_id, amount, status, payment_date])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })

    }
})
router.get('/', async (req, res) => {
    const getAllbill = 'select * from bill'
    try {
        const [result] = await db.execute(getAllbill)
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
    const getBillByID = 'select * from bill where bill_id=?'
    try {
        const [result] = await db.execute(getBillByID, [id])
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

    const updateQuery = `UPDATE bill SET ${fields.join(', ')} WHERE bill_id = ?`;

    try {
        const [result] = await db.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "bill not found" });
        }
        res.status(200).json({ message: "bill updated successfully" });
    } catch (error) {
        console.error("Error updating bill:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get('/pending', async (req, res) => {
    const getPendingBills = 'select * from bill where status="Pending"';
    try {
        const [result] = await db.execute(getPendingBills)
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


router.get('/by-patient/:patient_id', async (req, res) => {
    const { patient_id } = req.params;

    if (!patient_id) {
        return res.status(404).json({ message: "404 Not Found" })
    }

    const getBillByPatient = `
        select p.patient_id,p.name,
        b.*
        from patient p
        join surgery s on p.patient_id = s.patient_id
        join bill b on s.surgery_id = b.surgery_id
        where p.patient_id = ?
    `
    try {
        const [result] = await db.execute(getBillByPatient, [patient_id])
        res.status(200).json({ data: result })
    } catch (error) {
        console.error('Error ', error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})




export default router;