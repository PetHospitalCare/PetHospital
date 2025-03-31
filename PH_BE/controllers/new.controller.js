const db = require("../models");
const New = db.new;
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//Lấy danh sách bài viết
const GetAllNews = async (req, res) => {
    try {
        const news = await New.find()
            .populate("createdBy")
            .populate("updatedBy")
            .exec()

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            news,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

//Tạo bài viết mới
const CreateNew = async (req, res) => {
    try {
        const userId = req.userId;
        const { title, content } = req.body;
        
        // Get the uploaded image file (assuming it's using Multer like your medicine module)
        const file = req.file;  // For single file upload
        
        // Check required fields
        if (!title || !content) {
            return res.status(400).json({
                message: "Thiếu thông tin bắt buộc (title, content)"
            });
        }
        
        // Process image if it exists
        let imageData = {};
        if (file) {
            imageData = {
                url: file.path,  // URL from Multer/Cloudinary
                publicId: file.filename  // Public ID for Cloudinary
            };
        }
        
        // Create a new news post
        const newPost = new New({
            title,
            content,
            images: imageData,
            createdBy: userId
        });
        
        // Save to database
        const savedNews = await newPost.save();
        
        return res.status(201).json({
            message: "Tạo bài viết thành công",
            news: savedNews
        });
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};

//Chỉnh sửa bài viết 
const EditNew = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { title, content } = req.body;
        let imageData = {};
        
        const news = await New.findById(id);
        if (!news) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }
        
        if (req.file) {
            // Xóa ảnh cũ nếu có
            if (news.images && news.images.publicId) {
                await cloudinary.uploader.destroy(news.images.publicId);
            }
            
            imageData = {
                url: req.file.path,
                publicId: req.file.filename
            };
        }
        
        const updatedNews = await New.findByIdAndUpdate(id, {
            title,
            content,
            ...(Object.keys(imageData).length > 0 && { images: imageData }),
            updatedBy: userId
        }, { new: true });
        
        return res.status(200).json({
            message: "Cập nhật bài viết thành công",
            news: updatedNews
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật bài viết:", error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};

//Xoá bài viết
const DeleteNew = async (req, res) => {
    try {
        const { id } = req.params;
        const newsToDelete = await New.findById(id);

        if (!newsToDelete) {
            return res.status(404).json({ message: "Bài viết không tồn tại" });
        }

        if (newsToDelete.images && newsToDelete.images.publicId) {
            await cloudinary.uploader.destroy(newsToDelete.images.publicId);
        }

        await New.findByIdAndDelete(id);

        return res.status(200).json({ message: "Xóa bài viết thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
        return res.status(500).json({ message: "Lỗi hệ thống Back-end" });
    }
};

const GetOneNew = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await New.findById(id);
        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy sản phẩm thành công',
            news,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
module.exports = { CreateNew, GetAllNews, EditNew, DeleteNew, GetOneNew };