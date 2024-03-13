import { connectMySQL } from "../config/sqlconfig.js";
import nodemailer from 'nodemailer'


let transporter = nodemailer.createTransport({
    service: 'gmail',
    type: "SMTP",
    secure: true,
    auth: {
        user: 'shreyashpingle752@gmail.com',
        pass: 'vircbhwmcnqfinrb'
    }
});
// var mailOptions = {
//     from: 'shreyashpingle752@gmail.com',
//     to: orderData[0].email,
//     subject: 'Your Order Details',
//     html: `
// <p>Here's your order details & shipping details:</p>
// <ul>
// <li>Email: ${wholeOrderObject.email}</li>
// <li>Phone: ${wholeOrderObject.phone}</li>
// <li>Address: ${wholeOrderObject.address}</li>
// <li>Quantity: ${wholeOrderObject.quantity}</li>
// <li>Total Price: Rs. ${wholeOrderObject.totalPrice}</li>
// <li>Payment Method: ${wholeOrderObject.paymentMethod}</li>
// <li>Name: ${wholeOrderObject.name}</li>
// <li>Description: ${wholeOrderObject.description}</li>
// <li>Categories: ${wholeOrderObject.Categories}</li>
// </ul>
// `,
// };

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         return { success: false, message: 'Works Email has been sent' };
//     } else {
//         return { success: false, message: 'Internal server error.' };
//     }
// });



let incrementNumber = 0;
export const storeJob = async (jobDate, docReceivedOn, transportMode, customHouse, ownBooking, deliveryMode, numberOfContainer, ownTransportation, beType, consignmentType, cfsName, shippingLineName, blType, bltypenumber, jobOwner, orgname, orgcode, lastIc, freedays, blstatus) => {
    try {
        const connection = await connectMySQL();
        const firstletter = transportMode.charAt(0).toUpperCase();


        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth() - 1; // April (zero-based index)

        // Determine the year range based on the current month
        let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
        let endYear = startYear + 1;

        // Extract the last two digits of the years
        let startYearPart = startYear.toString().slice(-2);
        let endYearPart = endYear.toString().slice(-2);

        // Construct the year range
        let yearPart = `${startYearPart}-${endYearPart}`;

        let jobNumber = `${firstletter}/I/${yearPart}`


        const [result] = await connection.execute(`INSERT INTO impjobcreation 
        (jobnumber, jobdate, docreceivedon, transportmode, customhouse, ownbooking, deliverymode, noofcontainer, owntransportation, betype, consignmenttype, cfsname, shippinglinename, bltype, bltypenum, jobowner, orgcode, orgname, freedays, blstatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [jobNumber, jobDate, docReceivedOn, transportMode, customHouse, ownBooking, deliveryMode, numberOfContainer, ownTransportation, beType, consignmentType, cfsName, shippingLineName, blType, bltypenumber, jobOwner, orgname, orgcode, freedays, blstatus]);

        const insertedId = result.insertId;

        // Retrieve the inserted row
        const [row] = await connection.execute('SELECT * FROM impjobcreation WHERE id = ?', [insertedId]);

        return row;

    } catch (error) {
        console.log(error);
    }
}



export const updateJobNumber = async (id, transportMode) => {
    try {
        const connection = await connectMySQL();

        const firstletter = transportMode.charAt(0).toUpperCase();


        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth() - 1; // April (zero-based index)

        // Determine the year range based on the current month
        let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
        let endYear = startYear + 1;

        // Extract the last two digits of the years
        let startYearPart = startYear.toString().slice(-2);
        let endYearPart = endYear.toString().slice(-2);

        // Construct the year range
        let yearPart = `${startYearPart}-${endYearPart}`;

        let jobNumberlatest = `${firstletter}/I/${id}/${yearPart}`


        const [row] = await connection.execute(
            `UPDATE impjobcreation SET jobnumber = ? WHERE id = ?`,
            [jobNumberlatest, id]
        );
        const [jobDaterow] = await connection.execute(
            `SELECT jobdate FROM impjobcreation WHERE jobnumber = ?`,
            [jobNumberlatest]
        );

        return { jobNumberlatest, jobDaterow };

    } catch (error) {
        console.log(error);
    }
}



export const fetchBranches = async (importerName, orgcode, orgname) => {
    try {
        const connection = await connectMySQL();

        const [rows] = await connection.execute(`SELECT branchname, id FROM organizations WHERE clientname = ? AND orgcode = ? AND orgname = ?`, [importerName, orgcode, orgname]);

        return rows;
    } catch (error) {
        console.log(error);
    }
}



export const fetchAllorgdata = async (clientName, branchName, orgcode, orgname, id) => {
    try {
        const connection = await connectMySQL();

        const [rows] = await connection.execute(`SELECT GST, IEC, address FROM organizations WHERE clientname = ? AND orgcode = ? AND branchname = ? AND orgname = ? AND id = ?`, [clientName, orgcode, branchName, orgname, id]);

        return rows;

    } catch (error) {
        console.error('Error fetching organization data:', error);
        throw error; // Rethrow the error or handle it appropriately
    }
}



export const storeGeneralImportData = async (orgname, orgcode, jobowner, jobnumber, importerName, address, gst, iec, portShipment, finalDestination, selectedBranch, id) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(
            `INSERT INTO impgeneral (orgname, orgcode, jobowner, jobnumber, importername, address, gst, iec, portofshipment, finaldestination, branchname) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [orgname, orgcode, jobowner, jobnumber, importerName, address, gst, iec, portShipment, finalDestination, selectedBranch]
        );


        const [emailofbranch] = await connection.execute(`SELECT email FROM organizations WHERE orgname = ? AND orgcode = ? AND branchname = ? AND id = ?`, [orgname, orgcode, selectedBranch, id]);
        const [emailofcontacts] = await connection.execute(`SELECT email from contacts WHERE orgname = ? AND orgcode = ? AND branchname = ? AND clientname = ? AND bid = ?`, [orgname, orgcode, selectedBranch, importerName, id])


        const allEmails = [...emailofbranch.map(item => item.email), ...emailofcontacts.map(item => item.email)];

        // Loop through the combined email addresses and send emails
        allEmails.forEach(email => {
            const mailOptions = {
                from: 'shreyashpingle752@gmail.com',
                to: email,
                subject: 'Connect Logi',
                html: `Hello your mail is here` // Add your HTML content here
            };
        
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log('Error sending email:', error);
                } else {
                    console.log('Email sent successfully:', info.response);
                }
            });
        });



        // var mailOptions = {
        //     from: 'shreyashpingle752@gmail.com',
        //     to: ,
        //     subject: 'Your Order Details',s
        //     html: ``,
        // };

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         return { success: false, message: 'Works Email has been sent' };
        //     } else {
        //         return { success: false, message: 'Internal server error.' };
        //     }
        // });

        return row;
    } catch (error) {
        console.log(error);
        throw error; // Rethrow the error or handle it appropriately
    }
};




