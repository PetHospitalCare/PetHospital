import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PaymentService } from "@/services/PaymentService.js";
import { toast } from "sonner";

export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        getData()
    }, [searchParams]);


    const getData = async () => {
        try {
            const queryParams = Object.fromEntries(searchParams.entries());
            // console.log("VNPay Response:", queryParams);

            if (queryParams["vnp_ResponseCode"] && queryParams["vnp_TxnRef"]) {
                const response = await PaymentService.updatePayment({
                    vnp_ResponseCode: queryParams["vnp_ResponseCode"],
                    paymentId: queryParams["vnp_TxnRef"]
                });

                if (response.status === 200 && response.data.paymentSaved._id && queryParams["vnp_ResponseCode"] === '00' && response.data.paymentSaved.status === 1) {
                    toast.success("Thanh toán thành công!");
                } else {
                    toast.error("Thanh toán thất bại!");
                }
            }

            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            console.log(error);

            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    }

    return (
        <>
            <div className="absolute inset-0 -z-10">
                <img
                    src="https://res.cloudinary.com/debx8syhr/image/upload/v1737554135/a42b4dc7074a1bd77c694dbc815a4ced_omkgkz.png"

                    className="w-full h-full object-cover"
                />
            </div>
            <div className="fixed inset-0 z-500 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">

                {/* Loading Spinner */}
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-yellow-400 border-dashed rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-semibold text-white drop-shadow-lg">
                        Đang xử lý...
                    </p>
                </div>

                {/* Lớp chặn hoàn toàn tương tác */}
                <div className="fixed inset-0 bg-transparent pointer-events-auto touch-none"></div>
            </div>
        </>
    );

}