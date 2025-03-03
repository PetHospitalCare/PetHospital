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
        const { id } = req.params;
        const { name, price, status, duration } = req.body;
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        // Tạo subservice mới
        const newSubService = {
            name,
            price,
            status: status || "active", // Mặc định là "active" nếu không có
            duration
        };
        service.subServices.push(newSubService);

        await service.save();
        return res.status(201).json({ message: "Subservice added successfully", service: service.subServices, });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const getAllService = async (req, res) => {
    try {
        const services = await Service.find();
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
const getAllServiceById = async (req, res) => {
    try {
        const services = await Service.findById(req.params.id);
        if (!services) {
            return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
        }
        // Trả về danh sách sản phẩm
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm thành công',
            services: services.subServices,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const UpdateSubService = async (req, res) => {
    try {
        const { id, sid } = req.params;
        const { name, duration, price, status } = req.body;

        // Tìm dịch vụ chứa subService
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
        }

        // Tìm subService trong danh sách subServices
        const subService = service.subServices.id(sid);
        if (!subService) {
            return res.status(404).json({ success: false, message: "Dịch vụ con không tồn tại" });
        }

        // Cập nhật thông tin subService
        if (name !== undefined) subService.name = name;
        if (duration !== undefined) subService.duration = duration;
        if (price !== undefined) subService.price = price;
        if (status !== undefined) subService.status = status;

        // Lưu cập nhật
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Cập nhật dịch vụ con thành công",
        });
    } catch (error) {
        console.error("Lỗi cập nhật dịch vụ con:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống Back-end" });
    }
};
const DeleteSubService = async (req, res) => {
    try {
        const { serviceId, subServiceId } = req.params;

        // Tìm dịch vụ chứa subService
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ success: false, message: "Dịch vụ không tồn tại" });
        }

        // Lọc ra danh sách subServices mới sau khi loại bỏ subService cần xóa
        const updatedSubServices = service.subServices.filter(sub => sub._id.toString() !== subServiceId);
        if (updatedSubServices.length === service.subServices.length) {
            return res.status(404).json({ success: false, message: "Dịch vụ con không tồn tại" });
        }

        // Cập nhật danh sách subServices
        service.subServices = updatedSubServices;
        await service.save();

        return res.status(200).json({
            success: true,
            message: "Xóa dịch vụ con thành công",
        });
    } catch (error) {
        console.error("Lỗi khi xóa dịch vụ con:", error);
        return res.status(500).json({ success: false, message: "Lỗi hệ thống Back-end" });
    }
};

module.exports = { CreateNewService, getAllService, deleteService, updateService, getAllServiceById, UpdateSubService, DeleteSubService };