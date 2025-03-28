const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
    params: {
        folder: 'SDN301m',
        resource_type: 'auto' // Cho phép Cloudinary tự động xác định loại file
    }
});

const uploadCloud = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 5MB in bytes
});

module.exports = uploadCloud;
