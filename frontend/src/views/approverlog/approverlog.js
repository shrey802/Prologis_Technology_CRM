
// import React, { useEffect, useState } from 'react';
// import {
//     CButton,
//     CCardBody,
//     CCol,
//     CForm,
//     CModal,
//     CModalBody,
//     CModalFooter,
//     CModalHeader,
//     CModalTitle,
//     CRow,
//     CTable,
//     CTableBody,
//     CTableDataCell,
//     CTableHead,
//     CTableHeaderCell,
//     CTableRow,
//     CDropdown,
//     CDropdownItem,
//     CDropdownMenu,
//     CDropdownToggle
// } from '@coreui/react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useNavigate, useLocation } from 'react-router-dom';

// const Approverlog = () => {

//     const [latestOrg, setlatestOrg] = useState([]);
//     const [approvalname, setapprovalname] = useState([]);
//     const [visible, setvisible] = useState(false);

//     const uniquevalue = "OrgButton"
//     const fetchlatestOrg = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/getlatestorg', {
//                 params: {
//                     orgname: localStorage.getItem('orgname'),
//                     orgcode: localStorage.getItem('orgcode')
//                 }
//             })
//             setlatestOrg(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     }


//     const fetchapproverthathaveuniquevalue = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/getapproverthathaveuniquevalue', {
//                 params: {
//                     orgname: localStorage.getItem('orgname'),
//                     orgcode: localStorage.getItem('orgcode'),
//                     uniquevalue: uniquevalue
//                 }
//             })
//             setapprovalname(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     }


//     useEffect(() => {
//         fetchlatestOrg();
//         fetchapproverthathaveuniquevalue();
//     }, [])

//     async function showDetails(org){
//         try {
//             setvisible(true);
//             console.log(org);
//         } catch (error) {
//             console.log(error);
//         }
//     }


//     return (
//         <div>
//             <h1>Approver Log of Organization</h1>
//             <CTable striped hover responsive>
//                 <CTableHead>
//                     <CTableRow>
//                         <CTableHeaderCell>Client Name</CTableHeaderCell>
//                         <CTableHeaderCell>Actions</CTableHeaderCell>
//                     </CTableRow>
//                 </CTableHead>
//                 <CTableBody>
//                     {latestOrg.map((org, index) => {
//                         const isAdmin = localStorage.getItem('username') === 'admin';
//                         const isEmployee = approvalname.some(approval => approval.employeename === localStorage.getItem('username'));
//                         if (isAdmin || isEmployee) {
//                             return (
//                                 <CTableRow key={index}>
//                                     <CTableDataCell>{org.clientname}</CTableDataCell>
//                                     <CTableDataCell>

//                                         {/* <>
//                                             <CButton color="success">Accept</CButton>
//                                             <CButton color="danger">Delete</CButton>
//                                         </> */}

//                                         <CButton color="primary" onClick={() => showDetails(org)}>Show More</CButton>
//                                     </CTableDataCell>
//                                 </CTableRow>
//                             );
//                         } else {
//                             return null;
//                         }
//                     })}
//                 </CTableBody>
//             </CTable>

//             {
//                 <CModal
//                     visible={visible}
//                     onClose={() => setvisible(false)}
//                     aria-labelledby="LiveDemoExampleLabel"
//                 >
//                     <CModalHeader onClose={() => setvisible(false)}>
//                         <CModalTitle id="LiveDemoExampleLabel">
//                             All Data
//                         </CModalTitle>
//                     </CModalHeader>
//                     <CModalBody>

//                     </CModalBody>
//                     <CModalFooter>
//                         <CButton color="secondary" onClick={() => setvisible(false)}>
//                             Close
//                         </CButton>
//                         <CButton color="primary">
//                             Accept
//                         </CButton>
//                         <CButton color="primary">
//                             Delete
//                         </CButton>
//                     </CModalFooter>
//                 </CModal>

//             }


//         </div>
//     );

// };

// export default Approverlog;










































