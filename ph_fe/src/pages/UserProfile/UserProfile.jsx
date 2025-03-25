import { Button } from "@/components/ui/button";
import { UserService } from "@/services/UserService";
import { Pencil, Upload } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import PetInfo from "./PetInfo";

export default function UserProfile() {
    const [user, setUser] = React.useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
    const [imageFile, setImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        dateOfBirth: "",
        phone: "",
        gender: "",
        address: ""
    });
    const [isLoading, setIsLoading] = React.useState(false);

    // Lấy dữ liệu người dùng hiện tại
    const fetchUserData = async () => {
        try {
            const response = await UserService.getCurrentUser();
            if (response.data.success) {
                setUser(response.data.account);
                setFormData({
                    username: response.data.account.username || "",
                    email: response.data.account.email || "",
                    dateOfBirth: response.data.account.dateOfBirth ? new Date(response.data.account.dateOfBirth).toISOString().split('T')[0] : "",
                    phone: response.data.account.phone || "",
                    gender: response.data.account.gender || "male",
                    address: response.data.account.address || "",
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
            toast.error("Không thể tải thông tin người dùng");
        }
    };

    React.useEffect(() => {
        fetchUserData();
    }, []);

    // Xử lý chọn file ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Tạo URL preview cho ảnh
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    // Xử lý upload ảnh
    const handleImageUpload = async () => {
        if (!imageFile) {
            toast.error("Vui lòng chọn ảnh");
            return;
        }

        setIsLoading(true);
        try {
            // Tạo FormData để gửi file
            const formData = new FormData();
            formData.append("image", imageFile);
            console.log(imageFile)
            // Gọi API upload ảnh (giả định bạn có API này trong UserService)
            const response = await UserService.uploadAvatar(formData);

            if (response.status === 200) {
                // Cập nhật user với URL ảnh mới
                const updatedUser = { ...user, url: response.data.url, publicId: response.data.publicId };
                setUser(updatedUser);
                toast.success("Cập nhật ảnh đại diện thành công");
                setUploadDialogOpen(false);
                // Xóa các state liên quan đến upload
                setImageFile(null);
                setImagePreview(null);
            } else {
                toast.error("Cập nhật ảnh đại diện thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
            toast.error("Lỗi khi tải ảnh lên");
        } finally {
            setIsLoading(false);
        }
    };

    // Lưu update user
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedUser = {
                username: formData.username,
                phone: formData.phone,
                gender: formData.gender,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
            };

            // Gửi API cập nhật
            const response = await UserService.updateUserAccount(updatedUser);

            if (response.status === 200) {
                // Cập nhật state user sau khi cập nhật thành công
                setUser({ ...user, ...updatedUser });
                toast.success("Chỉnh sửa thành công");
            } else {
                toast.error("Chỉnh sửa thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu:", error);
            toast.error("Lỗi khi cập nhật tài khoản");
        } finally {
            setIsLoading(false);
        }
    };

    // Thay đổi trong form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto pt-24 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin cá nhân */}
                <div className="p-6 border rounded-lg shadow-lg bg-white">
                    <h1 className="font-bold text-3xl mb-6 text-gray-800">Thông Tin Cá Nhân</h1>
                    <hr className="mb-4" />
                    {user ? (
                        <>
                            <div className="flex items-center gap-6 mb-6">
                                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center relative group overflow-hidden shadow-md">
                                    <img
                                        src={user?.url ? user.url : "/profile.png"}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                        <Button
                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black hover:bg-gray-200 rounded-full p-2"
                                            onClick={() => setUploadDialogOpen(true)}
                                        >
                                            <Pencil size={20} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="border-b-2 font-bold border-gray-400 focus:outline-none focus:border-gray-300 text-2xl w-full"
                                        placeholder="Tên người dùng"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-600 text-lg">Ngày sinh</Label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 p-2 text-lg w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-600 text-lg">Giới tính</Label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <Label className="flex items-center space-x-2">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === "male"}
                                                onChange={handleChange}
                                            />
                                            <span className="text-lg">Nam</span>
                                        </Label>
                                        <Label className="flex items-center space-x-2">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === "female"}
                                                onChange={handleChange}
                                            />
                                            <span className="text-lg">Nữ</span>
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label className="text-gray-600 text-lg">Số điện thoại</Label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 p-2 text-lg w-full"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className="mt-4">
                                <Label className="text-gray-600 text-lg">Email</Label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 p-2 text-lg w-full"
                                    disabled
                                />
                            </div>
                            <div className="mt-4">
                                <Label className="text-gray-600 text-lg">Địa chỉ</Label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 p-2 text-lg w-full"
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>

                            <div className="mt-6 text-right">
                                <Button
                                    className="rounded p-3 text-base bg-[#3F2E2E] text-white bg-[#3F2E2E] transition-all"
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <p>Đang tải...</p>
                    )}

                    {/* Dialog cho upload ảnh */}
                    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                                <DialogDescription>
                                    Chọn ảnh từ thiết bị của bạn để cập nhật ảnh đại diện
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center space-y-4">
                                {imagePreview && (
                                    <div className="w-40 h-40 overflow-hidden rounded-md shadow-md">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Label
                                        htmlFor="avatar-upload"
                                        className="cursor-pointer flex items-center justify-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        <span>Chọn ảnh</span>
                                    </Label>
                                    <Input
                                        id="avatar-upload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="flex justify-end space-x-2 w-full">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setUploadDialogOpen(false);
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        onClick={handleImageUpload}
                                        disabled={!imageFile || isLoading}
                                        className="bg-[#3F2E2E] text-white hover:bg-[#3F2E2E] transition-all"
                                    >
                                        {isLoading ? "Đang tải lên..." : "Lưu"}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                {/* Thông tin thú cưng */}
                <PetInfo />
            </div>
        </div>
    );
}