// export const getClient = async (orgcode) => {
//     try {
//         const connection = await connectMySQL();
//         const [rows] = await connection.execute(`SELECT clientname, GROUP_CONCAT(CONCAT_WS(':', id, branchname, address, GST, IEC) SEPARATOR ',') AS branches FROM organizations WHERE orgcode = ? GROUP BY clientname`, [orgcode]);
//         // const allclients = [];

//         // Transform the rows into an array of objects with separate properties for client name and branches
//         const clients = rows.map(row => {
//             var client = {
//                 clientname: row.clientname,
//                 branches: []
//             };

//             // Split the concatenated string of branches and parse each branch into an object
//             const branchDetails = row.branches.split(',');
//             branchDetails.forEach(branch => {
//                 var [id, branchname, address, GST, IEC] = branch.split(':');
//                 var branchdata = {
//                     id: id,
//                     branchname: branchname,
//                     address: address,
//                     GST: GST,
//                     IEC: IEC
//                 };
//                 // Push the branch data into the branches array of the client
//                 client.branches.push(branchdata);
//             });

//             // Push the client object into the allclients array
//             // sendClient(client);
//             return client;
//         });


//     } catch (error) {
//         console.log(error);
//     }
// }










// export const getClient = async (orgcode) => {
//     try {
//         const connection = await connectMySQL();
//         const [rows] = await connection.execute(`SELECT clientname, GROUP_CONCAT(CONCAT_WS(':', id, branchname, address, GST, IEC) SEPARATOR ',') AS branches FROM organizations WHERE orgcode = ? GROUP BY clientname`, [orgcode]);
//         const allclients = [];
//         // Transform the rows into an array of objects with separate properties for client name and branches
//         const clients = rows.map(row => {
//             const client = {
//                 clientname: row.clientname,
//                 branches: []
//             };

