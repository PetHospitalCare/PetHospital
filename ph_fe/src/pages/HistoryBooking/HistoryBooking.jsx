import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookingServices } from "@/services/BookingService";
import { Hand } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function HistoryBooking() {
    const [HBooking, setHBooking] = useState([]);
    const statusMapping = {
        pending: "Chờ xác nhận",
        cancel: "Đã hủy",
        confirm: "Đã xác nhận",
        complete: "Đã hoàn thành",
    };
    const navigate = useNavigate();

    const fetchHBooking = async () => {
        try {
            const response = await BookingServices.GetHistoryBooking();
            if (response.data.success) {
                // Sắp xếp dữ liệu mới nhất
                const sortedBookings = response.data.booking.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setHBooking(sortedBookings);
                console.log(sortedBookings);
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đặt lịch:", error);
        }
    };

    const HandleClick = (bookingId) => {
        navigate(`/medical-detail/${bookingId}`);
    };
    
    useEffect(() => {
        fetchHBooking();
    }, []);

    return (
        <div className="container mx-auto pt-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
            {/* Header */}
            <div className="inline-block bg-[#3F2E2E] px-6 sm:px-12 py-2 text-white text-xl sm:text-2xl font-bold rounded-t">
                Lịch sử đặt lịch
            </div>
            <hr className="h-1 bg-[#3F2E2E] border-none" />

            {/* Booking List */}
            <div className="mt-8 space-y-6 mb-8">
                {HBooking.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex flex-col md:flex-row bg-white rounded border-2 shadow-lg overflow-hidden relative"
                    >
                        {/* Date Box */}
                        <div className="bg-[#E8EFFF] text-[#6B84C2] rounded flex flex-col items-center justify-center p-6 sm:p-8 w-full md:w-40 h-36 sm:h-44">
                            <span className="text-4xl sm:text-6xl font-semibold">
                                {new Date(booking.date).getDate()}
                            </span>
                            <div className="flex flex-col sm:flex-row sm:space-x-1 text-center">
                                <span className="text-base sm:text-lg font-semibold">
                                    {`${String(new Date(booking.date).getMonth() + 1).padStart(2, "0")}/${String(new Date(booking.date).getFullYear()).slice(-2)}`}
                                </span>
                                <span className="text-base sm:text-lg font-semibold">
                                    {booking.hour}
                                </span>
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-4">
                            <p className="font-bold text-xl sm:text-2xl md:text-3xl mb-3">
                                {booking.pet_id.name}
                            </p>
                            <p className="font-medium text-lg sm:text-xl mb-2">
                                {booking.service_id.name}
                            </p>
                            <p className="text-gray-500 text-sm sm:text-base">
                                Chi tiết: {booking.service_id.description}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="absolute top-3 right-6 sm:right-12">
                            <div
                                className={cn(
                                    "font-bold text-sm sm:text-lg",
                                    booking.status === "complete" && "text-green-600",
                                    booking.status === "cancel" && "text-red-600",
                                    booking.status === "confirm" && "text-blue-600",
                                    booking.status === "pending" && "text-orange-500"
                                )}
                            >
                                {statusMapping[booking.status] || "Không xác định"}
                            </div>
                        </div>

                        {/* View Details Button */}
                        <div className="absolute bottom-3 right-6 sm:right-12">
                            {booking.status === "complete" && (
                                <Button
                                    className="mt-2 px-4 py-2 bg-[#5b3131] text-white font-bold rounded text-sm sm:text-base"
                                    onClick={() => HandleClick(booking._id)}
                                >
                                    Xem chi tiết
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
