import * as React from "react";
import { PetService } from "@/services/PetService";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Pencil, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PetModal from "./Add_Pet_Modal";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";

export default function PetInfo() {
    const [pets, setPets] = React.useState([]);
    const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
    const [openPets, setOpenPets] = React.useState([]);
    const [imageFile, setImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [editPetId, setEditPetId] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentPetId, setCurrentPetId] = React.useState(null);
    const [petFormData, setPetFormData] = React.useState({
        name: "",
        type: "",
        gender: "",
        species: "",
        weight: "",
        dateOfBirth: ""
    });

    // Lấy dữ liệu của thú cưng
    const fetchPetData = async () => {
        try {
            const response = await PetService.getPetByUser();
            if (response.data.success) {
                setPets(response.data.pets);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thú cưng:", error);
        }
    };

    React.useEffect(() => {
        fetchPetData();
    }, []);

    //Xử lý xóa thú cưng
    const handleDeletePet = async (petId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa thú cưng này không?")) return;
        setIsLoading(true);
        try {
            const response = await PetService.deletePetByUser(petId);
            if (response.status === 200) {
                toast.success("Xóa thú cưng thành công");
                fetchPetData(); // Tải lại danh sách thú cưng
            } else {
                toast.error("Không thể xóa thú cưng");
            }
        } catch (error) {
            console.error("Lỗi khi xóa thú cưng:", error);
            toast.error("Đã xảy ra lỗi khi xóa thú cưng");
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý dropdown
    const toggleDropdown = (id) => {
        setOpenPets((prev) =>
            prev.includes(id) ? prev.filter((petId) => petId !== id) : [...prev, id]
        );
    };

    // Xử lý khi muốn chỉnh sửa thông tin thú cưng
    const handleEditPet = (pet) => {
        setEditPetId(pet._id);
        setPetFormData({
            name: pet.name || "",
            type: pet.type || "",
            gender: pet.gender?.toString() || "",
            species: pet.species || "",
            weight: pet.weight?.toString() || "",
            dateOfBirth: pet.dateOfBirth ? new Date(pet.dateOfBirth).toISOString().split('T')[0] : ""
        });
    };

    // Xử lý thay đổi dữ liệu form thú cưng
    const handlePetFormChange = (e) => {
        setPetFormData({
            ...petFormData,
            [e.target.name]: e.target.value
        });
    };

    // Xử lý thay đổi thông tin thú cưng từ select
    const handleSelectChange = (value, fieldName) => {
        setPetFormData({
            ...petFormData,
            [fieldName]: value
        });
    };

    // Lưu thông tin thú cưng
    const handleSavePet = async (petId) => {
        // Kiểm tra các trường bắt buộc
        if (!petFormData.name.trim() || !petFormData.type.trim() || !petFormData.species.trim()) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc: Tên, Loài động vật, và Giống.");
            return;
        }

        setIsLoading(true);
        try {
            const updatedPet = {
                name: petFormData.name,
                type: petFormData.type,
                gender: petFormData.gender ? parseInt(petFormData.gender) : null, // Không bắt buộc
                species: petFormData.species,
                weight: petFormData.weight ? parseFloat(petFormData.weight) : null, // Không bắt buộc
                dateOfBirth: petFormData.dateOfBirth || null, // Không bắt buộc
            };

            // Gọi API cập nhật thú cưng
            const response = await PetService.updatePet(petId, updatedPet);
            if (response.status === 200) {
                toast.success("Cập nhật thông tin thú cưng thành công");
                fetchPetData(); // Tải lại dữ liệu thú cưng
                setEditPetId(null); // Tắt chế độ chỉnh sửa
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật thú cưng:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật thú cưng");
        } finally {
            setIsLoading(false);
        }
    };

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
            // Tạo petFormData để gửi file
            const petFormData = new FormData();
            petFormData.append("image", imageFile);

            // Gọi API upload ảnh
            const response = await PetService.uploadPetAvatar(currentPetId, petFormData);

            if (response.data.success) {
                toast.success("Cập nhật ảnh thú cưng thành công");
                fetchPetData(); // Tải lại dữ liệu thú cưng để hiển thị ảnh mới
                setUploadDialogOpen(false);
                // Xóa các state liên quan đến upload
                setImageFile(null);
                setImagePreview(null);
            } else {
                toast.error("Cập nhật ảnh thú cưng thất bại");
            }
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
            toast.error("Lỗi khi tải ảnh lên");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 border rounded-lg shadow-lg bg-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="font-bold text-3xl text-gray-800">Thông Tin Thú Cưng</h1>
                <Button
                    className="rounded px-4 py-2 text-base bg-[#3F2E2E] text-white hover:bg-[#533b3b] transition-all"
                    onClick={() => setOpen(true)}
                >
                    Thêm mới
                </Button>
                <PetModal open={open} onOpenChange={setOpen} onSuccess={fetchPetData} />
            </div>
            <hr className="mb-4" />
            <div className="max-h-[500px] overflow-y-auto space-y-4">
                {pets.length > 0 ? (
                    pets.map((pet) => (
                        <div
                            key={pet._id}
                            className="border rounded-lg shadow-md overflow-hidden bg-gray-50 hover:shadow-lg transition-shadow"
                        >
                            <div
                                className="bg-[#3F2E2E] text-white p-4 flex justify-between items-center cursor-pointer"
                                onClick={() => toggleDropdown(pet._id)}
                            >
                                <h1 className="text-xl font-semibold">{pet.name}</h1>
                                {openPets.includes(pet._id) ? <ChevronUp /> : <ChevronDown />}
                            </div>
                            {openPets.includes(pet._id) && (
                                <div className="p-4 bg-white">
                                    <div className="flex gap-6">
                                        <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center relative group shadow-sm">
                                            <img
                                                src={pet.url ? pet.url : "/dogCat.png"}
                                                alt={pet.name}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-md flex items-center justify-center">
                                                <Button
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-black hover:bg-gray-200 rounded-full p-2"
                                                    onClick={() => {
                                                        setCurrentPetId(pet._id);
                                                        setUploadDialogOpen(true);
                                                    }}
                                                >
                                                    <Pencil size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {editPetId === pet._id ? (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label className="text-gray-600">Tên thú cưng</Label>
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            value={petFormData.name}
                                                            onChange={handlePetFormChange}
                                                            className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600">Ngày sinh</Label>
                                                        <Input
                                                            type="date"
                                                            name="dateOfBirth"
                                                            value={petFormData.dateOfBirth}
                                                            onChange={handlePetFormChange}
                                                            className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600">Loài động vật</Label>
                                                        <Select
                                                            value={petFormData.type}
                                                            onValueChange={(value) => handleSelectChange(value, "type")}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Chọn loại" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="dog">Chó</SelectItem>
                                                                <SelectItem value="cat">Mèo</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600">Giới tính</Label>
                                                        <Select
                                                            value={petFormData.gender}
                                                            onValueChange={(value) => handleSelectChange(value, "gender")}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Chọn giới tính" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="1">Đực</SelectItem>
                                                                <SelectItem value="0">Cái</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600">Giống</Label>
                                                        <Input
                                                            type="text"
                                                            name="species"
                                                            value={petFormData.species}
                                                            onChange={handlePetFormChange}
                                                            className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-gray-600">Cân nặng (kg)</Label>
                                                        <Input
                                                            type="number"
                                                            name="weight"
                                                            value={petFormData.weight}
                                                            onChange={handlePetFormChange}
                                                            className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-gray-700">Loài động vật: {pet.type === "dog" ? "Chó" : "Mèo"}</p>
                                                        <p className="text-gray-700">Giống: {pet.species}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-700">
                                                            Giới tính: {pet.gender === 1 ? "Đực" : pet.gender === 0 ? "Cái" : "Không xác định"}
                                                        </p>
                                                        <p className="text-gray-700">Cân nặng: {pet.weight} kg</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <p className="text-gray-700">
                                                            Ngày sinh: {pet.dateOfBirth ? new Date(pet.dateOfBirth).toLocaleDateString('vi-VN') : "Không xác định"}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        {editPetId === pet._id ? (
                                            <>
                                                <Button
                                                    className="bg-[#3F2E2E] text-white hover:bg-[#533b3b] transition-all"
                                                    onClick={() => handleSavePet(pet._id)}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "Đang lưu..." : "Lưu"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setEditPetId(null)}
                                                >
                                                    Hủy
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    className="bg-[#3F2E2E] text-white hover:bg-[#533b3b] transition-all"
                                                    onClick={() => handleEditPet(pet)}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Chỉnh sửa
                                                </Button>
                                                <Button
                                                    className="bg-red-700 text-white hover:bg-red-700 transition-all"
                                                    onClick={() => handleDeletePet(pet._id)}
                                                    disabled={isLoading}
                                                >
                                                    Xóa
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Chưa có thú cưng nào. Hãy thêm thú cưng của bạn.</p>
                )}
            </div>
            {/* Dialog cho upload ảnh */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Cập nhật ảnh thú cưng</DialogTitle>
                        <DialogDescription>
                            Chọn ảnh từ thiết bị của bạn để cập nhật ảnh cho thú cưng
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4">
                        {imagePreview && (
                            <div className="w-40 h-40 overflow-hidden rounded-md">
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
                                className="bg-[#3F2E2E]"
                            >
                                {isLoading ? "Đang tải lên..." : "Lưu"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}