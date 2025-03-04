import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Page from "@/app/dashboard/page";
const HOURS = [
    "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "13:00",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];
const BREAK_HOURS = ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30"];
const DAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

// Sample appointment data
const appointments = [
    { id: 1, title: "Khám định kỳ", startHour: "10:00", duration: 60, color: "bg-blue-100 text-blue-700", date: new Date(2025, 1, 26) },
    { id: 2, title: "Tiêm phòng", startHour: "14:15", duration: 120, color: "bg-green-100 text-green-700", date: new Date(2025, 1, 28) },
    { id: 3, title: "Kiểm tra sức khỏe", startHour: "10:10", duration: 30, color: "bg-red-100 text-red-700", date: new Date(2025, 1, 26) },
];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(() => {
        const today = new Date();
        return new Date(today.setDate(today.getDate() - ((today.getDay() + 6) % 7)));
    });

    const getWeekStart = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        return d;
    };

    const getDateRangeText = () => {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        return `${weekStart.getDate()}/${weekStart.getMonth() + 1} – ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}, ${weekEnd.getFullYear()}`;
    };

    const navigateWeek = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + direction * 7);
        setCurrentDate(newDate);
    };

    const today = new Date();
    const weekStart = getWeekStart(currentDate);

    return (
        <Page>
            <div className="container mx-auto p-4">
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
                                        const getMinutes = (time) => {
                                            const [hour, minute] = time.split(":").map(Number);
                                            return hour * 60 + minute;
                                        };

                                        const eventStartMinutes = getMinutes(event.startHour);
                                        const startIdx = HOURS.reduce((prevIdx, h, idx) => {
                                            return getMinutes(h) <= eventStartMinutes ? idx : prevIdx;
                                        }, 0);


                                        const endIdx = startIdx + event.duration / 30;

                                        return (
                                            eventDate >= weekStart &&
                                            eventDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000) &&
                                            eventDate.getDay() === (index + 1) % 7 &&
                                            rowIndex >= startIdx &&
                                            rowIndex < endIdx
                                        );
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
                                                const eventEndMinutes = eventStartMinutes + event.duration;

                                                // Tìm index gần nhất của giờ kết thúc
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
                                                            gridRow: `span ${event.duration / 30}`,
                                                        }}
                                                    >
                                                        <div className="font-semibold">{event.title}</div>
                                                        <div className="text-xs">{event.startHour} - {endHour}</div>
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
            </div>
        </Page>
    );
}
