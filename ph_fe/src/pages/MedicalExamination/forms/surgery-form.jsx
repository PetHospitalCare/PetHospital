"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SurgeryForm({ formData, onChange, subService }) {
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">  {subService.parentName}: {subService.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        <div className="space-y-2">
          <Label htmlFor="preOpNotes">Ghi chú trước phẫu thuật</Label>
          <Textarea
            id="preOpNotes"
            value={formData.preOpNotes || ""}
            onChange={(e) => onChange("preOpNotes", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedureNotes">Thông tin phẫu thuật</Label>
          <Textarea
            id="procedureNotes"
            value={formData.procedureNotes || ""}
            onChange={(e) => onChange("procedureNotes", e.target.value)}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="procedureNotes">Kết quả</Label>
          <Textarea
            id="results"
            value={formData.results || ""}
            onChange={(e) => onChange("results", e.target.value)}
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

