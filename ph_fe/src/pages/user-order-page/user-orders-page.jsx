import React, { useState, useEffect, useContext } from 'react';
import { PaymentService } from "@/services/PaymentService.js";
import { UserContext } from "@/contexts/UserContext.jsx";

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(UserContext);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    // Modal xác nhận hủy đơn hàng
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    // Lọc theo khoảng thời gian
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Sắp xếp
    const [sortField, setSortField] = useState('date'); // date hoặc price
    const [sortDirection, setSortDirection] = useState('desc'); // asc hoặc desc

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && user._id) {
                try {
                    const response = await PaymentService.getPaymentsByUserId(user._id);
                    if (response && response.data && response.data.payments) {
                        setOrders(response.data.payments);
                    }
                } catch (error) {
                    console.error("Error fetching orders:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrders();
    }, [user]);

    // Chuyển đổi mã trạng thái số sang chuỗi trạng thái
    const mapStatusToString = (statusCode) => {
        const statusMap = {
            0: "cancelled", // Thanh toán không thành công
            "-1": "cancelled", // Thanh toán không thành công
            1: "pending", // Chờ giao hàng
            2: "completed", // Hoàn thành
            "-2": "cancelled" // Bị hủy
        };

        return statusMap[statusCode] || "unknown";
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Lọc đơn hàng theo trạng thái, từ khóa tìm kiếm, khoảng thời gian, sau đó sắp xếp
    const filteredOrders = orders
        .filter(order => {
            const orderStatus = mapStatusToString(order.status);

            // Lọc theo trạng thái
            if (activeTab !== 'all' && orderStatus !== activeTab) return false;

            // Lọc theo từ khóa tìm kiếm
            if (searchTerm && !order._id.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            // Lọc theo khoảng thời gian
            const orderDate = new Date(order.createdAt);
            if (startDate && orderDate < new Date(startDate)) return false;
            if (endDate) {
                // Thêm 1 ngày vào endDate để bao gồm cả ngày cuối cùng
                const endDateObj = new Date(endDate);
                endDateObj.setDate(endDateObj.getDate() + 1);
                if (orderDate > endDateObj) return false;
            }

            return true;
        })
        .sort((a, b) => {
            // Sắp xếp theo trường đã chọn
            if (sortField === 'date') {
                return sortDirection === 'desc'
                    ? new Date(b.createdAt) - new Date(a.createdAt)
                    : new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortField === 'price') {
                const totalA = a.totalPrice + (a.shipFee || 0);
                const totalB = b.totalPrice + (b.shipFee || 0);
                return sortDirection === 'desc'
                    ? totalB - totalA
                    : totalA - totalB;
            }
            return 0;
        });

    // Tính toán các đơn hàng hiển thị trên trang hiện tại
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    // Hiển thị trạng thái với màu sắc tương ứng
    const getStatusBadge = (statusCode) => {
        const status = mapStatusToString(statusCode);

        const statusConfig = {
            completed: { text: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
            pending: { text: 'Chờ giao hàng', color: 'bg-blue-100 text-blue-800' },
            cancelled: { text: 'Không thành công/Đã hủy', color: 'bg-red-100 text-red-800' },
            unknown: { text: 'Không xác định', color: 'bg-gray-100 text-gray-800' }
        };

        const config = statusConfig[status];

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    // Format số tiền
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Tabs cho trạng thái đơn hàng
    const tabs = [
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ giao hàng' },
        { id: 'completed', label: 'Hoàn thành' },
        { id: 'cancelled', label: 'Không thành công/Đã hủy' }
    ];

    // Chi tiết đơn hàng
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(orderId);
        }
    };

    // Đổi trang
    const paginate = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Cuộn lên đầu danh sách khi đổi trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Hiển thị nút phân trang
    const renderPaginationButtons = () => {
        const buttons = [];

        // Nút Previous
        buttons.push(
            <button
                key="prev"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                &laquo;
            </button>
        );

        // Hiển thị tối đa 5 nút trang
        const maxVisibleButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        // Điều chỉnh lại nếu không đủ nút bên phải
        if (endPage - startPage + 1 < maxVisibleButtons) {
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }

        // Thêm nút trang đầu và dấu ... nếu cần
        if (startPage > 1) {
            buttons.push(
                <button
                    key="1"
                    onClick={() => paginate(1)}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="start-ellipsis" className="px-2 py-1">
                        ...
                    </span>
                );
            }
        }

        // Thêm các nút trang chính
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => paginate(i)}
                    className={`px-3 py-1 rounded-md ${currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                >
                    {i}
                </button>
            );
        }

        // Thêm dấu ... và nút trang cuối nếu cần
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="end-ellipsis" className="px-2 py-1">
                        ...
                    </span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                    {totalPages}
                </button>
            );
        }

        // Nút Next
        buttons.push(
            <button
                key="next"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                &raquo;
            </button>
        );

        return buttons;
    };

    return (
        <div className="pt-40" style={{ backgroundColor: "#fef6e9" }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Đơn hàng của tôi</h1>

                {/* Tìm kiếm và lọc */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-24">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm theo mã đơn hàng..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
                            }}
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setCurrentPage(1); // Reset về trang đầu tiên khi chuyển tab
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lọc và sắp xếp nâng cao */}
                <div className="mb-6 p-4 bg-white rounded-lg shadow">
                    <h3 className="font-medium text-gray-700 mb-3">Bộ lọc nâng cao</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Lọc theo khoảng thời gian */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input
                                type="date"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                value={endDate}
                                min={startDate} // Không cho chọn ngày trước start date
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Sắp xếp */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                value={sortField}
                                onChange={(e) => {
                                    setSortField(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="date">Ngày đặt hàng</option>
                                <option value="price">Tổng tiền</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                            <select
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                value={sortDirection}
                                onChange={(e) => {
                                    setSortDirection(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="desc">Giảm dần</option>
                                <option value="asc">Tăng dần</option>
                            </select>
                        </div>
                    </div>

                    {/* Nút reset bộ lọc */}
                    {(startDate || endDate || sortField !== 'date' || sortDirection !== 'desc') && (
                        <div className="mt-3 flex justify-end">
                            <button
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
                                onClick={() => {
                                    setStartDate('');
                                    setEndDate('');
                                    setSortField('date');
                                    setSortDirection('desc');
                                    setCurrentPage(1);
                                }}
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    )}
                </div>

                {/* Danh sách đơn hàng */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">Không tìm thấy đơn hàng</h3>
                        <p className="mt-2 text-gray-500">Không có đơn hàng nào phù hợp với tiêu chí tìm kiếm.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentOrders.map(order => (
                            <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
                                <div
                                    className="p-4 cursor-pointer hover:bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                                    onClick={() => toggleOrderDetails(order._id)}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-800">Đơn hàng {order._id.substring(order._id.length - 8)}</h3>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Ngày đặt: {formatDate(order.createdAt)}</p>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-4">
                                        <span className="font-bold text-lg">{formatCurrency(order.totalPrice + (order.shipFee || 0))}</span>
                                        <svg
                                            className={`h-5 w-5 text-gray-500 transition-transform ${expandedOrderId === order._id ? 'transform rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                {/* Chi tiết đơn hàng */}
                                {expandedOrderId === order._id && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Chi tiết sản phẩm</h4>
                                        <div className="divide-y divide-gray-200">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="py-3 flex justify-between">
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                                                    </div>
                                                    <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {order.shipFee > 0 && (
                                            <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                                                <span className="text-gray-600">Phí vận chuyển:</span>
                                                <span className="font-medium">{formatCurrency(order.shipFee)}</span>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                                            <span className="font-semibold">Tổng cộng:</span>
                                            <span className="font-bold text-lg">{formatCurrency(order.totalPrice + (order.shipFee || 0))}</span>
                                        </div>

                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {order.status === 2 && (
                                                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                                                    Đánh giá
                                                </button>
                                            )}
                                            {order.status === 1 && (
                                                <button
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Ngăn sự kiện click lan tỏa
                                                        setOrderToCancel(order);
                                                        setShowCancelModal(true);
                                                    }}
                                                >
                                                    Hủy đơn
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Phân trang */}
                        {filteredOrders.length > ordersPerPage && (
                            <div className="flex justify-center mt-8 gap-2">
                                {renderPaginationButtons()}
                            </div>
                        )}

                        {/* Thông tin phân trang */}
                        {filteredOrders.length > 0 && (
                            <div className="text-center text-sm text-gray-600 mt-4">
                                Hiển thị {indexOfFirstOrder + 1} đến {Math.min(indexOfLastOrder, filteredOrders.length)} { }
                                trong tổng số {filteredOrders.length} đơn hàng
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal xác nhận hủy đơn hàng */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Xác nhận hủy đơn hàng</h3>
                        <p className="text-gray-700 mb-6">
                            Bạn có chắc chắn muốn hủy đơn hàng {orderToCancel?._id.substring(orderToCancel._id.length - 8)}? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                                onClick={() => setShowCancelModal(false)}
                            >
                                Đóng
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                onClick={() => {
                                    // Thực hiện gọi API hủy đơn hàng ở đây
                                    console.log("Hủy đơn hàng", orderToCancel?._id);

                                    // TODO: Thêm logic gọi API hủy đơn hàng
                                    // const cancelOrder = async () => {
                                    //     try {
                                    //         await PaymentService.cancelOrder(orderToCancel._id);
                                    //         // Cập nhật trạng thái đơn hàng trong danh sách
                                    //         setOrders(prevOrders => prevOrders.map(order =>
                                    //             order._id === orderToCancel._id ? {...order, status: -2} : order
                                    //         ));
                                    //     } catch (error) {
                                    //         console.error("Error cancelling order:", error);
                                    //     }
                                    // };
                                    // cancelOrder();

                                    setShowCancelModal(false);
                                    setOrderToCancel(null);
                                }}
                            >
                                Xác nhận hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrdersPage;