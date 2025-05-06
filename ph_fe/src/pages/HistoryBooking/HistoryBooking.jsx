import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookingServices } from "@/services/BookingService";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";

export default function HistoryBooking() {
    const [HBooking, setHBooking] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(""); // Trạng thái lọc
    const itemsPerPage = 8; // Số mục mỗi trang

    const statusMapping = {
        pending: "Chờ xác nhận",
        cancel: "Đã hủy",
        confirm: "Chờ khám",
        complete: "Đã hoàn thành",
    };

    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    if (!user) {
        navigate("/login");
    }

    const fetchHBooking = async () => {
        try {
            const response = await BookingServices.GetHistoryBooking();
            if (response.data.success) {
                const sortedBookings = response.data.booking.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setHBooking(sortedBookings);
                setFilteredBookings(sortedBookings); // Khởi tạo danh sách lọc
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đặt lịch:", error);
        }
    };

    const handleFilterChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);

        if (selectedStatus) {
            const filtered = HBooking.filter((booking) => booking?.status === selectedStatus);
            setFilteredBookings(filtered);
        } else {
            setFilteredBookings(HBooking); // Hiển thị tất cả nếu không chọn trạng thái
        }

        setCurrentPage(1); // Reset về trang đầu tiên
    };

    const HandleClick = (bookingId) => {
        navigate(`/medical-detail/${bookingId}`);
    };

    useEffect(() => {
        fetchHBooking();
    }, []);

    // Tính toán dữ liệu phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    return (
        <div className="container mx-auto pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
            {/* Header */}
            <div className="inline-block bg-[#3F2E2E] px-6 sm:px-12 py-2 text-white text-xl sm:text-2xl font-bold rounded-t">
                Lịch sử đặt lịch
            </div>
            <hr className="h-1 bg-[#3F2E2E] border-none" />

            {/* Filter */}
            <div className="mt-6 flex justify-end">
                <select
                    value={statusFilter}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    {Object.entries(statusMapping).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
            </div>

            {/* Booking List */}
            <div className="mt-8 space-y-6 mb-8">
                {currentItems.length > 0 ? (
                    currentItems.map((booking) => (
                        <div
                            key={booking._id}
                            className="flex flex-col md:flex-row bg-white rounded border-2 shadow-lg overflow-hidden relative"
                        >
                            {/* Date Box */}
                            <div className="bg-[#E8EFFF] text-[#6B84C2] rounded flex flex-col items-center justify-center p-6 sm:p-8 w-full md:w-40 h-36 sm:h-44">
                                <span className="text-4xl sm:text-6xl font-semibold">
                                    {new Date(booking?.date).getDate()}
                                </span>
                                <div className="flex flex-col sm:flex-row sm:space-x-1 text-center">
                                    <span className="text-base sm:text-lg font-semibold">
                                        {`${String(new Date(booking?.date).getMonth() + 1).padStart(2, "0")}/${String(new Date(booking?.date).getFullYear()).slice(-2)}`}
                                    </span>
                                    <span className="text-base sm:text-lg font-semibold">
                                        {booking?.hour}
                                    </span>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1 p-4">
                                <p className="font-bold text-xl sm:text-2xl md:text-3xl mb-3">
                                    {booking?.pet_id?.name}
                                </p>
                                <p className="font-medium text-lg sm:text-xl mb-2">
                                    {booking?.service_id?.name}
                                </p>
                                <p className="text-gray-500 text-sm sm:text-base">
                                    Chi tiết: {booking?.service_id?.description}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="absolute top-3 right-6 sm:right-12">
                                <div
                                    className={cn(
                                        "font-bold text-sm sm:text-lg",
                                        booking?.status === "complete" && "text-green-600",
                                        booking?.status === "cancel" && "text-red-600",
                                        booking?.status === "confirm" && "text-blue-600",
                                        booking?.status === "pending" && "text-orange-500"
                                    )}
                                >
                                    {statusMapping[booking?.status] || "Không xác định"}
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="absolute bottom-3 right-6 sm:right-12">
                                {booking?.status === "complete" && (
                                    <Button
                                        className="mt-2 px-4 py-2 bg-[#5b3131] text-white font-bold rounded text-sm sm:text-base"
                                        onClick={() => HandleClick(booking._id)}
                                    >
                                        Xem chi tiết
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-600 text-lg">
                            Hiện thú cưng của bạn chưa có lịch khám. Hãy đặt lịch khám cho thú cưng của bạn!
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                    >
                        Trước
                    </Button>
                    <span className="text-sm font-medium">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
                    >
                        Sau
                    </Button>
                </div>
            )}
        </div>
    );
}
