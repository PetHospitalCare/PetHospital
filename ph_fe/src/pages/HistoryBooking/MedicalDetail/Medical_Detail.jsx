import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MeidicalServices } from "@/services/MedicalService";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import MedicalResult from "./Medical/Medical_result";

export default function MedicalDetail() {
    const { id } = useParams();
    const [medical, setMedical] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const parts = location.pathname.split("/");
    const medicalRecordPath = parts[1];
    const fetchMedical = async () => {
        try {
            const response = await MeidicalServices.getOneMedicalRecords(id);
            if (response.data.success) {
                setMedical(response.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đặt lịch:", error);
        }
    };

    useEffect(() => {
        fetchMedical();
    }, []);

    return (
        <div className={medicalRecordPath === "MedicalRecord" ? "w-full" : "container mx-auto pt-28 px-20"}>
            {medicalRecordPath !== "MedicalRecord" && (
                <>
                    {/* Header */}
                    <div className="inline-block bg-[#3F2E2E] px-12 py-2 text-white text-2xl font-bold rounded-t">
                        Hồ sơ khám
                    </div>


                    <hr className="h-1 bg-[#3F2E2E] border-none" />
                </>
            )
            }
            {/* nút quay về */}
            <div className="mt-4">

                <Button
                    onClick={() => navigate(-1)}
                    className="bg-[#3F2E2E] text-white px-4 py-2 rounded">Quay lại</Button>

            </div>

            {/* Thông tin của thú cưng */}
            <div className="flex items-start justify-between p-4">
                {/* Ảnh thú cưng */}
                <div className="w-44 h-44 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300">
                    <img
                        src={medical?.booking_id?.pet_id?.url ? medical.booking_id.pet_id.url : "/dogCat.png"}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Thông tin thú cưng */}
                <div className="flex-1 px-6">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
                        Tên: {medical?.booking_id?.pet_id?.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <p className="text-gray-900 text-lg md:text-xl">
                                <span className="font-semibold">Chủ sở hữu:</span> {medical?.booking_id?.pet_id?.account_id?.username}
                            </p>
                            <p className="text-gray-900 text-lg md:text-xl">
                                <span className="font-semibold">Cân nặng:</span> {medical?.booking_id?.pet_id?.weight} kg
                            </p>
                            <p className="text-gray-900 text-lg md:text-xl">
                                <span className="font-semibold">Thời gian khám:</span>
                                {`${String(new Date(medical?.booking_id?.date).getDate() + 1).padStart(2, "0")}/${String(new Date(medical?.booking_id?.date).getMonth() + 1).padStart(2, "0")}/${String(new Date(medical?.booking_id?.date).getFullYear())} - ${medical?.booking_id?.hour}`}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-900 text-lg md:text-xl">
                                <span className="font-semibold">Loài:</span> {medical?.booking_id?.pet_id?.type === "dog" ? "Chó" : "Mèo"}
                            </p>
                            <p className="text-gray-900 text-lg md:text-xl">
                                <span className="font-semibold">Giống:</span> {medical?.booking_id?.pet_id?.species}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Thông tin khám */}
            <div className="border border-gray-300 mt-8 p-4 mb-8 rounded-lg shadow-lg">
                {/* Hiển thị kết quả khám bệnh với 2 cột */}
                <MedicalResult medical={medical} />
            </div>
        </div >
    );
}