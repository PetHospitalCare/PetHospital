import { useState, useEffect } from "react"
import { QrCode, CreditCard, CheckCircle2, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { QRCodeSVG } from 'qrcode.react';
import { socket } from "../../App"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { BookingServices } from "@/services/BookingService"
import { set } from "date-fns"


export default function PaymentDialog({ open, onOpenChange, booking, onPaymentComplete }) {
    const [paymentMethod, setPaymentMethod] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState("pending")
    const [qrCode, setQrCode] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [orderCode, setOrderCode] = useState(null)
    const handlePaymentMethodChange = async (value) => {
        setPaymentMethod(value)
        if (value === "cash") {
            setPaymentStatus("pending")
        } else if (value === "transfer") {
            try {
                setIsLoading(true)
                const response = await BookingServices.CreatePaymentBooking(booking?._id)
                if (response.status === 200) {
                    setQrCode(response.data.qrcode)
                    setOrderCode(response.data.ordercode)
                }
            } catch (error) {
                toast.error("Không thể tạo mã QR")
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
    }
    const handleCashPaymentSuccess = async () => {
        try {
            const response = await BookingServices.UpdatePayByCash(booking?._id)
            if (response.status === 200) {
                setPaymentStatus("success")
                // toast.success("Thanh toán thành công!")
                onPaymentComplete()
            }
        } catch (error) {
            toast.error("Thanh toán thất bại!")
        }
    }
    const resetDialog = () => {
        setPaymentMethod(null)
        setPaymentStatus("pending")
        onPaymentComplete()
        onOpenChange(false)
    }
    useEffect(() => {
        socket.on("payment_success", (updatedBooking) => {
            if (updatedBooking._id === booking?._id && updatedBooking.payment.status === true) {
                setPaymentStatus("success")
            }
        });
        return () => {
            socket.off("payment_success");
        };
    }, [booking?._id])
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Phương thức thanh toán</DialogTitle>
                    <DialogDescription>Chọn phương thức thanh toán của bạn</DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup value={paymentMethod || ""} onValueChange={handlePaymentMethodChange} className="gap-4">
                        <div className="flex items-center space-x-2 rounded-md border p-4">
                            <RadioGroupItem value="cash" id="cash" disabled={paymentStatus === "success"} />
                            <Label htmlFor="cash" className="flex items-center gap-2 font-medium">
                                <Banknote className="h-5 w-5" />
                                Tiền mặt
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2 rounded-md border p-4">
                            <RadioGroupItem value="transfer" id="transfer" disabled={paymentStatus === "success"} />
                            <Label htmlFor="transfer" className="flex items-center gap-2 font-medium">
                                <CreditCard className="h-5 w-5" />
                                Chuyển khoản
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {paymentMethod === "transfer" && paymentStatus === "pending" && (
                    <div className="mt-2 mb-4">
                        <Card className="border shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Thông tin chuyển khoản</CardTitle>
                                <CardDescription>Quét mã QR hoặc chuyển khoản theo thông tin bên dưới</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="flex justify-center py-2">
                                    <div className="bg-white p-3 rounded-md border">
                                        {isLoading ? (
                                            <div className="h-28 w-28 flex items-center justify-center">
                                                <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        ) : qrCode ? (
                                            <QRCodeSVG
                                                value={qrCode}
                                                size={200}
                                                level="H"
                                                includeMargin={true}
                                            />
                                        ) : (
                                            <div className="h-28 w-28 flex items-center justify-center text-sm text-muted-foreground">
                                                Không thể tải mã QR
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="grid gap-2 text-sm">
                                    <div className="grid grid-cols-3 gap-1">
                                        <p className="font-medium">Ngân hàng:</p>
                                        <p className="col-span-2">MB Bank</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        <p className="font-medium">Số tài khoản:</p>
                                        <p className="col-span-2">0839440702</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        <p className="font-medium">Chủ tài khoản:</p>
                                        <p className="col-span-2">VU HONG MINH</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        <p className="font-medium">Nội dung CK:</p>
                                        <p className="col-span-2">Thanh toán {orderCode}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        <p className="font-medium">Số tiền:</p>
                                        <p className="col-span-2 font-medium text-primary">
                                            {booking?.price?.toLocaleString()}đ
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            {/* <CardFooter className="pt-2">
                                <Button className="w-full" onClick={handleClose} disabled={isLoading}>
                                    Đã chuyển khoản xong
                                </Button>
                            </CardFooter> */}
                        </Card>
                    </div>
                )}
                {paymentMethod === "transfer" && paymentStatus === "success" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Thanh toán thành công!</h3>
                            <p className="text-sm text-muted-foreground">Đã nhận thanh toán tiền chuyển khoản!.</p>
                        </div>
                        <Button onClick={resetDialog}>Đóng</Button>
                    </div>
                )}

                {paymentMethod === "cash" && paymentStatus === "pending" && (
                    <div className="flex flex-col items-center gap-4 py-2">
                        <p className="text-center text-sm text-muted-foreground">
                            Vui lòng thanh toán số tiền bằng tiền mặt cho nhân viên.
                        </p>
                        <Button onClick={handleCashPaymentSuccess}>Đánh dấu đã thanh toán</Button>
                    </div>
                )}


                {paymentMethod === "cash" && paymentStatus === "success" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                        <div className="text-center">
                            <h3 className="text-lg font-medium">Thanh toán thành công!</h3>
                            <p className="text-sm text-muted-foreground">Đã nhận thanh toán tiền mặt.</p>
                        </div>
                        <Button onClick={resetDialog}>Đóng</Button>
                    </div>
                )}

                <DialogFooter className="sm:justify-start">
                    {paymentMethod && paymentStatus !== "success" && (
                        <Button variant="outline" onClick={resetDialog}>
                            Hủy
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}