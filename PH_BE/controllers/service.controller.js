const db = require("../models");
const Service = db.service;
const cloudinary = require('cloudinary').v2;

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const CreateNewService = async (req, res) => {
    try {
        const { name, description, price, duration, isAvailable } = req.body;
        const file = req.file; //
        // Tạo một sản phẩm mới
        const newService = new Service({
            name,
            description,
            price,
            duration,
            url: file.path,
            publicId: file.filename,
            isAvailable
        });

        // Lưu sản phẩm vào database
        const savedService = await newService.save();

        return res.status(201).json({
            message: "Tạo dịch vụ thành công",
            Service: savedService,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const getAllService = async (req, res) => {
    try {
        const services = await Service.findOne({ name: "Tiêm chủng" })
            .exec();

        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            services,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        // Tìm và xóa sản phẩm theo id
        const deletedService = await Service.findById(id);


        // Kiểm tra xem sản phẩm có tồn tại không
        if (!deletedService) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tìm thấy",
            });
        }
        await cloudinary.uploader.destroy(deletedService.publicId);
        await Service.findByIdAndDelete(id);
        // Trả về phản hồi thành công
        res.status(200).json({
            success: true,
            message: "Dịch vụ đã được xóa thành công",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, duration, isAvailable } = req.body;
        const file = req.file;

        // Kiểm tra xem dịch vụ có tồn tại không
        const existingService = await Service.findById(id);
        if (!existingService) {
            return res.status(404).json({
                success: false,
                message: "Dịch vụ không tìm thấy",
            });
        }
        if (file?.path) {
            if (existingService.publicId) {
                await cloudinary.uploader.destroy(existingService.publicId);
            }

            const updatedService = await Service.findByIdAndUpdate(
                id,
                {
                    name,
                    description,
                    price,
                    duration,
                    isAvailable,
                    url: file?.path,
                    publicId: file?.filename
                },
                { new: true } // Trả về dữ liệu sau khi cập nhật
            );
            return res.status(200).json({
                success: true,
                message: "Cập nhật dịch vụ thành công",
                service: updatedService,
            });
        }
        const updatedService = await Service.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                duration,
                isAvailable,
            },
            { new: true } // Trả về dữ liệu sau khi cập nhật
        );
        return res.status(200).json({
            success: true,
            message: "Cập nhật dịch vụ thành công",
            service: updatedService,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end",
        });
    }
};

module.exports = { CreateNewService, getAllService, deleteService, updateService };