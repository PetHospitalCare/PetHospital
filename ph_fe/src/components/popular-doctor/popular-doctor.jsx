import { useState, useEffect } from "react";
import { MeidicalServices } from "@/services/MedicalService";
import { UserService } from "@/services/UserService";
import { Link } from "react-router-dom";

export default function TrendingDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [topDoctors, setTopDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all accounts
                const accountsResponse = await UserService.getAllDoctor();
                if (accountsResponse.status === 200) {
                    // Filter accounts to get only those with "doctor" role
                    const doctorAccounts = accountsResponse.data.doctor
                    // Fetch all medical records
                    const medicalRecordsResponse = await MeidicalServices.getAllMedicalRecords();

                    if (medicalRecordsResponse.status === 200 || medicalRecordsResponse.data.success) {
                        const medicalRecords = medicalRecordsResponse.data.data;
                        // Count appearances of each doctor in medical records
                        const doctorAppearances = {};

                        medicalRecords.forEach(record => {
                            const doctorId = record?.booking_id?.doctor_id?._id;
                            if (doctorId) {
                                if (!doctorAppearances[doctorId]) {
                                    // Find the doctor in our filtered doctor accounts
                                    const doctorInfo = doctorAccounts.find(doc => doc?._id === doctorId);
                                    doctorAppearances[doctorId] = {
                                        count: 0,
                                        doctor: doctorInfo // Use our filtered doctor info if available
                                    };
                                }
                                doctorAppearances[doctorId].count += 1;
                            }
                        });
                        // Sort doctors by appearance count (descending) and take top 4
                        const sortedTopDoctors = Object.values(doctorAppearances)
                            .sort((a, b) => b.count - a.count);

                        // Bổ sung nếu thiếu top 4
                        if (sortedTopDoctors.length < 4) {
                            const currentDoctorIds = sortedTopDoctors.map(doc => doc.doctor?._id);

                            const remainingDoctors = doctorAccounts
                                .filter(doc => !currentDoctorIds.includes(doc._id))
                                .slice(0, 4 - sortedTopDoctors.length)
                                .map(doc => ({ doctor: doc, count: 0 }));

                            sortedTopDoctors.push(...remainingDoctors);
                        }

                        setTopDoctors(sortedTopDoctors);
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
        <div className="bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Đội ngũ bác sĩ</h1>
                    <p className="text-gray-600 mt-4">Những bác sĩ thú y tận tâm và giàu kinh nghiệm, luôn sẵn sàng đồng hành chăm sóc sức khỏe thú cưng của bạn.</p>

                </div>
                {loading ? (
                    <div className="text-center py-4">Đang tải dữ liệu...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topDoctors.length > 0 ? (
                            topDoctors.map((item, index) => (
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
                <div className="text-center mt-6">
                    <Link to="/all-doctor" className="text-center text-blue-600 font-semibold hover:underline">
                        Xem thêm các bác sĩ khác
                    </Link>
                </div>
            </div>
        </div>
    );
}