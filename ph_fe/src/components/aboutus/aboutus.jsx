import { useState, useEffect, useRef } from "react";
export default function AboutSection() {
    return (
        <section className="bg-[#FDF6E9] px-6 py-16 md:py-24">
            <div className="container mx-auto max-w-6xl">
                <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-[#2196F3] text-4xl md:text-5xl font-bold">ABOUT US</h2>
                        <p className="text-gray-800 leading-relaxed">
                            Được thành lập vào năm 2025, Bệnh viện thú cưng mong muốn trở thành đối tác đáng tin cậy của mọi chủ sở hữu thú cưng trên hành trình cung cấp dịch vụ chăm sóc sức khỏe đặc biệt cho những người bạn đồng hành thân yêu của mình. Với cam kết đổi mới và xuất sắc, chúng tôi đặt mục tiêu thiết lập các tiêu chuẩn mới trong lĩnh vực chăm sóc thú y tại Việt Nam, liên tục nâng cao dịch vụ của mình để đảm bảo mang lại trải nghiệm tốt nhất có thể cho "những đứa con nhỏ" yêu quý của bạn.
                        </p>
                        <button className="bg-[#2196F3] text-white px-8 py-2.5  rounded-full hover:bg-[#1976D2] transition-colors">
                            SEE MORE
                        </button>
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <img
                            src="https://thietbithuyvietnam.com/wp-content/uploads/2023/11/1701136163-3766-BAA1i-sE1BB91-e1575253177574.jpg"

                            className="w-full max-w-md"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

