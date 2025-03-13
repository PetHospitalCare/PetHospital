const db = require("../models");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const getShoppingCartByUserId = async (req, res) => {
    try {
        const {userId} = req.params;
        const shoppingCart = await db.shoppingcart.find({userId: String(userId)});


        return res.status(200).json({
            success: true,
            message: 'Lấy dữ liệu giỏ hàng thành công',
            shoppingCart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { getShoppingCartByUserId };