import { Button } from "@/components/ui/button";
import { PetService } from "@/services/PetService";
import { UserService } from "@/services/UserService";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import PetModal from "./Add_Pet_Modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function UserProfile() {
    const [user, setUser] = React.useState(null);
    const [pets, setPets] = React.useState([]);
    const [isEditing, setIsEditing] = React.useState(false);
    const [openPets, setOpenPets] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: "",
        phone: "",
        gender: "",
        address: ""
    });

    //Lấy dữ liệu người dùng hiện tại
    const fetchUserData = async () => {
        try {
            const response = await UserService.getCurrentUser();
            if (response.data.success) {
                setUser(response.data.account);
                setFormData({
                    username: response.data.account.username || "",
                    phone: response.data.account.phone || "",
                    gender: response.data.account.gender || "male",
                    address: response.data.account.address || "",
                });
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
        }
    };

    //Lấy dữ liệu của thú cưng
    const fetchPetData = async () => {
        try {
            const response = await PetService.getPetByUser();
            if (response.data.success) {
                setPets(response.data.pets);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
        }
    };

    React.useEffect(() => {
        fetchUserData();
        fetchPetData();
    }, []);

    //Lưu update user
    const handleSave = async () => {
        try {
            const updatedUser = {
                username: formData.username,
                phone: formData.phone,
                gender: formData.gender,
                address: formData.address
            };
    
            // Gửi API cập nhật
            const response = await UserService.updateAccount(user._id, updatedUser);
    
            if (response.status == 200) {
                // Cập nhật state user sau khi cập nhật thành công
                setUser({ ...user, ...updatedUser });
                setIsEditing(false);
                toast.success("Chỉnh sửa thành công");
            } else {
                toast.error("Chỉnh sửa thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dữ liệu:", error);
            toast.error("Lỗi khi cập nhật tài khoản");
        }
    };
    //thay đổi trong form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //Xử lý nút edit
    const handleEditClick = () => {
        setIsEditing(true);
    };

    //Xử lý dropdown
    const toggleDropdown = (id) => {
        setOpenPets((prev) =>
            prev.includes(id) ? prev.filter((petId) => petId !== id) : [...prev, id]
        );
    };

    return (
        <div className="container mx-auto pt-24">
            <div className="grid grid-cols-2 gap-4">
                {/* Thông tin cá nhân */}
                <div className="p-6 border rounded-lg shadow-md relative">
                    <h1 className="font-bold text-3xl mb-4">THÔNG TIN CÁ NHÂN</h1>
                    <hr />
                    <button
                        className="absolute top-6 right-6 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                        onClick={handleEditClick}
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    {user ? (
                        <>
                            <div className="flex mt-3 gap-4">
                                <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                                    <img
                                        src={user?.url ? user.url : "/profile.png"}
                                        alt="Avatar"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    {isEditing ? (
                                        <Input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="border p-2 rounded-md text-lg w-full"
                                        />
                                    ) : (
                                        <p className="text-2xl font-semibold">{user?.username.toUpperCase()}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <Label className="text-gray-600 text-lg">Số điện thoại</Label>
                                <p className="font-bold text-lg">{user?.phone}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between">
                                <div className="mt-3">
                                    <Label className="text-gray-600 text-lg">Ngày sinh</Label>
                                    <p className="font-bold text-lg">07-05-2003</p>
                                </div>
                        
                                <div className="mt-3 flex items-center">
                                    <div className="ml-4 flex items-center space-x-4">
                                        <Label className="flex items-center space-x-2">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === "male"}
                                                onChange={handleChange}
                                                disabled={!isEditing}
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
                                                disabled={!isEditing}
                                            />
                                            <span className="text-lg">Nữ</span>
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="mt-3">
                                <Label className="text-gray-600 text-lg">Email</Label>
                                <p className="font-bold text-lg">{user?.email}</p>
                            </div>
                            <hr />
                            <div className="mt-3">
                                <Label className="text-gray-600 text-lg">Địa chỉ</Label>
                                {isEditing ? (
                                    <Input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="border p-2 rounded-md text-lg w-full"
                                    />
                                ) : (
                                    <p className="font-bold text-lg">{user?.address}</p>
                                )}
                            </div>
                            <hr />
                            {isEditing && (
                                <div className="mt-5 text-right">
                                    <Button className="rounded p-3 text-base bg-[#3F2E2E]" onClick={handleSave}>
                                        Lưu
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p>Đang tải...</p>
                    )}
                </div>

                {/* Thông tin thú cưng */}
                <div className="p-6 border rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="font-bold text-3xl">THÔNG TIN THÚ CƯNG</h1>
                        <Button
                            className="rounded p-5 text-base bg-[#3F2E2E]"
                            onClick={() => setOpen(true)}
                        >
                            Thêm mới
                        </Button>
                        <PetModal open={open} onOpenChange={setOpen} onSuccess={fetchPetData} />

                    </div>
                    <hr />
                    <div>
                        {pets.length > 0 ? (
                            pets.map((pet) => (
                                <div key={pet._id} className="border rounded mb-4 overflow-hidden">
                                    <div className="bg-[#3F2E2E] text-white p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleDropdown(pet._id)}>
                                        <p className="text-xl font-semibold">{pet.name}</p>
                                        {openPets.includes(pet._id) ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                    {openPets.includes(pet._id) && (
                                        <div className="p-4 bg-white border-t">
                                            <div className="flex gap-4">
                                                <img src={pet.url ? pet.url : "/dogCat.png"} alt={pet.name} className="w-24 h-24 object-cover rounded-md" />
                                                <div>
                                                    <p className="text-gray-700">Giống: {pet?.type === "dog" ? "Chó" : "Mèo"}</p>
                                                    <p className="text-gray-700">Loại: {pet?.species}</p>
                                                    <p className="text-gray-700">Cân nặng: {pet?.weight}kg</p>
                                                    <p className="text-gray-700">Chi tiết: {pet?.detail}</p>
                                                </div>
                                            </div>
                                            <Button className="mt-3 bg-[#3F2E2E] text-white">Sửa</Button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>Chưa có thú cưng nào.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
