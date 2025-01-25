const db = require("../models");
const Category = db.category;

const CreateNewCategory= async (req, res) => {
    try {
        const files = req.files; // Danh sách file ảnh
        const { name } = req.body;

        // Tạo một sản phẩm mới
        const newCategory = new Category({
            name,
        });

        // Lưu sản phẩm vào database
        const savedCategory = await newCategory.save();

        return res.status(201).json({
            message: "Tạo Danh Mục thành công",
            Category: savedCategory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find()

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách danh mục thành công',
            categories,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Tìm và xóa sản phẩm theo id
        const deletedCategory = await Category.findByIdAndDelete(id);

        // Kiểm tra xem sản phẩm có tồn tại không
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tìm thấy",
            });
        }
        // Trả về phản hồi thành công
        res.status(200).json({
            success: true,
            message: "Danh mục đã được xóa thành công",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
module.exports = { CreateNewCategory, getAllCategory, deleteCategory };