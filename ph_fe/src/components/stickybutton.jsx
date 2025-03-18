import { CalendarCheck } from "lucide-react"
import { useContext, useState } from "react"
import { UserContext } from "@/contexts/UserContext"
import BookingDialog from "./Booking-modal"

export default function StickyButton() {
    const { user } = useContext(UserContext);
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-4 left-4 bg-[#3F2E2E] text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg"
            >
                <CalendarCheck className="w-5 h-5" /> Đặt lịch ngay
            </button>

            <BookingDialog open={open} onClose={() => setOpen(false)} />
        </>
    )
}
