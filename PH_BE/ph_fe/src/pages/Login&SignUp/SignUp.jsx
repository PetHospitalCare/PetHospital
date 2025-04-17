import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra họ và tên
        if (!username) newErrors.username = "Vui lòng nhập họ và tên.";

        // Kiểm tra email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = "Vui lòng nhập email.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Email không hợp lệ.";
        }

        // Kiểm tra số điện thoại
        const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/; // Định dạng số điện thoại Việt Nam
        if (!phone) {
            newErrors.phone = "Vui lòng nhập số điện thoại.";
        } else if (!phoneRegex.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ.";
        } else if (phone.length !== 10) {
            newErrors.phone = "Số điện thoại phải có đúng 10 chữ số.";
        }

        // Kiểm tra mật khẩu
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu.";
        } else if (!passwordRegex.test(password)) {
            newErrors.password =
                "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ in hoa, số và ký tự đặc biệt.";
        }

        // Kiểm tra xác nhận mật khẩu
        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng nhập xác nhận mật khẩu .";
        } else if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset lỗi trước khi kiểm tra

        if (!validateForm()) {
            return; // Dừng nếu form không hợp lệ
        }

        setIsLoading(true);

        try {
            const response = await UserService.getAllAccount();
            const accounts = response.data.accounts;

            // validate email or phone exist
            const isEmailExist = accounts.some((acc) => acc.email === email);
            const isPhoneExist = accounts.some((acc) => acc.phone === phone);

            if (isEmailExist) {
                setErrors({ email: "Email đã được đăng ký." });
                setIsLoading(false);
                return;
            }
            if (isPhoneExist) {
                setErrors({ phone: "Số điện thoại đã được đăng ký." });
                setIsLoading(false);
                return;
            }

            await UserService.sendOtp({ email: email, type: "register" });

            // save temporary in localStorage
            localStorage.setItem(
                "tempSignupData",
                JSON.stringify({
                    username,
                    password,
                    gender,
                    email,
                    phone,
                    role: ["customer"],
                })
            );

            navigate("/otp", { state: { email: email, type: "register" } });
        } catch (err) {
            setErrors({ general: "Không thể kiểm tra tài khoản hiện có." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (e.target.value !== password) {
            setErrors({ ...errors, confirmPassword: "Mật khẩu xác nhận không khớp." });
        } else {
            setErrors({ ...errors, confirmPassword: "" });
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
                    {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
                    {/* Form */}
                    <form className="space-y-5" onSubmit={handleSignUp}>
                        {/* UserName */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Họ & Tên<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="text"
                                value={username}
                                placeholder="Nhập tên người dùng"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Email<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="text"
                                value={email}
                                placeholder="Nhập email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Số điện thoại<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="text"
                                value={phone}
                                placeholder="Nhập số điện thoại"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                        </div>

                        {/* Gender Selection */}
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                value="male"
                                className={`w-2/6 p-5 rounded-lg font-medium ${
                                    gender === "male" ? "bg-blue-500 text-white" : "bg-gray-400"
                                }`}
                                onClick={(e) => setGender(e.target.value)}
                            >
                                Nam
                            </Button>
                            <Button
                                type="button"
                                value="female"
                                className={`w-2/6 p-5 rounded-lg font-medium ${
                                    gender === "female" ? "bg-blue-500 text-white" : "bg-gray-400"
                                }`}
                                onClick={(e) => setGender(e.target.value)}
                            >
                                Nữ
                            </Button>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Mật khẩu<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="password"
                                value={password}
                                placeholder="Nhập mật khẩu"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-base font-medium text-gray-600 mb-1">
                                Xác nhận mật khẩu<span className="text-red-600">*</span>
                            </label>
                            <Input
                                type="password"
                                value={confirmPassword}
                                placeholder="Nhập lại mật khẩu"
                                onChange={handleConfirmPasswordChange}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
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
