const db = require("../models");
const Pet = db.pet

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const getPetsByUser = async (req, res) => {
    try {
        const userId = req.userId

        const pets = await Pet.find({ account_id: userId });

        if (!pets.length) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thú cưng nào." });
        }

        res.status(200).json({ success: true, pets });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thú cưng:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

//Tạo thú cưng mới
const createPetByUser = async (req, res) => {
    try {
        const userId = req.userId; // Lấy ID của user từ request

        const { name, dateOfBirth, gender, weight, type, species, detail, url, publicId } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!name || !type || !species) {
            return res.status(400).json({ success: false, message: "Tên, loại và giống là bắt buộc." });
        }

        // Tạo thú cưng mới
        const newPet = new Pet({
            name,
            dateOfBirth,
            gender,
            weight,
            type,
            species,
            detail,
            url,
            publicId,
            account_id: userId
        });

        // Lưu vào database
        await newPet.save();

        res.status(201).json({ success: true, message: "Thú cưng đã được tạo thành công.", pet: newPet });
    } catch (error) {
        console.error("Lỗi khi tạo thú cưng:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
module.exports = { getPetsByUser, createPetByUser };