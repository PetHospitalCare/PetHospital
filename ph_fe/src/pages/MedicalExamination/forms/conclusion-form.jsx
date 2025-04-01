import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X, Search, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { MedicineService } from "@/services/MedicineService"

export function ConclusionForm({ conclusion, onChange, isReadOnly, onMedicinePriceChange }) {
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalMedicinePrice, setTotalMedicinePrice] = useState(0) // Add this state

  // Add calculateTotalPrice function
  const calculateTotalPrice = (prescriptions) => {
    if (!prescriptions || !medicines.length) return 0;

    const total = prescriptions.reduce((sum, item) => {
      const medicine = medicines.find(m => m._id === item.medicine_id);
      const quantity = parseInt(item.quantity) || 0;
      const price = medicine?.price || 0;
      return sum + (price * quantity);
    }, 0);

    setTotalMedicinePrice(total);
    onMedicinePriceChange(total);
    return total;
  };
  useEffect(() => {
    if (medicines.length === 0) {
      loadMedicines();
    }
  }, [])

  const loadMedicines = async () => {
    try {
      setLoading(true)
      const response = await MedicineService.getAllMedicine()
      if (response?.data?.success) {
        setMedicines(response.data.medicines)
      }
    } catch (error) {
      toast.error("Không thể tải danh sách thuốc")
    } finally {
      setLoading(false)
    }
  }
  // Add new useEffect to format existing prescription data
  useEffect(() => {
    if (!conclusion?.prescription || medicines.length === 0) return;

    const formattedPrescriptions = conclusion.prescription.map(item => {
      const medicineDetails = medicines.find(m => m._id === (item.medicine_id || item.medicine?._id));
      return {
        medicine_id: medicineDetails?._id || item.medicine_id,
        medicine: medicineDetails?.name || item.medicine,
        quantity: item.quantity || "",
        instructions: item.instructions || "",
        unit: medicineDetails?.unit || item.unit || ""
      };
    });

    onChange("prescription", formattedPrescriptions);
  }, [medicines]);
  useEffect(() => {
    if (medicines.length > 0 && conclusion?.prescription) {
      calculateTotalPrice(conclusion.prescription);
    }
  }, [medicines]);

  const handleAddPrescription = () => {
    const newPrescription = {
      medicine_id: "", // For frontend reference
      medicine: "", // For display purposes
      quantity: "",
      instructions: "",
      unit: "" // For display purposes
    }
    onChange("prescription", [...(conclusion.prescription || []), newPrescription])
  }

  const handleSelectMedicine = (index, medicineId) => {
    const medicine = medicines.find(m => m._id === medicineId)
    if (!medicine) return

    const updatedPrescriptions = [...(conclusion.prescription || [])]
    updatedPrescriptions[index] = {
      medicine_id: medicine._id, // For backend reference
      medicine: medicine.name, // For display only
      unit: medicine.unit, // For display only
      quantity: "",
      instructions: ""
    }
    onChange("prescription", updatedPrescriptions)
    calculateTotalPrice(updatedPrescriptions);
  }

  const handleRemovePrescription = (index) => {
    const updatedPrescriptions = (conclusion.prescription || []).filter((_, i) => i !== index)
    onChange("prescription", updatedPrescriptions)
  }
  const handleUpdatePrescription = (index, field, value) => {
    const updatedPrescriptions = [...(conclusion.prescription || [])]
    updatedPrescriptions[index] = {
      ...updatedPrescriptions[index],
      [field]: value
    }
    onChange("prescription", updatedPrescriptions)
    calculateTotalPrice(updatedPrescriptions); // Add this line
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kê đơn thuốc</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Danh sách thuốc</Label>
          {!isReadOnly && (
            <Button onClick={handleAddPrescription} size="sm" variant="outline" >
              <Plus className="w-4 h-4 mr-2" />
              Thêm thuốc
            </Button>
          )}
        </div>

        {(conclusion.prescription || []).map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 p-4 border rounded-lg relative">
            {!isReadOnly && (
              <Button
                onClick={() => handleRemovePrescription(index)}
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="col-span-6">
              <Label>Tên thuốc</Label>
              <Select
                value={item.medicine_id}
                onValueChange={(value) => handleSelectMedicine(index, value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn thuốc...">
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tải...
                      </div>
                    ) : (
                      item.medicine || "Chọn thuốc..."
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine._id} value={medicine._id}>
                      <div className="flex flex-col">
                        <div>{medicine.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {medicine.type} • {medicine.unit}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Số lượng</Label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleUpdatePrescription(index, "quantity", e.target.value)}
                placeholder="VD: 10"
                disabled={isReadOnly}
              />
            </div>
            {/* <div className="col-span-3">
              <Label>Liều lượng</Label>
              <Input
                value={item.dosage}
                onChange={(e) => handleUpdatePrescription(index, "dosage", e.target.value)}
                placeholder="VD: 1 viên/lần"
              />
            </div> */}

            <div className="col-span-3">
              <Label>Đơn vị</Label>
              <Input
                value={item.unit}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="col-span-12">
              <Label>Hướng dẫn sử dụng</Label>
              <Input
                value={item.instructions}
                onChange={(e) => handleUpdatePrescription(index, "instructions", e.target.value)}
                placeholder="VD: Uống sau ăn"
                disabled={isReadOnly}
              />
            </div>

            {item.medicine && (
              <div className="col-span-12 space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="font-medium">Thông tin thuốc:</div>
                  <div className="flex items-start gap-4">
                    {/* Tìm thông tin thuốc một lần và sử dụng lại */}
                    {(() => {
                      const selectedMedicine = medicines.find(m => m._id === item.medicine_id)
                      return (
                        <>
                          <div className="w-32 h-32 relative rounded-lg border overflow-hidden bg-muted">
                            {selectedMedicine?.images?.[0]?.url ? (
                              <img
                                src={selectedMedicine.images[0].url}
                                alt={item.medicine}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <img className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div>Loại: {selectedMedicine?.type}</div>
                            <div>Dùng cho: {selectedMedicine?.pet_type?.join(", ")}</div>
                            <div>Nhà sản xuất: {selectedMedicine?.manufacturer}</div>
                            <div className="text-xs text-muted-foreground mt-2">
                              Mô tả: {selectedMedicine?.description}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}