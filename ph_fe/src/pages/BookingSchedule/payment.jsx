"use client"

import { useState, useEffect } from "react"
import { CreditCard, CheckCircle2, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"
import { socket } from "../../App"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { BookingServices } from "@/services/BookingService"
import { motion, AnimatePresence } from "framer-motion"

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
        })
        return () => {
            socket.off("payment_success")
        }
    }, [booking?._id])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 },
        },
    }

    const successVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5,
            },
        },
    }

    const checkmarkVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeInOut",
                delay: 0.2,
            },
        },
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Phương thức thanh toán</DialogTitle>
                    <DialogDescription>Chọn phương thức thanh toán của bạn</DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <RadioGroup value={paymentMethod || ""} onValueChange={handlePaymentMethodChange} className="gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center space-x-2 rounded-md border p-4"
                        >
                            <RadioGroupItem value="cash" id="cash" disabled={paymentStatus === "success"} />
                            <Label htmlFor="cash" className="flex items-center gap-2 font-medium">
                                <Banknote className="h-5 w-5" />
                                Tiền mặt
                            </Label>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="flex items-center space-x-2 rounded-md border p-4"
                        >
                            <RadioGroupItem value="transfer" id="transfer" disabled={paymentStatus === "success"} />
                            <Label htmlFor="transfer" className="flex items-center gap-2 font-medium">
                                <CreditCard className="h-5 w-5" />
                                Chuyển khoản
                            </Label>
                        </motion.div>
                    </RadioGroup>
                </div>

                <AnimatePresence mode="wait">
                    {paymentMethod === "transfer" && paymentStatus === "pending" && (
                        <motion.div
                            key="transfer-pending"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="mt-2 mb-4"
                        >
                            <Card className="border shadow-sm">
                                <CardHeader className="pb-2">
                                    <motion.div variants={itemVariants}>
                                        <CardTitle className="text-lg">Thông tin chuyển khoản</CardTitle>
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <CardDescription>Quét mã QR hoặc chuyển khoản theo thông tin bên dưới</CardDescription>
                                    </motion.div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-0">
                                    <motion.div variants={itemVariants} className="flex justify-center py-2">
                                        <div className="bg-white p-3 rounded-md border">
                                            {isLoading ? (
                                                <div className="h-28 w-28 flex items-center justify-center">
                                                    <svg
                                                        className="animate-spin h-6 w-6 text-primary"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            ) : qrCode ? (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <QRCodeSVG value={qrCode} size={200} level="H" includeMargin={true} />
                                                </motion.div>
                                            ) : (
                                                <div className="h-28 w-28 flex items-center justify-center text-sm text-muted-foreground">
                                                    Không thể tải mã QR
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                    <motion.div variants={itemVariants} className="grid gap-2 text-sm">
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="font-medium">Ngân hàng:</p>
                                            <p className="col-span-2">MB Bank</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1">
                                            <p className="font-medium">Số tài khoản:</p>
                                            <p className="col-span-2">0123456789</p>
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
                                            <p className="col-span-2 font-medium text-primary">{booking?.price?.toLocaleString()}đ</p>
                                        </div>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {paymentMethod === "transfer" && paymentStatus === "success" && (
                        <motion.div
                            key="transfer-success"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex flex-col items-center gap-4 py-4"
                        >
                            <motion.div variants={successVariants} className="relative flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1.2, 1],
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        times: [0, 0.6, 1],
                                        ease: "easeInOut",
                                    }}
                                    className="absolute h-16 w-16 bg-green-100 rounded-full"
                                />
                                <motion.div className="relative z-10">
                                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                                </motion.div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="text-center">
                                <h3 className="text-lg font-medium">Thanh toán thành công!</h3>
                                <p className="text-sm text-muted-foreground">Đã nhận thanh toán tiền chuyển khoản!</p>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button onClick={resetDialog}>Đóng</Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {paymentMethod === "cash" && paymentStatus === "pending" && (
                        <motion.div
                            key="cash-pending"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex flex-col items-center gap-4 py-2"
                        >
                            <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
                                Vui lòng thanh toán số tiền bằng tiền mặt cho nhân viên.
                            </motion.p>
                            <motion.div variants={itemVariants}>
                                <Button onClick={handleCashPaymentSuccess}>Đánh dấu đã thanh toán</Button>
                            </motion.div>
                        </motion.div>
                    )}

                    {paymentMethod === "cash" && paymentStatus === "success" && (
                        <motion.div
                            key="cash-success"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex flex-col items-center gap-4 py-4"
                        >
                            <motion.div variants={successVariants} className="relative flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 1.2, 1],
                                        opacity: 1,
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        times: [0, 0.6, 1],
                                        ease: "easeInOut",
                                    }}
                                    className="absolute h-16 w-16 bg-green-100 rounded-full"
                                />
                                <motion.div className="relative z-10">
                                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                                </motion.div>
                            </motion.div>
                            <motion.div variants={itemVariants} className="text-center">
                                <h3 className="text-lg font-medium">Thanh toán thành công!</h3>
                                <p className="text-sm text-muted-foreground">Đã nhận thanh toán tiền mặt.</p>
                            </motion.div>
                            <motion.div variants={itemVariants}>
                                <Button onClick={resetDialog}>Đóng</Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
