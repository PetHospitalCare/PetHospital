
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function PetCareForm({ formData, onChange }) {
    return (
        <Card className="mb-4">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Chăm sóc thú cưng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="careType">Loại dịch vụ</Label>
                    <Select value={formData.careType || ""} onValueChange={(value) => onChange("careType", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="grooming">Tắm và cắt tỉa lông</SelectItem>
                            <SelectItem value="dental">Vệ sinh răng miệng</SelectItem>
                            <SelectItem value="nail">Cắt móng</SelectItem>
                            <SelectItem value="ear">Vệ sinh tai</SelectItem>
                            <SelectItem value="full">Chăm sóc toàn diện</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="careDetails">Chi tiết dịch vụ</Label>
                    <Textarea
                        id="careDetails"
                        value={formData.careDetails || ""}
                        onChange={(e) => onChange("careDetails", e.target.value)}
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="careNotes">Ghi chú</Label>
                    <Textarea id="careNotes" value={formData.notes || ""} onChange={(e) => onChange("notes", e.target.value)} />
                </div>
            </CardContent>
        </Card>
    )
}

