import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { UserService } from "../../services/UserService";

export default function ChangeEmail() {
    const [newEmail, setNewEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const oldEmail = location.state?.email;

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateEmail(newEmail)) {
            setError("Email phải là địa chỉ @gmail.com hợp lệ");
            return;
        }
    
        if (newEmail === oldEmail) {
            setError("Email mới không được trùng với email hiện tại");
            return;
        }
    
        try {
            // Check exist email
            const response = await UserService.getAllAccount()
            const isExist = response.data.accounts.some(acc => acc.email === newEmail);
            if (isExist) {
                setError("Email đã được đăng ký");
                return;
            }
    
            // update email in localStorage
            const tempData = JSON.parse(localStorage.getItem("tempSignupData"));
            tempData.email = newEmail;
            localStorage.setItem("tempSignupData", JSON.stringify(tempData));
    
            // send new otp request
            await UserService.sendOtp({email: newEmail});
    
            // navigate to OTP with new email
            navigate("/otp", { state: { email: newEmail } });
        } catch (err) {
            setError("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };
    

    return (
        <div className="relative h-screen">
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
            </div>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <Link to="/otp" className="flex items-center text-gray-500 hover:text-gray-700">
                        <ArrowLeftIcon className="size-4 mr-2" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Đổi Email</h1>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Email mới<span className="text-red-600">*</span></label>
                            <Input 
                                type="email" 
                                value={newEmail} 
                                onChange={(e) => setNewEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="text-center">
                            <Button type="submit" className="w-2/5 bg-blue-400 text-white py-3 rounded font-medium hover:bg-blue-500 transition-colors">
                                Xác nhận
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}