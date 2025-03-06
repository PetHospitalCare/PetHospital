const db = require("../models");
const Medicine = db.medicine;
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//Tạo 1 thuốc mới
const createNewMedicine = async (req, res) => {
    try {
        const files = req.files; // Danh sách file ảnh
        const { name, description, type, pet_type, dosage, manufacturer, unit, price, quantity, expiry_date } = req.body;

        // Xử lý danh sách ảnh, tạo mảng `images`
        const images = files?.map((file) => ({
            url: file.path,        // Đường dẫn ảnh (thường từ Multer hoặc dịch vụ upload)
            publicId: file.filename, // ID dùng để quản lý ảnh trên cloud (ví dụ: Cloudinary)
        }));
        const parsedPetType = typeof pet_type === "string" ? JSON.parse(pet_type) : pet_type;

        // Kiểm tra xem các trường cần thiết có tồn tại không
        if (!name || !type || !price || !quantity) {
            return res.status(400).json({
                message: "Thiếu thông tin bắt buộc (name, type, price, quantity)"
            });
        }

        // Tạo một sản phẩm mới
        const newMedicine = new Medicine({
            name,
            images,
            description,
            type,
            pet_type: parsedPetType,
            dosage,
            manufacturer,
            unit,
            price,
            quantity,
            expiry_date: expiry_date ? new Date(expiry_date) : null
        });

        // Lưu sản phẩm vào database
        const savedMedicine = await newMedicine.save();

        return res.status(201).json({
            message: "Tạo thuốc thành công",
            medicine: savedMedicine,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

//Xem danh sách thuốc
const getAllMedicine = async (req, res) => {
    try {
        const medicines = await Medicine.find();

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách thuốc thành công',
            medicines,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

//Xem chi tiết 1 thuốc
const getOneMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id);

        if (!medicine) {
            return res.status(404).json({ success: false, message: "Thuốc không tìm thấy" });
        }

        return res.status(200).json({ success: true, message: "Lấy thông tin thuốc thành công", medicine });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};

//Cập nhật thuốc
const updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type, pet_type, dosage, manufacturer, unit, price, quantity, expiry_date } = req.body;
        const files = req.files;

        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ success: false, message: "Thuốc không tìm thấy" });
        }
        const parsedPetType = typeof pet_type === "string" ? JSON.parse(pet_type) : pet_type;

        let images = medicine.images;
        if (files && files.length > 0) {
            const oldImagePublicIds = images.map((image) => image.publicId);
            await Promise.all(oldImagePublicIds.map((publicId) => cloudinary.uploader.destroy(publicId)));
            images = files.map((file) => ({ url: file.path, publicId: file.filename }));
        }

        medicine.name = name || medicine.name;
        medicine.description = description || medicine.description;
        medicine.type = type || medicine.type;
        medicine.pet_type = parsedPetType || medicine.pet_type;
        medicine.dosage = dosage || medicine.dosage;
        medicine.manufacturer = manufacturer || medicine.manufacturer;
        medicine.unit = unit || medicine.unit;
        medicine.price = price || medicine.price;
        medicine.quantity = quantity || medicine.quantity;
        medicine.expiry_date = expiry_date ? new Date(expiry_date) : medicine.expiry_date;
        medicine.images = images;

        const updatedMedicine = await medicine.save();
        return res.status(200).json({ success: true, message: "Cập nhật thuốc thành công", medicine: updatedMedicine });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};

//Xóa Thuốc
const deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMedicine = await Medicine.findById(id);


        // Kiểm tra xem sản phẩm có tồn tại không
        if (!deletedMedicine) {
            return res.status(404).json({
                success: false,
                message: "Thuốc không tìm thấy",
            });
        }
        // Lấy danh sách publicId từ ảnh
        const imagePublicIds = deletedMedicine.images.map((image) => image.publicId);

        // Xóa từng ảnh trên Cloudinary
        const deleteImagePromises = imagePublicIds.map((publicId) =>
            cloudinary.uploader.destroy(publicId)
        );
        await Promise.all(deleteImagePromises); // Đợi tất cả ảnh được xóa

        await Medicine.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Thuốc đã được xóa thành công",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { createNewMedicine, getAllMedicine, getOneMedicine, updateMedicine, deleteMedicine };