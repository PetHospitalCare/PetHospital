import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BookingTable from "./BookingStatus";
import Page from "@/app/dashboard/page";

export default function ManageBooking() {
    const [activeTab, setActiveTab] = useState("pending");
    const [pendingCount, setPendingCount] = useState(0);
    return (

        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="pending">Chờ xác nhận ({pendingCount})</TabsTrigger>
                <TabsTrigger value="confirm">Chờ khám</TabsTrigger>
                <TabsTrigger value="complete">Đã khám</TabsTrigger>
                <TabsTrigger value="cancel">Đã hủy</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
                <BookingTable status="pending" setCount={setPendingCount} />
            </TabsContent>
            <TabsContent value="confirm" >
                <BookingTable status="confirm" setCount={setPendingCount} />
            </TabsContent>
            <TabsContent value="complete">
                <BookingTable status="complete" setCount={setPendingCount} />
            </TabsContent>
            <TabsContent value="cancel">
                <BookingTable status="cancel" setCount={setPendingCount} />
            </TabsContent>
        </Tabs>

    );
}