//             // Split the concatenated string of branches and parse each branch into an object
//             const branchDetails = row.branches.split(',');
//             branchDetails.forEach(branch => {
//                 const [id, branchname, address, GST, IEC] = branch.split(':');
//                 const branchdata = {
//                     id: id,
//                     branchname: branchname,
//                     address: address,
//                     GST: GST,
//                     IEC: IEC
//                 };
//                 // Push the branch data into the branches array of the client
//                 client.branches.push(branchdata);
//             });

//             // Print out the client object and its branches separately
//             // console.log('Client:', client);

//             return client;
//         });

//         return allclients;
//     } catch (error) {
//         console.log(error);
//     }
// }












// export const getClient = async (orgcode) => {
//     try {
//         const connection = await connectMySQL();
//         const [rows] = await connection.execute(`SELECT clientname, GROUP_CONCAT(CONCAT_WS(':', id, branchname, address, GST, IEC) SEPARATOR ',') AS branches FROM organizations WHERE orgcode = ? GROUP BY clientname`, [orgcode]);

//         // Transform the rows into an array of objects with separate properties for client name and branches
//         const clients = rows.map(row => {

//             // Split the concatenated string of branches and parse each branch into an object
//             const branchDetails = row.branches.split(',');

//             branchDetails.forEach(branch => {
//                 const [id, branchname, address, GST, IEC] = branch.split(':');

//                 const branchdata = {
//                     id: id,
//                     branchname: branchname,
//                     address: address,
//                     GST: GST,
//                     IEC: IEC
//                 }

//                 const client = {
//                     clientname: row.clientname,
//                     branches: []
//                 };

//                 client.branches.push(branchdata);
//                 console.log(client);
//             });

//         });

//         // console.log(clients);
//         return clients;
//     } catch (error) {
//         console.log(error);
//     }
// }




// export const getClient = async (orgcode) => {
//     try {
//         const connection = await connectMySQL();
//         const [rows] = await connection.execute(`SELECT clientname, address, GST, IEC, branchname, id
//         FROM organizations
//         WHERE orgcode = ?
//         GROUP BY clientname, address, GST, IEC, branchname, id;
//         `, [orgcode]);

//         // Initialize an empty array to store the clients
//         const clients = [];

//         // Iterate over each row from the database
//         rows.forEach(row => {
//             // Check if the client already exists in the clients array
//             const existingClientIndex = clients.findIndex(client => client.clientname === row.clientname);

//             // If the client exists, add the branch to its branches array
//             if (existingClientIndex !== -1) {
//                 clients[existingClientIndex].branches.push({
//                     branchname: row.branchname,
//                     id: row.id,
//                     address: row.address,
//                     GST: row.GST,
//                     IEC: row.IEC
//                 });
//             } else {
//                 // If the client does not exist, create a new client object and push it to the clients array
//                 clients.push({
//                     clientname: row.clientname,
//                     branches: [{
//                         branchname: row.branchname,
//                         id: row.id,
//                         address: row.address,
//                         GST: row.GST,
//                         IEC: row.IEC
//                     }]
//                 });
//             }
//         });

//         console.log(clients);
//         return clients;
//     } catch (error) {
//         console.log(error);
//     }
// }









export const getClient = async (orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(`SELECT clientname, id, branchname, address, GST, IEC FROM organizations WHERE orgcode = ?`, [orgcode]);

        return rows;
    } catch (error) {
        console.log(error);
    }
}


// TAT O2D

export const storeO2D = async (tatimpcolumn, days, hours, minutes, orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(`INSERT INTO o2dtat 
        (tatimpcolumn, days, hours, minutes, orgname, orgcode) VALUES (?, ?, ?, ?, ?, ?)`, [tatimpcolumn, days, hours, minutes, orgname, orgcode]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}

export const get02ddata = async (orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(`SELECT tatimpcolumn, id, days, hours, minutes FROM o2dtat WHERE orgname = ? AND orgcode = ?`, [orgname, orgcode]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}


export const deleteO2D = async (orgname, orgcode, deletionrowid) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`DELETE FROM o2dtat WHERE orgname = ? AND orgcode = ? AND id = ?`, [orgname, orgcode, deletionrowid]);
        return row;
    } catch (error) {
        console.log(error);
    }
}


export const updateO2D = async (tatimpcolumn, days, hours, minutes, orgname, orgcode, id) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`UPDATE o2dtat SET tatimpcolumn = ?, days = ?, hours = ?, minutes = ? WHERE orgname = ? AND orgcode = ? AND id = ?`, [tatimpcolumn, days, hours, minutes, orgname, orgcode, id]);
        return row;
    } catch (error) {
        console.log(error);
    }
}



