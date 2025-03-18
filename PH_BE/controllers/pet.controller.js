const uploadCloud = require("../middlewares/UploadCloud");
const db = require("../models");
const Pet = db.pet

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//Lấy thông tin thú cưng của 1 user
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

// Cập nhật thông tin thú cưng
const updatedPet = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, dateOfBirth, gender, weight, type, species } = req.body;

        // Cập nhật thông tin thú cưng
        const updatedPet = await Pet.findByIdAndUpdate(
            id,
            {
                name,
                dateOfBirth: new Date(dateOfBirth),
                gender,
                weight,
                type,
                species
            },
            { new: true, runValidators: true }
        );

        if (!updatedPet) {
            return res.status(404).json({ message: "Không tìm thấy thú cưng" });
        }
        console.log("Received data in backend:", req.params, req.body);

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công",
            pet: updatedPet
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật thú cưng:", error);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
// Upload ảnh cho pet
const uploadPetAvatar = async (req, res) => {
  try {
    const uploadMiddleware = uploadCloud.single('image');

    uploadMiddleware(req, res, async function(err) {

      // Không có file được upload
      if (!req.file) {
        return res.status(400).json({ success: false, message: "Vui lòng chọn file ảnh" });
      }

      const {id}  = req.params;
      const pet = await Pet.findById(id);

      // Nếu thú cưng của KH đã có ảnh thú cưng, xóa ảnh cũ trên Cloudinary
      if (pet.publicId) {
        await cloudinary.uploader.destroy(pet.publicId);
      }

      // Lấy thông tin từ file đã upload
      const url = req.file.path;
      const publicId = req.file.filename;
      
      // Cập nhật thông tin ảnh thú cưng trong database
      const updatedPet = await Pet.findByIdAndUpdate(
        id,
        { 
          url: url, 
          publicId: publicId
        },
        { new: true }
      ).select("-password");

      return res.status(200).json({
        success: true,
        message: "Upload ảnh thú cưng thành công",
        url: url,
        publicId: publicId,
        account: updatedPet
      });
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh thú cưng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
module.exports = { getPetsByUser, createPetByUser, updatedPet, uploadPetAvatar };