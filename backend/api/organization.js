
import { connectMySQL } from "../config/sqlconfig.js";


// STORING 
export const OrgDataStorage = async (clientname, orgname, orgcode, address, country, state, city, postalCode, phoneNumber, emailAddress, PAN, GST, IEC, creditdays, branchName, username) => {
    try {
        const connection = await connectMySQL();
        // Check if data exists in the users table for the provided orgname and orgcode
        const [row] = await connection.execute(`
            SELECT * FROM users WHERE orgname = ? AND orgcode = ?
        `, [orgname, orgcode]);

        // Extract alias from orgname
        const firstEmptyIndex = clientname.indexOf(' ');
        const aliasisthis = clientname.slice(0, firstEmptyIndex !== -1 ? firstEmptyIndex : orgname.length).toLowerCase();

        // Insert data into the organizations table
        const [rows] = await connection.execute(`
            INSERT INTO crm_db.organizations (clientname, alias, address, country, state, city, postalcode, phone, email, PAN, GST, IEC, creditdays, orgname, orgcode, branchname, username)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [clientname, aliasisthis, address, country, state, city, postalCode, phoneNumber, emailAddress, PAN, GST, IEC, creditdays, orgname, orgcode, branchName, username]);
        const insertedId = rows.insertId;

        // Get the auto-generated ID of the inserted row
        const [rowWithAutoGeneratedId] = await connection.execute('SELECT LAST_INSERT_ID() as id');

        // Extract the auto-generated ID from the row
        const autoGeneratedId = rowWithAutoGeneratedId[0].id;

        return autoGeneratedId;
    } catch (error) {
        console.error('Error inserting organization data:', error.message);
        throw error;
    }
}


// RENDER ON ORGANIZATION PAGE
// export const OrgRender = async (orgname, orgcode) => {
//     try {
//         const connection = await connectMySQL();

//         const [row] = await connection.execute(`
//             SELECT clientname, alias, branchname FROM organizations WHERE orgname = ? AND orgcode = ?
//         `, [orgname, orgcode]);

//         return row;
//     } catch (error) {
//         console.error('Error fetching organization data:', error.message);
//         throw error;
//     }
// }






// export const OrgRender = async (orgname, orgcode) => {
//     try {
//         const connection = await connectMySQL();

//         const [rows] = await connection.execute(`
//             SELECT clientname, alias, branchname
//             FROM organizations
//             WHERE orgname = ? AND orgcode = ?
//         `, [orgname, orgcode]);
//         console.log(rows);
//         if (rows.length > 0) {
//             const branchNames = rows.map(row => row.branchname); // Use map instead of forEach
//             const organizationData = {
//                 clientname: rows[0].clientname,
//                 alias: rows[0].alias,
//                 allbranchesofclient: branchNames
//             };

//             return organizationData;
//         } else {
//             return null; // Handle case where organization not found
//         }
//     } catch (error) {
//         console.error('Error fetching organization data:', error.message);
//         throw error;
//     }
// }





export const OrgRender = async (orgname, orgcode) => {
    try {
        const connection = await connectMySQL();

        const [rows] = await connection.execute(`
            SELECT clientname, alias, branchname, id
            FROM organizations
            WHERE orgname = ? AND orgcode = ?
        `, [orgname, orgcode]);

        if (rows.length > 0) {
            const clientsMap = new Map(); // Map to store clients and their branches
            rows.forEach(row => {
                const { clientname, alias, branchname, id } = row;
                if (clientsMap.has(alias)) {
                    clientsMap.get(alias).branches.push({ branchname, id });
                } else {
                    clientsMap.set(alias, { clientname, alias, branches: [{ branchname, id }] });
                }
            });

            const organizationData = Array.from(clientsMap.values());
            return organizationData.flat(); // Flatten the array
        } else {
            return null; // Handle case where organization not found
        }
    } catch (error) {
        console.error('Error fetching organization data:', error.message);
        throw error;
    }
}



















// ADD USER VIA ADMIN API
export const insertEmployees = async (username, password, orgcode, branchname, orgname) => {
    try {
        const connection = await connectMySQL();

        // Check if the organization exists in the users table
        const [rows] = await connection.execute(`
            SELECT * FROM users WHERE orgcode = ? AND orgname = ?
        `, [orgcode, orgname]);

        // If the organization doesn't exist, throw an error
        if (rows.length === 0) {
            throw new Error('Organization does not exist');
        }

        // Insert employee data into the employees table
        await connection.execute(`
            INSERT INTO employees (username, password, branchname, orgcode, orgname) 
            VALUES (?, ?, ?, ?, ?)
        `, [username, password, branchname, orgcode, orgname]);

        return rows;
    } catch (error) {
        console.error('Error inserting employee data:', error.message);
        throw error;
    }
}



export const fetchBranchData = async (clientname, alias, branchname, id) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`SELECT * FROM organizations WHERE clientname = ? AND alias = ? AND branchname = ? AND id = ?`, [clientname, alias, branchname, id]);

        return row[0];
    } catch (error) {
        console.error('Error inserting employee data:', error.message);
        throw error;
    }
}






