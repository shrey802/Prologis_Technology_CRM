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

const Contactdeatils = () => {
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    return (
        <div>
            <CCol xs={12}>
                <CCard className="mb-2 container-div">
                    <CCardBody>
                        {/* <CDropdown className="text-field-1">
                            <CDropdownToggle color="secondary">Branch Names</CDropdownToggle>
                            <CDropdownMenu className="text-field-2">
                                <CDropdownItem href="#">Mumbai</CDropdownItem>
                                <CDropdownItem href="#">Kolkata</CDropdownItem>
                                <CDropdownDivider/>
    <CDropdownItem href="#">Add New Branch</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown> */}
                        <input type="text" placeholder="Credit Days" className='text-field-1' />
                        <input type="text" placeholder="GST Details" className='text-field-1' />
                        <input type="text" placeholder="IEC Code" className='text-field-1' />
                        {/* <div className='search-button'>
                    <CButton type="submit" className='new-regis-button'>
                        New
                    </CButton>
                </div> */}
                    </CCardBody>
                </CCard>
            </CCol>


            {/* <CNav variant="tabs">
<CNavItem>
  <CNavLink href="#" active>General</CNavLink>
</CNavItem>
<CNavItem>
  <CNavLink href="#">Registration</CNavLink>
</CNavItem> */}
            {/* <CNavItem>
  <CNavLink href="#">Link</CNavLink>
</CNavItem> */}
            {/* <CNavItem>
  <CNavLink href="#" disabled>
    Disabled
  </CNavLink>
</CNavItem> */}
            {/* </CNav> */}
        </div>
    )
}

export default Contactdeatils;
