'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FaRegTrashAlt } from "react-icons/fa";
import axios from 'axios';
import Loading from '@/app/_components/Loading';

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [responsibility, setResponsibility] = useState([])
  const [roleOptions, setRoleOptions] = useState([])
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    initials: '',
    newUser_picture: "",
    role: '',
    responsibilities: [],
    user_picture: null,
  });
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage?.getItem("token");
      const companyId = localStorage?.getItem("company_id");
      setToken(token)
      setCompanyId(companyId)
      if (!token) {
        router.push("/login"); // Redirect to login if no token
      }
      try {
        const res = await axios.get(`http://13.210.33.250/api/user/${id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            company_id: companyId,
          },
        });
        console.log(res);
        const u = res.data.data;


        setUserData({
          id: u.id,
          name: u.first_name,
          newUser_picture: '',
          email: u.email,
          phone: u.phone || '',
          title: u.title || '',
          initials: u.initials || '',
          role: u.role.id.toString(),
          responsibilities: [...u.responsibilities].toString(),
          user_picture: u.profile_image_url,
        });

        const { data } = await axios.get('http://13.210.33.250/api/user/dropdown-responsibility', {
          headers: {
            Accept: 'application/json',
            company_id: companyId,
            Authorization: `Bearer ${token}`
          }
        });

        console.log(data, "kkkkkkkkk");
        setResponsibility(data)
        const formData = new FormData();
        formData.append('type', '0');
        const response = await axios.post('http:///13.210.33.250/api/role/dropdown', formData, {
          headers: {
            Accept: 'application/json',
            company_id: companyId,
            Authorization: `Bearer ${token}`
          }
        });
        const roles = response.data.data;
        const roleList = Object.entries(roles).map(([title, id]) => ({
          id,
          title,
        }));

        setRoleOptions(roleList);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updated = checked
        ? [...userData.responsibilities, value]
        : userData.responsibilities.filter((item) => item !== value);
      setUserData((prev) => ({ ...prev, responsibilities: updated }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      newUser_picture: e.target.files[0],
      user_picture: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append('_method', 'put');
      form.append('name', userData.name);
      form.append('email', userData.email);
      form.append('phone', userData.phone);
      form.append('title', userData.title);
      form.append('initials', userData.initials);
      form.append('role', userData.role);
      form.append('overwite_data', '1');

      if (userData.newUser_picture) {
        form.append('user_picture', userData.newUser_picture);
      }


      // userData.responsibilities.forEach((item) => form.append('responsibilities[]', item));
      for (let pair of form.entries()) {
        console.log(pair[0], pair[1]);
      }
      setLoading(true)

      await axios.post(`http://13.210.33.250/api/user/${id}`, form, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          company_id: companyId,
        },
      });

      toast.success("User updated successfully!")
      router.push('/dashboard');

    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    }
  };

  const deleteUserImage = async () => {
    // try {

    //   const response = await axios.delete(`http://13.210.33.250/api/user/${userData.id}/image`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       Accept: "application/json",
    //       company_id: companyId,
    //     },
    //   })
    //   console.log(response);


    // } catch (error) {
    //   console.log(error);

    // }
    setUserData((prev) => {
      return { ...prev, user_picture: null }
    })
    console.log(userData);

  }

  if (loading) return <>
    <Loading />
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
  </>
  console.log(userData);


  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit User</h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <span onClick={() => deleteUserImage()} className='absolute text-red-500 bg-red-100 -top-3 right-0 rounded-full p-2 cursor-pointe'><FaRegTrashAlt /></span>
            <img
              src={
                userData.user_picture === null
                  ? "/blank-profile-picture-973460_1280.webp"
                  : typeof userData.user_picture === "object"
                    ? URL.createObjectURL(userData.user_picture)
                    : userData.user_picture
              }
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
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-1 font-medium text-gray-700">Name*</label>
            <input
              name="name"
              type="text"
              value={userData.name}
              onChange={handleChange}
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
              onClick={() =>
                router.push("/users")
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