export const updateRow = async (orgcode, orgname, clientname, alias, branchname, address, country, state, city, postalcode, phone, email, PAN, GST, IEC, creditdays) => {
    try {
        const connection = await connectMySQL();

        const [row] = await connection.execute(`
            UPDATE organizations
            SET 
                address = ?,
                country = ?,
                state = ?,
                city = ?,
                postalcode = ?,
                phone = ?,
                email = ?,
                PAN = ?,
                GST = ?,
                IEC = ?,
                creditdays = ?
            WHERE 
                orgcode = ? AND
                orgname = ? AND
                branchname = ? AND
                clientname = ? AND
                alias = ?
        `, [
            address, country, state, city, postalcode, phone, email, PAN, GST, IEC, creditdays,
            orgcode,
            orgname,
            branchname,
            clientname,
            alias,
        ]);


        return row;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}




// STORE CONTACTS
export const insertContact = async (contactName, designation, department, mobile, email, branchname, orgname, orgcode, id, clientname) => {
    try {
        const connection = await connectMySQL();
        const row = await connection.execute(`INSERT INTO contacts 
        (contactName, designation, department, mobile, email, branchname, orgname, orgcode, clientname, bid) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [contactName, designation, department, mobile, email, branchname, orgname, orgcode, clientname, id]);
        return row;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}



export const fetchAllContacts = async (branchname, clientname, id, orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(`SELECT * FROM contacts WHERE branchname = ? AND orgname = ? AND orgcode = ? AND clientname = ? AND bid = ?`, [branchname, orgname, orgcode, clientname, id]);
        return rows;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}

export const fetchAllContactsofNew = async (branchname, clientname, orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(`SELECT * FROM contacts WHERE branchname = ? AND orgname = ? AND orgcode = ? AND clientname = ?`, [branchname, orgname, orgcode, clientname]);
        return rows;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}


export const updateContactduringNew = async (contactName, designation, department, mobile, email, branchname, orgname, orgcode, clientname) => {
    try {
        const connection = await connectMySQL();
        const row = await connection.execute(`UPDATE contacts SET contactName = ?, designation = ?, department = ?, mobile = ?, email = ? WHERE branchname = ? AND orgname = ? AND orgcode = ? AND clientname = ?`,
            [contactName, designation, department, mobile, email, branchname, orgname, orgcode, clientname]);
        return row;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}



export const deleteContact = async (email, mobile, contactName, designation, department) => {
    try {
        const connection = await connectMySQL();
        const row = await connection.execute(`DELETE FROM contacts WHERE email = ? AND mobile = ? AND contactName = ? AND designation = ? AND department = ?`, [email, mobile, contactName, designation, department]);
        return row;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}


export const updateContact = async (contactName, designation, department, mobile, email, branchname, clientname, id, orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const row = await connection.execute(
            `UPDATE contacts SET contactName = ?, designation = ?, department = ?, mobile = ?, email = ? WHERE branchname = ? AND orgname = ? AND orgcode = ? AND clientname = ? AND bid = ?`,
            [contactName, designation, department, mobile, email, branchname, orgname, orgcode, clientname, id]
        );
        return row;
    } catch (error) {
        console.error('Error updating row:', error.message);
        throw error;
    }
}




export const saveBranchinTable = async (clientname, orgcode, branchname) => {
    try {
        const connection = await connectMySQL();

        const [row] = await connection.execute(`INSERT INTO branches (clientname, orgcode, branchname) VALUES (?, ?, ?)`, [clientname, orgcode, branchname]);
        return {
            row,
            branchname
        }
    } catch (error) {
        console.log(error);
    }
}



export const updateBID = async (BID, clientname, orgcode, branchname) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`
            UPDATE branches 
            SET bid = ? 
            WHERE clientname = ? AND orgcode = ? AND branchname = ? AND bid IS NULL
        `, [BID, clientname, orgcode, branchname]);

        if (row.affectedRows === 0) {
            throw new Error('Branch not found or BID was not updated');
        }

        return { success: true, message: 'BID updated successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Error updating BID' };
    }
}




export const deleteBranch = async (id, branchname, orgcode, orgname, clientname) => {
    try {
        const connection = await connectMySQL();

        // Delete branch from organizations table
        const [orgRow] = await connection.execute(`
            DELETE FROM organizations 
            WHERE id = ? AND branchname = ? AND orgcode = ? AND orgname = ? AND clientname = ?
        `, [id, branchname, orgcode, orgname, clientname]);

        // Delete branch from branches table
        const [branchRow] = await connection.execute(`
            DELETE FROM branches 
            WHERE bid = ? AND orgcode = ? AND clientname = ? AND branchname = ?
        `, [id, orgcode, clientname, branchname]);

        return {branchRow, orgRow};
    } catch (error) {
        console.log(error);
    }
}