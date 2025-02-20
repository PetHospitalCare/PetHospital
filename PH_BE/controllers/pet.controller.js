const db = require("../models");
const Product = db.pet;
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const CreateNewProduct = async (req, res) => {
    try {
        const files = req.files; // Danh sách file ảnh
        const { name, description, price, quantity, categoryId, type } = req.body;
        const parsedType = typeof type === "string" ? JSON.parse(type) : type;

        // Kiểm tra dữ liệu đầu vào
        // if (!name || !categoryId || !type || !files || files.length === 0) {
        //     return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ thông tin và ít nhất một ảnh!" });
        // }

        // Xử lý danh sách ảnh, tạo mảng `images`
        const images = files?.map((file) => ({
            url: file.path,        // Đường dẫn ảnh (thường từ Multer hoặc dịch vụ upload)
            publicId: file.filename, // ID dùng để quản lý ảnh trên cloud (ví dụ: Cloudinary)
        }));

        // Tạo một sản phẩm mới
        const newProduct = new Product({
            name,
            images,
            description,
            price,
            quantity,
            categoryId,
            type: parsedType
        });

        // Lưu sản phẩm vào database
        const savedProduct = await newProduct.save();

        return res.status(201).json({
            message: "Tạo sản phẩm thành công",
            product: savedProduct,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('categoryId', 'name') // Chỉ lấy trường `name` từ Category
            .exec();

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            products,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Tìm và xóa sản phẩm theo id
        const deletedProduct = await Product.findById(id);


        // Kiểm tra xem sản phẩm có tồn tại không
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tìm thấy",
            });
        }
        // Lấy danh sách publicId từ ảnh
        const imagePublicIds = deletedProduct.images.map((image) => image.publicId);

        // Xóa từng ảnh trên Cloudinary
        const deleteImagePromises = imagePublicIds.map((publicId) =>
            cloudinary.uploader.destroy(publicId)
        );
        await Promise.all(deleteImagePromises); // Đợi tất cả ảnh được xóa
        await Product.findByIdAndDelete(id);
        // Trả về phản hồi thành công
        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được xóa thành công",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
module.exports = { CreateNewProduct, getAllProduct, deleteProduct };