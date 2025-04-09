// Component to render different service results based on service type
import React from 'react';
import { getServiceIcon, getSubServiceName } from './utils.jsx';
import ExcelDataViewer from './Excel_Data_Viewer.jsx';
import Zoom from "react-medium-image-zoom";

export default function ServiceResultDetail({ service }) {
    if (!service) return <div className="text-center py-10 text-gray-500">Không có dữ liệu dịch vụ</div>;

    const result = service.result;
    if (!result) return <div className="text-center py-10 text-gray-500">Không có kết quả cho dịch vụ này</div>;
    console.log(result)

    return (
        <div className="bg-white rounded-lg">
            <h3 className="font-bold text-lg mb-4 pb-2 border-b text-[#3F2E2E] flex items-center">
                {getServiceIcon(service.service_id?.name)}
                <span className="ml-2">{getSubServiceName(service)}</span>
            </h3>

            {/* Vaccination service */}
            {service.service_id?.name === "Tiêm chủng" && (
                <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-gray-600 text-sm mb-1">Tên vaccine</p>
                            <p className="font-medium">{result.name || "N/A"}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-gray-600 text-sm mb-1">Số lô</p>
                            <p className="font-medium">{result.batchNumber || "N/A"}</p>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <p className="text-gray-600 text-sm mb-1">Ngày tiêm tiếp theo</p>
                            <p className="font-medium">{result.nextDate || "N/A"}</p>
                        </div>
                    </div>
                    <div className="mt-2 ">
                        <p className="text-gray-600 text-sm mb-1">Ghi chú</p>
                        <div className="font-medium  p-3 rounded ">{result.notes || "Không có ghi chú"}</div>
                    </div>
                </div>
            )}

            {/* Surgery service */}
            {service.service_id?.name === "Phẫu thuật" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Ghi chú trước phẫu thuật</p>
                        <div className="font-medium p-3 rounded ">{result.preOpNotes || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Quy trình phẫu thuật</p>
                        <div className="font-medium p-3 rounded ">{result.procedureNotes || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Kết quả</p>
                        <div className="font-medium p-3 rounded ">{result.results || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Chăm sóc hậu phẫu</p>
                        <div className="font-medium p-3 rounded ">{result.postOpCare || "N/A"}</div>
                    </div>
                </div>
            )}

            {/* Ultrasound & X-ray service */}
            {service.service_id?.name === "Siêu âm & X-quang" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    {result.images && result.images.length > 0 && (
                        <div>
                            <p className="text-gray-600 text-sm mb-2">Hình ảnh</p>
                            <div className="flex flex-wrap gap-3">
                                {result.images.map((img, idx) => (
                                    <div key={idx} className="relative">
                                        <Zoom>
                                            <img
                                                src={img.url}
                                                alt={img.name || "Medical image"}
                                                className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow"
                                            />
                                        </Zoom>
                                        <p className="text-xs text-center mt-1 text-gray-600">{img.name || `Ảnh ${idx + 1}`}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Mô tả</p>
                        <div className="font-medium p-3 rounded">{result.description || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Kết quả</p>
                        <div className="font-medium p-3 rounded">{result.results || "N/A"}</div>
                    </div>

                </div>
            )}

            {/* Health checkup service */}
            {service.service_id?.name === "Khám sức khỏe" && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Nhiệt độ</p>
                            <p className="font-medium">{result.temperature ? `${result.temperature}°C` : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Nhịp tim</p>
                            <p className="font-medium">{result.heartRate ? `${result.heartRate} bpm` : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Nhịp thở</p>
                            <p className="font-medium">{result.respiratoryRate || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Tình trạng nước</p>
                            <p className="font-medium">{result.hydration || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Trạng thái cơ thể</p>
                            <p className="font-medium">{result.bodyCondition ? `${result.bodyCondition}/5` : "N/A"}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Mô tả</p>
                            <div className="font-medium p-3 rounded">{result.description || "N/A"}</div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Dự đoán</p>
                            <div className="font-medium p-3 rounded">{result.prediction || "N/A"}</div>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Điều trị</p>
                            <div className="font-medium p-3 rounded">{result.treatment || "N/A"}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Test & Lab service */}
            {service.service_id?.name === "Xét nghiệm" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Kết quả</p>
                        <div className="font-medium p-3 rounded">{result.results || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Phân tích</p>
                        <div className="font-medium p-3 rounded">{result.interpretation || "N/A"}</div>
                    </div>
                    {result.fileUrl && (
                        <div>
                            <p className="text-gray-600 text-sm mb-1">Kết quả chi tiết</p>
                            <ExcelDataViewer fileUrl={result.fileUrl} />
                        </div>
                    )}
                </div>
            )}

            {/* Pet care service */}
            {service.service_id?.name === "Chăm sóc thú cưng" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Chi tiết chăm sóc</p>
                        <div className="font-medium p-3 rounded">{result.careDetails || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Ghi chú</p>
                        <div className="font-medium p-3 rounded">{result.notes || "N/A"}</div>
                    </div>
                </div>
            )}

             {/* Pet care service */}
             {service.service_id?.name === "Dịch vụ Lưu trú" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Hướng dẫn cho ăn</p>
                        <div className="font-medium p-3 rounded">{result.feedingInstructions || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Chăm sóc đặc biệt</p>
                        <div className="font-medium p-3 rounded">{result.specialCare || "N/A"}</div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm mb-1">Ghi chú</p>
                        <div className="font-medium p-3 rounded">{result.notes || "N/A"}</div>
                    </div>
                </div>
            )}
        </div>
    );
}