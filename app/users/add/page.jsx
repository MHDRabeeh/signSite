"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loading from '@/app/_components/Loading';

export default function AddUserForm() {
    const [token, setToken] = useState()
    const [company_id, setCompanyId] = useState()
    const [responsibility, setResponsibility] = useState([])
    const [roleOptions, setRoleOptions] = useState([])
    const [errors, setErrors] = useState();
    const [loading, setLoading] = useState(false)
    const router = useRouter()

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
            if (!token) {
                router.push("/login"); // Redirect to login if no token
            }
            try {

                setLoading(true)
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

            } finally {
                setLoading(false)
            }
        }
        fetchRole()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // console.log(type, checked, name, value);


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
        validateForm()
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
    const isValidName = (name) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        return name.trim() !== "" && nameRegex.test(name);
    };
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() !== "" && emailRegex.test(email);
    };
    // const isValidRole = (role) => {
    //     return role.trim() !== "";
    // };
    const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^\d{9,14}$/;
        return phone === "" || phoneRegex.test(phone);
    };
    const hasAtLeastOneResponsibility = (responsibilities) => {
        return Array.isArray(responsibilities) && responsibilities.length > 0;
    };

    const validateForm = () => {
        let newErrors = {};
        if (!userData.name) {
            newErrors.name = "name is required";
        } else if (!isValidName(userData.name)) {
            newErrors.name = "Name is required.", "or", "Name must contain only letters and spaces";
        }
        if (!userData.email) {
            newErrors.email = "email is required"
        } else if (!isValidEmail(userData.email)) {
            newErrors.email = "Please enter a valid email address."
        }
        if (!userData.role) {
            newErrors.role = "Role is required"
        }
        if (!userData.phone) {
            newErrors.phone = "phone number required"
        } else if (!isValidPhoneNumber(userData.phone)) {
            newErrors.phone = "Phone number must contain only digits (10 to 15 digits)"
        }
        if (userData.responsibilities.length == 0) {
            newErrors.responsibilities = "Please select at least one responsibility"
        }
        setErrors(newErrors)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        validateForm();
        if (Object.keys(errors || {}).length > 0) {
            return;
        }

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
            setLoading(true)
            const response = await axios.post('http://13.210.33.250/api/user', formData, {
                headers: {
                    Accept: 'application/json',
                    company_id: company_id,
                    Authorization: `Bearer ${token}`,

                }
            });

            console.log('Success:', response.data);
            toast.success("Added successfully ")
            router.push("/dashboard")



        } catch (error) {
            console.error('❌ Submit Error:', error.response?.data || error.message);
            toast.error("Email already exists")
        } finally {
            setLoading(false)
        }
    };
    console.log(errors);

    if (loading) {
        return <Loading />
    }



    return (
        <div className="min-h-screen bg-[#f8f9fc] p-6">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
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
                        <label className="block mb-1 font-medium text-gray-700">Name *</label>
                        <input
                            name="name"
                            type="text"
                            value={userData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full border rounded-md px-4 py-2"
                            required
                        />
                        {errors?.name && <span className='text-red-600 text-xs font-light'>{errors.name}</span>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Email *</label>
                        <input
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full border rounded-md px-4 py-2"
                            required
                        />
                        {errors?.email && <span className='text-red-600 text-xs font-light'>{errors.email}</span>}
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
                            required
                        />
                        {errors?.phone && <span className='text-red-600 text-xs font-light'>{errors.phone}</span>}
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
                        <label className="block mb-1 font-medium text-gray-700">Role *</label>
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
                        {errors?.role && <span className='text-red-600 text-xs font-light'>{errors.role}</span>}
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
                            {errors?.responsibilities && <span className='text-red-600 text-xs font-light'>{errors.responsibilities}</span>}
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
