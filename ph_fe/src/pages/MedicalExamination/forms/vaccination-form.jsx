"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function VaccinationForm({ formData, onChange, subService }) {
    if (!subService) return null

    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                    {subService.parentName}: {subService.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="batchNumber">Số lô</Label>
                        <Input
                            id="batchNumber"
                            value={formData.batchNumber || ""}
                            onChange={(e) => onChange("batchNumber", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="injectionSite">Vị trí tiêm</Label>
                        <Select value={formData.injectionSite || ""} onValueChange={(value) => onChange("injectionSite", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vị trí tiêm" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="subcutaneous">Dưới da</SelectItem>
                                <SelectItem value="intramuscular">Bắp thịt</SelectItem>
                                <SelectItem value="intranasal">Mũi</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nextDate">Ngày tiêm nhắc lại</Label>
                    <Input
                        id="nextDate"
                        type="date"
                        value={formData.nextDate || ""}
                        onChange={(e) => onChange("nextDate", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="vaccineNotes">Ghi chú</Label>
                    <Textarea
                        id="vaccineNotes"
                        value={formData.notes || ""}
                        onChange={(e) => onChange("notes", e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

