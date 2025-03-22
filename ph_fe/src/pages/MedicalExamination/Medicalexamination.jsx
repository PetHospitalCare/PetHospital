import { useEffect, useState } from "react";
import { fetchServices } from "./services-api";
import { BookingServices } from "@/services/BookingService";
import { MeidicalServices } from "@/services/MedicalService"; // Assuming you have a service to fetch medical records
import * as React from "react"
import { format } from "date-fns"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PetInfo } from "../../components/pet-info"
import { VaccinationForm } from "./forms/vaccination-form"
import { LabTestForm } from "./forms/lab-test-form"
import { ImagingForm } from "./forms/imaging-form"
import { CheckupForm } from "./forms/checkup-form"
import { PetCareForm } from "./forms/pet-care-form"
import { BoardingForm } from "./forms/boarding-form"
import { SurgeryForm } from "./forms/surgery-form"
import { ConclusionForm } from "./forms/conclusion-form"
import { serviceNameToType } from "./services"

export default function MedicalExaminationDialog({ open, onOpenChange, appointment }) {
    const [selectedSubServices, setSelectedSubServices] = useState([]);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState("examination");
    const [conclusion, setConclusion] = useState({
        generalHealth: "",
        diagnosis: "",
        treatment: "",
        followUp: "",
        notes: "",
    });
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [petInfo, setpetInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        async function loadServices() {
            setLoading(true);
            try {
                const servicesData = await fetchServices();
                setServices(servicesData);
            } catch (error) {
                console.error("Failed to load services:", error);
                setServices([]);
            } finally {
                setLoading(false);
            }
        }

        async function loadAppointment() {
            try {
                const data = await BookingServices.GetBookingbyId(appointment?.id);
                if (data?.data?.success) {
                    setpetInfo({
                        name: data?.data?.booking?.pet_id?.name,
                        type: data?.data?.booking?.type,
                        breed: data?.data?.booking?.pet_id?.species,
                        weight: data?.data?.booking?.pet_id?.weight,
                        dob: data?.data?.booking?.pet_id?.dateOfBirth,
                        gender: "Đực",
                        ownerName: data?.data?.booking?.guest_name,
                        phone: data?.data?.booking?.guest_phone,
                        note: data?.data?.booking?.note,
                    });
                }
            } catch (error) {
                console.error("Failed to load appointment:", error);
            }
        }

        async function loadMedicalRecord() {
            try {
                const recordData = await MeidicalServices.getMedicalByBookingId(appointment?.id);
                if (recordData.data.data) {
                    const { services, diagnosis, result, prescription, note } = recordData?.data.data;
                    console.log(services)
                    setSelectedSubServices(services?.map(service => {
                        const name = service?.service_id.subServices?.find(sub => sub?._id === service?.sub_service_id)?.name;
                        return {
                            name: name,
                            id: service?.sub_service_id,
                            parentName: service?.service_id?.name,
                            parentId: service?.service_id?._id,
                            parentType: serviceNameToType[service?.service_id?.name],
                        }
                    }
                    ));
                    setFormData(services?.reduce((acc, service) => {
                        acc[service?.sub_service_id] = service?.result;
                        return acc;
                    }, {}));


                    setConclusion({
                        generalHealth: result?.generalHealth,
                        diagnosis,
                        treatment: result?.treatment,
                        followUp: result?.followUp,
                        notes: note,
                    });

                    setIsEditing(true);
                } else {
                    setIsEditing(false);
                }
            } catch (error) {
                console.error("Failed to load medical record:", error);
                setIsEditing(false);
            }
        }

        if (appointment) {
            loadAppointment();
            loadMedicalRecord();
        }

        loadServices();
    }, [appointment]);

    const handleSubServiceToggle = (subService) => {
        if (!subService || !subService?._id) {
            console.error("Invalid sub-service:", subService);
            return;
        }

        setSelectedSubServices((prev) => {
            const exists = prev?.some((item) => item?.id === subService?._id);

            if (exists) {
                return prev?.filter((item) => item?.id !== subService?._id);
            } else {
                const parentService = services?.find(
                    (service) =>
                        service?.subServices &&
                        Array.isArray(service?.subServices) &&
                        service?.subServices?.some((sub) => sub?._id === subService?._id),
                );

                if (!parentService) {
                    console.error("Parent service not found for sub-service:", subService);
                    return prev;
                }

                return [
                    ...prev,
                    {
                        id: subService?._id,
                        name: subService?.name,
                        parentName: parentService?.name || "",
                        parentId: parentService?._id || "",
                        parentType: serviceNameToType[parentService?.name] || "",
                    },
                ];
            }
        });
    };

    const handleInputChange = (serviceId, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                [field]: value,
            },
        }));
    };

    const handleConclusionChange = (field, value) => {
        setConclusion((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        const medicalRecordData = {
            booking_id: appointment?.id,
            services: selectedSubServices.map(subService => ({
                service_id: subService?.parentId,
                sub_service_id: subService?.id,
                result: formData[subService?.id],
            })),
            diagnosis: conclusion?.diagnosis,
            result: {
                generalHealth: conclusion?.generalHealth,
                treatment: conclusion?.treatment,
                followUp: conclusion?.followUp,
            },
            prescription: [], // Add prescription data if available
            note: conclusion?.notes,
        };
        try {
            if (isEditing) {
                await MeidicalServices.UpdateMedical(appointment?.id, medicalRecordData);
                toast.success("Cập nhật kết quả khám thành công!");
            } else {
                toast.success("Lưu kết quả khám thành công!");
                await MeidicalServices.CreateNewMedical(medicalRecordData);
            }
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save medical record:", error);
        }
    };

    const filteredServices = React.useMemo(() => {
        if (!services || services?.length === 0) return [];
        if (!searchTerm?.trim()) return services;

        return services
            ?.map((service) => {
                if (!service?.subServices || !Array.isArray(service?.subServices)) {
                    return null;
                }

                const filteredSubServices = service?.subServices?.filter(
                    (sub) => sub && sub?.name && sub?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
                );

                if (filteredSubServices?.length > 0) {
                    return {
                        ...service,
                        subServices: filteredSubServices,
                    };
                }
                return null;
            })
            ?.filter(Boolean);
    }, [services, searchTerm]);

    const renderServiceForm = (subService) => {
        const serviceData = formData[subService?.id] || {};
        console.log(formData)
        switch (subService?.parentType) {
            case "vaccination":
                return (
                    <VaccinationForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            case "labTest":
                return (
                    <LabTestForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            case "petCare":
                return (
                    <PetCareForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            case "boarding":
                return (
                    <BoardingForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            case "surgery":
                return (
                    <SurgeryForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            case "imaging":
                return (
                    <ImagingForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            case "checkup":
                return (
                    <CheckupForm
                        key={subService?.id}
                        formData={serviceData}
                        onChange={(field, value) => handleInputChange(subService?.id, field, value)}
                        subService={subService}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Dialog modal={false} open={open} onOpenChange={(isOpen) => {
            onOpenChange(isOpen);
            if (!isOpen) {
                setSelectedSubServices([]);
                setFormData({});
                setActiveTab("examination");
                setConclusion({
                    generalHealth: "",
                    diagnosis: "",
                    treatment: "",
                    followUp: "",
                    notes: "",
                });
                setIsEditing(false);
            }
        }}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
                <DialogHeader className="px-6 pt-6 pb-2">
                    <DialogTitle>Kết quả khám</DialogTitle>
                    <div className="text-sm text-muted-foreground">{format(new Date(), "HH:mm 'Ngày' dd-MM-yyyy")}</div>
                </DialogHeader>

                <div className="grid md:grid-cols-[280px_1fr] gap-6 p-6 pt-2 h-[calc(90vh-80px)] overflow-hidden">
                    <div className="space-y-4 overflow-y-auto pr-2 h-full">
                        <div className="aspect-square relative rounded-lg overflow-hidden border">
                            <img src="/placeholder.svg?height=280&width=280" alt="Pet photo" className="object-cover" />
                        </div>

                        <PetInfo petInfo={petInfo} />

                        <div className="space-y-2">
                            <label>Dịch vụ sử dụng</label>
                            <Popover open={servicesOpen} onOpenChange={setServicesOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedSubServices?.length > 0
                                            ? `${selectedSubServices?.length} dịch vụ đã chọn`
                                            : "Chọn dịch vụ"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[280px] p-2">
                                    <Input
                                        type="text"
                                        placeholder="Tìm dịch vụ..."
                                        className="mb-2"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="max-h-48 overflow-y-auto">
                                        {loading ? (
                                            <div className="py-2 text-center text-sm text-muted-foreground">Đang tải dịch vụ...</div>
                                        ) : services?.length === 0 ? (
                                            <div className="py-2 text-center text-sm text-muted-foreground">Không tìm thấy dịch vụ</div>
                                        ) : (
                                            filteredServices?.map((service) => (
                                                <div key={service?._id} className="mb-2">
                                                    <div className="font-medium text-sm mb-1">{service?.name}</div>
                                                    {service?.subServices && service?.subServices?.length > 0 ? (
                                                        service?.subServices?.map((subService) => (
                                                            <div
                                                                key={subService?._id}
                                                                className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-md ml-2"
                                                            >
                                                                <Checkbox
                                                                    id={subService?._id}
                                                                    checked={selectedSubServices?.some((item) => item?.id === subService?._id)}
                                                                    onCheckedChange={() => handleSubServiceToggle(subService)}
                                                                />
                                                                <label htmlFor={subService?._id} className="text-sm flex-1">
                                                                    {subService?.name}
                                                                </label>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {subService?.price?.[petInfo?.type] ? `${subService?.price?.[petInfo?.type]?.toLocaleString()}đ` : ""}
                                                                </span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground ml-2">Không có dịch vụ con</div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {selectedSubServices?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {selectedSubServices?.map((subService) => (
                                        <Badge key={subService?.id} variant="secondary" className="text-xs flex items-center">
                                            {subService?.name}
                                            <button
                                                onClick={() => handleSubServiceToggle({ _id: subService?.id })}
                                                className="ml-1 hover:text-destructive"
                                                aria-label={`Remove ${subService?.name}`}
                                            >
                                                <X size={12} />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col h-full overflow-hidden">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="examination">Khám bệnh</TabsTrigger>
                                <TabsTrigger value="conclusion">Kết luận</TabsTrigger>
                            </TabsList>
                            <TabsContent value="examination" className="mt-4 flex-1 overflow-hidden">
                                <ScrollArea className="h-[calc(90vh-240px)]">
                                    {selectedSubServices?.length > 0 ? (
                                        <div className="space-y-6">
                                            {selectedSubServices?.map((subService) => renderServiceForm(subService))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                                            <p>Vui lòng chọn dịch vụ từ danh sách bên trái</p>
                                        </div>
                                    )}
                                </ScrollArea>
                            </TabsContent>
                            <TabsContent value="conclusion" className="mt-4 flex-1 overflow-hidden">
                                <ScrollArea className="h-[calc(90vh-240px)]">
                                    <ConclusionForm conclusion={conclusion} onChange={handleConclusionChange} />
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-end gap-2 pt-4 mt-auto">
                            <Button variant="outline" onClick={() => setOpen(false)}>
                                Hủy
                            </Button>
                            <Button variant="secondary">
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm đơn thuốc
                            </Button>
                            <Button onClick={handleSubmit}>
                                <Check className="w-4 h-4 mr-2" />
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}