import { connectMySQL } from "../config/sqlconfig.js";
const connection = await connectMySQL();
const orgname = 'Seawave Forwarding Logistics';
const orgcode = 'seawave@2323';

const getAllEmployees = async () => {
    try {
        const [rows] = await connection.execute(`SELECT username FROM employees WHERE orgname = ? AND orgcode = ?`, [orgname, orgcode]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}


// const accessRowsforEmployees = async () => {
//     try {
//         const empdata = await getAllEmployees();
//         const accessofEmployees = [];
//         for (const { username } of empdata) {
//             const [rows] = await connection.execute(`SELECT value FROM importaccess WHERE username = ?`, [username]);
//             const structuredData = {
//                 username: username,
//                 access: rows.map(row => row.value)
//             }
//             accessofEmployees.push(structuredData);
//         }
//         return accessofEmployees;
//     } catch (error) {
//         console.log(error);
//     }
// }




const getAllJobs = async () => {
    try {
        const [rows] = await connection.execute(`SELECT jobnumber FROM impjobcreation WHERE orgname = ? AND orgcode = ?`, [orgname, orgcode]);
        return rows;
    } catch (error) {
        console.log(error);
    }
}


// const accessRowsforEmployees = async () => {
//     try {
//         // Step 1: Fetch all employees and their access rows
//         const empdata = await getAllEmployees();
//         const accessRows = [];
//         for (const emp of empdata) {
//             const [rows] = await connection.execute(`SELECT value FROM importaccess WHERE username = ?`, [emp.username]);
//             const structuredData = {
//                 username:emp.username,
//                 access: rows.map(row => row.value) 
//             }
//             accessRows.push( structuredData );
//         }

//         // Step 2: Fetch all jobs
//         const allJobs = await getAllJobs();
//       console.log(allJobs);
//         const combinedData = accessRows.map(accessRow => {
//             return {
//                 username: accessRow.username,
//                 access: accessRow.access,
//                 jobnumber: allJobs.map(job => job.jobnumber)
//             };
//         });


//         // for (const job of allJobs) {
//         //     console.log(job);
//         //     const matchedAccessRows = accessRows.filter(accessRow => accessRow.username === job.jobdoneby);
//         //     for (const accessRow of matchedAccessRows) {
//         //         const [completedRows] = await connection.execute(`SELECT * FROM completedRows WHERE jobnumber = ?`, [job.jobnumber]);
//         //         const jobData = {
//         //             job: job,
//         //             accessRow: accessRow,
//         //             completedRows: completedRows
//         //         };
//         //         combinedData.push(jobData);
//         //     }
//         // }

//         // Now you have all the combined data in the 'combinedData' array
//         // console.log(combinedData);
//     } catch (error) {
//         console.log(error);
//     }
// }


// const getCompletedRowsofThatUserintheJobs = async () => {
//     try {
//         const formattedData = {};
//         const allJobs = await getAllJobs();
//         for()
//     } catch (error) {
//         console.log(error);
//     }
// }



const accessRowsforEmployees = async () => {
    try {
        // Step 1: Fetch all employees and their access rows
        const empdata = await getAllEmployees();
        const accessRows = [];
        for (const emp of empdata) {
            const [accessRowsResult] = await connection.execute(`SELECT value FROM importaccess WHERE username = ?`, [emp.username]);
            const access = accessRowsResult.map(row => row.value);

            // Step 2: Fetch completed rows for each job done by the user
            const jobsData = await getAllJobs();
            const jobs = [];
            for (const job of jobsData) {
                const [completedRowsResult] = await connection.execute(`SELECT tatimpcolumn FROM o2dimport WHERE status = ? AND jobnumber = ? AND jobdoneby = ?`, ['Completed', job.jobnumber, emp.username]);
                const completedRows = completedRowsResult.map(row => row.tatimpcolumn);
                const structure = {
                    jobnumber: job.jobnumber, completedRows: completedRows
                }
                jobs.push(JSON.stringify(structure));
            }

            // Construct structured data for the user
            const userData = {
                username: emp.username,
                access,
                jobs
            };
            accessRows.push(userData);
        }

        // console.log(accessRows);
    } catch (error) {
        console.log(error);
    }
};

accessRowsforEmployees();

// let currentDate = new Date();
// // Get the current month (zero-based index)
// let currentMonth = currentDate.getMonth();
// // Get the current year
// let currentYear = currentDate.getFullYear();

// let startYearPart, endYearPart;

// // Check if the current month is April or later
// if (currentMonth >= 3) {
//     // April or later, use the current year as the start year
//     startYearPart = currentYear.toString().slice(-2);
//     endYearPart = (currentYear + 1).toString().slice(-2);
// }

// // Construct the year range
// let yearPart = `${startYearPart}-${endYearPart}`;
// const [lastYearRow] = await connection.execute('SELECT jobnumber FROM impjobcreation ORDER BY id DESC LIMIT 1');
// console.log(lastYearRow[0].jobnumber.slice(-5));
// // && item.name !== 'User List' && item.name !== 'TAT' && item.name!== 'Mailing'



































export const getCompletedRows = async (username, fullname, branchname) => {
    try {
        const jobdata = await getAllJobs();
        
        const [accessRowsResult] = await connection.execute(`SELECT value FROM importaccess WHERE username = ?`, [username]);
        console.log(accessRowsResult);
        const [rows] = await connection.execute(`SELECT * FROM o2dimport WHERE jobdoneby = ?`, [username]);
        const structuredData = {
            totalJobs: jobdata,
            access: accessRowsResult,
            completedRows: rows,
            name: username
        }
        return structuredData;
    } catch (error) {
        console.log(error);
    }
}