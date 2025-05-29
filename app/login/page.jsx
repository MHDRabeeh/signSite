"use client"
import React, { useState } from 'react'
import { TfiEmail } from "react-icons/tfi";
import { CiLock } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import axios from 'axios';


export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter()
    async function handleLogin(e) {
        e.preventDefault()
        try {
            const { data } = await axios.post("http://13.210.33.250/api/login", {
                email,
                password
            }, {
                headers: {
                    'Accept': 'application/json'
                }
            })
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("company_id",data.companies[0].id);
            toast.success("successfully Login ");
            router.push("/dashboard")
            console.log(data);



        } catch (error) {
            console.log(error);
            toast.error("Something went wrong please add proper email and password");
        }
    }

    return (
        <div className="min-h-screen flex">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />

            <div className="w-1/2 bg-gray-50" ></div>


            <div className="w-1/2 flex items-center justify-center">
                <div className="max-w-md w-full px-8">




                    <h2 className="text-2xl font-semibold text-gray-900 mb-1">Sign In to your Account</h2>
                    <p className="text-sm text-gray-500 mb-6">Welcome back! please enter your detail</p>


                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <TfiEmail />
                                </span>
                                <input
                                    required
                                    onChange={((e) => setEmail(e.target.value))}
                                    type="email"
                                    placeholder="Email"
                                    className="pl-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <CiLock />
                                </span>
                                <input
                                    required
                                    onChange={((e) => setPassword(e.target.value))}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button

                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                                >
                                    {!showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                Remember me
                            </label>
                            <a href="#" className="text-blue-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        <button

                            type="submit"
                            
                            className="w-full bg-blue-600  hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
