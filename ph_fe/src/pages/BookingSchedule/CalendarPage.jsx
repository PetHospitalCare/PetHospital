import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Services } from "@/services/Services";
import { BookingServices } from "@/services/BookingService";
import MedicalExaminationDialog from "../MedicalExamination/Medicalexamination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const HOURS = [
    "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "13:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];
const BREAK_HOURS = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];
const DAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    });
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    // Fetch all services
    const getAllService = async () => {
        try {
            const res = await Services.getAllService();
            if (res.data.success) {
                setServices(res.data.services);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu services:", error);
        }
    };

    // Fetch all bookings and format appointments
    const fetchBookings = async () => {
        try {
            setLoading(true);

            const response = await BookingServices.GetAllBooking();

            const formattedAppointments = response.data.map(booking => {
                const subService = getSubService(booking.service_id, booking.sub_service_id);
                let color;
                let status;

                if (booking.status === 'cancel') {
                    color = "bg-red-100 text-red-700";
                    status = 'cancel';
                } else {
                    color = booking.payment.status ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700";
                    status = booking.payment.status;
                }

                return {
                    id: booking._id,
                    owner: booking?.guest_name || "Không có tên",
                    title: subService?.name || "Không tìm thấy dịch vụ",
                    doctor: booking?.doctor_id?.username || "Không có bác sĩ",
                    startHour: booking.hour,
                    duration: subService?.duration || 30,
                    color: color,
                    date: new Date(booking.date),
                    status: status
                };
            });
            setAppointments(formattedAppointments);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu booking:", error);
        }
    };
    console.log(appointments);
    // Get sub-service information
    const getSubService = (serviceId, subServiceId) => {
        const service = services.find(s => s._id === serviceId);
        if (!service) return null;

        const subService = service.subServices.find(sub => sub._id === subServiceId);
        return subService || null;
    };

    // Fetch data on component mount
    useEffect(() => {
        getAllService();
    }, []);

    useEffect(() => {
        if (services.length > 0) {
            fetchBookings();
        }
    }, [services]);

    // Get the start of the week
    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        // Điều chỉnh để Thứ 2 là ngày đầu tuần (1)
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    // Get the date range text for the current week
    const getDateRangeText = () => {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        return `${weekStart.getDate()}/${weekStart.getMonth() + 1} – ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}, ${weekEnd.getFullYear()}`;
    };

    // Navigate to the previous or next week
    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const today = new Date();
    const weekStart = getWeekStart(currentDate);
    const isEventToday = (eventDate) => {
        const today = new Date();
        const event = new Date(eventDate);
        return (
            event.getDate() === today.getDate() &&
            event.getMonth() === today.getMonth() &&
            event.getFullYear() === today.getFullYear()
        );
    };
    return (
        <div className="container mx-auto p-4">
            {loading ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Đang tải lịch khám...</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <h2 className="text-xl font-semibold">{getDateRangeText()}</h2>
                            <Button variant="outline" onClick={() => setCurrentDate(getWeekStart(new Date()))}>
                                Today
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-100 rounded"></div>
                                <span className="text-sm text-gray-600">Đã khám</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                                <span className="text-sm text-gray-600">Chờ khám</span>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg">
                        <div className="grid grid-cols-8 border-b">
                            <div className="p-4 border-r"></div>
                            {DAYS.map((day, index) => {
                                const dayDate = new Date(weekStart);
                                dayDate.setDate(weekStart.getDate() + index);
                                const isToday = dayDate.toDateString() === today.toDateString();

                                return (
                                    <div key={day} className="p-4 text-center border-r last:border-r-0">
                                        <div className={cn("font-medium", isToday && "text-red-500 font-bold")}>
                                            {day} {dayDate.getDate()}/{dayDate.getMonth() + 1}
                                            {isToday && <span className="ml-1"></span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="relative">
                            {HOURS.map((hour, rowIndex) => (
                                <div key={hour} className="grid grid-cols-8">
                                    <div className="p-4 border-r border-t text-sm text-muted-foreground">
                                        {hour}
                                    </div>
                                    {DAYS.map((_, index) => {
                                        const filteredAppointments = appointments.filter(event => {
                                            const eventDate = new Date(event.date);
                                            const currentDate = new Date(weekStart);
                                            currentDate.setDate(weekStart.getDate() + index);

                                            const getMinutes = (time) => {
                                                const [hour, minute] = time.split(":").map(Number);
                                                return hour * 60 + minute;
                                            };

                                            const eventStartMinutes = getMinutes(event.startHour);
                                            const currentSlotMinutes = getMinutes(hour);

                                            // So sánh chính xác ngày tháng năm
                                            const isSameDay =
                                                eventDate.getFullYear() === currentDate.getFullYear() &&
                                                eventDate.getMonth() === currentDate.getMonth() &&
                                                eventDate.getDate() === currentDate.getDate();

                                            // Debug để kiểm tra
                                            console.log({
                                                eventDate: eventDate.toLocaleDateString(),
                                                currentDate: currentDate.toLocaleDateString(),
                                                isSameDay,
                                                hour,
                                                eventHour: event.startHour,
                                                timeMatch: eventStartMinutes === currentSlotMinutes
                                            });

                                            return isSameDay && eventStartMinutes === currentSlotMinutes;
                                        });
                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "relative border-r last:border-r-0 border-t p-2 min-h-[50px] flex flex-wrap gap-1",
                                                    BREAK_HOURS.includes(hour) && "bg-gray-200 opacity-50 pointer-events-none relative"
                                                )}
                                            >
                                                {BREAK_HOURS.includes(hour) && <span className="absolute inset-0 flex items-center justify-center text-gray-500">Nghỉ trưa</span>}
                                                {filteredAppointments.map((event) => {
                                                    const getMinutes = (time) => {
                                                        const [hour, minute] = time.split(":").map(Number);
                                                        return hour * 60 + minute;
                                                    };

                                                    const eventStartMinutes = getMinutes(event.startHour);
                                                    const eventEndMinutes = eventStartMinutes + 30;

                                                    const endHourIndex = HOURS.reduce((prevIdx, h, idx) => {
                                                        return getMinutes(h) <= eventEndMinutes ? idx : prevIdx;
                                                    }, 0);

                                                    const endHour = HOURS[endHourIndex] || "Unknown";

                                                    return (
                                                        <div
                                                            key={event.id}
                                                            className={cn("rounded-md p-2 text-sm", event.color)}
                                                            style={{
                                                                flex: `1 1 ${100 / filteredAppointments.length}%`,
                                                                minWidth: "48px",

                                                            }}
                                                        // onClick={() => {
                                                        //     setSelectedAppointment(event);
                                                        //     setIsDialogOpen(true);
                                                        // }}
                                                        >
                                                            <div className="font-semibold truncate">{event.title}</div>
                                                            <div className="text-xs">{event.startHour} - {endHour} ({event.owner})</div>
                                                            <div className="text-xs mt-1 italic border-t pt-1 truncate">
                                                                <span className="font-medium">BS:</span> {event.doctor}
                                                            </div>
                                                            {event.status ? (
                                                                <div className="flex items-center gap-1 text-xs text-green-700 mt-2 font-medium bg-green-50 p-1.5 rounded-md">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                    <span>Đã khám xong</span>
                                                                </div>
                                                            ) : (
                                                                isEventToday(event.date) ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="mt-2 px-3 py-1 text-xs w-full justify-center hover:bg-primary hover:text-white transition-colors"
                                                                        onClick={() => {
                                                                            setLoading(true);
                                                                            setSelectedAppointment(event);
                                                                            setIsDialogOpen(true);
                                                                            setTimeout(() => setLoading(false), 500);
                                                                        }}
                                                                        disabled={loading}
                                                                    >
                                                                        {loading ? (
                                                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                                        ) : (
                                                                            <ChevronRight className="w-3 h-3 mr-1" />
                                                                        )}
                                                                        {loading ? "Đang tải..." : "Khám bệnh"}
                                                                    </Button>
                                                                ) : (
                                                                    <div className="flex items-center gap-1 text-xs text-yellow-700 mt-2 font-medium bg-yellow-50 p-1.5 rounded-md">
                                                                        <Clock className="w-4 h-4" />
                                                                        <span>Chờ khám</span>
                                                                    </div>
                                                                )
                                                            )}
                                                            {/* <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2 px-3 py-1 text-xs"
                                                        onClick={() => {
                                                            setSelectedAppointment(event);
                                                            setIsDialogOpen(true);
                                                        }}
                                                    >
                                                        <ChevronRight className="w-3 h-3 mr-1" /> Khám bệnh
                                                    </Button> */}


                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <MedicalExaminationDialog
                open={isDialogOpen}
                onOpenChange={() => setIsDialogOpen(false)}
                appointment={selectedAppointment}
            />
        </div>
    );
}