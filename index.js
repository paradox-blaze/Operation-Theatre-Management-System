import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';
import surgeryRouter from './routes/surgeries.js';
import theatreRouter from './routes/theatre.js';
import staffRouter from './routes/staff.js';
import surgeonRouter from './routes/surgeons.js';
import patientRouter from './routes/patients.js';
import equipmentRouter from './routes/equipments.js';
import billingRouter from './routes/billing.js';
import opRecordsRouter from './routes/opRecords.js';
import scheduleRouter from './routes/schedule.js';
import authRouter from './routes/auth.js';
import { verifyToken, checkRole } from './middleware/auth.js';


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRouter);


// Connect to the database
db.getConnection()
    .then((connection) => {
        console.log("successfully connected");
        connection.release();
    })
    .catch((err) => {
        console.log("Error", err);
    });



// Protected routes with role-based authorization
app.use('/api/surgeries', verifyToken, checkRole(['admin', 'surgeon']), surgeryRouter);
app.use('/api/theatre', verifyToken, checkRole(['admin', 'surgeon']), theatreRouter);
app.use('/api/staff', verifyToken, checkRole(['admin']), staffRouter);
app.use('/api/surgeon', verifyToken, checkRole(['admin']), surgeonRouter);
app.use('/api/patient', verifyToken, checkRole(['admin', 'surgeon']), patientRouter);
app.use('/api/equipments', verifyToken, checkRole(['admin', 'staff']), equipmentRouter);
app.use('/api/billing', verifyToken, checkRole(['admin', 'staff']), billingRouter);
app.use('/api/op_records', verifyToken, checkRole(['admin', 'surgeon', 'staff']), opRecordsRouter);
app.use('/api/schedule', verifyToken, checkRole(['admin', 'staff']), scheduleRouter);

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});