// export const storeimpTAT = async (impTATData, orgname, orgcode) => {
//     try {
//         const connection = await connectMySQL();
//         for (const item of impTATData) {
//             const { document, tat } = item;
//             const { days, hours, minutes } = tat;

//             // Assuming there is a table named 'impTATTable' with columns tatimpcolumn, days, hours, minutes
//             const [rows] = await connection.execute(`INSERT INTO tatimport 
//             (orgname, orgcode, tatimpcolumn, days, hours, minutes) VALUES (?, ?, ?, ?, ?, ?)`,
//                 [orgname, orgcode, document, days, hours, minutes]);
//         }

//     } catch (error) {
//         console.log(error);
//     }
// }



// export const fetchImpTATData = async (orgname, orgcode) => {
//     try {
//         const connection = await connectMySQL();
//         const [rows] = await connection.execute(`SELECT tatimpcolumn, days, hours, minutes FROM tatimport WHERE orgname = ? AND orgcode = ?`, [orgname, orgcode]);
//         return rows;
//     } catch (error) {
//         console.log(error);
//     }
// }


// export const updateImpTATData = async (impTATData, orgname, orgcode) => {
//     try {
//         const connection = await connectMySQL();

//         for (const item of impTATData) {
//             const { document, tat } = item;
//             const { days, hours, minutes } = tat;

//             await connection.execute(`UPDATE tatimport SET days = ?, hours = ?, minutes = ? WHERE orgname = ? AND orgcode = ? AND tatimpcolumn = ?`, [days, hours, minutes, orgname, orgcode, document]);
//         }
//         return 'Update successful'; // Return statement moved outside of the loop
//     } catch (error) {
//         console.log(error);
//     }
// }




// export const TATget = async (orgname, orgcode, ScrutinyDocument, PortCFSNomination, ChecklistApproval, ESanchit, FilingBOE, Assesment, DutyCall, ExaminationOOC) => {
//     try {
//         const connection = await connectMySQL();
//         const columnNames = [ScrutinyDocument, PortCFSNomination, ChecklistApproval, ESanchit, FilingBOE, Assesment, DutyCall, ExaminationOOC];
//         const [rows] = await connection.execute(`SELECT tatimpcolumn, days, hours, minutes FROM tatimport WHERE orgname = ? AND orgcode = ?`, [orgname, orgcode]);

//         const result = [];

//         // Loop through each row
//         for (const row of rows) {
//             // Check if the tatimpcolumn value matches any of the specified column names
//             if (columnNames.includes(row.tatimpcolumn)) {
//                 // Extract days, hours, and minutes from the row
//                 const { days, hours, minutes } = row;

//                 // Store the extracted values in the result array
//                 result.push({ [row.tatimpcolumn]: { days, hours, minutes } });
//             }
//         }

//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// };



export const fetchAlluseraccess = async (username) => {

    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(
            `SELECT value FROM importaccess WHERE username = ?`,
            [username]
        );

        return rows;
    } catch (error) {
        console.log('Error in storeimpaccess:', error);
        throw error;
    }
}



export const fetchJobData = async (jobnumber) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`SELECT * FROM impjobcreation WHERE jobnumber = ?`, [jobnumber]);
        return row;
    } catch (error) {
        console.log(error);
    }
}



