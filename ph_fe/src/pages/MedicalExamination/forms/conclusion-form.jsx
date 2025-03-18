"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ConclusionForm({ conclusion, onChange }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Kết luận</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="generalHealth">Tình trạng sức khỏe tổng quát</Label>
          <Select value={conclusion.generalHealth} onValueChange={(value) => onChange("generalHealth", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excellent">Rất tốt</SelectItem>
              <SelectItem value="good">Tốt</SelectItem>
              <SelectItem value="fair">Trung bình</SelectItem>
              <SelectItem value="poor">Kém</SelectItem>
              <SelectItem value="critical">Nguy kịch</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="diagnosis">Chẩn đoán</Label>
          <Textarea
            id="diagnosis"
            value={conclusion.diagnosis}
            onChange={(e) => onChange("diagnosis", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="treatment">Phương pháp điều trị</Label>
          <Textarea
            id="treatment"
            value={conclusion.treatment}
            onChange={(e) => onChange("treatment", e.target.value)}
            rows={3}
          />
        </div>



        <div className="space-y-2">
          <Label htmlFor="notes">Ghi chú bổ sung</Label>
          <Textarea id="notes" value={conclusion.notes} onChange={(e) => onChange("notes", e.target.value)} />
        </div>
      </CardContent>
    </Card>
  )
}

