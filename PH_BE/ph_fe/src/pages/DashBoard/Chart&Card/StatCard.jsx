// StatCard.jsx
import { CalendarDays, DollarSign, Dog, ActivitySquare } from "lucide-react"
const icons = {
    calendar: CalendarDays,
    dollar: DollarSign,
    pet: Dog,
    service: ActivitySquare
}

export default function StatCard({ title, value, subValue, icon, isCurrency }) {
    const Icon = icons[icon]

    const formattedValue = isCurrency
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        : value?.toLocaleString('vi-VN')

    return (
        <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold">{formattedValue}</div>
                <p className="text-xs text-muted-foreground">{subValue}</p>
            </div>
        </div>
    )
}