export const storeinO2Dtable = async (planDate, actualDate, timedelay, status, orgname, orgcode, jobnumber, jobdoneby, tatimpcolumn, tat) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`INSERT INTO o2dimport (tatimpcolumn, plandate, actualdate, timedelay, orgname, orgcode, status, jobnumber, jobdoneby, tat) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [tatimpcolumn, planDate, actualDate, timedelay, orgname, orgcode, status, jobnumber, jobdoneby, tat]);
    } catch (error) {
        console.log(error);
    }
}


export const deletetheO2DtoNull = async (tatimpcolumn, jobNumber, orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [updatedRow] = await connection.execute(`DELETE FROM o2dimport WHERE tatimpcolumn = ? AND jobnumber = ? AND orgname = ? AND orgcode = ?`, [tatimpcolumn, jobNumber, orgname, orgcode]);
        // const [row] = await connection.execute(`SELECT id, planDate, actualDate, timedelay, status FROM o2dimport WHERE id = ? AND orgname = ? AND orgcode = ?`, [id, orgname, orgcode]);
        // return row;
    } catch (error) {
        console.log(error);
    }
}


export const fetchallimpjobs = async (orgname, orgcode) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute('SELECT * FROM impjobcreation WHERE orgname = ? AND orgcode = ?', [orgname, orgcode]);
        const [genrows] = await connection.execute(`SELECT * FROM impgeneral WHERE orgname = ? AND orgcode = ?`, [orgname, orgcode]);
        return {
            rows,
            genrows
        };
    } catch (error) {
        console.log(error);
    }
}



export const storeRemark = async (remarkskaData, orgname, orgcode, jobnumber) => {
    try {

        const connection = await connectMySQL();
        const rowsToUpdate = [];

        remarkskaData.forEach(item => {
            if (item.remarks !== '') {
                rowsToUpdate.push(item);
            }
        });

        for (const item of rowsToUpdate) {
            const { tatimpcolumn, remarks } = item;
            const [rows] = await connection.execute(`UPDATE o2dimport SET remarks = ? WHERE tatimpcolumn = ? AND orgname = ? AND orgcode = ? AND jobnumber = ?`, [remarks, tatimpcolumn, orgname, orgcode, jobnumber]);
        }


    } catch (error) {
        console.log(error);
    }
};



export const deleteJob = async (orgname, orgcode, jobnumber) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`DELETE FROM impjobcreation WHERE orgname = ? AND orgcode = ? AND jobnumber = ?`, [orgname, orgcode, jobnumber]);
        const [deletedgenrow] = await connection.execute(`DELETE FROM impgeneral WHERE orgname = ? AND orgcode = ? AND jobnumber = ?`, [orgname, orgcode, jobnumber]);
        const [deletedo2drows] = await connection.execute(`DELETE FROM o2dimport WHERE orgname = ? AND orgcode = ? AND jobnumber = ?`, [orgname, orgcode, jobnumber]);

    } catch (error) {
        console.log(error);
    }
}


export const fetchingGeneralofJob = async (jobnumber, orgcode, orgname) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`SELECT * FROM impgeneral WHERE orgname = ? AND orgcode = ? AND jobnumber = ?`, [orgname, orgcode, jobnumber]);
        return row[0];
    } catch (error) {
        console.log(error);
    }
}



export const updateGeneral = async (importerName, address, gst, iec, portShipment, finalDestination, selectedBranch, orgname, orgcode, jobnumber, jobowner) => {
    try {
        const connection = await connectMySQL();

        const [row] = await connection.execute(`
            UPDATE impgeneral
            SET importername = ?, address = ?, GST = ?, IEC = ?, portofshipment = ?, finaldestination = ?, branchname = ?
            WHERE jobnumber = ? AND orgname = ? AND orgcode = ? AND jobowner = ?
        `, [importerName, address, gst, iec, portShipment, finalDestination, selectedBranch, jobnumber, orgname, orgcode, jobowner]);

    } catch (error) {
        console.log(error);
    }
}



export const updateCurrentJob = async (docReceivedOn, transportMode, customHouse, ownBooking, deliveryMode, numberOfContainer, ownTransportation, beType, consignmentType, cfsName, shippingLineName, blType, bltypenumber, blstatus, freedays, jobnumber) => {
    try {
        const connection = await connectMySQL();
        const [row] = await connection.execute(`
        UPDATE impjobcreation
        SET docreceivedon = ?, transportmode = ?, customhouse = ?, ownbooking = ?, deliverymode = ?, noofcontainer = ?, 
            owntransportation = ?, betype = ?, consignmenttype = ?, cfsname = ?, shippinglinename = ?, bltype = ?,
            bltypenum = ?, freedays = ?, blstatus = ?
        WHERE jobnumber = ?
        `, [docReceivedOn, transportMode, customHouse, ownBooking, deliveryMode, numberOfContainer, ownTransportation, beType, consignmentType, cfsName, shippingLineName, blType, bltypenumber, freedays, blstatus, jobnumber])
    } catch (error) {
        console.log(error);
    }
}


export const getO2Ddatafromo2dimport = async (orgname, orgcode, jobNumber) => {
    try {
        const connection = await connectMySQL();
        const [rows] = await connection.execute(`SELECT * FROM o2dimport WHERE orgname = ? AND orgcode = ? AND jobnumber = ?`, [orgname, orgcode, jobNumber]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}