const db = require("../models");
const cloudinary = require('cloudinary').v2;
const ShoppingCart = db.shoppingcart;
const Payment = db.payment;

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
        let isDeleteAll = false;
        let savedShoppingCart;

        let shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

        if (!shoppingCart && data.order === 'add') {
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

        if ((data.order === 'add' || data.order === 'subtract' || data.order === 'update') && shoppingCart) {
            const existingItem = shoppingCart.items.find(
                (item) => item.productId === data.product.productId
            );

            if (data.order === 'add') {
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    existingItem.quantity += data.product.quantity;
                } else {
                    // Nếu chưa có, thêm sản phẩm mới
                    shoppingCart.items.push(data.product);
                }
            } else if (data.order === 'subtract') {
                if (existingItem) {
                    // Nếu sản phẩm đã tồn tại, giảm số lượng
                    existingItem.quantity -= data.product.quantity;

                    if (existingItem.quantity <= 0) {
                        const index = shoppingCart.items.findIndex(item => item.productId === existingItem.productId);

                        if (index > -1) {
                            shoppingCart.items.splice(index, 1);
                        }
                    }
                }
            } else if (data.order === 'update') {

                if (data.product.quantity > 0) {
                    if (existingItem) {
                        existingItem.quantity = data.product.quantity;
                    } else {
                        shoppingCart.items.push(data.product);
                    }
                }
            }
        }

        if (data.order === 'delete') {
            if (shoppingCart) {
                const index = shoppingCart.items.findIndex(item => item.productId === data.product.productId);
                if (index > -1) {
                    shoppingCart.items.splice(index, 1);
                }
            }
        }

        // Cập nhật lại tổng giá tiền
        if (shoppingCart && shoppingCart?.items?.length > 0) {
            shoppingCart.totalPrice = shoppingCart.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            );
        } else {
            isDeleteAll = true;
        }

        // Lưu lại vào database
        if (!isDeleteAll) {
            savedShoppingCart = await shoppingCart.save();
        } else {
            savedShoppingCart = await shoppingCart.deleteOne({ userId: String(userId) });
        }

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

const payment = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;
        let payment;

        if (userId && userId !== 'contact_infor') {
            let shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

            if (!shoppingCart) {
                return res.status(500).json({
                    message: "Lỗi hệ thống Back-end"
                });
            }


            payment = new Payment({
                userId: shoppingCart.userId,
                contactInfo: '',
                items: shoppingCart.items,
                totalPrice: shoppingCart.totalPrice,
                shipFee: shoppingCart.shipFee,
                address: shoppingCart.address
            });
        } else if (userId && userId === 'contact_infor') {
            payment = new Payment({
                userId: '',
                contactInfo: userId,
                items: data.items,
                totalPrice: data.totalPrice,
                shipFee: data.shipFee,
                address: data.address
            });
        }

        const savedPayment = await payment.save();

        return res.status(200).json({
            success: true,
            message: 'Thanh toán thành công',
            savedPayment,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { getShoppingCartByUserId, updateShoppingCartByUserId, payment };