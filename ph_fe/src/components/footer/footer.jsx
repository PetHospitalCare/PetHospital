import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <footer className="bg-[#FDF6E9] py-12 w-full text-center border-t border-gray-200">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LIÊN HỆ CHÚNG TÔI */}
                    <div className="flex flex-col items-start gap-4">
                        <h3 className="font-semibold text-blue-500 uppercase text-lg">Liên hệ chúng tôi</h3>
                        <div className="flex items-start gap-2 text-gray-600">
                            <BuildingIcon className="w-5 h-5 mt-1 flex-shrink-0" />
                            <p className="text-sm text-left">
                                Văn phòng Pet Health, Tòa nhà Sông Đà<br />
                                Số 54 Phạm Hùng, Nam Từ Liêm, TP. Hà Nội
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">Mobile: +84 0985741249</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MailIcon className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">Pethealth2024@gmail.com</p>
                        </div>
                        {/* <p className="text-gray-500 text-xs mt-2">
                            © {new Date().getFullYear()} Pet Health. All rights reserved.
                        </p> */}
                    </div>

                    {/* GIỜ LÀM VIỆC */}
                    <div className="flex flex-col items-start gap-4">
                        <h3 className="font-semibold text-blue-500 uppercase text-lg">Giờ làm việc</h3>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 w-full">
                            <div className="text-left">Thứ 2 - Thứ 7</div>
                            <div className="text-left">Chủ nhật & Ngày lễ</div>

                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 w-full">
                            <div className="text-left">
                                8:00 - 12:00<br />
                                14:00 - 18:00
                            </div>
                            <div className="text-left">8:00 - 12:00</div>
                        </div>
                        
                        <div className="flex flex-col items-start gap-2 mt-4">
                            <h3 className="font-semibold text-blue-500 ">Theo dõi chúng tôi</h3>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                    <FacebookIcon className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                    <TwitterIcon className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                    <InstagramIcon className="w-5 h-5" />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                                    <LinkedinIcon className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="flex flex-col items-start gap-4">
                        <h3 className="text-lg font-semibold text-gray-700">Địa chỉ chúng tôi tại Trường đại học FPT</h3>
                        <div className="w-full">
                            <iframe
                                className="w-full h-64 rounded-md shadow-md"
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11640.246173409367!2d105.53450707708018!3d21.012262136159258!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1743965612599!5m2!1svi!2s"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function BuildingIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
        </svg>
    )
}

function FacebookIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}

function InstagramIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    )
}

function LinkedinIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    )
}

function MailIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}

function PhoneIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    )
}

function TwitterIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
    )
}