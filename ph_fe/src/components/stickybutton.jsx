import { CalendarCheck } from "lucide-react"
export default function Stickybutton() {
    return (
        <button className="fixed bottom-4 left-4 bg-[#3F2E2E] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <CalendarCheck></CalendarCheck> Đặt lịch ngay
        </button>
    )
}