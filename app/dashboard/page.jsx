"use client"
import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DeleteModal from '../_components/DeleteModal';

export default function page() {
  const [userData, setUserData] = useState()
  const [search, setSearch] = useState("")
  const [active, setActive] = useState("1")
  const [showDeleteModal,setShowDeleteModal] = useState({status:false,id:""})
  const [token,setToken] = useState() 
  const [companyId,setCompanyId] = useState()
  const router = useRouter()
  useEffect(() => {
    async function fetch() {
      const token = localStorage.getItem("token")
      setToken(token)
      const companyId = localStorage.getItem("company_id")
      setCompanyId(companyId)
      try {
        const { data } = await axios.get(`http://13.210.33.250/api/user?status=${active}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            company_id: companyId,
          }
        })

        setUserData(data);


      } catch (error) {
        console.log(error);

      }
    }
    fetch()
  }, [active])



  // Calculate pagination
  console.log(userData);
  const filteredUsers = userData?.data?.filter(user =>
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.role?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://13.210.33.250/api/user/${id}`,{headers: {
            // Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            company_id: companyId,
          }})
      console.log(response,"this is response");

    } catch (error) {
      console.log(error);

    }
  }



  return (
    <div className="p-4">
    
      <div className=' flex justify-between items-center py-3 px-2'>
        <div className='flex gap-4 px-3 py-1'>
          <input onChange={(e) => setSearch(e.target.value)} type="text" className='py-1.5 px-3 border-2 border-blue-200 bg-white shadow-sm rounded-lg outline-none
           focus:focus:ring-blue-700 focus:border-blue-300 block   placeholder:text-sm placeholder:text-gray-300 '  placeholder='search' />
          <select
            onChange={(e) => setActive(e.target.value)}
            defaultValue="Active"
            className=" px-4 py-2 border border-gray-300 rounded-lg shadow-sm  focus:outline-0 hover:bg-transparent ">

            <option value={"1"} className='bg-green-100 text-green-400 text-xs  hover:bg-transparent' >Active</option>
            <option value={"0"} className='bg-red-100 text-red-400 text-xs'>Inactive</option>
          </select>
        </div>
        <div>
          <button onClick={() => router.push(`users/add`)} className='px-4 py-2 bg-blue-700 text-white text-xs font-medium rounded-lg '>
            + Add New User
          </button>
        </div>

      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                S.L
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Initials
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {index + 1}
                </th>

                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {user.first_name}
                </th>
                <td className="px-6 py-4">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  {user.initials == null ? "null" : user.initials}
                </td>
                <td className="px-6 py-4">
                  {user.phone}
                </td>
                <td className="px-6 py-4">
                  {user.role.slug}
                </td>
                <td className="px-6 py-4">
                  <div className='cursor-pointer'>
                    {
                      user.status ? <span className='px-2 py-1 bg-green-100 rounded-lg text-green-500 text-xs cursor-pointer'>active</span> :
                        <span className='px-2 py-1 bg-red-100 rounded-lg text-red-500 text-xs cursor-pointer'> Inactive </span>
                    }


                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.role.title}
                </td>
                <td className="px-6 py-4">
                  <div className='flex  gap-2 items-center justify-center'>
                    <span onClick={() => router.push(`users/edit/${user.id}`)} className='bg-red-100 p-3 rounded-full text-blue-700'><FiEdit /></span>
                    <span className='bg-red-100 p-3 rounded-full text-red-700' onClick={()=>setShowDeleteModal({status:true,id:user.id})} ><RiDeleteBin6Line /></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className='mt-2 px-3 '>
        <Pagination defaultCurrent={1} total={50} align='end' />
         {showDeleteModal.status&&<DeleteModal handleDelete={handleDelete} showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal}/>} 
      </div>

    </div>
  )
}
