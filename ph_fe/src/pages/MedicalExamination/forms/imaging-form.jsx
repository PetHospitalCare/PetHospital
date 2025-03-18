"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ImagingForm({ formData, onChange, subService }) {
  if (!subService) return null

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {subService.parentName}: {subService.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bodyPart">Vùng khám</Label>
          <Select value={formData.bodyPart || ""} onValueChange={(value) => onChange("bodyPart", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn vùng khám" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abdomen">Bụng</SelectItem>
              <SelectItem value="thorax">Ngực</SelectItem>
              <SelectItem value="limbs">Chi</SelectItem>
              <SelectItem value="head">Đầu</SelectItem>
              <SelectItem value="spine">Cột sống</SelectItem>
              <SelectItem value="pelvis">Khung chậu</SelectItem>
              <SelectItem value="full">Toàn thân</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="findings">Kết quả</Label>
          <Textarea
            id="findings"
            value={formData.findings || ""}
            onChange={(e) => onChange("findings", e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recommendations">Đề xuất</Label>
          <Textarea
            id="recommendations"
            value={formData.recommendations || ""}
            onChange={(e) => onChange("recommendations", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

