import React, { useEffect } from 'react'
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
  CDropdownItem,
  CFormInput,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CButton
} from '@coreui/react'
import '../../css/styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const UserList = () => {
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [allData, setAllData] = useState();
  const [importData, setImportData] = useState(false);

  useEffect(() => {
    const fetchAllusernames = async () => {
      try {
        const codeoforg = localStorage.getItem('orgcode');
        const nameoforg = localStorage.getItem('orgname');
        const username = localStorage.getItem('empnameforaccess');
        const response = await axios.get('http://localhost:5000/fetchAllusers', {
          params: {
            orgcode: codeoforg,
            orgname: nameoforg,
            username: username
          }
        })
        
        setAllData(response.data);
      } catch (error) {
        console.log('Error: ' + error);
      }
    }
    fetchAllusernames();
  }, []);


  async function handleAccess(index) {
    try {
      // Access the username at the specified index in the allData state
      const username = allData[index].username;
  
      // Store the username in localStorage
      localStorage.setItem('empnameforaccess', username);
      
      // navigate('/#/UserListAccess');
      // Optionally, you can redirect or perform any other action here
    } catch (error) {
      console.log(error);
    }
  }
  



  return (
    <div>
      <CTable hover responsive striped className=''>
        <CTableHead>
          <CTableRow color='dark' >
            <CTableHeaderCell scope="col"></CTableHeaderCell>
            <CTableHeaderCell scope="col">Username</CTableHeaderCell>
            <CTableHeaderCell scope="col">Access</CTableHeaderCell>


          </CTableRow>
        </CTableHead>

        <CTableBody>
          {allData && allData.map((userData, index) => (

            <CTableRow key={index}>
              <th scope="row" className="font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <Link to={'/UserListAccess'} onClick={() => handleAccess(index)}>Edit</Link>
              </th>
              <CTableHeaderCell scope="row">{userData.username}</CTableHeaderCell>
              <CTableDataCell>{importData? 'Import': 'Access'}</CTableDataCell>
            </CTableRow>

          ))}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default UserList;
