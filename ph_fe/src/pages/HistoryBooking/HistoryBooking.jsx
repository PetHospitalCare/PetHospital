import { cn } from "@/lib/utils";
import { BookingServices } from "@/services/BookingService";
import { useEffect, useState } from "react";

export default function HistoryBooking() {
    const [HBooking, setHBooking] = useState([]);
    const statusMapping = {
        pending: "Chờ xác nhận",
        cancel: "Đã hủy",
        confirm: "Đã xác nhận",
        complete: "Đã hoàn thành",
    };
    const fetchHBooking = async () => {
        try {
            const response = await BookingServices.GetHistoryBooking()
            if (response.data.success) {
                setHBooking(response.data.booking);
            }
            console.log(response.data.booking)
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
        }
    };
    useEffect(() => {
        fetchHBooking();
    }, []);

    return (
        <div className="container mx-auto pt-28 px-20">

            {/* Header */}
            <div className="inline-block bg-[#3F2E2E] px-12 py-2 text-white text-2xl font-bold rounded-t">
                Lịch sử đặt lịch
            </div>
            <hr className="h-1 bg-[#3F2E2E] border-none" />
            {/* Booking List */}
            <div className="mt-8 space-y-4">
                {HBooking.map((booking) => (
                    <div
                        key={booking.id}
                        className="flex bg-white rounded border-2 shadow-lg overflow-hidden relative"
                    >
                        {/* Date Box */}
                        <div className="bg-[#E8EFFF] text-[#6B84C2] rounded flex flex-col items-center justify-center p-12 w-40 h-44">
                            <span className="text-6xl font-semibold">{new Date(booking.date).getDate()}</span>
                            <div className="flex space-x-1">
                                <span className="text-lg font-semibold">
                                    {`${String(new Date(booking.date).getMonth() + 1).padStart(2, "0")}/${String(new Date(booking.date).getFullYear()).slice(-2)}`}
                                </span>
                                <span className="text-lg font-semibold"> {booking.hour}</span>
                            </div>

                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-4 pb-0">
                            <p className="font-bold text-3xl ml-10 mb-5">{booking.pet_id.name}</p>
                            <p className="font-medium text-xl ml-10">{booking.service_id.name}</p>
                            <p className="text-gray-500 text-xl ml-10">Chi tiết: {booking.note}</p>
                        </div>

                        {/* Status */}
                        <div className="absolute top-3 right-12">
                            <div
                                className={cn(
                                    "font-bold text-red-600 text-xl",
                                    booking.status === "complete" && "text-green-600",
                                    booking.status === "cancel" && "text-red-600",
                                    booking.status === "confirm" && "text-blue-600",
                                    booking.status === "pending" && "text-orange-500"
                                )}
                            >
                                {statusMapping[booking.status] || "Không xác định"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
