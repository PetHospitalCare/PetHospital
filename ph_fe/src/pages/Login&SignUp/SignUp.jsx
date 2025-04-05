import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Button } from "@/components/ui/button";
import StepProgressBar from "@/components/Step-progress-bar";
import { Input } from "@/components/ui/input";
import { UserService } from "../../services/UserService";

export default function SignUp() {
    const [step, setStep] = useState(1);
    const [gender, setGender] = useState("male");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
    const validatePhone = (phone) => /^(0[3|5|7|8|9])+([0-9]{8})$/.test(phone);
    const validatePassword = (password) => /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // if (!validateEmail(email)) {
        //     setError("Email must be a valid @gmail.com address");
        //     return;
        // }
        // if (!validatePhone(phone)) {
        //     setError("Phone number must be a valid number");
        //     return;
        // }
        if (!validatePassword(password)) {
            setError("Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 ký tự đặc biệt");
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            setIsLoading(false);
            return;
        }

        try {
            const response = await UserService.getAllAccount();
            const accounts = response.data.accounts;

            // validate email or phone exist
            const isEmailExist = accounts.some(acc => acc.email === email);
            const isPhoneExist = accounts.some(acc => acc.phone === phone);

            if (isEmailExist) {
                setError("Email đã được đăng ký");
                setIsLoading(false);
                return;
            }
            if (isPhoneExist) {
                setError("Số điện thoại đã được đăng ký");
                setIsLoading(false);
                return;
            }

            await UserService.sendOtp({ email: email });

            await UserService.sendOtp({ email: email });

            // save temporary in localStorage
            localStorage.setItem("tempSignupData", JSON.stringify({
                username,
                password,
                gender,
                email,
                phone,
                role: ["customer"]
            }));

            navigate("/otp", { state: { email } });
        } catch (err) {
            setError("Không thể kiểm tra tài khoản hiện có");
        } finally {
            setIsLoading(false);
        }
    };

    // Load temporary data from localStorage when component mounts
    useEffect(() => {
        const tempData = JSON.parse(localStorage.getItem("tempSignupData"));
        if (tempData) {
            setUsername(tempData.username);
            setEmail(tempData.email);
            setPhone(tempData.phone);
            setPassword(tempData.password);
            setGender(tempData.gender);
        }
    }, []);

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setConfirmPasswordError("Mật khẩu xác nhận không khớp");
        } else {
            setConfirmPasswordError("");
        }
    };

    return (
        <div className="relative h-screen">

            {/* Background Image */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"
                    className="w-full h-full object-cover"
                    alt="Background"
                />
            </div>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <Link to="/Login" className="flex items-center text-gray-500 hover:text-gray-700">
                        <ArrowLeftIcon className="size-4 mr-2" />
                    </Link>
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Đăng ký</h1>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSignUp}>
                        {/* UserName */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Họ & Tên<span className="text-red-600">*</span></label>
                            <Input
                                type="text"
                                value={username}
                                placeholder="Nhập tên người dùng"
                                onChange={(e) => setUsername(e.target.value)}
                                required />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Email<span className="text-red-600">*</span></label>

                            <Input
                                type="email"
                                value={email}
                                placeholder="Nhập email"
                                onChange={(e) => setEmail(e.target.value)}

                                required />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Số điện thoại<span className="text-red-600">*</span></label>

                            <Input
                                type="tel"
                                value={phone}
                                placeholder="Nhập số điện thoại"
                                onChange={(e) => setPhone(e.target.value)}
                                required />
                        </div>

                        {/* Gender Selection */}
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                value="male"
                                className={`w-2/6 p-5 rounded-lg font-medium ${gender == "male" ? "bg-blue-500 text-white" : "bg-gray-400"}`}
                                onClick={(e) => setGender(e.target.value)}
                            >
                                Nam
                            </Button>
                            <Button
                                type="button"
                                value="female"
                                className={`w-2/6 p-5 rounded-lg font-medium ${gender == "female" ? "bg-blue-500 text-white" : "bg-gray-400"}`}
                                onClick={(e) => setGender(e.target.value)}
                            >
                                Nữ
                            </Button>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Mật khẩu<span className="text-red-600">*</span></label>

                            <Input
                                type="password"
                                value={password}
                                placeholder="Nhập mật khẩu"
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">Xác nhận mật khẩu<span className="text-red-600">*</span></label>

                            <Input
                                type="password"
                                value={confirmPassword}
                                placeholder="Nhập lại mật khẩu"
                                onChange={handleConfirmPasswordChange}
                                required />
                            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                        </div>

                        {/* Step Progress Bar */}
                        <StepProgressBar step={1} />

                        {/* Submit form button */}
                        <div className="text-center">
                            <Button
                                type="submit"
                                className="w-2/5 bg-blue-400 text-white py-3 rounded font-medium hover:bg-blue-500 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? "Đang xử lý..." : "Tiếp theo"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
