"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function BoardingForm({ formData, onChange, subService, isReadOnly }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{subService.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedingInstructions">Hướng dẫn cho ăn</Label>
          <Textarea
            id="feedingInstructions"
            value={formData.feedingInstructions || ""}
            onChange={(e) => onChange("feedingInstructions", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialCare">Chăm sóc đặc biệt</Label>
          <Textarea
            id="specialCare"
            value={formData.specialCare || ""}
            onChange={(e) => onChange("specialCare", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="boardingNotes">Ghi chú</Label>
          <Textarea
            id="boardingNotes"
            value={formData.notes || ""}
            onChange={(e) => onChange("notes", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
}

