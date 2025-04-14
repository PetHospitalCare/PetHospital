import { useState, useEffect } from "react";
import { MeidicalServices } from "@/services/MedicalService";
import { UserService } from "@/services/UserService";

export default function AllDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all doctor accounts
                const accountsResponse = await UserService.getAllDoctor();
                if (accountsResponse.status === 200) {
                    const doctorAccounts = accountsResponse.data.doctor;

                    // Fetch all medical records
                    const medicalRecordsResponse = await MeidicalServices.getAllMedicalRecords();
                    if (medicalRecordsResponse.status === 200 || medicalRecordsResponse.data.success) {
                        const medicalRecords = medicalRecordsResponse.data.data;

                        // Count appearances of each doctor in medical records
                        const doctorAppearances = {};
                        medicalRecords.forEach((record) => {
                            const doctorId = record?.booking_id?.doctor_id?._id;
                            if (doctorId) {
                                if (!doctorAppearances[doctorId]) {
                                    const doctorInfo = doctorAccounts.find((doc) => doc?._id === doctorId);
                                    doctorAppearances[doctorId] = {
                                        count: 0,
                                        doctor: doctorInfo,
                                    };
                                }
                                doctorAppearances[doctorId].count += 1;
                            }
                        });

                        // Include all doctors, even those not in medical records
                        const allDoctors = doctorAccounts.map((doctor) => ({
                            count: doctorAppearances[doctor._id]?.count || 0,
                            doctor,
                        }));

                        // Sort doctors by appearance count (descending)
                        const sortedDoctors = allDoctors.sort((a, b) => b.count - a.count);

                        setDoctors(sortedDoctors);
                    }
                }
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className=" min-h-screen pt-24 bg-[#fef6e9]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Đội ngũ bác sĩ</h1>
                    <p className="text-gray-600 mt-4">
                        Những bác sĩ thú y tận tâm và giàu kinh nghiệm, luôn sẵn sàng đồng hành chăm sóc sức khỏe thú cưng của bạn.
                    </p>
                </div>
                {loading ? (
                    <div className="text-center py-4">Đang tải dữ liệu...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {doctors.length > 0 ? (
                            doctors.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    <div className="flex flex-col items-center py-5 space-y-3">
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow">
                                            <img
                                                src={item?.doctor?.url || "./profile.png"}
                                                alt={`Dr. ${item?.doctor?.username || "Unknown"}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {item?.doctor?.username || "Không có tên"}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Số ca khám: {item?.count || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4">Không có dữ liệu bác sĩ</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}