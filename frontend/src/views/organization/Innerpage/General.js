import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownDivider,
    CDropdownHeader,
    CDropdownItem,
    CFormInput,
    CFormLabel,
    CForm,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CNavItem,
    CNav,
    CNavLink
} from '@coreui/react'
import '../../../css/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import createjob from './CreateJob';

const General = ({ onSave }) => {
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [visible, setVisible] = useState(false);

    const [generalData, setGeneralData] = useState({
        clientname: '',
        address: '',
        country: '',
        state: '',
        city: '',
        postalCode: '',
        phoneNumber: '',
        emailAddress: '',
        branchName: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGeneralData({ ...generalData, [name]: value });
    };

    const handleSave = () => {
        onSave(generalData);
    };


    // const handleAddBranch = () => {
    //     if (branchName.trim() !== '') {
    //         setGeneralData(prevState => ({
    //             ...prevState,
    //             branchName: [...prevState.branchName, branchName.trim()]
    //         }));
    //         setBranchName('');
    //         setVisible(false);
    //     }
    // };

    const handleAddBranch = () => {
        // Append new branch name to the existing string
        
        if (generalData.branchName !== '') {
          setGeneralData({ ...generalData, branchName: generalData.branchName });
          setVisible(false);
        }
      };

    return (
        <div>
            <CCol xs={12}>
                <CCard className="mb-2 container-div-general">
                    <CCardBody>
                        <input
                            type="text"
                            name="clientname"
                            value={generalData.clientname}
                            placeholder="Client Name"
                            onChange={handleChange}
                            className='text-field-1'
                        />
                        {/* <input
                            type="text"
                            name="clientname"
                            value={generalData.clientname}
                            placeholder="Alias"
                            onChange={handleChange}
                            className='text-field-1'
                        /> */}
                        <CDropdown className="text-field-1">
                            <CDropdownToggle color="secondary">Branch Names</CDropdownToggle>
                            <CDropdownMenu className="text-field-2">
                                {/* <CDropdownItem href="#">Mumbai</CDropdownItem>
                                <CDropdownItem href="#">Kolkata</CDropdownItem> */}
                                {/* {generalData.branchName.map((branch, index) => (
                                    <CDropdownItem key={index}>{branch}</CDropdownItem>
                                ))} */}
                                <CDropdownItem>
                                {generalData.branchName}
                                </CDropdownItem>
                                <CDropdownDivider />
                                {/* <Link to={"/addnewBranch"}> */}
                                <CDropdownItem onClick={() => setVisible(!visible)} style={{ cursor: 'pointer' }}>Add New Branch</CDropdownItem>
                                {/* </Link> */}
                            </CDropdownMenu>
                        </CDropdown>
                        <input
                            type="text"
                            name="address"
                            value={generalData.address}
                            placeholder="Address"
                            onChange={handleChange}
                            className="text-field-1"
                        />
                        <input
                            type="text"
                            name="country"
                            value={generalData.country}
                            placeholder="Country"
                            onChange={handleChange}
                            className="text-field-1"
                        />
                        <input
                            type="text"
                            name="state"
                            value={generalData.state}
                            placeholder="State/Province"
                            onChange={handleChange}
                            className="text-field-1"
                        />
                        <input
                            type="text"
                            name="city"
                            value={generalData.city}
                            placeholder="City"
                            onChange={handleChange}
                            className="text-field-1"
                        />
                        <input
                            type="text"
                            name="postalCode"
                            value={generalData.postalCode}
                            placeholder="Postal Code"
                            onChange={handleChange}
                            className="text-field-1"
                        />
                        <input
                            type="text"
                            name="phoneNumber"
                            value={generalData.phoneNumber}
                            placeholder="Phone Number"
                            onChange={handleChange}
                            className="text-field-1"
                        />
                        <input
                            type="text"
                            name="emailAddress"
                            value={generalData.emailAddress}
                            placeholder="Email Address"
                            onChange={handleChange}
                            className="text-field-1"
                        />

                        <div className='mb-2 search-button update-button'>
                            <CButton color="primary" type="submit" onClick={handleSave}>
                                Update
                            </CButton>
                        </div>

                    </CCardBody>

                </CCard>
            </CCol>
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
            >
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle id="LiveDemoExampleLabel">Add Branch Details</CModalTitle>
                </CModalHeader>
                <CModalBody >
                    {/* <div>
                        <input type="date" placeholder="" className='text-field-1' />
                    </div>
                    <div>
                        <input type="text" placeholder="Bill No." className='text-field-1' />
                    </div> */}
                    <div>
                        <input type="text" placeholder="Branch Name"
                            className='text-field-1' name='branchName'
                            onChange={handleChange}
                        />
                    </div>
                    
                    {/* <div>
                        <input type="text" placeholder="Amount" className='text-field-1' />
                    </div>
                    <div>
                        <input type="text" placeholder="Tax" className='text-field-1' />
                    </div>
                    <div>
                        <input type="text" placeholder="Grand Total" className='text-field-1' />
                    </div> */}

                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary" onClick={handleAddBranch}>Add New</CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default General;
