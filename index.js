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


dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // or whatever your frontend URL is
    credentials: true
}));

app.use(express.json());



// Connect to the database
db.getConnection()
    .then((connection) => {
        console.log("successfully connected");
        connection.release();
    })
    .catch((err) => {
        console.log("Error", err);
    });
// In your backend

// Routes with role-based authorization
app.use('/api/surgeries',  surgeryRouter);
app.use('/api/theatre',  theatreRouter);
app.use('/api/staff',  staffRouter);
app.use('/api/surgeon', surgeonRouter);
app.use('/api/patient', patientRouter);
app.use('/api/equipments', equipmentRouter);
app.use('/api/billing',  billingRouter);
app.use('/api/op_records',  opRecordsRouter);
app.use('/api/schedule',  scheduleRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});
