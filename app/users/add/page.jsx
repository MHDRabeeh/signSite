"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddUserForm() {
    const [token, setToken] = useState()
    const [company_id, setCompanyId] = useState()
    const [responsibility, setResponsibility] = useState([])
    const [roleOptions, setRoleOptions] = useState([])

    const [userData, setuserData] = useState({
        name: '',
        email: '',
        phone: '',
        title: '',
        initials: '',
        role: '',
        responsibilities: [],
        user_picture: null,
    });
    useEffect(() => {

        async function fetchRole() {
            const token = localStorage.getItem("token");
            const company_id = localStorage.getItem("company_id");
            setToken(token),
                setCompanyId(company_id)
            try {


                const { data } = await axios.get('http://13.210.33.250/api/user/dropdown-responsibility', {
                    headers: {
                        Accept: 'application/json',
                        company_id: company_id,
                        Authorization: `Bearer ${token}`
                    }
                });

                console.log(data, "kkkkkkkkk");
                setResponsibility(data)
                const formData = new FormData();
                formData.append('type', '0');
                const res = await axios.post('http:///13.210.33.250/api/role/dropdown', formData, {
                    headers: {
                        Accept: 'application/json',
                        company_id: company_id,
                        Authorization: `Bearer ${token}`
                    }
                });
                const roles = res.data.data;
                const roleList = Object.entries(roles).map(([title, id]) => ({
                    id,
                    title,
                }));

                setRoleOptions(roleList);



            } catch (error) {
                console.log(error);

            }
        }
        fetchRole()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(type, checked, name, value);


        if (type === 'checkbox') {
            setuserData((prev) => ({
                ...prev,
                responsibilities: checked
                    ? [...prev.responsibilities, value]
                    : prev.responsibilities.filter((r) => r !== value),
            }));
        } else {
            setuserData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setuserData((prev) => ({
                ...prev,
                user_picture: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            
            formData.append('role', userData.role); 
            formData.append('name', userData.name); 
            formData.append('email', userData.email); 
            formData.append('overwite_data', '1'); 

            // Optional fields
            if (userData.user_picture) {
                formData.append('user_picture', userData.user_picture);
            }
            if (userData.title) {
                formData.append('title', userData.title);
            }
            if (userData.initials) {
                formData.append('initials', userData.initials);
            }
            if (userData.phone) {
                formData.append('phone', userData.phone);
            }

            // Optional: responsibilities as array format [1,2]
            // if (userData.responsibilities.length > 0) {
            //     userData.responsibilities.forEach((item) => {
            //         formData.append('responsibilities[]', item.toString());
            //     });
            // }
            if (userData.responsibilities.length > 0) {
                formData.append('responsibilities', JSON.stringify(userData.responsibilities));
            }
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            const response = await axios.post('http://13.210.33.250/api/user', formData, {
                headers: {
                    Accept: 'application/json',
                    company_id: company_id,
                    Authorization: `Bearer ${token}`,
                  
                }
            });

            console.log('Success:', response.data);

           

        } catch (error) {
            console.error('❌ Submit Error:', error.response?.data || error.message);
        }
    };
    console.log(userData);



    return (
        <div className="min-h-screen bg-[#f8f9fc] p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New User</h2>

                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src={userData.user_picture ? URL.createObjectURL(userData.user_picture) : "/blank-profile-picture-973460_1280.webp"}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
                        />
                        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <span role="img" aria-label="upload">📷</span>
                        </label>
                    </div>
                </div>

                {/* Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Name*</label>
                        <input
                            name="name"
                            type="text"
                            value={userData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full border rounded-md px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email*</label>
                        <input
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full border rounded-md px-4 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Phone</label>
                        <input
                            name="phone"
                            type="text"
                            value={userData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                            className="w-full border rounded-md px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Title</label>
                        <input
                            name="title"
                            type="text"
                            value={userData.title}
                            onChange={handleChange}
                            placeholder="Enter title"
                            className="w-full border rounded-md px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Initials</label>
                        <input
                            name="initials"
                            type="text"
                            value={userData.initials}
                            onChange={handleChange}
                            placeholder="Enter initials"
                            className="w-full border rounded-md px-4 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Role*</label>
                        <select
                            name="role"
                            value={userData.role}
                            onChange={handleChange}
                            className="w-full border rounded-md px-4 py-2"
                            required
                        >
                            <option value="">Select role</option>
                            {roleOptions.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block mb-2 font-medium text-gray-700">Responsibilities</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {responsibility?.map((item) => (
                                <label key={item.id} className="flex items-center space-x-2 text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="responsibilities"
                                        value={item.id}
                                        checked={userData.responsibilities.includes(item.id.toString())}
                                        onChange={handleChange}
                                    />
                                    <span>{item.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-center mt-4 space-x-4">
                        <button
                            type="button"
                            className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
                            onClick={() => setuserData({
                                name: '',
                                email: '',
                                phone: '',
                                title: '',
                                initials: '',
                                role: '',
                                responsibilities: [],
                                user_picture: null,
                            })}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
