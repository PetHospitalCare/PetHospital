import React, { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import ServiceResultDetail from "./Medical_result_detail";

export default function MedicalResult({ medical }) {
    const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

    // Set first service as default when data is loaded
    useEffect(() => {
        if (medical?.services?.length > 0) {
            setSelectedServiceIndex(0);
        }
    }, [medical]);

    if (!medical || !medical.services || medical.services.length === 0) {
        return <div className="py-6 text-center text-gray-500">Không có dữ liệu khám bệnh</div>;
    }

    // Function to get subservice name
    const getSubServiceName = (service) => {
        if (!service.sub_service_id) return 'N/A';

        const subService = service.service_id?.subServices?.find(
            sub => sub._id === service.sub_service_id
        );

        return subService?.name || 'N/A';
    };

    return (
        <div className="mt-1 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-[#3F2E2E]">Kết quả khám bệnh</h2>
            <div className="grid grid-cols-12 gap-6 border rounded-lg overflow-hidden shadow-md">
                {/* Column 1: Service Names (1/3 width) */}
                <div className="col-span-4 bg-gray-50 p-0 max-h-[600px] overflow-y-auto border-r">
                    {medical.services.map((service, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedServiceIndex(index)}
                            className={`p-4 border-b last:border-b-0 cursor-pointer transition-all hover:bg-gray-100 
                ${selectedServiceIndex === index ? 'bg-[#3F2E2E] text-white' : 'bg-white text-gray-800'}`}
                        >
                            <p className={`font-medium ${selectedServiceIndex === index ? 'text-white' : 'text-gray-800'}`}>
                                {service.service_id?.name || "Không có tên"}
                            </p>
                            <p className={`text-sm mt-1 ${selectedServiceIndex === index ? 'text-gray-200' : 'text-gray-600'}`}>
                                {getSubServiceName(service)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Column 2: Service Results (2/3 width) */}
                <div className="col-span-8 bg-white p-6 max-h-[600px] overflow-y-auto">
                    {medical.services[selectedServiceIndex] && (
                        <ServiceResultDetail service={medical.services[selectedServiceIndex]} />
                    )}
                </div>
            </div>

            {/* Prescription Section */}
            {medical.prescription && medical.prescription.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 text-[#3F2E2E] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Đơn thuốc
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {medical.prescription.map((item, index) => (
                            <div key={index} className="border p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-3">
                                    {item.medicine?.images && item.medicine.images[0]?.url ? (
                                        <img
                                            src={item.medicine.images[0].url}
                                            alt={item.medicine.name}
                                            className="w-16 h-16 object-cover rounded-lg mr-3 border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-medium">{item.medicine?.name || "Unknown Medicine"}</h3>
                                        <p className="text-sm text-gray-600">{item.medicine?.type || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="text-sm grid grid-cols-2 gap-2 mt-2 border-t pt-2">
                                    <p><span className="font-medium">Liều lượng:</span> {item.medicine?.dosage || "N/A"}</p>
                                    <p><span className="font-medium">Đơn vị:</span> {item.medicine?.unit || "N/A"}</p>
                                    <p><span className="font-medium">Giá:</span> {item.medicine?.price ? `${item.medicine.price.toLocaleString()} VND` : "N/A"}</p>
                                    <p><span className="font-medium">Số lượng:</span> {item.quantity || item.medicine?.quantity || "N/A"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}




