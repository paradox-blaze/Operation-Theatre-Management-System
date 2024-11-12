// createUser.js
import bcrypt from 'bcrypt';
import db from './db.js'; // Adjust the path to your db connection file

const createUser = async () => {
    const username = 'Aneesh';
    const plainPassword = 'Aneesh@10'; // Replace with your desired password
    const role = 'admin'; // Set the role as needed
    const email = 'aneeshupadhya234@gmail.com';

    try {
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

        // Insert the user into the database with the hashed password
        await db.query(
            `INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)`,
            [username, passwordHash, role, email]
        );

        console.log('User created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

createUser();
