"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export function CheckupForm({ formData, onChange }) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Khám sức khỏe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">Nhiệt độ (°C)</Label>
            <Input
              id="temperature"
              value={formData.temperature || ""}
              onChange={(e) => onChange("temperature", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heartRate">Nhịp tim (bpm)</Label>
            <Input
              id="heartRate"
              value={formData.heartRate || ""}
              onChange={(e) => onChange("heartRate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate">Nhịp thở (bpm)</Label>
            <Input
              id="respiratoryRate"
              value={formData.respiratoryRate || ""}
              onChange={(e) => onChange("respiratoryRate", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Tình trạng tổng quát</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hydration">Tình trạng nước</Label>
              <Select value={formData.hydration || ""} onValueChange={(value) => onChange("hydration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="mild">Mất nước nhẹ</SelectItem>
                  <SelectItem value="moderate">Mất nước vừa</SelectItem>
                  <SelectItem value="severe">Mất nước nặng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyCondition">Thể trạng</Label>
              <Select value={formData.bodyCondition || ""} onValueChange={(value) => onChange("bodyCondition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Gầy còm</SelectItem>
                  <SelectItem value="2">2 - Gầy</SelectItem>
                  <SelectItem value="3">3 - Lý tưởng</SelectItem>
                  <SelectItem value="4">4 - Thừa cân</SelectItem>
                  <SelectItem value="5">5 - Béo phì</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Khám theo hệ thống</Label>

          <div className="space-y-2">
            <Label htmlFor="eyesEarsNose">Mắt, Tai, Mũi</Label>
            <Textarea
              id="eyesEarsNose"
              value={formData.eyesEarsNose || ""}
              onChange={(e) => onChange("eyesEarsNose", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardiovascular">Tim mạch</Label>
            <Textarea
              id="cardiovascular"
              value={formData.cardiovascular || ""}
              onChange={(e) => onChange("cardiovascular", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="respiratory">Hô hấp</Label>
            <Textarea
              id="respiratory"
              value={formData.respiratory || ""}
              onChange={(e) => onChange("respiratory", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="digestive">Tiêu hóa</Label>
            <Textarea
              id="digestive"
              value={formData.digestive || ""}
              onChange={(e) => onChange("digestive", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="musculoskeletal">Cơ xương khớp</Label>
            <Textarea
              id="musculoskeletal"
              value={formData.musculoskeletal || ""}
              onChange={(e) => onChange("musculoskeletal", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skin">Da và lông</Label>
            <Textarea id="skin" value={formData.skin || ""} onChange={(e) => onChange("skin", e.target.value)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

