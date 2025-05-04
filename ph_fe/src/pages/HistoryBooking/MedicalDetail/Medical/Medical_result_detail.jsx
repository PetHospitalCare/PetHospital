// Component to render different service results based on service type
import React from 'react';
import { getServiceIcon, getSubServiceName } from './utils.jsx';
import ExcelDataViewer from './Excel_Data_Viewer.jsx';
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Share from "yet-another-react-lightbox/plugins/share";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import { useState } from "react";
export default function ServiceResultDetail({ service }) {
    const [index, setIndex] = useState(-1);
    if (!service) return <div className="text-center py-10 text-gray-500">Không có dữ liệu dịch vụ</div>;

    const result = service.result;
    if (!result) return <div className="text-center py-10 text-gray-500">Không có kết quả cho dịch vụ này</div>;

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
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {result.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className="relative group aspect-square rounded-lg overflow-hidden border cursor-pointer"
                                        onClick={() => setIndex(idx)}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.name || "Medical image"}
                                            className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                        />
                                        <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                            {`Ảnh ${idx + 1}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Lightbox
                                open={index >= 0}
                                index={index}
                                close={() => setIndex(-1)}
                                slides={result.images.map(img => ({ src: img.url }))}
                                plugins={[Zoom, Thumbnails, Share, Fullscreen]}
                                zoom={{
                                    maxZoomPixelRatio: 3,
                                    zoomInMultiplier: 2
                                }}
                            />
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
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-gray-600 text-sm">Kết quả chi tiết</p>
                                <a
                                    href={result.fileUrl}
                                    download={"ket-qua-xet-nghiem.xlsx"} // Add fileName here
                                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Get the file extension from URL or fileName
                                        const fileExt = result.fileName?.split('.').pop() || 'xlsx';

                                        // Fetch and download with correct content type
                                        fetch(result.fileUrl)
                                            .then(response => response.blob())
                                            .then(blob => {
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `ket-qua-xet-nghiem.${fileExt}`;
                                                document.body.appendChild(a);
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                                document.body.removeChild(a);
                                            })
                                            .catch(err => {
                                                console.error('Download error:', err);
                                                toast.error('Có lỗi khi tải file');
                                            });
                                    }}
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    Tải xuống
                                </a>
                            </div>
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