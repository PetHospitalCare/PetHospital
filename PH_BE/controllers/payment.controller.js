const db = require("../models");
const Payment = db.payment;
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const nodemailer = require("nodemailer");
const Account = db.account;
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "namkhanh2703.work@gmail.com",
        pass: "tuff cyhw bwez qkcm",
    },
});

const paymentVNPay = async (req, res) => {
    try {
        const { userId } = req.params;
        const orderInfo = req.body;
        let payment = null;
        let shoppingCart = null;
        let savedPayment = null;

        if (!userId) {
            console.log('UserId không được cung cấp');

            return res.status(400).json({
                success: false,
                message: 'UserId không được cung cấp'
            });
        }

        if (userId) {
            shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

            if (!shoppingCart) {
                console.log('Không tìm thấy cart');

                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy giỏ hàng của người dùng"
                });
            }

            const addressObject = {
                selectedAddress: orderInfo.selectedAddress || '',
                inputAddress: orderInfo.inputAddress || '',
                province: orderInfo.province || '',
                district: orderInfo.district || '',
                ward: orderInfo.ward || '',
            }

            payment = new Payment({
                userId: shoppingCart.userId || orderInfo.userId,
                items: shoppingCart.items || orderInfo.items,
                totalPrice: shoppingCart.totalPrice || orderInfo.totalPrice,
                shipFee: shoppingCart.shipFee || orderInfo.shipFee,
                address: addressObject,
                phone: orderInfo.phoneNumber,
                email: orderInfo.email,
                status: 0,
                method: orderInfo.paymentMethod || 'online'
            });
        }

        if (payment) {
            savedPayment = await payment.save();
        } else {
            return res.status(400).json({
                success: false,
                message: "Không thể tạo đơn hàng"
            });
        }

        const vnpay = new VNPay({
            tmnCode: 'RCS7ES46',
            secureSecret: '4TKTBYQ9H25SR8BITLS6BR60XEOHPWDO',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            testMode: true,
            hashAlgorithm: 'SHA512',
            enableLog: false,
            loggerFn: ignoreLogger,
        });

        const now = new Date();

        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: savedPayment.totalPrice + savedPayment.shipFee,
            vnp_IpAddr: '127.0.0.1',
            vnp_TxnRef: savedPayment._id,
            vnp_OrderInfo: savedPayment._id,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:5173/payment-result',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(now),
            vnp_ExpireDate: dateFormat(new Date(now.getTime() + 15 * 60 * 1000))
        })

        if (shoppingCart) {
            await shoppingCart.deleteOne({ userId: String(userId) });
        }

        return res.status(200).json({
            success: true,
            message: 'Tạo bản ghi và url thành công',
            paymentUrl,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const updatePayment = async (req, res) => {
    try {
        const data = req.body;
        let paymentSaved;
        let payment;

        if (data.paymentId) {
            payment = await db.payment.findOne({ _id: String(data.paymentId) });

            if (payment) {
                if (data.vnp_ResponseCode === '00') {
                    payment.status = 1;
                } else {
                    payment.status = -1;
                }

                paymentSaved = await payment.save();
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Cập nhật payment không thành công',
                });
            }
        }

        if (paymentSaved.status === 1) {
            const updateResult = await updateProductQuantity(payment.items);

            if (!updateResult.success) {
                payment.status = -1;
                paymentSaved = await payment.save();

                return res.status(400).json({
                    success: false,
                    message: updateResult.message
                });
            }

            const emailResult = await sendEmailSuccessPayment(paymentSaved, paymentSaved.userId);

            if (!emailResult.success) {
                console.log('Cảnh báo: ' + emailResult.message);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật payment thành công',
            paymentSaved,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const getPaymentsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'UserId không được cung cấp'
            });
        }

        const payments = await db.payment.find({ userId: String(userId) });

        if (!payments || payments.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Không tìm thấy payment nào cho người dùng này',
                payments: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách payment thành công',
            payments,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const paymentCodPay = async (req, res) => {
    try {
        const { userId } = req.params;
        const orderInfo = req.body;
        let payment = null;
        let shoppingCart;
        let savedPayment = null;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'UserId không được cung cấp'
            });
        }

        if (userId) {
            shoppingCart = await db.shoppingcart.findOne({ userId: String(userId) });

            if (!shoppingCart) {
                console.log('Không tìm thấy cart');

                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy giỏ hàng của người dùng"
                });
            }

            const addressObject = {
                selectedAddress: orderInfo.selectedAddress || '',
                inputAddress: orderInfo.inputAddress || '',
                province: orderInfo.province || '',
                district: orderInfo.district || '',
                ward: orderInfo.ward || '',
            }

            payment = new Payment({
                userId: shoppingCart.userId || orderInfo.userId,
                items: shoppingCart.items || orderInfo.items,
                totalPrice: shoppingCart.totalPrice || orderInfo.totalPrice,
                shipFee: shoppingCart.shipFee || orderInfo.shipFee,
                address: addressObject,
                phone: orderInfo.phoneNumber,
                email: orderInfo.email,
                status: 1,
                method: orderInfo.paymentMethod || 'cod'
            });
        }

        if (payment) {
            savedPayment = await payment.save();
        } else {
            return res.status(400).json({
                success: false,
                message: "Không thể tạo đơn hàng"
            });
        }

        if (shoppingCart) {
            await shoppingCart.deleteOne({ userId: String(userId) });
        }

        const updateResult = await updateProductQuantity(shoppingCart.items || orderInfo.items);

        if (!updateResult.success) {
            payment.status = -1;
            savedPayment = await payment.save();

            return res.status(400).json({
                success: false,
                message: updateResult.message
            });
        }

        const emailResult = await sendEmailSuccessPayment(savedPayment, userId);

        if (!emailResult.success) {
            console.log('Cảnh báo: ' + emailResult.message);
            // Vẫn tiếp tục xử lý đơn hàng dù gửi email bị lỗi
        }

        return res.status(200).json({
            success: true,
            message: 'Thanh toán COD thành công',
            savedPayment,
        });

    } catch (error) {
        console.log('Lỗi trong quá trình thanh toán:', error);

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const sendEmailSuccessPayment = async (paymentInput, userKeyInput) => {
    try {
        // Kiểm tra xem các tham số cần thiết đã được truyền vào chưa
        if (!paymentInput || !userKeyInput) {
            console.error("Thiếu dữ liệu paymentInput hoặc userKeyInput");
            return { success: false, message: "Thiếu dữ liệu để gửi email" };
        }

        const user = await Account.findOne({ _id: userKeyInput });

        if (!user) {
            console.error("Không tìm thấy user với userKey:", userKeyInput);
            return { success: false, message: "Không tìm thấy user!" };
        }

        // Định dạng tiền tệ
        const formattedPrice = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(paymentInput.totalPrice + (paymentInput.shipFee || 0));

        // Tạo danh sách sản phẩm trong email
        const itemsList = paymentInput.items.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(item.price)}</td>
            </tr>
        `).join('');

        const addressParts = [];

        if (paymentInput.address.inputAddress) addressParts.push(paymentInput.address.inputAddress);
        if (paymentInput.address.selectedAddress) addressParts.push(paymentInput.address.selectedAddress);
        if (paymentInput.address.ward) addressParts.push(paymentInput.address.ward);
        if (paymentInput.address.district) addressParts.push(paymentInput.address.district);
        if (paymentInput.address.province) addressParts.push(paymentInput.address.province);

        const fullAddress = addressParts.join(', ');

        await transporter.sendMail({
            to: paymentInput.email || user.email,
            subject: "Thông tin đơn hàng - PetCare",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        
                        <div style="text-align: center; margin-bottom: 20px;">
                            <img src="/pethospital.png" alt="" width="120">
                        </div>
        
                        <h2 style="color: #2c3e50; text-align: center;">Xác nhận đặt hàng thành công</h2>
                        <p style="text-align: center; color: #555;">Chào <b>${user?.username || 'Quý khách'}</b>,</p>
                        
                        <p style="color: #555;">Bạn đã đặt đơn hàng thành công tại <b>PetCare</b>. Dưới đây là thông tin chi tiết:</p>
        
                        <div style="background: #ecf7ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p><strong>Mã đơn hàng:</strong> #${paymentInput._id}</p>
                            <p><strong>Ngày đặt:</strong> ${new Date(paymentInput.createdAt).toLocaleDateString('vi-VN')}</p>
                            <p><strong>Địa chỉ giao hàng:</strong> ${fullAddress}</p>
                            <p><strong>Phí vận chuyển:</strong> ${new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(paymentInput.shipFee || 0)}</p>
                            <p><strong>Tổng tiền:</strong> ${formattedPrice}</p>
                        </div>
                        
                        <h3 style="color: #2c3e50;">Chi tiết sản phẩm</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background-color: #f2f2f2;">
                                    <th style="padding: 12px 8px; text-align: left;">Sản phẩm</th>
                                    <th style="padding: 12px 8px; text-align: center;">Số lượng</th>
                                    <th style="padding: 12px 8px; text-align: right;">Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                        </table>
        
                        <p style="color: #555; margin-top: 20px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua hotline: <strong>+84 0985741249</strong>.</p>
        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="http://localhost:5173/orders" 
                               style="display: inline-block; padding: 12px 24px; background: #3498db; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">
                               Xem lại đơn hàng của bạn
                            </a>
                        </div>
        
                        <p style="margin-top: 20px; text-align: center; font-size: 12px; color: #7f8c8d;">
                            Địa chỉ: Văn phòng Pet Health, Tòa nhà Sông Đà, Số 54 Phạm Hùng, Nam Từ Liêm, TP. Hà Nội
                        </p>
        
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://facebook.com/petcare" style="margin: 0 10px; color: #3b5998; text-decoration: none;">
                                Facebook
                            </a>
                            <a href="https://instagram.com/petcare" style="margin: 0 10px; color: #e4405f; text-decoration: none;">
                                Instagram
                            </a>
                            <a href="https://your-petcare-website.com" style="margin: 0 10px; color: #0077b5; text-decoration: none;">
                                Website
                            </a>
                        </div>
        
                    </div>
                </div>
            `,
        });

        return { success: true, message: "Gửi email thanh toán thành công!" };
    } catch (error) {
        console.error("Lỗi khi gửi email:", error);
        return { success: false, message: "Lỗi khi gửi email thanh toán!", error };
    }
};