import React, { useEffect, useState } from 'react';
import {
    CButton,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle
} from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const Approverlog = () => {
    const [latestOrg, setlatestOrg] = useState([]);
    const [approvalname, setapprovalname] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null); // State to store selected organization
    const [approvedOrgs, setapprovedOrgs] = useState([])
    const uniquevalue = "OrgButton";


    const fetchlatestOrg = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getlatestorg', {
                params: {
                    orgname: localStorage.getItem('orgname'),
                    orgcode: localStorage.getItem('orgcode'),
                },
            });
            setlatestOrg(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchApproverThatHaveUniqueValue = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getapproverthathaveuniquevalue', {
                params: {
                    orgname: localStorage.getItem('orgname'),
                    orgcode: localStorage.getItem('orgcode'),
                    uniquevalue: uniquevalue,
                },
            });
            setapprovalname(response.data);

        } catch (error) {
            console.log(error);
        }
    };


    async function checker() {
        try {
            const response = await axios.get('http://localhost:5000/getapprovedorg', {
                params: {
                    orgname: localStorage.getItem('orgname'),
                    orgcode: localStorage.getItem('orgcode'),
                },
            });

            setapprovedOrgs(response.data);

        } catch (error) {
            console.error(error);
        }
    }

    // async function mismatch() {
    //     const filteredOrgs = latestOrg.filter(org => {
    //         // Check if the clientname of the current organization matches with any approved organization
    //         return !approvedOrgs.some(approvedOrg => approvedOrg.clientname === org.clientname);
    //     });

    //     // Update the latestOrg state with the filtered organizations
    //     setlatestOrg(filteredOrgs);
    // }
    const [allorg, setallorg] = useState([]);
    async function getOrganizations() {
        try {
            const response = await axios.get(`http://localhost:5000/getorg`, {
                params: {
                    orgname: localStorage.getItem('orgname'),
                    orgcode: localStorage.getItem('orgcode')
                }
            })
            setallorg(response.data)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        Promise.all([fetchApproverThatHaveUniqueValue(), fetchlatestOrg()])
            .then(() => checker())
            .then(() => getOrganizations())
            .catch((error) => console.error(error));
    }, []);





    const openModal = (org) => {
        setSelectedOrg(org);
    }

    const closeModal = () => {
        setSelectedOrg(null);
    }

    const handleInputChange = (e, field) => {
        setSelectedOrg({
            ...selectedOrg,
            [field]: e.target.value
        });
    }


    const approveOrganization = async () => {
        try {
            await axios.put('http://localhost:5000/approveOrganization', {
                orgId: selectedOrg.id,
                updatedFields: selectedOrg,
                approval: { username: localStorage.getItem('username'), status: 'Approve' }
            });
            toast.success('Organization approved successfully');
            closeModal();
        } catch (error) {
            console.log(error);
            toast.error('Failed to approve organization');
        }
    }

    const rejectOrg = async () => {
        try {
            await axios.put('http://localhost:5000/approveOrganization', {
                orgId: selectedOrg.id,
                updatedFields: selectedOrg,
                approval: { username: localStorage.getItem('username'), status: 'Reject' }
            });
            toast.success('Organization approved successfully');
            closeModal();
        } catch (error) {
            console.log(error);
        }
    }

    console.log(allorg);

    return (
        <div>
            <h1>Approver Log of Organization</h1>
            <CTable striped hover responsive>
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell>Client Name</CTableHeaderCell>
                        <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    {latestOrg && latestOrg.map((org, index) => (
                        // Check if the organization is not present in the approvedOrgs array
                        !allorg.some(approvedOrg => approvedOrg.clientname === org.clientname) && (
                            <CTableRow key={index}>
                                <CTableDataCell>{org.clientname}</CTableDataCell>
                                <CTableDataCell>
                                    <CButton color="primary" onClick={() => openModal(org)}>Show More</CButton>
                                </CTableDataCell>
                            </CTableRow>
                        )
                    ))}

                </CTableBody>
            </CTable>

            <CModal
                visible={selectedOrg !== null}
                onClose={closeModal}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader onClose={closeModal}>
                    <CModalTitle id="LiveDemoExampleLabel">
                        All Data
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedOrg && (
                        <>
                            <div>
                                <label>GST:</label>
                                <input type="text" value={selectedOrg.GST} onChange={(e) => handleInputChange(e, 'GST')} />
                            </div>
                            <div>
                                <label>IEC:</label>
                                <input type="text" value={selectedOrg.IEC} onChange={(e) => handleInputChange(e, 'IEC')} />
                            </div>
                            <div>
                                <label>PAN:</label>
                                <input type="text" value={selectedOrg.PAN} onChange={(e) => handleInputChange(e, 'PAN')} />
                            </div>
                            <div>
                                <label>Address:</label>
                                <input type="text" value={selectedOrg.address} onChange={(e) => handleInputChange(e, 'address')} />
                            </div>
                            <div>
                                <label>Creditdays:</label>
                                <input type="text" value={selectedOrg.creditdays} onChange={(e) => handleInputChange(e, 'creditdays')} />
                            </div>
                            <div>
                                <label>Phone:</label>
                                <input type="text" value={selectedOrg.phone} onChange={(e) => handleInputChange(e, 'phone')} />
                            </div>
                            <div>
                                <label>PostalCode:</label>
                                <input type="text" value={selectedOrg.postalcode} onChange={(e) => handleInputChange(e, 'postalcode')} />
                            </div>
                            <div>
                                <label>City:</label>
                                <input type="text" value={selectedOrg.city} onChange={(e) => handleInputChange(e, 'city')} />
                            </div>
                            <div>
                                <label>State:</label>
                                <input type="text" value={selectedOrg.state} onChange={(e) => handleInputChange(e, 'state')} />
                            </div>
                            <div>
                                <label>Country:</label>
                                <input type="text" value={selectedOrg.country} onChange={(e) => handleInputChange(e, 'country')} />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="text" value={selectedOrg.email} onChange={(e) => handleInputChange(e, 'email')} />
                            </div>
                            <div>
                                <label>Branchname:</label>
                                <input type="text" value={selectedOrg.branchname} onChange={(e) => handleInputChange(e, 'branchname')} />
                            </div>
                        </>
                    )}
                </CModalBody>

                <CModalFooter>
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={approveOrganization}>
                        Approve
                    </CButton>
                    <CButton color="danger" onClick={rejectOrg}>
                        Reject
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Approverlog;