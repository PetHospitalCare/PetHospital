const db = require("../models");
const cloudinary = require('cloudinary').v2;
const ShoppingCart = db.shoppingcart;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const getShoppingCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });


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

const updateShoppingCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;

        let shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

        if (!shoppingCart) {
            // Nếu chưa có giỏ hàng, tạo mới
            shoppingCart = new ShoppingCart({
                userId,
                items: [],
                totalPrice: 0,
                shipFee: 20000,
                address: '',
                status: 0
            });
        }

        if (data.order === 'add') {
            const existingItem = shoppingCart.items.find(
                (item) => item.productId === data.product.productId
            );

            if (existingItem) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                existingItem.quantity += data.product.quantity;
            } else {
                // Nếu chưa có, thêm sản phẩm mới
                shoppingCart.items.push(data.product);
            }
        }

        // Cập nhật lại tổng giá tiền
        shoppingCart.totalPrice = shoppingCart.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );

        // Lưu lại vào database
        const savedShoppingCart = await shoppingCart.save();

        return res.status(200).json({
            success: true,
            message: 'Cập nhật dữ liệu giỏ hàng thành công',
            savedShoppingCart,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { getShoppingCartByUserId, updateShoppingCartByUserId };