const getAllPayments = async (req, res) => {
    try {
        const payments = await db.payment.find();

        if (!payments || payments.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'Không tìm thấy payment nào',
                payments: []
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Lấy toàn bộ danh sách payment thành công',
            payments,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const updateProductQuantity = async (productsInput) => {
    try {
        const notFoundProducts = [];

        for (const item of productsInput) {
            const product = await db.product.findById(item.productId);

            if (!product) {
                console.log(`Không tìm thấy sản phẩm với ID: ${item.productId}`);
                notFoundProducts.push(item.productId);
                continue;
            }

            if (product.quantity < item.quantity) {
                throw new Error(`Sản phẩm ${product.name || product._id} không đủ số lượng trong kho`);
            }

            const newQuantity = product.quantity - item.quantity;

            await db.product.findByIdAndUpdate(
                item.productId,
                { quantity: newQuantity },
                { new: true }
            );
        }

        if (notFoundProducts.length > 0) {
            return {
                success: false,
                message: `Không tìm thấy sản phẩm với ID: ${notFoundProducts.join(', ')}`
            };
        }

        return {
            success: true,
            message: 'Cập nhật số lượng sản phẩm thành công'
        };
    } catch (error) {
        console.log('Lỗi khi cập nhật số lượng sản phẩm:', error);
        return {
            success: false,
            message: error.message || 'Lỗi khi cập nhật số lượng sản phẩm'
        };
    }
};

const restoreProductQuantity = async (productsInput) => {
    try {
        for (const item of productsInput) {
            const product = await db.product.findById(item.productId);

            if (!product) {
                console.log(`Không tìm thấy sản phẩm với ID: ${item.productId}`);
                continue;
            }

            const newQuantity = product.quantity + item.quantity;

            await db.product.findByIdAndUpdate(
                item.productId,
                { quantity: newQuantity },
                { new: true }
            );
        }


        return {
            success: true,
            message: 'Khôi phục số lượng sản phẩm thành công',
        };
    } catch (error) {
        console.log('Lỗi khi khôi phục số lượng sản phẩm:', error);

        return {
            success: false,
            message: error.message || 'Lỗi khi khôi phục số lượng sản phẩm'
        };
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { paymentId } = req.params;
        let paymentSaved;
        let payment;

        if (paymentId) {
            payment = await db.payment.findOne({ _id: String(paymentId) });

            if (payment) {
                payment.status = -2;
                paymentSaved = await payment.save();
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Cập nhật payment không thành công',
                });
            }

            const updateResult = await restoreProductQuantity(payment.items);

            if (!updateResult.success) {
                console.log('Cảnh báo: ' + updateResult.message);
            }
        } else {
            console.log('Không có paymentId');

            return res.status(400).json({
                success: false,
                message: "Đã có lỗi xảy ra"
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Huỷ order thành công',
            paymentSaved,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { paymentId } = req.params;


        if (paymentId) {
            const result = await db.payment.deleteOne({ _id: String(paymentId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy đơn hàng để xóa"
                });
            }
        } else {
            console.log('Không có paymentId');

            return res.status(400).json({
                success: false,
                message: "Đã có lỗi xảy ra"
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Xóa order thành công',
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const data = req.body;
        let paymentSaved;
        let payment;

        if (data.paymentId) {
            payment = await db.payment.findOne({ _id: String(data.paymentId) });

            if (payment) {
                payment.status = data.status;

                paymentSaved = await payment.save();
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Cập nhật payment không thành công',
                });
            }
        } else {
            console.log('Không có paymentId');

            return res.status(400).json({
                success: false,
                message: "Đã có lỗi xảy ra"
            });
        }


        return res.status(200).json({
            success: true,
            message: 'Cập nhật payment thành công',
            paymentSaved,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};

module.exports = { paymentVNPay, updatePayment, getPaymentsByUserId, paymentCodPay, getAllPayments, cancelOrder, deleteOrder, updatePaymentStatus };