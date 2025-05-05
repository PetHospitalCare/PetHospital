import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
export function PetInfo({ petInfo }) {
    return (
        <Card>
            <CardHeader className="py-3">
                <CardTitle className="text-base">Thông tin thú cưng</CardTitle>
            </CardHeader>
            <CardContent className="py-2 space-y-2 text-sm">
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Tên vật nuôi:</span>
                    <span className="font-medium">{petInfo?.name}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Loại:</span>
                    <span>{petInfo?.type == "dog" ? "Chó" : "Mèo"}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Giống:</span>
                    <span>{petInfo?.breed}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Ngày sinh:</span>
                    <span>
                        {petInfo?.dob ? format(new Date(petInfo.dob), "dd-MM-yyyy") : ""}
                    </span>
                    {/* <span>{petInfo?.dob}</span> */}
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Giới tính:</span>
                    <span>{petInfo?.gender}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Cân nặng (kg):</span>
                    <span>{petInfo?.weight}</span>
                </div>
                <Separator className="my-1" />
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Chủ nuôi:</span>
                    <span>{petInfo?.ownerName}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">SĐT:</span>
                    <span>{petInfo?.phone}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Ghi chú:</span>
                    <span>{petInfo?.note}</span>
                </div>
            </CardContent>
        </Card>
    )
}

