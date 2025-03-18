"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SurgeryForm({ formData, onChange }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Phẫu thuật</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="surgeryType">Loại phẫu thuật</Label>
          <Select value={formData.surgeryType || ""} onValueChange={(value) => onChange("surgeryType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại phẫu thuật" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spay">Triệt sản cái</SelectItem>
              <SelectItem value="neuter">Triệt sản đực</SelectItem>
              <SelectItem value="dental">Nha khoa</SelectItem>
              <SelectItem value="tumor">Cắt bỏ u</SelectItem>
              <SelectItem value="orthopedic">Chỉnh hình</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anesthesia">Gây mê</Label>
          <Select value={formData.anesthesia || ""} onValueChange={(value) => onChange("anesthesia", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phương pháp gây mê" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Gây mê toàn thân</SelectItem>
              <SelectItem value="local">Gây tê cục bộ</SelectItem>
              <SelectItem value="sedation">An thần</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preOpNotes">Ghi chú trước phẫu thuật</Label>
          <Textarea
            id="preOpNotes"
            value={formData.preOpNotes || ""}
            onChange={(e) => onChange("preOpNotes", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedureNotes">Chi tiết thủ thuật</Label>
          <Textarea
            id="procedureNotes"
            value={formData.procedureNotes || ""}
            onChange={(e) => onChange("procedureNotes", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postOpCare">Chăm sóc hậu phẫu</Label>
          <Textarea
            id="postOpCare"
            value={formData.postOpCare || ""}
            onChange={(e) => onChange("postOpCare", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

