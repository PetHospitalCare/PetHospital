
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


export function LabTestForm({ formData, onChange }) {
    const currentTests = formData.testTypes ? JSON.parse(formData.testTypes) : []

    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Xét nghiệm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">

                </div>

                <div className="space-y-2">
                    <Label htmlFor="sampleCollected">Mẫu đã thu thập</Label>
                    <Select value={formData.sampleCollected || ""} onValueChange={(value) => onChange("sampleCollected", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại mẫu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blood">Máu</SelectItem>

                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="results">Kết quả</Label>
                    <Textarea
                        id="results"
                        value={formData.results || ""}
                        onChange={(e) => onChange("results", e.target.value)}
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="interpretation">Nhận định</Label>
                    <Textarea
                        id="interpretation"
                        value={formData.interpretation || ""}
                        onChange={(e) => onChange("interpretation", e.target.value)}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

