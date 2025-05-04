const db = require("../models");
const Booking = db.booking;
const Payment = db.payment
const Account = db.account
const Product = db.product
const Pet = db.pet
const moment = require('moment')
//Lấy danh sách bài viết
const GetBookingByTime = async (req, res) => {
    try {
        const { timeRange } = req.params
        let dateFilter = {}
        switch (timeRange) {
            case 'week':
                dateFilter = {
                    createdAt: {
                        $gte: moment().startOf('week').toDate(),
                        $lte: moment().endOf('week').toDate()
                    }
                }
                break
            case 'month':
                dateFilter = {
                    createdAt: {
                        $gte: moment().startOf('month').toDate(),
                        $lte: moment().endOf('month').toDate()
                    }
                }
                break
            case 'year':
                dateFilter = {
                    createdAt: {
                        $gte: moment().startOf('year').toDate(),
                        $lte: moment().endOf('year').toDate()
                    }
                }
                break
            default:
                dateFilter = {}
        }
        const [totalAppointments, pendingAppointments, completedAppointments, ConfirmedAppointments, cancelAppointments] = await Promise.all([
            Booking.countDocuments(dateFilter),
            Booking.countDocuments({ ...dateFilter, status: 'pending' }),
            Booking.countDocuments({ ...dateFilter, status: 'complete' }),
            Booking.countDocuments({ ...dateFilter, status: 'confirm' }),
            Booking.countDocuments({ ...dateFilter, status: 'cancel' })
        ])

        return res.status(200).json({
            success: true,
            data: {
                totalAppointments,
                pendingAppointments,
                ConfirmedAppointments,
                completedAppointments,
                cancelAppointments
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Lỗi hệ thống Back-end"
        });
    }
};
const getAllRevenueByTime = async (req, res) => {
    try {
        const { timeRange } = req.params;
        let dateFilter = {};
        let groupTemplate = [];
        let groupBy = null;
        let projectStage = null;
        let sortField = null;

        // Thiết lập bộ lọc thời gian và template
        switch (timeRange) {
            case 'week':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('isoWeek').toDate(),
                        $lte: moment().endOf('isoWeek').toDate()
                    }
                };
                groupBy = { $dayOfWeek: "$updatedAt" };
                sortField = 'day';
                groupTemplate = Array.from({ length: 7 }, (_, i) => ({
                    day: i + 1,
                    total: 0,
                    count: 0,
                    paymentTotal: 0,
                    paymentCount: 0
                }));
                projectStage = {
                    $project: {
                        _id: 0,
                        day: "$_id",
                        total: 1,
                        count: 1,
                        paymentTotal: 1,
                        paymentCount: 1
                    }
                };
                break;

            case 'month':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('month').toDate(),
                        $lte: moment().endOf('month').toDate()
                    }
                };
                groupBy = {
                    weekInMonth: {
                        $ceil: {
                            $divide: [
                                { $subtract: [{ $dayOfMonth: "$updatedAt" }, 1] },
                                7
                            ]
                        }
                    }
                };
                sortField = 'week';
                groupTemplate = Array.from({ length: 5 }, (_, i) => ({
                    week: i + 1,
                    total: 0,
                    count: 0,
                    paymentTotal: 0,
                    paymentCount: 0
                }));
                projectStage = {
                    $project: {
                        _id: 0,
                        week: "$_id.weekInMonth",
                        total: 1,
                        count: 1,
                        paymentTotal: 1,
                        paymentCount: 1
                    }
                };
                break;

            case 'year':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('year').toDate(),
                        $lte: moment().endOf('year').toDate()
                    }
                };
                groupBy = { $month: "$updatedAt" };
                sortField = 'month';
                groupTemplate = Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    total: 0,
                    count: 0,
                    paymentTotal: 0,
                    paymentCount: 0
                }));
                projectStage = {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        total: 1,
                        count: 1,
                        paymentTotal: 1,
                        paymentCount: 1
                    }
                };
                break;

            default:
                dateFilter = {};
        }

        // Pipeline tổng doanh thu từ Booking
        const bookingPipeline = [
            {
                $match: {
                    ...dateFilter,
                    status: 'complete',
                    "payment.status": true,

                }
            }
        ];

        // Pipeline tổng doanh thu từ Payment (status = 1)
        const paymentPipeline = [
            {
                $match: {
                    ...dateFilter,
                    status: 1
                }
            }
        ];

        if (groupBy) {
            // Thêm groupBy cho Booking
            bookingPipeline.push(
                {
                    $group: {
                        _id: groupBy,
                        total: { $sum: "$price" },
                        count: { $sum: 1 }
                    }
                },
                projectStage,
                { $sort: { [sortField]: 1 } }
            );

            // Thêm groupBy cho Payment (tương tự như Booking)
            paymentPipeline.push(
                {
                    $group: {
                        _id: groupBy,
                        paymentTotal: { $sum: "$totalPrice" },
                        paymentCount: { $sum: 1 }
                    }
                },
                projectStage,
                { $sort: { [sortField]: 1 } }
            );

            // Thực hiện song song 2 aggregation
            const [bookingResult, paymentResult] = await Promise.all([
                Booking.aggregate(bookingPipeline),
                Payment.aggregate(paymentPipeline)
            ]);

            // Merge kết quả với template
            const mergedResult = groupTemplate.map(templateItem => {
                const bookingItem = bookingResult.find(item =>
                    item[sortField] === templateItem[sortField]
                );
                const paymentItem = paymentResult.find(item =>
                    item[sortField] === templateItem[sortField]
                );

                return {
                    ...templateItem,
                    total: bookingItem ? bookingItem.total : 0,
                    count: bookingItem ? bookingItem.count : 0,
                    paymentTotal: paymentItem ? paymentItem.paymentTotal : 0,
                    paymentCount: paymentItem ? paymentItem.paymentCount : 0,
                    combinedTotal: (bookingItem?.total || 0) + (paymentItem?.paymentTotal || 0)
                };
            });

            // Tính tổng toàn bộ
            const totalSummary = {
                totalBooking: mergedResult.reduce((sum, item) => sum + item.total, 0),
                totalBookingCount: mergedResult.reduce((sum, item) => sum + item.count, 0),
                totalPayment: mergedResult.reduce((sum, item) => sum + item.paymentTotal, 0),
                totalPaymentCount: mergedResult.reduce((sum, item) => sum + item.paymentCount, 0),
                grandTotal: mergedResult.reduce((sum, item) => sum + item.combinedTotal, 0)
            };

            return res.status(200).json({
                success: true,
                data: mergedResult,
                summary: totalSummary,
                timeRange
            });
        } else {
            // Xử lý trường hợp không có groupBy
            bookingPipeline.push({
                $group: {
                    _id: null,
                    total: { $sum: "$price" },
                    count: { $sum: 1 }
                }
            });

            paymentPipeline.push({
                $group: {
                    _id: null,
                    paymentTotal: { $sum: "$totalPrice" },
                    paymentCount: { $sum: 1 }
                }
            });

            const [bookingResult, paymentResult] = await Promise.all([
                Booking.aggregate(bookingPipeline),
                Payment.aggregate(paymentPipeline)
            ]);

            const bookingTotal = bookingResult.length > 0 ? bookingResult[0].total : 0;
            const bookingCount = bookingResult.length > 0 ? bookingResult[0].count : 0;
            const paymentTotal = paymentResult.length > 0 ? paymentResult[0].paymentTotal : 0;
            const paymentCount = paymentResult.length > 0 ? paymentResult[0].paymentCount : 0;

            return res.status(200).json({
                success: true,
                data: [{
                    total: bookingTotal,
                    count: bookingCount,
                    paymentTotal: paymentTotal,
                    paymentCount: paymentCount,
                    combinedTotal: bookingTotal + paymentTotal
                }],
                summary: {
                    totalBooking: bookingTotal,
                    totalBookingCount: bookingCount,
                    totalPayment: paymentTotal,
                    totalPaymentCount: paymentCount,
                    grandTotal: bookingTotal + paymentTotal
                }
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống Back-end",
            error: error.message
        });
    }
};
const getDataforCard = async (req, res) => {
    try {
        const { timeRange } = req.params;

        // Thiết lập bộ lọc thời gian
        let dateFilter = {};
        switch (timeRange) {
            case 'today':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    }
                };
                break;
            case 'week':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('week').toDate(),
                        $lte: moment().endOf('week').toDate()
                    }
                };
                break;
            case 'month':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('month').toDate(),
                        $lte: moment().endOf('month').toDate()
                    }
                };
                break;
            case 'year':
                dateFilter = {
                    updatedAt: {
                        $gte: moment().startOf('year').toDate(),
                        $lte: moment().endOf('year').toDate()
                    }
                };
                break;
            default:
                dateFilter = {};
        }

        // Lấy dữ liệu song song
        const [
            // Thú cưng mới
            newPetsStats,

            // Sản phẩm bán ra từ Booking (nếu có)
            bookingProductsStats,

            // Sản phẩm bán ra từ Payment
            paymentProductsStats,

            // Các thống kê khác giữ nguyên
            totalAppointments,
            appointmentStatusStats,
            upcomingAppointments,
            totalCustomers,
            customerRoleStats,
            totalProducts,
            totalPets,
            petTypeStats,
            lowStockProducts,
            bestSellingProducts,
            newCustomersThisPeriod,
            bookingRevenue,
            paymentRevenue
        ] = await Promise.all([
            // Thống kê thú cưng mới
            Pet.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        dogs: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "dog"] }, 1, 0]
                            }
                        },
                        cats: {
                            $sum: {
                                $cond: [{ $eq: ["$type", "cat"] }, 1, 0]
                            }
                        }
                    }
                }
            ]),

            // Sản phẩm bán từ Booking (nếu có sản phẩm trong booking)
            Booking.aggregate([
                {
                    $match: {
                        ...dateFilter,
                        status: 'complete',
                        "products": { $exists: true, $not: { $size: 0 } }
                    }
                },
                { $unwind: "$products" },
                {
                    $group: {
                        _id: null,
                        totalSold: { $sum: "$products.quantity" },
                        productCount: { $addToSet: "$products.productId" }
                    }
                },
                {
                    $project: {
                        totalSold: 1,
                        uniqueProducts: { $size: "$productCount" }
                    }
                }
            ]),

            // Sản phẩm bán từ Payment
            Payment.aggregate([
                {
                    $match: {
                        ...dateFilter,
                        status: 1 // Đã thanh toán
                    }
                },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: null,
                        totalSold: { $sum: "$items.quantity" },
                        productCount: { $addToSet: "$items.productId" }
                    }
                },
                {
                    $project: {
                        totalSold: 1,
                        uniqueProducts: { $size: "$productCount" }
                    }
                }
            ]),

            // Các thống kê khác giữ nguyên
            Booking.countDocuments(dateFilter),
            Booking.aggregate([{ $match: dateFilter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
            Booking.countDocuments({ date: { $gte: new Date() }, status: { $ne: 'cancel' } }),
            Account.countDocuments({ ...dateFilter }),
            Account.aggregate([{ $match: dateFilter }, { $unwind: "$role" }, { $group: { _id: "$role", count: { $sum: 1 } } }]),
            Product.countDocuments(dateFilter),
            Pet.countDocuments(dateFilter),
            Pet.aggregate([{ $match: dateFilter }, { $group: { _id: "$type", count: { $sum: 1 } } }]),
            Product.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 }).limit(5),
            Payment.aggregate([
                { $match: dateFilter },
                { $unwind: "$items" },
                { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" }, name: { $first: "$items.name" }, price: { $first: "$items.price" }, imageUrl: { $first: "$items.imageUrl" } } },
                { $sort: { totalSold: -1 } },
                { $limit: 5 }
            ]),
            Account.countDocuments({ ...dateFilter, role: 'customer' }),
            Booking.aggregate([{ $match: { ...dateFilter, "payment.status": true, status: "complete", price: { $exists: true, $gt: 0 } } }, { $group: { _id: null, total: { $sum: "$price" } } }]),
            Payment.aggregate([{ $match: { ...dateFilter, status: 1, totalPrice: { $exists: true, $gt: 0 } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }])
        ]);

        // Xử lý kết quả thú cưng mới
        const newPetsData = newPetsStats[0] || { count: 0, dogs: 0, cats: 0 };

        // Xử lý kết quả sản phẩm bán ra (từ Booking và Payment)
        const bookingProductsData = bookingProductsStats[0] || { totalSold: 0, uniqueProducts: 0 };
        const paymentProductsData = paymentProductsStats[0] || { totalSold: 0, uniqueProducts: 0 };

        const totalProductsSold = bookingProductsData.totalSold + paymentProductsData.totalSold;
        const uniqueProductsSold = new Set([
            ...(bookingProductsData.productCount || []),
            ...(paymentProductsData.productCount || [])
        ]).size;

        // Tính tổng doanh thu
        const bookingRevenueTotal = bookingRevenue[0]?.total || 0;
        const paymentRevenueTotal = paymentRevenue[0]?.total || 0;
        const totalRevenue = bookingRevenueTotal + paymentRevenueTotal;

        // Transform data
        const appointmentStatus = appointmentStatusStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const roles = customerRoleStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const petTypes = petTypeStats.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                timeRange: timeRange || 'all',
                summary: {
                    totalAppointments,
                    upcomingAppointments,
                    totalCustomers,
                    totalProducts,
                    totalPets,
                    newPets: newPetsData.count,
                    newPetsDogs: newPetsData.dogs,
                    newPetsCats: newPetsData.cats,
                    newCustomersThisPeriod,
                    revenueThisPeriod: totalRevenue,
                    productsSold: totalProductsSold,
                    uniqueProductsSold
                },
                details: {
                    appointments: {
                        byStatus: appointmentStatus
                    },
                    customers: {
                        byRole: roles
                    },
                    products: {
                        lowStock: lowStockProducts.map(p => ({
                            id: p._id, name: p.name, quantity: p.quantity, price: p.price
                        })),
                        bestSellers: bestSellingProducts.map(p => ({
                            id: p._id, name: p.name, totalSold: p.totalSold, price: p.price, imageUrl: p.imageUrl
                        }))
                    },
                    pets: {
                        byType: petTypes
                    },
                    revenueSources: {
                        fromBookings: bookingRevenueTotal,
                        fromPayments: paymentRevenueTotal
                    }
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};


module.exports = { GetBookingByTime, getAllRevenueByTime, getDataforCard };