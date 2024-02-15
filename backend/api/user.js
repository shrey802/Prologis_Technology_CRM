import { connectMySQL } from "../config/sqlconfig.js";


// LOGIN API
export const getTheUser = async (username, password, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(
            `SELECT * FROM users WHERE username = ? AND password = ? AND orgcode = ?`,
            [username, password, orgcode]
        );
        // If no user is found, return null
        if (rows.length === 0) {
            return null;
        }
        // Otherwise, return the user details
        return rows[0]; 
    } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
    }
}



// REGISTER API
export const insertUser = async (username, password, orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const firstEmptyIndex = orgname.indexOf(' ');
        const orgNamehaiye = orgname.slice(0, firstEmptyIndex !== -1 ? firstEmptyIndex : orgname.length).toLowerCase();
        const newOrgcode = orgNamehaiye + '@' + orgcode
        const [rows] = await connection.execute(`INSERT INTO users (username, password, orgcode, orgname) VALUES (?, ?, ?, ?)`,
            [username, password, newOrgcode, orgname]
        ); // Replace orgcode with newOrgCode
        return {rows: rows, orgcode: newOrgcode};
    } catch (error) {
        console.error('Error inserting user:', error.message);
        throw error;
    }
}



